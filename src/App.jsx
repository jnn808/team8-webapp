import "./index.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import ReportForm from "./pages/ReportForm";
import CaseTracker from "./pages/CaseTracker";

export default function App() {
  return (
    <div style={{ background: "#0D0F14", color: "#E8E4DC", minHeight: "100vh" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/track" element={<CaseTracker />} />
      </Routes>
      <Footer />
    </div>
  );
}