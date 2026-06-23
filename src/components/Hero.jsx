export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-eyebrow">Whistleblower Protection Platform</div>
      <h1>
        Speak the truth.<br />
        Stay <em>invisible</em>.
      </h1>
      <p className="hero-sub">
        A safe, anonymous digital platform that empowers employees to expose
        corporate misconduct — without fear, without identity.
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
  );
}