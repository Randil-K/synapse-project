import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../components/GameShell";
import { useBeep } from "../lib/useBeep";
import { dailyRandom } from "../lib/seededRandom";
import { todayKey, getDailyHistory, recordDailyResult, addXP } from "../lib/storage";

const FREQS = [329.6, 392.0, 466.2, 554.4];
const COLORS = ["amber", "coral", "violet", "mint"];
const POS = ["top-0 left-[85px]", "top-[85px] left-[170px]", "top-[170px] left-[85px]", "top-[85px] left-0"];
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
    <svg width="70" height="70" viewBox="0 0 76 76">
      <polygon points={polygonPoints(sides, rotation, 26 * scale)} fill={color} opacity="0.9" />
    </svg>
  );
}

function buildPatternQuestion(rng) {
  const ruleType = ["rotation", "sides", "color", "size"][Math.floor(rng() * 4)];
  const baseSides = 3 + Math.floor(rng() * 3);
  const baseColorIdx = Math.floor(rng() * PCOLORS.length);
  const baseRotation = Math.floor(rng() * 4) * 30;
  const items = [];
  for (let s = 0; s < 4; s++) {
    let sides = baseSides, rotation = baseRotation, colorIdx = baseColorIdx, scale = 0.7;
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
    if (key !== JSON.stringify(correct) && !distractors.some((x) => JSON.stringify(x) === key)) distractors.push(d);
  }
  const options = [correct, ...distractors].sort(() => rng() - 0.5);
  return { sequence: items.slice(0, 3), correct, options };
}

