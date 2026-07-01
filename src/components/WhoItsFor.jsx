const SEGMENTS = [
  {
    icon: "🏢",
    label: "Employees in large corporations",
    desc: "Speak up about fraud, harassment, or misconduct — without risking your job.",
  },
  {
    icon: "⚖️",
    label: "Compliance officers & NGOs",
    desc: "Receive structured, verified reports and act on them through a governed process.",
  },
  {
    icon: "🏦",
    label: "High-risk sectors",
    desc: "Banking, construction, and public procurement — where silence costs everyone.",
  },
];

export default function WhoItsFor() {
  return (
    <section className="section" id="who-its-for">
      <div className="section-label">Audience</div>
      <h2 className="section-title">Who it's for</h2>
      <p className="section-body">
        Whether you're a frontline employee or a compliance officer, ShieldBox
        gives you the tools to act — on your terms.
      </p>
      <div className="segments">
        {SEGMENTS.map((s) => (
          <div className="segment-card" key={s.label}>
            <div className="seg-icon">{s.icon}</div>
            <div className="seg-label">{s.label}</div>
            <div className="seg-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
