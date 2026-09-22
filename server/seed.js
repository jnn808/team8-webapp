// server/seed.js
//
// Run this by itself whenever you want to reset your local database back
// to known sample data:
//
//     npm run db:seed
//
// It does NOT run automatically when the server starts — seeding on every
// startup would wipe out any test data you created by hand in the meantime.
import { pool, ensureTables } from "./database.js";

const seedReports = [
  {
    case_code: "SB-88219",
    category: "maintenance",
    desc_text: "Cable crossover machine pulley is frayed and slipping under load.",
    current_status: "In Review",
    date_created: "2026-09-09 08:30:00",
    notes: [
      { note_text: "Staff has cordoned off the area around the machine.", date_created: "2026-09-09 09:00:00" },
    ],
  },
  {
    case_code: "SB-71042",
    category: "safety",
    desc_text: "Emergency exit door near the pool area is not latching properly.",
    current_status: "Pending",
    date_created: "2026-09-12 14:05:00",
    notes: [],
  },
  {
    case_code: "SB-30087",
    category: "harassment",
    desc_text: "Repeated inappropriate comments from another member during group class.",
    current_status: "Resolved",
    date_created: "2026-08-30 11:15:00",
    notes: [
      { note_text: "Member was spoken to by staff and moved to a different class time.", date_created: "2026-09-01 10:00:00" },
      { note_text: "Follow-up confirmed no further incidents.", date_created: "2026-09-05 16:30:00" },
    ],
  },
];

async function seed() {
  await ensureTables();

  // Clear existing data first, so re-running this script is always safe.
  await pool.query("DELETE FROM notes");
  await pool.query("DELETE FROM reports");

  for (const r of seedReports) {
    const [result] = await pool.execute(
      "INSERT INTO reports (case_code, category, desc_text, current_status, date_created) VALUES (?, ?, ?, ?, ?)",
      [r.case_code, r.category, r.desc_text, r.current_status, r.date_created]
    );
    const reportId = result.insertId;

    for (const n of r.notes) {
      await pool.execute(
        "INSERT INTO notes (report_id, note_text, date_created) VALUES (?, ?, ?)",
        [reportId, n.note_text, n.date_created]
      );
    }
  }

  console.log(`Seeded ${seedReports.length} reports into the shieldbox database.`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
