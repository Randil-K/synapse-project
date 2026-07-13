import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import NeuralBg from "./components/NeuralBg";
import Home from "./pages/Home";
import Progress from "./pages/Progress";
import Echo from "./games/Echo";
import Grid from "./games/Grid";
import Pattern from "./games/Pattern";
import DailyChallenge from "./games/DailyChallenge";

export default function App() {
  return (
    <div className="min-h-screen relative">
      <NeuralBg />
      <div className="relative z-10">
        <NavBar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play/echo" element={<Echo />} />
            <Route path="/play/grid" element={<Grid />} />
            <Route path="/play/pattern" element={<Pattern />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
