// server/routes/v1.js
import { Router } from "express";
import deprecated from "../deprecate.js";
import {
  findReportByCaseCode,
  createReport,
  addNoteToReport,
  markReportResolved,
  deleteReport,
} from "../db.js";

const router = Router();

const old = deprecated({
  sunset: 'Fri, 13 Nov 2026 00:00:00 GMT',
  successor: '/v2/reports'
});

const VALID_CATEGORIES = ["incident", "maintenance", "harassment", "safety"];

function validateCreateReport(body) {
  const errors = [];
  if (!body?.category) errors.push("category is required.");
  else if (!VALID_CATEGORIES.includes(body.category)) errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  if (!body?.description) errors.push("description is required.");
  else if (typeof body.description !== "string" || body.description.trim().length === 0) errors.push("description must be a non-empty string.");
  return errors;
}

function validateNote(body) {
  const errors = [];
  if (!body?.message) errors.push("message is required.");
  else if (typeof body.message !== "string" || body.message.trim().length === 0) errors.push("message must be a non-empty string.");
  return errors;
}

function validateResolve(body) {
  const errors = [];
  if (!body?.status) errors.push("status is required.");
  else if (body.status !== "Resolved") errors.push('status must be exactly "Resolved".');
  return errors;
}

// v1 GET route
router.get("/:caseCode", old, async (req, res) => {
  const { caseCode } = req.params;
  const report = await findReportByCaseCode(caseCode);

  if (!report) return res.status(404).json({ error: `No report found with caseCode "${caseCode}".` });

  return res.status(200).json({
    caseCode: report.case_code,
    category: report.category,
    description: report.desc_text,
    status: report.current_status,
    createdAt: report.date_created,
    notes: report.notesList.map((note) => ({
      noteId: `not-${note.id}`,
      message: note.note_text,
      createdAt: note.date_created,
    })),
  });
});

// v1 POST Route
router.post("/", old, async (req, res) => {
  const errors = validateCreateReport(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const report = await createReport({ category: req.body.category, description: req.body.description });

  return res.status(201).json({
    caseCode: report.case_code,
    category: report.category,
    description: report.desc_text,
    status: report.current_status,
    createdAt: report.date_created,
  });
});

// v1 POST Notes
router.post("/:caseCode/notes", old, async (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const note = await addNoteToReport(req.params.caseCode, req.body.message);
  if (!note) return res.status(404).json({ error: `No report found with caseCode "${req.params.caseCode}".` });

  return res.status(201).json({
    noteId: `not-${note.id}`,
    caseCode: note.caseCode,
    message: note.note_text,
    createdAt: note.date_created,
  });
});

// v1 PATCH
router.patch("/:caseCode", old, async (req, res) => {
  const errors = validateResolve(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const updated = await markReportResolved(req.params.caseCode);
  if (!updated) return res.status(404).json({ error: `No report found with caseCode "${req.params.caseCode}".` });

  return res.status(200).json({
    caseCode: updated.case_code,
    status: updated.current_status,
    updatedAt: updated.updated_at,
  });
});

// v1 DELETE
router.delete("/:caseCode", old, async (req, res) => {
  const deleted = await deleteReport(req.params.caseCode);
  if (!deleted) return res.status(404).json({ error: `No report found with caseCode "${req.params.caseCode}".` });
  return res.status(204).send();
});

export default router;