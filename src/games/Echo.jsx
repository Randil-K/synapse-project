import { useState, useRef, useCallback } from "react";
import GameShell from "../components/GameShell";
import { useBeep } from "../lib/useBeep";
import { recordScore, addXP } from "../lib/storage";

const FREQS = [329.6, 392.0, 466.2, 554.4];
// Order: top, right, bottom, left  (diamond / compass)
const COLORS = ["amber", "coral", "violet", "mint"];

export default function Echo() {
  const [seq, setSeq] = useState([]);
  const [lit, setLit] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | watch | input | over
  const [level, setLevel] = useState(0);
  const [best, setBest] = useState(
    () => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").echo || 0
  );
  const [msg, setMsg] = useState("Watch the sequence, then repeat it.");
  const userIdxRef = useRef(0);
  const beep = useBeep();

  const playSeq = useCallback(
    (fullSeq) => {
      setPhase("watch");
      setMsg("Watch closely…");
      let i = 0;
      const step = () => {
        setLit(null);
        if (i >= fullSeq.length) {
          setPhase("input");
          setMsg("Your turn — repeat it.");
          return;
        }
        setLit(fullSeq[i]);
        beep(FREQS[fullSeq[i]]);
        i++;
        setTimeout(() => {
          setLit(null);
          setTimeout(step, 120);
        }, 380);
      };
      setTimeout(step, 400);
    },
    [beep]
  );

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSeq(first);
    setLevel(1);
    userIdxRef.current = 0;
    playSeq(first);
  };

  const nextRound = (curSeq) => {
    const next = [...curSeq, Math.floor(Math.random() * 4)];
    setSeq(next);
    setLevel(next.length);
    userIdxRef.current = 0;
    playSeq(next);
  };

  const handleInput = (i) => {
    if (phase !== "input") return;
    beep(FREQS[i], 110);
    setLit(i);
    setTimeout(() => setLit(null), 180);

    if (i === seq[userIdxRef.current]) {
      userIdxRef.current += 1;
      if (userIdxRef.current === seq.length) {
        setMsg("Nice — next round.");
        setPhase("watch");
        setTimeout(() => nextRound(seq), 650);
      }
    } else {
      setWrong(i);
      setPhase("over");
      const finalLevel = level - 1;
      const scores = recordScore("echo", finalLevel);
      addXP(finalLevel * 4);
      setBest(scores.echo);
      setMsg(
        `Round over — you reached round ${level}.${finalLevel > best ? " New best!" : ""}`
      );
      setTimeout(() => setWrong(null), 400);
    }
  };

  // Diamond grid: 3×3 grid, pads at N / E / S / W cells
  // grid areas:
  //   .  0  .
  //   3  .  1
  //   .  2  .
  const PAD_STYLE = [
    { gridColumn: "2", gridRow: "1" }, // top    (amber)
    { gridColumn: "3", gridRow: "2" }, // right  (coral)
    { gridColumn: "2", gridRow: "3" }, // bottom (violet)
    { gridColumn: "1", gridRow: "2" }, // left   (mint)
  ];

  return (
    <GameShell
      title="Echo"
      stats={[
        { label: "Round", value: level || 1 },
        { label: "Best", value: best || "—" },
      ]}
    >
      {/* Diamond grid — fully self-contained, no overflow */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gridTemplateRows: "repeat(3, 80px)",
          gap: "8px",
        }}
      >
        {PAD_STYLE.map((style, i) => (
          <button
            key={i}
            onClick={() => handleInput(i)}
            style={style}
            className={[
              `pad-${COLORS[i]}`,
              "rounded-[18px] cursor-pointer transition-all duration-150 border-0 outline-none",
              lit === i
                ? "brightness-[1.5] scale-[1.07] shadow-glow"
                : "brightness-[0.55]",
              wrong === i ? "!brightness-40 !saturate-50" : "",
            ].join(" ")}
            aria-label={`Echo pad ${i + 1}`}
          />
        ))}
      </div>

      {/* Status message */}
      <div
        className={`text-[15px] text-center min-h-[22px] ${
          phase === "over"
            ? "text-coral"
            : level > 0 && phase !== "watch"
            ? "text-mint"
            : "text-muted"
        }`}
      >
        {msg}
      </div>

      {/* Start / Play again button */}
      {phase !== "watch" && phase !== "input" && (
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
