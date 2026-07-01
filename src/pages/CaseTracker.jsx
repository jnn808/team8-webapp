import { Link } from "react-router-dom";
import { useState } from "react";

const MOCK_CASES = {
  "SB-2025-001": {
    category: "Fraud or financial misconduct",
    submitted: "2 days ago",
    status: "Under Review",
    steps: [
      { label: "Report received", done: true },
      { label: "Identity verified (anonymous)", done: true },
      { label: "Assigned to review team", done: true },
      { label: "Investigation in progress", done: false },
      { label: "Outcome communicated", done: false },
    ],
    note: "Your case has been assigned to a review team. Updates are typically posted within 5–7 business days.",
  },
  "SB-2025-002": {
    category: "Safety violation",
    submitted: "5 days ago",
    status: "Investigation in Progress",
    steps: [
      { label: "Report received", done: true },
      { label: "Identity verified (anonymous)", done: true },
      { label: "Assigned to review team", done: true },
      { label: "Investigation in progress", done: true },
      { label: "Outcome communicated", done: false },
    ],
    note: "An active investigation is underway. No further action is required from you at this time.",
  },
  "SB-2025-003": {
    category: "Ethics violation",
    submitted: "12 days ago",
    status: "Closed",
    steps: [
      { label: "Report received", done: true },
      { label: "Identity verified (anonymous)", done: true },
      { label: "Assigned to review team", done: true },
      { label: "Investigation in progress", done: true },
      { label: "Outcome communicated", done: true },
    ],
    note: "This case has been resolved. Thank you for your report.",
  },
};

export default function CaseTracker() {
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  function handleTrack() {
    const code = input.trim().toUpperCase();
    setSearched(true);
    setResult(MOCK_CASES[code] || null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleTrack();
  }

  return (
    <div className="page-shell">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>

      <div className="form-header">
        <div className="section-label">Track a Case</div>
        <h1 className="section-title">Case tracker</h1>
        <p className="section-body">
          Enter the secure case code you received when you filed your report.
          Your code looks like <strong style={{ color: "#C8F45A" }}>SB-2025-001</strong>.
        </p>
      </div>

      <div className="tracker-form">
        <input
          className="tracker-input"
          type="text"
          placeholder="Enter your case code e.g. SB-2025-001"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-primary" onClick={handleTrack}>
          Track case
        </button>
      </div>

      {searched && !result && (
        <div className="tracker-empty">
          No case found for <strong>{input.trim().toUpperCase()}</strong>. Double-check your case code and try again.
        </div>
      )}

      {searched && result && (
        <div className="tracker-result">
          <div className="tracker-result-header">
            <span className="case-code-pill">{input.trim().toUpperCase()}</span>
            <span className="status-pill">{result.status}</span>
          </div>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>
            Category: {result.category} · Submitted {result.submitted}
          </p>

          <ul className="timeline">
            {result.steps.map((step) => (
              <li key={step.label} className={`timeline-step${step.done ? " done" : ""}`}>
                <span className="timeline-dot" />
                {step.label}
              </li>
            ))}
          </ul>

          <p className="tracker-update-note">{result.note}</p>
        </div>
      )}
    </div>
  );
}