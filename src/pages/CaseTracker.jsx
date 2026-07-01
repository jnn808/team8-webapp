import { Link } from "react-router-dom";

export default function CaseTracker() {
  return (
    <div className="page-shell">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <div className="form-header">
        <div className="section-label">Track a Case</div>
        <h1 className="section-title">Case tracker</h1>
        <p className="section-body">
          This page is a placeholder. The case tracker will go here.
        </p>
      </div>
    </div>
  );
}