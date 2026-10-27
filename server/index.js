import 'dotenv/config';
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
app.get('/api/partner/handymen', async (req, res) => {
  try {
    const PARTNER_URL = process.env.PARTNER_URL; // Gets the live link from your .env file
    
    // Calls Team 7 from your server
    const r = await fetch(`${PARTNER_URL}/api/handymen`, {
      headers: {
        'ngrok-skip-browser-warning': 'true' // Bypasses the Ngrok security screen
      }
    });

    if (!r.ok) {
      console.error('partner returned status:', r.status);
      return res.status(502).json({ message: 'Partner data unavailable' });
    }

    const handymen = await r.json();
    res.json(handymen);

  } catch (err) {
    console.error('partner call failed:', err.message);
    res.status(502).json({ message: 'Partner data unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`ShieldBox API listening at http://localhost:${PORT}`);
});
