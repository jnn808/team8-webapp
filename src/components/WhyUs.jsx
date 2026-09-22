const ADVANTAGES = [
  "End-to-end encryption on every report",
  "Tiered anonymity — you choose how visible to be",
  "Legal partnership framework protecting whistleblowers",
  "Evidence attachment to prevent baseless claims",
  "Neutral third-party verification before disclosure",
];

export default function WhyUs() {
  return (
    <section className="section" id="why-us">
      <div className="section-label">Unfair Advantage</div>
      <h2 className="section-title">
        Built to protect you,<br />not just the company
      </h2>
      <div className="why-grid">
        <ul className="adv-list">
          {ADVANTAGES.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <div className="concept-box">
          <h4>"The Black Box for Boardrooms"</h4>
          <p>
            Like a flight recorder, ShieldBox captures what corporations want
            buried. Reports are reviewed by neutral legal partners before
            reaching any internal team — so your submission is verified,
            protected, and impossible to suppress.
          </p>
          <br />
          <p>
            Reporters may optionally attach evidence files. A unique case code
            links you to your report without revealing your identity — you can
            add information at any point, making fabricated reports structurally
            harder to sustain.
          </p>
        </div>
      </div>
    </section>
  );
}