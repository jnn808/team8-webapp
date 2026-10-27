// server/app.js
import express from "express";
import cors from "cors";
import reportsRouter from "./routes/reports.js";

const app = express();

app.use(cors());
app.use(express.json());

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

// 4. Enforce security on routes (Auth first, then Rate Limiter)
// Testing limit: 3 requests per 1 minute
app.use("/reports", requireApiKey, rateLimit({ windowMs: 60000, max: 100 }), reportsRouter);

app.get("/", (req, res) => {
  res.send("ShieldBox API is running.");
});

export default app;