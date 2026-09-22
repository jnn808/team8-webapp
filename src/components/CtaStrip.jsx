import { Link } from "react-router-dom";

export default function CtaStrip() {
  return (
    <section className="cta-strip" id="report">
      <h2>You already know what you saw.</h2>
      <p>
        The hardest part was deciding to act. We handle the rest — anonymously,
        securely, and with legal backing.
      </p>
      <Link to="/report" className="btn-dark">File a Report Now</Link>
    </section>
  );
}