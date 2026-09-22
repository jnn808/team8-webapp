// server/routes/reports.js
import { Router } from "express";
import {
  findReportByCaseCode,
  createReport,
  addNoteToReport,
  markReportResolved,
  deleteReport,
} from "../db.js";

const router = Router();

// =======================================================================
// VALIDATION — checked BEFORE any write happens, per the Week 6 handout.
// Each function returns an array of error strings. Empty array = valid.
// =======================================================================

const VALID_CATEGORIES = ["incident", "maintenance", "harassment", "safety"];

function validateCreateReport(body) {
  const errors = [];

  if (!body?.category) {
    errors.push("category is required.");
  } else if (!VALID_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }

  if (!body?.description) {
    errors.push("description is required.");
  } else if (typeof body.description !== "string" || body.description.trim().length === 0) {
    errors.push("description must be a non-empty string.");
  }

  return errors;
}

function validateNote(body) {
  const errors = [];

  if (!body?.message) {
    errors.push("message is required.");
  } else if (typeof body.message !== "string" || body.message.trim().length === 0) {
    errors.push("message must be a non-empty string.");
  }

  return errors;
}

function validateResolve(body) {
  const errors = [];

  if (!body?.status) {
    errors.push("status is required.");
  } else if (body.status !== "Resolved") {
    errors.push('status must be exactly "Resolved".');
  }

  return errors;
}

// =======================================================================
// GET /reports/:caseCode  (Week 5)
// =======================================================================
router.get("/:caseCode", async (req, res) => {
  const { caseCode } = req.params;
  const report = await findReportByCaseCode(caseCode);

  if (!report) {
    return res.status(404).json({
      error: `No report found with caseCode "${caseCode}".`,
    });
  }

  const responseBody = {
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
  };

  return res.status(200).json(responseBody);
});

// =======================================================================
// POST /reports  (Week 6)
// Validate first. Only write if validation passes. 201 + the new
// resource, shaped exactly like the contract, on success.
// =======================================================================
router.post("/", async (req, res) => {
  const errors = validateCreateReport(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  const report = await createReport({
    category: req.body.category,
    description: req.body.description,
  });

  return res.status(201).json({
    caseCode: report.case_code,
    category: report.category,
    description: report.desc_text,
    status: report.current_status,
    createdAt: report.date_created,
  });
});

// =======================================================================
// POST /reports/:caseCode/notes  (Week 6)
// Validate first, THEN check the report exists (404), THEN write.
// =======================================================================
router.post("/:caseCode/notes", async (req, res) => {
  const errors = validateNote(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  const note = await addNoteToReport(req.params.caseCode, req.body.message);
  if (!note) {
    return res.status(404).json({
      error: `No report found with caseCode "${req.params.caseCode}".`,
    });
  }

  return res.status(201).json({
    noteId: `not-${note.id}`,
    caseCode: note.caseCode,
    message: note.note_text,
    createdAt: note.date_created,
  });
});

// =======================================================================
// PATCH /reports/:caseCode  (Week 6)
// Validate first, THEN check existence (404), THEN write. Setting status
// to "Resolved" twice in a row lands on the same end state — idempotent,
// per Week 3's rule — even though updatedAt itself changes each call.
// =======================================================================
router.patch("/:caseCode", async (req, res) => {
  const errors = validateResolve(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  const updated = await markReportResolved(req.params.caseCode);
  if (!updated) {
    return res.status(404).json({
      error: `No report found with caseCode "${req.params.caseCode}".`,
    });
  }

  return res.status(200).json({
    caseCode: updated.case_code,
    status: updated.current_status,
    updatedAt: updated.updated_at,
  });
});

// =======================================================================
// DELETE /reports/:caseCode  (Week 6)
// No request body to validate — just check the report exists before
// deleting. 404 if it doesn't, 204 with no body if it did.
// =======================================================================
router.delete("/:caseCode", async (req, res) => {
  const deleted = await deleteReport(req.params.caseCode);
  if (!deleted) {
    return res.status(404).json({
      error: `No report found with caseCode "${req.params.caseCode}".`,
    });
  }

  return res.status(204).send();
});

export default router;
