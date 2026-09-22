import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import WhoItsFor from "../components/WhoItsFor";
import WhyUs from "../components/WhyUs";
import CtaStrip from "../components/CtaStrip";

export default function Landing() {
  return (
    <>
      <Hero />
      <div className="divider" />
      <HowItWorks />
      <div className="divider" />
      <WhoItsFor />
      <div className="divider" />
      <WhyUs />
      <CtaStrip />
    </>
  );
}