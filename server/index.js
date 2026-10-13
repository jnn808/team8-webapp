// server/index.js
// This is the thing you actually run to serve real traffic (npm run
// server). It owns the two side effects app.js deliberately does NOT have:
// connecting to the database, and opening a real network port.
import app from "./app.js";
import { ensureTables } from "./database.js";

const PORT = 3001;

// Make sure the tables exist before we start accepting requests — this is
// just a safety net in case someone forgets to run `npm run db:seed` first.
await ensureTables();

app.listen(PORT, () => {
  console.log(`ShieldBox API listening at http://localhost:${PORT}`);
});
