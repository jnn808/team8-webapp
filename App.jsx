import { useState, useEffect } from "react";

const NAV_LINKS = ["How It Works", "Who It's For", "Why Us", "Report"];

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

const ADVANTAGES = [
  "End-to-end encryption on every report",
  "Tiered anonymity — you choose how visible to be",
  "Legal partnership framework protecting whistleblowers",
  "Evidence attachment to prevent baseless claims",
  "Neutral third-party verification before disclosure",
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0D0F14", color: "#E8E4DC", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ink: #0D0F14;
          --paper: #E8E4DC;
          --signal: #C8F45A;
          --muted: #5A5F6B;
          --panel: #161A22;
          --border: #252A35;
        }

        body { background: var(--ink); color: var(--paper); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 2.5rem;
          transition: background 0.3s, border-bottom 0.3s;
        }
        .nav.scrolled {
          background: rgba(13,15,20,0.95);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(8px);
        }
        .logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          color: var(--paper);
          letter-spacing: -0.02em;
        }
        .logo span { color: var(--signal); }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          color: var(--muted); font-family: 'Inter', sans-serif;
          font-size: 0.85rem; text-decoration: none; letter-spacing: 0.03em;
          font-weight: 400; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--paper); }
        .nav-cta {
          background: var(--signal); color: var(--ink);
          border: none; padding: 0.6rem 1.4rem;
          font-family: 'Inter', sans-serif; font-size: 0.85rem;
          font-weight: 600; cursor: pointer; letter-spacing: 0.02em;
          transition: opacity 0.2s;
        }
        .nav-cta:hover { opacity: 0.85; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 8rem 2.5rem 4rem;
          max-width: 900px; margin: 0 auto;
          position: relative;
        }
        .hero-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.15em; color: var(--signal);
          text-transform: uppercase; margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .hero-eyebrow::before {
          content: ''; display: inline-block;
          width: 2rem; height: 1px; background: var(--signal);
        }
        .hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 1.08; letter-spacing: -0.02em;
          color: var(--paper); margin-bottom: 1.75rem;
          max-width: 820px;
        }
        .hero h1 em {
          font-style: italic; color: var(--signal);
        }
        .hero-sub {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem; line-height: 1.7;
          color: var(--muted); max-width: 560px;
          margin-bottom: 2.5rem; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          background: var(--signal); color: var(--ink);
          border: none; padding: 0.9rem 2rem;
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 0.95rem; cursor: pointer; letter-spacing: 0.01em;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-ghost {
          background: transparent; color: var(--paper);
          border: 1px solid var(--border); padding: 0.9rem 2rem;
          font-family: 'Inter', sans-serif; font-weight: 400;
          font-size: 0.95rem; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: var(--paper); }
        .hero-stat-row {
          display: flex; gap: 3rem; margin-top: 4rem;
          padding-top: 2.5rem; border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .hero-stat span {
          display: block;
          font-family: 'DM Serif Display', serif;
          font-size: 2rem; color: var(--paper);
        }
        .hero-stat p {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; color: var(--muted);
          font-weight: 400; margin-top: 0.25rem;
          letter-spacing: 0.03em;
        }

        /* DIVIDER */
        .divider {
          width: 100%; max-width: 1100px; margin: 0 auto;
          height: 1px; background: var(--border);
        }

        /* SECTIONS */
        .section {
          max-width: 1100px; margin: 0 auto;
          padding: 6rem 2.5rem;
        }
        .section-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.15em; color: var(--signal);
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          line-height: 1.15; letter-spacing: -0.02em;
          color: var(--paper); margin-bottom: 1rem;
        }
        .section-body {
          font-family: 'Inter', sans-serif;
          font-size: 1rem; line-height: 1.7;
          color: var(--muted); max-width: 520px;
          font-weight: 300;
        }

        /* HOW IT WORKS */
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2px; margin-top: 3.5rem;
          border: 1px solid var(--border);
        }
        .step {
          padding: 2.5rem 2rem;
          background: var(--panel);
          border-right: 1px solid var(--border);
          transition: background 0.2s;
        }
        .step:last-child { border-right: none; }
        .step:hover { background: #1C2130; }
        .step-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3rem; color: var(--border);
          line-height: 1; margin-bottom: 1.5rem;
          transition: color 0.2s;
        }
        .step:hover .step-num { color: var(--signal); }
        .step h3 {
          font-family: 'Inter', sans-serif;
          font-size: 1rem; font-weight: 600;
          color: var(--paper); margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        .step p {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem; line-height: 1.65;
          color: var(--muted); font-weight: 300;
        }

        /* WHO IT'S FOR */
        .segments {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem; margin-top: 3.5rem;
        }
        .segment-card {
          border: 1px solid var(--border);
          padding: 2rem;
          transition: border-color 0.2s;
        }
        .segment-card:hover { border-color: var(--signal); }
        .seg-icon { font-size: 1.8rem; margin-bottom: 1rem; }
        .seg-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem; font-weight: 600;
          color: var(--paper); margin-bottom: 0.5rem;
        }
        .seg-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem; line-height: 1.6;
          color: var(--muted); font-weight: 300;
        }

        /* WHY US */
        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem; align-items: start;
          margin-top: 3.5rem;
        }
        .adv-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .adv-list li {
          display: flex; gap: 1rem; align-items: flex-start;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem; color: var(--muted);
          font-weight: 300; line-height: 1.5;
        }
        .adv-list li::before {
          content: '→'; color: var(--signal);
          font-size: 0.9rem; flex-shrink: 0; margin-top: 0.1rem;
        }
        .concept-box {
          background: var(--panel);
          border: 1px solid var(--border);
          padding: 2.5rem;
        }
        .concept-box h4 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem; color: var(--signal);
          margin-bottom: 1rem; font-style: italic;
        }
        .concept-box p {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem; line-height: 1.7;
          color: var(--muted); font-weight: 300;
        }

        /* CTA STRIP */
        .cta-strip {
          background: var(--signal);
          padding: 5rem 2.5rem;
          text-align: center;
        }
        .cta-strip h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          color: var(--ink); margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .cta-strip p {
          font-family: 'Inter', sans-serif;
          font-size: 1rem; color: #2a2e38;
          margin-bottom: 2rem; font-weight: 400;
          max-width: 480px; margin-left: auto; margin-right: auto;
          line-height: 1.6;
        }
        .btn-dark {
          background: var(--ink); color: var(--signal);
          border: none; padding: 1rem 2.5rem;
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 1rem; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-dark:hover { opacity: 0.85; }

        /* FOOTER */
        .footer {
          background: var(--panel);
          border-top: 1px solid var(--border);
          padding: 3rem 2.5rem;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: gap;
          max-width: 1100px; margin: 0 auto;
        }
        .footer-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem; color: var(--paper);
        }
        .footer-logo span { color: var(--signal); }
        .footer-note {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem; color: var(--muted);
          font-weight: 300;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .why-grid { grid-template-columns: 1fr; gap: 2rem; }
          .steps { grid-template-columns: 1fr; }
          .step { border-right: none; border-bottom: 1px solid var(--border); }
          .step:last-child { border-bottom: none; }
          .hero { padding: 7rem 1.5rem 3rem; }
          .section { padding: 4rem 1.5rem; }
          .hero-stat-row { gap: 2rem; }
          .footer { flex-direction: column; gap: 1rem; text-align: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="logo">Shield<span>Box</span></div>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l}><a href={`#${l.toLowerCase().replace(/\s/g, "-")}`}>{l}</a></li>
          ))}
        </ul>
        <button className="nav-cta">File a Report</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-eyebrow">Whistleblower Protection Platform</div>
        <h1>
          Speak the truth.<br />
          Stay <em>invisible</em>.
        </h1>
        <p className="hero-sub">
          A safe, anonymous digital platform that empowers employees to expose corporate misconduct — without fear, without identity.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">File a Report →</button>
          <button className="btn-ghost">Track My Case</button>
        </div>
        <div className="hero-stat-row">
          <div className="hero-stat">
            <span>100%</span>
            <p>End-to-end encrypted</p>
          </div>
          <div className="hero-stat">
            <span>0</span>
            <p>Personal data required</p>
          </div>
          <div className="hero-stat">
            <span>24h</span>
            <p>Report acknowledgement</p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-label">Process</div>
        <h2 className="section-title">How it works</h2>
        <p className="section-body">
          Three steps. No account. No trace. Your identity stays with you — the truth doesn't have to.
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

      <div className="divider" />

      {/* WHO IT'S FOR */}
      <section className="section" id="who-it's-for">
        <div className="section-label">Audience</div>
        <h2 className="section-title">Who it's for</h2>
        <p className="section-body">
          Whether you're a frontline employee or a compliance officer, ShieldBox gives you the tools to act — on your terms.
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

      <div className="divider" />

      {/* WHY US */}
      <section className="section" id="why-us">
        <div className="section-label">Unfair Advantage</div>
        <h2 className="section-title">Built to protect you,<br />not just the company</h2>
        <div className="why-grid">
          <ul className="adv-list">
            {ADVANTAGES.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <div className="concept-box">
            <h4>"The Black Box for Boardrooms"</h4>
            <p>
              Like a flight recorder, ShieldBox captures what corporations want buried. Reports are reviewed by neutral legal partners before reaching any internal team — so your submission is verified, protected, and impossible to suppress.
            </p>
            <br />
            <p>
              Addressing your concern about anonymous legitimacy: reporters may optionally attach evidence files. A unique case code links you to your report without revealing your identity — you can add information at any point, making fabricated reports structurally harder to sustain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip" id="report">
        <h2>You already know what you saw.</h2>
        <p>
          The hardest part was deciding to act. We handle the rest — anonymously, securely, and with legal backing.
        </p>
        <button className="btn-dark">File a Report Now</button>
      </section>

      {/* FOOTER */}
      <div style={{ background: "#161A22", borderTop: "1px solid #252A35" }}>
        <div className="footer">
          <div className="footer-logo">Shield<span>Box</span></div>
          <div className="footer-note">
            © 2025 ShieldBox · All reports encrypted · No data retained without consent
          </div>
        </div>
      </div>
    </div>
  );
}