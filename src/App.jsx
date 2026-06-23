import "./index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhoItsFor from "./components/WhoItsFor";
import WhyUs from "./components/WhyUs";
import CtaStrip from "./components/CtaStrip";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div style={{ background: "#0D0F14", color: "#E8E4DC", minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <WhoItsFor />
      <div className="divider" />
      <WhyUs />
      <CtaStrip />
      <Footer />
    </div>
  );
}