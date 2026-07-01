import { Link } from "react-router-dom";
import { useState } from "react";

const CATEGORIES = [
  "Fraud or financial misconduct",
  "Harassment or discrimination",
  "Safety violation",
  "Ethics violation",
  "Data or privacy breach",
  "Other",
];

export default function ReportForm() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contactEmail, setContactEmail] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted

  function validate() {
    const next = {};
    if (!category) next.category = "Choose a category.";
    if (description.trim().length < 20)
      next.description = "Give at least a few sentences of detail.";
    if (!isAnonymous && !/^\S+@\S+\.\S+$/.test(contactEmail))
      next.contactEmail = "Enter a valid email or submit anonymously.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      // Replace with your actual submission endpoint
      const formData = new FormData();
      formData.append("category", category);
      formData.append("description", description);
      formData.append("anonymous", String(isAnonymous));
      if (!isAnonymous) formData.append("contactEmail", contactEmail);
      if (file) formData.append("evidence", file);

      await fetch("/api/reports", { method: "POST", body: formData });
      setStatus("submitted");
    } catch (err) {
      setStatus("idle");
      setErrors({ submit: "Something went wrong. Please try again." });
    }
  }

  if (status === "submitted") {
    return (
      <div className="page-shell">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <div className="form-header">
          <div className="section-label">Report received</div>
          <h1 className="section-title">Thank you.</h1>
          <p className="section-body">
            Your report has been submitted{isAnonymous ? " anonymously" : ""}.
            {!isAnonymous &&
              " We'll follow up at the email address you provided."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>

      <div className="form-header">
        <div className="section-label">Submit a Report</div>
        <h1 className="section-title">Report submission</h1>
        <p className="section-body">
          Fill out the details below. You can choose to submit anonymously,
          or leave contact info if you're open to follow-up questions.
        </p>
      </div>

      <form className="report-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="form-error">{errors.category}</div>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="description">
            What happened?
          </label>
          <textarea
            id="description"
            className="form-textarea"
            rows={7}
            placeholder="Describe what happened, when, and who was involved. Include as much detail as you're comfortable sharing."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <div className="form-error">{errors.description}</div>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="evidence">
            Supporting evidence (optional)
          </label>
          <input
            id="evidence"
            className="form-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-field form-toggle-row">
          <label className="form-toggle">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span>Submit anonymously</span>
          </label>
        </div>

        {!isAnonymous && (
          <div className="form-field">
            <label className="form-label" htmlFor="contactEmail">
              Contact email
            </label>
            <input
              id="contactEmail"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            {errors.contactEmail && (
              <div className="form-error">{errors.contactEmail}</div>
            )}
          </div>
        )}

        {errors.submit && <div className="form-error">{errors.submit}</div>}

        <button
          type="submit"
          className="submit-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}