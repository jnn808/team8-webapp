// server/index.js
// This is the actual backend server. It is separate from Vite (which only
// serves the React frontend) — they run as two separate processes.
import express from "express";
import cors from "cors";
import reportsRouter from "./routes/reports.js";
import { ensureTables } from "./database.js";

const app = express();
const PORT = 3001;

app.use(cors());            // allow the Vite dev server (different port) to call this API
app.use(express.json());    // parse incoming JSON request bodies

app.use("/reports", reportsRouter);

// Simple root route just so visiting http://localhost:3001 in a browser
// confirms the server is alive.
app.get("/", (req, res) => {
  res.send("ShieldBox API is running.");
});

// Make sure the tables exist before we start accepting requests — this is
// just a safety net in case someone forgets to run `npm run db:seed` first.
await ensureTables();

app.listen(PORT, () => {
  console.log(`ShieldBox API listening at http://localhost:${PORT}`);
});
