// server/routes/v2.js
import { Router } from "express";
import {
  findReportByCaseCode,
  createReport,
  addNoteToReport,
  markReportResolved,
  deleteReport,
} from "../db.js";

const router = Router();
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

// v2 GET route (BREAKING CHANGE: reportId and submittedAt)
router.get("/:reportId", async (req, res) => {
  const { reportId } = req.params;
  const report = await findReportByCaseCode(reportId);

  if (!report) return res.status(404).json({ error: `No report found with ID "${reportId}".` });

  return res.status(200).json({
    reportId: report.case_code, // CHANGED
    category: report.category,
    description: report.desc_text,
    status: report.current_status,
    submittedAt: report.date_created, // CHANGED
    notes: report.notesList.map((note) => ({
      noteId: `not-${note.id}`,
      message: note.note_text,
      submittedAt: note.date_created, // CHANGED
    })),
  });
});

// v2 POST Route
router.post("/", async (req, res) => {
  const errors = validateCreateReport(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const report = await createReport({ category: req.body.category, description: req.body.description });

  return res.status(201).json({
    reportId: report.case_code, // CHANGED
    category: report.category,
    description: report.desc_text,
    status: report.current_status,
    submittedAt: report.date_created, // CHANGED
  });
});

// v2 POST Notes
router.post("/:reportId/notes", async (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const note = await addNoteToReport(req.params.reportId, req.body.message);
  if (!note) return res.status(404).json({ error: `No report found with ID "${req.params.reportId}".` });

  return res.status(201).json({
    noteId: `not-${note.id}`,
    reportId: note.caseCode, // CHANGED
    message: note.note_text,
    submittedAt: note.date_created, // CHANGED
  });
});

// v2 PATCH
router.patch("/:reportId", async (req, res) => {
  const errors = validateResolve(req.body);
  if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

  const updated = await markReportResolved(req.params.reportId);
  if (!updated) return res.status(404).json({ error: `No report found with ID "${req.params.reportId}".` });

  return res.status(200).json({
    reportId: updated.case_code, // CHANGED
    status: updated.current_status,
    updatedAt: updated.updated_at,
  });
});

// v2 DELETE
router.delete("/:reportId", async (req, res) => {
  const deleted = await deleteReport(req.params.reportId);
  if (!deleted) return res.status(404).json({ error: `No report found with ID "${req.params.reportId}".` });
  return res.status(204).send();
});

export default router;