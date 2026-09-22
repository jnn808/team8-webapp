// server/database.js
//
// Opens a connection pool to your local MySQL (XAMPP) server and makes
// sure the two tables exist. A "pool" just means: instead of opening a
// brand new connection for every single query, we keep a small set of
// open connections ready to reuse — this is the standard way to talk to
// MySQL from Node.

import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";

// Connect WITHOUT specifying a database first, and create it if it doesn't
// exist yet. This means you never need to open phpMyAdmin (which needs
// Apache running) just to make the database — this code does it for you,
// and MySQL alone (no Apache) is all XAMPP needs to have running.
const bootstrapConnection = await mysql.createConnection({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
});
await bootstrapConnection.query(
  `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
);
await bootstrapConnection.end();

export const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 5,
});

// Column names are deliberately NOT the same as the contract's field names
// (desc, current_status, date_created — not description/status/createdAt).
// This is on purpose: real databases rarely match your API contract
// exactly, so the route handler still has to do the mapping step.
export async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      case_code      VARCHAR(20) UNIQUE NOT NULL,
      category       VARCHAR(50) NOT NULL,
      desc_text      TEXT NOT NULL,
      current_status VARCHAR(20) NOT NULL,
      date_created   DATETIME NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      report_id    INT NOT NULL,
      note_text    TEXT NOT NULL,
      date_created DATETIME NOT NULL,
      FOREIGN KEY (report_id) REFERENCES reports(id)
    )
  `);

  // Added for Week 6: PATCH needs somewhere to store when a report was
  // last updated. IF NOT EXISTS means this is safe to run again on a
  // database that already has the reports table from Week 5 — it won't
  // touch your existing rows.
  await pool.query(`
    ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at DATETIME NULL
  `);
}
