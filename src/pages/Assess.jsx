import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FACTCHECK_POOL } from "../lib/factcheck-data";
import { COMPRESS_POOL } from "../lib/compress-data";
import { savePillarScores, markAssessmentComplete, addXP } from "../lib/storage";

// ---- Mini Echo memory test ------------------------------------------------
function MemoryStep({ onDone }) {
  const SEQ = [2, 0, 3, 1, 2]; // fixed 5-element sequence for assessment
  const COLORS = ["amber", "coral", "violet", "mint"];
  const LABELS = ["◆", "●", "■", "▲"];
  const [phase, setPhase] = useState("intro"); // intro | watch | input | done
  const [lit, setLit] = useState(null);
  const [userSeq, setUserSeq] = useState([]);
  const [correct, setCorrect] = useState(null);

  const playSeq = useCallback(() => {
    setPhase("watch");
    setUserSeq([]);
    let i = 0;
    const step = () => {
      setLit(null);
      if (i >= SEQ.length) {
        setTimeout(() => {
          setPhase("input");
        }, 300);
        return;
      }
      const cur = SEQ[i++];
      setTimeout(() => {
        setLit(cur);
        setTimeout(() => {
          setLit(null);
          setTimeout(step, 150);
        }, 420);
      }, 120);
    };
    setTimeout(step, 500);
  }, []);

  const handleInput = (idx) => {
    if (phase !== "input") return;
    const next = [...userSeq, idx];
    setUserSeq(next);
    setLit(idx);
    setTimeout(() => setLit(null), 180);

    if (next[next.length - 1] !== SEQ[next.length - 1]) {
      const got = next.length - 1;
      setCorrect(got);
      setPhase("done");
      setTimeout(() => onDone({ score: Math.round((got / SEQ.length) * 100) }), 800);
      return;
    }
    if (next.length === SEQ.length) {
      setCorrect(SEQ.length);
      setPhase("done");
      setTimeout(() => onDone({ score: 100 }), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-muted text-sm text-center max-w-xs">
        {phase === "intro" && "Watch the sequence of 5 symbols light up, then repeat it."}
        {phase === "watch" && "Watch closely…"}
        {phase === "input" && "Repeat the sequence from the beginning."}
        {phase === "done" && correct === SEQ.length
          ? "Perfect memory! ✨"
          : `Got ${correct} of ${SEQ.length} correct.`}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handleInput(i)}
            disabled={phase !== "input"}
            className={`w-20 h-20 rounded-2xl font-display text-2xl transition-all duration-150 border-2 border-transparent
              ${lit === i ? "brightness-150 scale-105 shadow-glow" : "brightness-50"}
              pad-${color}`}
          >
            {LABELS[i]}
          </button>
        ))}
      </div>
      {phase === "intro" && (
        <button
          onClick={playSeq}
          className="bg-amber text-[#1c1305] font-semibold rounded-full px-6 py-2.5 text-sm hover:-translate-y-0.5 transition-transform"
        >
          Start memory test
        </button>
      )}
    </div>
  );
}

// ---- Mini Pattern step (rule inference) ------------------------------------
const PATTERN_Q = {
  question: "Which shape comes next?",
  sequence: ["🔴", "🔴🔴", "🔴🔴🔴", "?"],
  options: ["🔴🔴🔴🔴", "🔵🔵", "🔴🔴", "🔶"],
  answer: 0,
  explanation: "The rule: add one red circle each step.",
};

