import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import NeuralBg from "./components/NeuralBg";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Assess from "./pages/Assess";
import Learn from "./pages/Learn";
import Echo from "./games/Echo";
import Grid from "./games/Grid";
import Pattern from "./games/Pattern";
import FactCheck from "./games/FactCheck";
import Compress from "./games/Compress";
import DailyChallenge from "./games/DailyChallenge";
import { hasCompletedAssessment } from "./lib/storage";

// Guard: redirect new users to /assess before they can reach home
function HomeGuard() {
  if (!hasCompletedAssessment()) {
    return <Navigate to="/assess" replace />;
  }
  return <Home />;
}

export default function App() {
  return (
    <div className="min-h-screen relative">
      <NeuralBg />
      <div className="relative z-10">
        <NavBar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<HomeGuard />} />
            <Route path="/play/echo" element={<Echo />} />
            <Route path="/play/grid" element={<Grid />} />
            <Route path="/play/pattern" element={<Pattern />} />
            <Route path="/play/factcheck" element={<FactCheck />} />
            <Route path="/play/compress" element={<Compress />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/assess" element={<Assess />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
