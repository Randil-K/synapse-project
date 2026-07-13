import { useState, useCallback } from "react";
import GameShell from "../components/GameShell";
import { useBeep } from "../lib/useBeep";
import { recordScore, addXP } from "../lib/storage";

const PCOLORS = ["#e8a33d", "#f26d5b", "#8aa6ff", "#4fd1c5", "#e8e8e8"];

function polygonPoints(sides, rotationDeg, r = 26, cx = 38, cy = 38) {
  const pts = [];
  const rot = (rotationDeg * Math.PI) / 180;
  for (let k = 0; k < sides; k++) {
    const a = rot + (k * 2 * Math.PI) / sides - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
function Shape({ sides, rotation, color, scale = 1 }) {
  return (
    <svg width="76" height="76" viewBox="0 0 76 76">
      <polygon points={polygonPoints(sides, rotation, 26 * scale)} fill={color} opacity="0.9" />
    </svg>
  );
}

function generateRound(rng = Math.random) {
  const ruleType = ["rotation", "sides", "color", "size"][Math.floor(rng() * 4)];
  const baseSides = 3 + Math.floor(rng() * 3);
  const baseColorIdx = Math.floor(rng() * PCOLORS.length);
  const baseRotation = Math.floor(rng() * 4) * 30;
  const baseScale = 0.7;

  const items = [];
  for (let s = 0; s < 4; s++) {
    let sides = baseSides, rotation = baseRotation, colorIdx = baseColorIdx, scale = baseScale;
    if (ruleType === "rotation") rotation = baseRotation + s * 40;
    if (ruleType === "sides") sides = baseSides + s;
    if (ruleType === "color") colorIdx = (baseColorIdx + s) % PCOLORS.length;
    if (ruleType === "size") scale = 0.55 + s * 0.18;
    items.push({ sides, rotation, color: PCOLORS[colorIdx], scale });
  }

  const correct = items[3];
  const distractors = [];
  let guard = 0;
  while (distractors.length < 3 && guard < 30) {
    guard++;
    const d = { ...correct };
    const which = Math.floor(rng() * 3);
    if (which === 0) d.sides = Math.max(3, correct.sides + (rng() < 0.5 ? -1 : 1));
    if (which === 1) d.rotation = correct.rotation + (rng() < 0.5 ? -40 : 40);
    if (which === 2) d.color = PCOLORS[(PCOLORS.indexOf(correct.color) + 1 + Math.floor(rng() * 3)) % PCOLORS.length];
    const key = JSON.stringify(d);
    if (key !== JSON.stringify(correct) && !distractors.some((x) => JSON.stringify(x) === key)) {
      distractors.push(d);
    }
  }
  const options = [correct, ...distractors].sort(() => rng() - 0.5);
  return { sequence: items.slice(0, 3), correct, options };
}

export default function Pattern() {
  const [round, setRound] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").pattern || 0);
  const [msg, setMsg] = useState("");
  const [picked, setPicked] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const beep = useBeep();

  const next = useCallback(() => {
    setRound(generateRound());
    setPicked(null);
    setMsg("");
    setPhase("playing");
  }, []);

  const start = () => {
    setStreak(0);
    next();
  };

  const choose = (opt) => {
    if (phase !== "playing" || picked) return;
    const isCorrect = JSON.stringify(opt) === JSON.stringify(round.correct);
    setPicked(opt);
    if (isCorrect) {
      beep(520, 140);
      setMsg("Correct.");
      const ns = streak + 1;
      setStreak(ns);
      setTimeout(next, 650);
    } else {
      beep(180, 220);
      setPhase("over");
      const scores = recordScore("pattern", streak);
      addXP(streak * 4);
      setBest(scores.pattern);
      setMsg(`Not quite — streak ended at ${streak}.${streak > best ? " New best!" : ""}`);
    }
  };

  return (
    <GameShell
      title="Pattern"
      stats={[
        { label: "Streak", value: streak },
        { label: "Best", value: best || "—" },
      ]}
    >
      <div className="text-muted text-sm text-center max-w-sm">
        {phase === "idle"
          ? "Figure out the rule linking these three shapes, then pick what comes next."
          : "Three shapes follow one rule. Find what comes fourth."}
      </div>

      {round && (
        <>
          <div className="flex items-center gap-3.5">
            {round.sequence.map((it, i) => (
              <div key={i} className="w-[76px] h-[76px] bg-[#0f2226] border border-panelEdge rounded-2xl flex items-center justify-center">
                <Shape {...it} />
              </div>
            ))}
            <span className="text-muted text-lg">→</span>
            <div className="w-[76px] h-[76px] border-2 border-dashed border-panelEdge rounded-2xl flex items-center justify-center text-muted font-display text-2xl">
              ?
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 w-full max-w-[420px]">
            {round.options.map((opt, i) => {
              const isPicked = picked && JSON.stringify(opt) === JSON.stringify(picked);
              const showCorrect = picked && JSON.stringify(opt) === JSON.stringify(round.correct);
              let cls = "border-panelEdge bg-[#0f2226] hover:border-violet hover:-translate-y-0.5";
              if (showCorrect) cls = "border-mint bg-[#123330]";
              else if (isPicked) cls = "border-coral bg-[#2c1512]";
              return (
                <div
                  key={i}
                  onClick={() => choose(opt)}
                  className={`border rounded-2xl py-3.5 flex items-center justify-center cursor-pointer transition-all ${cls}`}
                >
                  <Shape {...opt} />
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className={`text-[15px] text-center min-h-[20px] ${phase === "over" ? "text-coral" : "text-mint"}`}>{msg}</div>

      {(phase === "idle" || phase === "over") && (
        <button
          onClick={start}
          className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d99]"
        >
          {phase === "over" ? "Play again" : "Start"}
        </button>
      )}
    </GameShell>
  );
}