function PatternStep({ onDone }) {
  const [chosen, setChosen] = useState(null);

  const handlePick = (i) => {
    setChosen(i);
    const score = i === PATTERN_Q.answer ? 100 : 30;
    setTimeout(() => onDone({ score }), 700);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-muted text-sm text-center">{PATTERN_Q.question}</p>
      <div className="flex gap-4 text-3xl items-end">
        {PATTERN_Q.sequence.map((s, i) => (
          <span key={i} className={s === "?" ? "text-muted text-xl" : ""}>
            {s}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {PATTERN_Q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handlePick(i)}
            disabled={chosen !== null}
            className={`rounded-xl border px-4 py-3 text-2xl text-center transition-all
              ${chosen === i
                ? i === PATTERN_Q.answer
                  ? "border-mint bg-mint/10"
                  : "border-coral bg-coral/10"
                : "border-panelEdge bg-panel/40 hover:border-violet/60"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Mini Fact-Check step --------------------------------------------------
const FC_Q = FACTCHECK_POOL[4]; // Vaccines question

function FactCheckStep({ onDone }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSubmit = () => {
    setRevealed(true);
    const correct = selected === FC_Q.hallucIndex;
    setTimeout(() => onDone({ score: correct ? 100 : 20 }), 1200);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-muted text-sm">
        Topic: <span className="text-ink">{FC_Q.topic}</span>
      </p>
      <p className="text-muted text-xs">Click the sentence that contains a hallucination.</p>
      <div className="flex flex-col gap-2">
        {FC_Q.sentences.map((sent, i) => {
          let cls = "rounded-xl px-4 py-3 border text-[13.5px] leading-relaxed cursor-pointer transition-all text-left ";
          if (revealed) {
            if (i === FC_Q.hallucIndex) cls += "border-coral bg-coral/10 text-ink";
            else if (i === selected) cls += "border-panelEdge bg-panel/20 text-muted/50 line-through";
            else cls += "border-panelEdge bg-panel/20 text-muted/60";
          } else {
            cls += i === selected
              ? "border-amber bg-amber/10 text-ink"
              : "border-panelEdge bg-panel/40 text-ink hover:border-violet/50";
          }
          return (
            <button key={i} className={cls} onClick={() => !revealed && setSelected(i)}>
              {i + 1}. {sent}
            </button>
          );
        })}
      </div>
      {!revealed && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="self-end bg-amber text-[#1c1305] font-semibold rounded-full px-6 py-2 text-sm hover:-translate-y-0.5 transition-all disabled:opacity-40"
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ---- Mini Compress step ---------------------------------------------------
const CP_Q = COMPRESS_POOL[2]; // Multitasking prompt (short + clear)
const MAX_W = 20;
function cw(t) { return t.trim() === "" ? 0 : t.trim().split(/\s+/).length; }

function CompressStep({ onDone }) {
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState("writing"); // writing | self-assess
  const words = cw(answer);
  const over = words > MAX_W;

  const OPTS = [
    { label: "Yes — got it", xp: 100 },
    { label: "Kind of", xp: 55 },
    { label: "No", xp: 20 },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-panel/60 border border-panelEdge rounded-xl px-4 py-3 text-sm text-ink leading-relaxed">
        {CP_Q.source}
      </div>
      {phase === "writing" ? (
        <>
          <div className="flex items-center justify-between text-xs font-mono text-muted mb-0.5">
            <span>Your summary (≤{MAX_W} words)</span>
            <span className={over ? "text-coral" : words > 16 ? "text-amber" : "text-mint"}>
              {words}/{MAX_W}
            </span>
          </div>
          <textarea
            rows={2}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Compress to ≤20 words…"
            className="w-full bg-[#0f2226] border border-panelEdge rounded-xl px-4 py-2.5 text-ink text-sm outline-none focus:border-mint transition-colors resize-none placeholder:text-muted/40"
          />
          <button
            onClick={() => setPhase("self-assess")}
            disabled={words === 0 || over}
            className="self-end bg-amber text-[#1c1305] font-semibold rounded-full px-6 py-2 text-sm hover:-translate-y-0.5 transition-all disabled:opacity-40"
          >
            Done →
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-muted text-xs">Did you capture the key point?</p>
          {OPTS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onDone({ score: opt.xp })}
              className="text-left px-4 py-2.5 rounded-xl border border-panelEdge bg-panel/40 hover:border-mint/50 text-ink text-sm transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Steps config ----------------------------------------------------------
const STEPS = [
  {
    id: "memory",
    pillar: "memory",
    title: "Memory Check",
    subtitle: "Pillar 1 — Recall & Short-term Memory",
    icon: "🧠",
    Component: MemoryStep,
  },
  {
    id: "pattern",
    pillar: "pattern",
    title: "Pattern Check",
    subtitle: "Pillar 2 — Pattern & Analytical Reasoning",
    icon: "🔷",
    Component: PatternStep,
  },
  {
    id: "critical",
    pillar: "critical",
    title: "Critical Thinking Check",
    subtitle: "Pillar 3 — Critical Thinking",
    icon: "🎯",
    Component: FactCheckStep,
  },
  {
    id: "problem",
    pillar: "problem",
    title: "Problem Solving Check",
    subtitle: "Pillar 4 — Problem Solving",
    icon: "✍️",
    Component: CompressStep,
  },
];

// ---- Main Assess page ------------------------------------------------------
export default function Assess() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState({});
  const [done, setDone] = useState(false);

  const handleStepDone = useCallback(
    ({ score }) => {
      const step = STEPS[stepIdx];
      const newResults = { ...results, [step.pillar]: score };
      setResults(newResults);

      if (stepIdx + 1 >= STEPS.length) {
        // Save to storage
        savePillarScores(newResults);
        markAssessmentComplete();
        addXP(50); // one-time assessment bonus
        setDone(true);
      } else {
        setStepIdx((s) => s + 1);
      }
    },
    [stepIdx, results]
  );

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-5 py-12 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="font-display text-4xl text-ink">Baseline set!</h1>
        <p className="text-muted text-[15px] max-w-sm leading-relaxed">
          Your skill radar chart is now seeded. Play games to improve your scores across all four pillars.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {STEPS.map((s) => (
            <div
              key={s.pillar}
              className="flex items-center justify-between px-4 py-2 bg-panel/60 border border-panelEdge rounded-xl"
            >
              <span className="text-muted text-sm">{s.icon} {s.title.replace(" Check", "")}</span>
              <span className="font-mono text-sm font-semibold text-amber">
                {results[s.pillar] || 0}
              </span>
            </div>
          ))}
        </div>
        <p className="text-muted text-xs font-mono">+50 XP bonus for completing your assessment</p>
        <button
          onClick={() => navigate("/")}
          className="bg-amber text-[#1c1305] font-semibold rounded-full px-8 py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d99] mt-2"
        >
          Let's play →
        </button>
      </div>
    );
  }

  const step = STEPS[stepIdx];
  const StepComponent = step.Component;

  return (
    <div className="max-w-2xl mx-auto px-5">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < stepIdx
                ? "bg-mint"
                : i === stepIdx
                ? "bg-amber"
                : "bg-panelEdge"
            }`}
          />
        ))}
      </div>

      <div className="bg-panel/80 border border-panelEdge rounded-xl2 px-6 py-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="text-3xl">{step.icon}</div>
          <div>
            <div className="font-mono text-xs text-muted uppercase tracking-widest mb-0.5">
              Step {stepIdx + 1} of {STEPS.length}
            </div>
            <h2 className="font-display text-2xl text-ink">{step.title}</h2>
            <p className="text-muted text-xs font-mono">{step.subtitle}</p>
          </div>
        </div>

        <StepComponent key={step.id} onDone={handleStepDone} />
      </div>

      <p className="text-muted text-xs text-center mt-4 font-mono">
        This baseline helps seed your skill radar chart on the Progress page.
      </p>
    </div>
  );
}
