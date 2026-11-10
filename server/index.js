import 'dotenv/config';
import app from "./app.js";
import { ensureTables } from "./database.js";
import { fetchWithRetry } from "./resilientFetch.js";
import { versions } from "./partner.js"; // <-- 1. Import your adapter

const PORT = 3001;

await ensureTables();

// Keep the last good response in memory
let lastGood = null;

app.get('/api/partner/handymen', async (req, res) => {
  try {
    const PARTNER_URL = process.env.PARTNER_URL;
    
    // 2. Select the version based on your .env file
    const partnerVer = process.env.PARTNER_VERSION || 'v1';
    const partnerApi = versions[partnerVer];
    
    // 3. Build the URL dynamically using the adapter's path
    const baseUrl = PARTNER_URL.replace(/\/$/, ''); // strip trailing slash just in case
    const url = `${baseUrl}${partnerApi.path}`;
    
    const r = await fetchWithRetry(
      url,
      { headers: { 'ngrok-skip-browser-warning': 'true' } },
      { timeoutMs: 1500, retries: 2, delayMs: 200 }
    );

    if (!r.ok) {
      throw new Error(`partner returned status: ${r.status}`);
    }

    const rawData = await r.json();
    
    // 4. Transform the data using the adapter's parse function!
    const parsedData = partnerApi.parse(rawData);
    
    // Save successful data and the current time to our cache
    lastGood = { 
      data: parsedData, 
      asof: new Date().toISOString() 
    };
    
    // Return the new object format with the stale flag
    return res.json({ data: lastGood.data, stale: false, asof: lastGood.asof });

  } catch (err) {
    const reason = err.name === 'TimeoutError'
      ? 'timeout' 
      : (err.cause?.code || err.message);
      
    console.error('partner call failed:', reason);
    
    // If we have saved data, serve it gracefully!
    if (lastGood) {
      return res.json({ data: lastGood.data, stale: true, asof: lastGood.asof });
    }
    
    // If we have no saved data at all, return the standard error
    return res.status(502).json({ message: 'Partner data unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`ShieldBox API listening at http://localhost:${PORT}`);
});