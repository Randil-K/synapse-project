import { useState, useRef } from "react";
import GameShell from "../components/GameShell";
import { useBeep } from "../lib/useBeep";
import { recordScore, addXP } from "../lib/storage";

function dims(level) {
  if (level <= 4) return { size: 3, count: 3 + Math.floor((level - 1) / 2) };
  if (level <= 8) return { size: 4, count: 4 + Math.floor((level - 5) / 2) };
  return { size: 5, count: 6 + Math.floor((level - 9) / 2) };
}

export default function Grid() {
  const [level, setLevel] = useState(0);
  const [size, setSize] = useState(3);
  const [lit, setLit] = useState([]);
  const [picked, setPicked] = useState([]);
  const [reveal, setReveal] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | memorize | input | over
  const [msg, setMsg] = useState("Memorize the tiles that light up.");
  const [best, setBest] = useState(() => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").grid || 0);
  const litRef = useRef([]);

  const playRound = (lvl) => {
    const { size: s, count } = dims(lvl);
    setSize(s);
    setPicked([]);
    setReveal(false);
    const idxs = [...Array(s * s).keys()].sort(() => Math.random() - 0.5).slice(0, count);
    litRef.current = idxs;
    setLit(idxs);
    setPhase("memorize");
    setMsg("Memorize…");
    setTimeout(() => {
      setLit([]);
      setPhase("input");
      setMsg(`Click the ${count} tiles you saw.`);
    }, 1400 + count * 90);
  };

  const start = () => {
    setLevel(1);
    playRound(1);
  };

  const pick = (i) => {
    if (phase !== "input" || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === litRef.current.length) {
      const correct = next.every((p) => litRef.current.includes(p));
      setReveal(true);
      setPhase("checking");
      setTimeout(() => {
        if (correct) {
          setMsg("Correct — next round.");
          setPhase("input");
          setLevel((l) => {
            const nl = l + 1;
            playRound(nl);
            return nl;
          });
        } else {
          setPhase("over");
          const scores = recordScore("grid", level);
          addXP(level * 4);
          setBest(scores.grid);
          setMsg(`Round over — you reached round ${level}.${level > best ? " New best!" : ""}`);
        }
      }, 700);
    }
  };

  return (
    <GameShell
      title="Grid"
      stats={[
        { label: "Round", value: level || 1 },
        { label: "Best", value: best || "—" },
      ]}
    >
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${size}, 64px)` }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          let cls = "tile-base";
          if (phase === "memorize" && lit.includes(i)) cls = "bg-amber border-amber";
          else if (reveal && litRef.current.includes(i)) cls = "bg-mint border-mint";
          else if (reveal && picked.includes(i) && !litRef.current.includes(i)) cls = "bg-coral border-coral";
          else if (picked.includes(i)) cls = "bg-violet border-violet";
          return (
            <div
              key={i}
              onClick={() => pick(i)}
              className={`w-16 h-16 rounded-2xl border cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${cls}`}
            />
          );
        })}
      </div>
      <div className={`text-[15px] text-center min-h-[20px] ${phase === "over" ? "text-coral" : phase === "checking" ? "text-mint" : "text-muted"}`}>
        {msg}
      </div>
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
