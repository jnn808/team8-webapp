// server/db.js
//
// Query helpers used by the routes. Routes never write raw SQL themselves —
// they call these functions. Everything here is async because talking to a
// real database server over the network always takes a moment.
import { pool } from "./database.js";

// Internal helper: just the report row, no notes attached. Used by the
// write functions below to check "does this report exist?" without the
// extra cost of also fetching every note every time.
async function getReportRow(caseCode) {
  const [rows] = await pool.execute(
    "SELECT * FROM reports WHERE case_code = ?",
    [caseCode]
  );
  return rows[0] || null;
}

// Finds one report by case code, including its notes. Returns null if
// nothing matches — the route decides what to do with that (404).
export async function findReportByCaseCode(caseCode) {
  const report = await getReportRow(caseCode);
  if (!report) return null;

  const [noteRows] = await pool.execute(
    "SELECT * FROM notes WHERE report_id = ? ORDER BY date_created ASC",
    [report.id]
  );

  return { ...report, notesList: noteRows };
}

// Generates a case code in the same SB-##### shape as the existing sample
// data. Not cryptographically fancy — just enough randomness that two
// reports created back-to-back won't collide in a student project.
function generateCaseCode() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `SB-${num}`;
}

// Creates a new report with status "Pending". Returns the full new row.
export async function createReport({ category, description }) {
  // Extremely small chance of generating a caseCode that's already taken —
  // if that happens (a duplicate-key error), just try again with a new one.
  for (let attempt = 0; attempt < 5; attempt++) {
    const caseCode = generateCaseCode();
    try {
      await pool.execute(
        `INSERT INTO reports (case_code, category, desc_text, current_status, date_created)
         VALUES (?, ?, ?, 'Pending', NOW())`,
        [caseCode, category, description]
      );
      return await getReportRow(caseCode);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") continue; // caseCode collision — retry
      throw err;
    }
  }
  throw new Error("Could not generate a unique case code after several attempts.");
}

// Adds a note to an existing report. Returns null if the report doesn't
// exist (route turns that into a 404) — otherwise the new note row, plus
// the report's caseCode attached for convenience.
export async function addNoteToReport(caseCode, message) {
  const report = await getReportRow(caseCode);
  if (!report) return null;

  const [result] = await pool.execute(
    "INSERT INTO notes (report_id, note_text, date_created) VALUES (?, ?, NOW())",
    [report.id, message]
  );
  const [rows] = await pool.execute("SELECT * FROM notes WHERE id = ?", [result.insertId]);

  return { ...rows[0], caseCode: report.case_code };
}

// Marks a report Resolved. Returns null if the report doesn't exist
// (route turns that into a 404) — otherwise the updated row. Setting
// status to "Resolved" twice in a row is idempotent: the end state
// (status = Resolved) is the same either time, per Week 3's rule.
export async function markReportResolved(caseCode) {
  const report = await getReportRow(caseCode);
  if (!report) return null;

  await pool.execute(
    "UPDATE reports SET current_status = 'Resolved', updated_at = NOW() WHERE id = ?",
    [report.id]
  );

  return await getReportRow(caseCode);
}

// Deletes a report and its notes. Returns false if the report didn't
// exist to begin with (route turns that into a 404), true if it deleted
// something.
export async function deleteReport(caseCode) {
  const report = await getReportRow(caseCode);
  if (!report) return false;

  await pool.execute("DELETE FROM notes WHERE report_id = ?", [report.id]);
  await pool.execute("DELETE FROM reports WHERE id = ?", [report.id]);

  return true;
}
