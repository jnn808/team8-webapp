// server/app.js
// Just builds and configures the Express app — no listening, no DB startup
// side effects. This is what tests import: they can send fake requests to
// this app object directly, with no real network port ever opened.
import express from "express";
import cors from "cors";
import reportsRouter from "./routes/reports.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/reports", reportsRouter);

app.get("/", (req, res) => {
  res.send("ShieldBox API is running.");
});

export default app;
