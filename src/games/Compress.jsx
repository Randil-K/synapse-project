import { useState, useCallback, useRef } from "react";
import GameShell from "../components/GameShell";
import { COMPRESS_POOL } from "../lib/compress-data";
import { recordScore, addXP, updatePillarScore } from "../lib/storage";

const MAX_WORDS = 20;

function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function pickRandom(used) {
  const available = COMPRESS_POOL.filter((p) => !used.has(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Self-assessment options: label, XP, pillar value
const SELF_OPTIONS = [
  { label: "Yes — I got the key point", emoji: "✓", xp: 15, pillar: 85, color: "mint" },
  { label: "Kind of — mostly there", emoji: "~", xp: 8, pillar: 55, color: "amber" },
  { label: "No — I missed it", emoji: "✗", xp: 2, pillar: 20, color: "coral" },
];

export default function Compress({ embedded = false, onResult }) {
  const [used, setUsed] = useState(new Set());
  const [prompt, setPrompt] = useState(() => pickRandom(new Set()));
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState("writing"); // writing | self-assess | revealed | over
  const [score, setScore] = useState(0);
  const [roundsDone, setRoundsDone] = useState(0);
  const [best, setBest] = useState(
    () => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").compress || 0
  );
  const textRef = useRef(null);

  const words = countWords(answer);
  const overLimit = words > MAX_WORDS;

  const handleSubmitWriting = useCallback(() => {
    if (words === 0 || overLimit) return;
    setPhase("self-assess");
  }, [words, overLimit]);

  const handleSelfAssess = useCallback(
    (option) => {
      const newScore = score + option.xp;
      const newRounds = roundsDone + 1;
      setScore(newScore);
      setRoundsDone(newRounds);
      addXP(option.xp);
      updatePillarScore("problem", option.pillar);
      setPhase("revealed");
    },
    [score, roundsDone]
  );

  const handleNext = useCallback(() => {
    if (!prompt) return;
    const newUsed = new Set(used);
    newUsed.add(prompt.id);
    const next = pickRandom(newUsed);

    if (next === null) {
      const s = recordScore("compress", score);
      setBest(s.compress);
      setPhase("over");
      onResult?.({ score, rounds: roundsDone });
      return;
    }
    setUsed(newUsed);
    setPrompt(next);
    setAnswer("");
    setPhase("writing");
    setTimeout(() => textRef.current?.focus(), 50);
  }, [used, prompt, score, roundsDone, onResult]);

  const handleRestart = () => {
    setUsed(new Set());
    setPrompt(pickRandom(new Set()));
    setAnswer("");
    setScore(0);
    setRoundsDone(0);
    setPhase("writing");
  };

  const content = (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {phase === "over" ? (
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="text-5xl">✍️</div>
          <h2 className="font-display text-3xl text-ink">Session complete</h2>
          <p className="text-muted text-center">
            You earned <span className="text-amber font-semibold">{score} points</span> across{" "}
            {roundsDone} compression rounds.
          </p>
          {score > best && (
            <div className="text-mint text-sm font-mono">✨ New personal best!</div>
          )}
          <button
            onClick={handleRestart}
            className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d99]"
          >
            Play again
          </button>
        </div>
      ) : prompt ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                Round {roundsDone + 1}
              </div>
              <h2 className="font-display text-xl text-ink">Compress It</h2>
            </div>
            <div className="font-mono text-xs text-amber text-right">
              <div className="text-base font-semibold">{score} pts</div>
            </div>
          </div>

          {/* Source text */}
          <div className="bg-panel/60 border border-panelEdge rounded-xl px-5 py-4">
            <div className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
              Source paragraph
            </div>
            <p className="text-ink text-[14.5px] leading-relaxed">{prompt.source}</p>
            <div className="font-mono text-xs text-muted mt-2">
              ~{prompt.wordCount} words
            </div>
          </div>

          {/* Writing area */}
          {(phase === "writing" || phase === "self-assess") && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs text-muted uppercase tracking-widest">
                  Your summary (≤{MAX_WORDS} words)
                </label>
                <span
                  className={`font-mono text-sm font-semibold transition-colors ${
                    overLimit ? "text-coral" : words > 16 ? "text-amber" : "text-mint"
                  }`}
                >
                  {words} / {MAX_WORDS}
                </span>
              </div>
              <textarea
                ref={textRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={phase === "self-assess"}
                rows={3}
                placeholder="Write your ≤20-word summary here…"
                className="w-full bg-[#0f2226] border border-panelEdge rounded-xl px-4 py-3 text-ink text-[14.5px] leading-relaxed outline-none focus:border-mint transition-colors resize-none placeholder:text-muted/40 disabled:opacity-60"
              />
              {overLimit && (
                <p className="text-coral text-xs font-mono mt-1">
                  Over the limit — trim {words - MAX_WORDS} word{words - MAX_WORDS !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {/* Self-assessment step */}
          {phase === "self-assess" && (
            <div className="flex flex-col gap-3">
              <p className="text-muted text-sm">
                Did your summary capture the key point?{" "}
                <span className="text-ink/60 text-xs font-mono">
                  (be honest — only you know)
                </span>
              </p>
              <div className="flex flex-col gap-2">
                {SELF_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelfAssess(opt)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-panelEdge bg-panel/40 hover:border-${opt.color}/60 hover:bg-panel/70 transition-all text-left`}
                  >
                    <span
                      className={`font-mono text-lg text-${opt.color} w-6 text-center`}
                    >
                      {opt.emoji}
                    </span>
                    <span className="text-ink text-sm">{opt.label}</span>
                    <span className="ml-auto font-mono text-xs text-muted">
                      +{opt.xp} XP
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Model answer reveal */}
          {phase === "revealed" && (
            <>
              <div className="bg-panel/60 border border-mint/30 rounded-xl px-5 py-4">
                <div className="font-mono text-xs text-mint uppercase tracking-widest mb-2">
                  Model answer
                </div>
                <p className="text-ink text-[14.5px] leading-relaxed italic">
                  "{prompt.model}"
                </p>
                <div className="mt-2 text-muted text-xs font-mono">
                  Key point: {prompt.keyPoint}
                </div>
              </div>
              <div className="bg-panel/40 border border-panelEdge rounded-xl px-5 py-3">
                <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                  Your summary
                </div>
                <p className="text-ink text-[14px]">{answer}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-violet text-[#0a1020] font-semibold rounded-full px-7 py-2.5 text-sm hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_8px_22px_-8px_#8aa6ff66]"
                >
                  Next prompt →
                </button>
              </div>
            </>
          )}

          {/* Submit button */}
          {phase === "writing" && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmitWriting}
                disabled={words === 0 || overLimit}
                className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-2.5 text-sm hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_8px_22px_-8px_#e8a33d99] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                Done writing →
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );

  if (embedded) return content;

  return (
    <GameShell
      title="Compress It"
      stats={[
        { label: "Round", value: roundsDone + 1 },
        { label: "Best", value: best || "—" },
      ]}
    >
      {content}
    </GameShell>
  );
}
