const STEPS = [
  {
    number: "01",
    title: "Submit Anonymously",
    body: "File your report through our encrypted portal. No login required. No personal data collected unless you choose to share it.",
  },
  {
    number: "02",
    title: "Get a Secure Code",
    body: "Receive a unique case reference code. Use it to follow up, add evidence, or respond to investigators — all without revealing who you are.",
  },
  {
    number: "03",
    title: "Track Your Case",
    body: "Monitor the status of your report in real time. Our neutral legal partners review every submission before it reaches the company.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="section-label">Process</div>
      <h2 className="section-title">How it works</h2>
      <p className="section-body">
        Three steps. No account. No trace. Your identity stays with you — the
        truth doesn't have to.
      </p>
      <div className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.number}>
            <div className="step-num">{s.number}</div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}