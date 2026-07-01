import { Link } from "react-router-dom";

export default function ReportForm() {
  return (
    <div className="page-shell">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <div className="form-header">
        <div className="section-label">Submit a Report</div>
        <h1 className="section-title">Report submission</h1>
        <p className="section-body">
          This page is a placeholder. The report form will go here.
        </p>
      </div>
    </div>
  );
}