export default function DailyChallenge() {
  const key = todayKey();
  const navigate = useNavigate();
  const beep = useBeep();
  const alreadyDone = getDailyHistory()[key]?.completed;

  const rng = useMemo(() => dailyRandom(key), [key]);
  const echoSeq = useMemo(() => Array.from({ length: 5 }, () => Math.floor(rng() * 4)), [rng]);
  const gridTiles = useMemo(() => {
    const idxs = new Set();
    while (idxs.size < 5) idxs.add(Math.floor(rng() * 16));
    return [...idxs];
  }, [rng]);
  const patternQs = useMemo(() => Array.from({ length: 3 }, () => buildPatternQuestion(rng)), [rng]);

  const [stage, setStage] = useState(alreadyDone ? "done" : "intro"); // intro|echo|grid|pattern|summary|done
  const [scores, setScores] = useState({ echo: 0, grid: 0, pattern: 0 });

  // ---- Echo stage state ----
  const [lit, setLit] = useState(null);
  const [ePhase, setEPhase] = useState("watch");
  const userIdxRef = useRef(0);
  const [eMsg, setEMsg] = useState("Watch closely…");

  const runEcho = () => {
    setEPhase("watch");
    setEMsg("Watch closely…");
    userIdxRef.current = 0;
    let i = 0;
    const step = () => {
      setLit(null);
      if (i >= echoSeq.length) {
        setEPhase("input");
        setEMsg("Repeat the sequence.");
        return;
      }
      setLit(echoSeq[i]);
      beep(FREQS[echoSeq[i]]);
      i++;
      setTimeout(() => setTimeout(step, 120), 380);
    };
    setTimeout(step, 400);
  };

  const echoInput = (i) => {
    if (ePhase !== "input") return;
    setLit(i);
    beep(FREQS[i], 110);
    setTimeout(() => setLit(null), 160);
    if (i === echoSeq[userIdxRef.current]) {
      userIdxRef.current++;
      if (userIdxRef.current === echoSeq.length) {
        setScores((s) => ({ ...s, echo: echoSeq.length }));
        setEPhase("done");
        setEMsg("Sequence complete.");
        setTimeout(() => setStage("grid"), 700);
      }
    } else {
      setScores((s) => ({ ...s, echo: userIdxRef.current }));
      setEPhase("done");
      setEMsg(`Got ${userIdxRef.current} of ${echoSeq.length}.`);
      setTimeout(() => setStage("grid"), 900);
    }
  };

  // ---- Grid stage state ----
  const [gPicked, setGPicked] = useState([]);
  const [gPhase, setGPhase] = useState("memorize");
  const [gMsg, setGMsg] = useState("Memorize…");

  const runGrid = () => {
    setGPhase("memorize");
    setGPicked([]);
    setGMsg("Memorize…");
    setTimeout(() => {
      setGPhase("input");
      setGMsg("Click the 5 tiles you saw.");
    }, 1700);
  };

  const gridPick = (i) => {
    if (gPhase !== "input" || gPicked.includes(i)) return;
    const next = [...gPicked, i];
    setGPicked(next);
    if (next.length === gridTiles.length) {
      const correctCount = next.filter((p) => gridTiles.includes(p)).length;
      setScores((s) => ({ ...s, grid: correctCount }));
      setGPhase("done");
      setGMsg(`${correctCount} of ${gridTiles.length} correct.`);
      setTimeout(() => setStage("pattern"), 900);
    }
  };

  // ---- Pattern stage state ----
  const [pIdx, setPIdx] = useState(0);
  const [pPicked, setPPicked] = useState(null);
  const [pCorrectCount, setPCorrectCount] = useState(0);

  const patternChoose = (opt) => {
    if (pPicked) return;
    setPPicked(opt);
    const isCorrect = JSON.stringify(opt) === JSON.stringify(patternQs[pIdx].correct);
    beep(isCorrect ? 520 : 180, isCorrect ? 140 : 220);
    const newCount = pCorrectCount + (isCorrect ? 1 : 0);
    setTimeout(() => {
      if (pIdx + 1 < patternQs.length) {
        setPIdx(pIdx + 1);
        setPPicked(null);
        setPCorrectCount(newCount);
      } else {
        setScores((s) => ({ ...s, pattern: newCount }));
        finish(newCount);
      }
    }, 600);
  };

  const finish = (patternScore) => {
    const total = scores.echo + scores.grid + patternScore;
    const streak = recordDailyResult(key, { completed: true, score: total });
    addXP(30 + total * 5);
    setStage("summary");
    setFinalStreak(streak);
    setFinalTotal(total);
  };
  const [finalStreak, setFinalStreak] = useState(null);
  const [finalTotal, setFinalTotal] = useState(null);

  return (
    <GameShell title="Daily Challenge" stats={[{ label: "Date", value: key.slice(5) }, { label: "Streak", value: finalStreak ?? "—" }]}>
      {stage === "intro" && (
        <>
          <p className="text-muted text-sm text-center max-w-sm">
            One combined round today: a 5-step Echo sequence, a Grid recall, and 3 Pattern questions.
            Everyone gets the exact same challenge — come back tomorrow for a new one.
          </p>
          <button
            onClick={() => {
              setStage("echo");
              setTimeout(runEcho, 50);
            }}
            className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform"
          >
            Begin
          </button>
        </>
      )}

      {stage === "done" && (
        <>
          <p className="text-mint text-center">You've already completed today's challenge — nice work.</p>
          <p className="text-muted text-sm text-center">Score: {getDailyHistory()[key]?.score} · Come back tomorrow for a new one.</p>
          <button onClick={() => navigate("/progress")} className="border border-panelEdge rounded-full px-6 py-2.5 text-sm text-muted hover:text-ink hover:border-mint transition-colors">
            View your streak
          </button>
        </>
      )}

      {stage === "echo" && (
        <>
          <div className="relative w-[280px] h-[280px]">
            {POS.map((pos, i) => (
              <div
                key={i}
                onClick={() => echoInput(i)}
                className={`pad-${COLORS[i]} absolute w-[110px] h-[110px] rounded-[26px] cursor-pointer transition-all duration-150 ${pos} ${
                  lit === i ? "brightness-[1.4] scale-[1.06] shadow-glow" : "brightness-[0.55]"
                }`}
              />
            ))}
          </div>
          <div className="text-[15px] text-muted text-center">{eMsg}</div>
        </>
      )}

      {stage === "grid" && (
        <>
          <GridKickoff onMount={runGrid} />
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, 64px)" }}>
            {Array.from({ length: 16 }).map((_, i) => {
              let cls = "tile-base";
              if (gPhase === "memorize" && gridTiles.includes(i)) cls = "bg-amber border-amber";
              else if (gPhase === "done" && gridTiles.includes(i)) cls = "bg-mint border-mint";
              else if (gPhase === "done" && gPicked.includes(i) && !gridTiles.includes(i)) cls = "bg-coral border-coral";
              else if (gPicked.includes(i)) cls = "bg-violet border-violet";
              return (
                <div key={i} onClick={() => gridPick(i)} className={`w-16 h-16 rounded-2xl border cursor-pointer transition-all ${cls}`} />
              );
            })}
          </div>
          <div className="text-[15px] text-muted text-center">{gMsg}</div>
        </>
      )}

      {stage === "pattern" && (
        <>
          <div className="text-muted text-sm text-center">Question {pIdx + 1} of {patternQs.length}</div>
          <div className="flex items-center gap-3.5">
            {patternQs[pIdx].sequence.map((it, i) => (
              <div key={i} className="w-[76px] h-[76px] bg-[#0f2226] border border-panelEdge rounded-2xl flex items-center justify-center">
                <Shape {...it} />
              </div>
            ))}
            <span className="text-muted text-lg">→</span>
            <div className="w-[76px] h-[76px] border-2 border-dashed border-panelEdge rounded-2xl flex items-center justify-center text-muted font-display text-2xl">?</div>
          </div>
          <div className="grid grid-cols-4 gap-3 w-full max-w-[420px]">
            {patternQs[pIdx].options.map((opt, i) => {
              const isPicked = pPicked && JSON.stringify(opt) === JSON.stringify(pPicked);
              const showCorrect = pPicked && JSON.stringify(opt) === JSON.stringify(patternQs[pIdx].correct);
              let cls = "border-panelEdge bg-[#0f2226] hover:border-violet hover:-translate-y-0.5";
              if (showCorrect) cls = "border-mint bg-[#123330]";
              else if (isPicked) cls = "border-coral bg-[#2c1512]";
              return (
                <div key={i} onClick={() => patternChoose(opt)} className={`border rounded-2xl py-3.5 flex items-center justify-center cursor-pointer transition-all ${cls}`}>
                  <Shape {...opt} />
                </div>
              );
            })}
          </div>
        </>
      )}

      {stage === "summary" && (
        <>
          <h3 className="font-display text-2xl text-mint">Today's score: {finalTotal} / 9</h3>
          <div className="font-mono text-sm text-muted flex gap-6">
            <span>Echo {scores.echo}/5</span>
            <span>Grid {scores.grid}/5</span>
            <span>Pattern {scores.pattern}/3</span>
          </div>
          <p className="text-muted text-sm">🔥 {finalStreak}-day streak</p>
          <button onClick={() => navigate("/progress")} className="border border-panelEdge rounded-full px-6 py-2.5 text-sm text-muted hover:text-ink hover:border-mint transition-colors">
            View your progress
          </button>
        </>
      )}
    </GameShell>
  );
}

// Tiny helper: fires a callback exactly once on mount, used to kick off the
// grid memorize phase when that stage first renders.
function GridKickoff({ onMount }) {
  const fired = useRef(false);
  if (!fired.current) {
    fired.current = true;
    onMount();
  }
  return null;
}
