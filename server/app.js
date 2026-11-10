// server/app.js
import express from "express";
import cors from "cors";
import v1Router from "./routes/v1.js";
import v2Router from "./routes/v2.js";
import { monitor, statsHandler } from "./monitoring.js";

const app = express();

app.use(cors());
app.use(express.json());

// ---> ADD MONITOR HERE <---
app.use(monitor); // FIRST, so rejected requests are logged too

// 1. Load keys from .env
const VALID_KEYS = (process.env.API_KEYS || '').split(',').filter(Boolean);

// 2. Authentication middleware
function requireApiKey(req, res, next) {
  const key = req.get('X-API-Key');
  if (!key || !VALID_KEYS.includes(key)) {
    return res.status(401).json({ message: 'Missing or invalid API key' });
  }
  req.apiKey = key;
  next();
}

// 3. Rate Limiting middleware
function rateLimit({ windowMs, max }) {
  const hits = new Map(); 
  return (req, res, next) => {
    const id = req.apiKey || req.ip;
    const now = Date.now();
    let entry = hits.get(id);
    
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(id, entry);
    }
    
    entry.count += 1;
    
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ message: 'Too many requests', retryAfter });
    }
    
    next();
  };
}

// Add the stats route (protected by the API key check)
app.get('/stats', requireApiKey, statsHandler);

// Bundle our security middleware to make mounting cleaner
const secureRoute = [requireApiKey, rateLimit({ windowMs: 60000, max: 100 })];

// 4. Mount all versions of the API
app.use("/v2/reports", secureRoute, v2Router);
app.use("/v1/reports", secureRoute, v1Router);
app.use("/reports", secureRoute, v1Router); // The unversioned fallback (keeps old partner code from crashing)

app.get("/", (req, res) => {
  res.send("ShieldBox API is running.");
});

export default app;