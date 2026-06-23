import { useState, useEffect } from "react";

const NAV_LINKS = ["How It Works", "Who It's For", "Why Us", "Report"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="logo">Shield<span>Box</span></div>
      <ul className="nav-links">
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a href={`#${l.toLowerCase().replace(/\s/g, "-")}`}>{l}</a>
          </li>
        ))}
      </ul>
      <button className="nav-cta">File a Report</button>
    </nav>
  );
}