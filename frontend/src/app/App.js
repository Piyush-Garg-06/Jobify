import { HashRouter as Router, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage.js";
import LMSPortal from "./pages/LMSPortal.js";
import AdminPortal from "./pages/AdminPortal.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lms" element={<LMSPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}
