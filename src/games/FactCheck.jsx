import { useState, useCallback } from "react";
import GameShell from "../components/GameShell";
import { FACTCHECK_POOL } from "../lib/factcheck-data";
import { recordScore, addXP, updatePillarScore } from "../lib/storage";

// Pick a deterministic question index based on today's date + session offset
function pickQuestion(used) {
  const available = FACTCHECK_POOL.filter((_, i) => !used.has(i));
  if (available.length === 0) return null;
  const pool = available.map((_, i) =>
    FACTCHECK_POOL.indexOf(available[i])
  );
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function FactCheck({ embedded = false, onResult }) {
  const [used, setUsed] = useState(new Set());
  const [qIdx, setQIdx] = useState(() => pickQuestion(new Set()));
  const [selected, setSelected] = useState(null); // sentence index player picked
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(
    () => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").factcheck || 0
  );
  const [phase, setPhase] = useState("playing"); // playing | result | over
  const [totalAnswered, setTotalAnswered] = useState(0);

  const question = qIdx !== null ? FACTCHECK_POOL[qIdx] : null;

  const handleSelect = useCallback(
    (sentIdx) => {
      if (revealed || !question) return;
      setSelected(sentIdx);
    },
    [revealed, question]
  );

  const handleSubmit = useCallback(() => {
    if (selected === null || revealed || !question) return;
    setRevealed(true);
    const correct = selected === question.hallucIndex;
    const newTotal = totalAnswered + 1;
    setTotalAnswered(newTotal);

    if (correct) {
      const newStreak = streak + 1;
      const newScore = score + 10 + newStreak * 2;
      setStreak(newStreak);
      setScore(newScore);
      addXP(10 + newStreak * 2);
      updatePillarScore("critical", Math.min(100, 50 + newStreak * 10));
    } else {
      setStreak(0);
    }
    setPhase("result");
  }, [selected, revealed, question, score, streak, totalAnswered]);

  const handleNext = useCallback(() => {
    if (!question) return;
    const newUsed = new Set(used);
    newUsed.add(qIdx);
    const next = pickQuestion(newUsed);

    if (next === null) {
      // Pool exhausted — finish
      const finalScore = score;
      const s = recordScore("factcheck", finalScore);
      setBest(s.factcheck);
      setPhase("over");
      onResult?.({ score: finalScore, correct: totalAnswered });
      return;
    }
    setUsed(newUsed);
    setQIdx(next);
    setSelected(null);
    setRevealed(false);
    setPhase("playing");
  }, [qIdx, used, score, totalAnswered, onResult]);

  const handleRestart = () => {
    setUsed(new Set());
    setQIdx(pickQuestion(new Set()));
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setStreak(0);
    setTotalAnswered(0);
    setPhase("playing");
  };

  const content = (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {phase === "over" ? (
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="text-5xl">🎯</div>
          <h2 className="font-display text-3xl text-ink">Session complete</h2>
          <p className="text-muted text-center">
            You scored <span className="text-amber font-semibold">{score} points</span> across{" "}
            {totalAnswered} questions.
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
      ) : question ? (
        <>
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                Topic
              </div>
              <h2 className="font-display text-xl text-ink">{question.topic}</h2>
            </div>
            <div className="font-mono text-xs text-muted text-right">
              <div className="text-amber text-base font-semibold">{score} pts</div>
              {streak > 1 && (
                <div className="text-coral">🔥 {streak} streak</div>
              )}
            </div>
          </div>

          {/* Instruction */}
          <p className="text-muted text-sm">
            One of the sentences below contains a{" "}
            <span className="text-coral font-medium">planted hallucination</span> — a plausible
            but false claim. Click the sentence you think is wrong, then submit.
          </p>

          {/* Sentence list */}
          <div className="flex flex-col gap-2">
            {question.sentences.map((sent, i) => {
              let cls =
                "rounded-xl px-4 py-3 border text-[14.5px] leading-relaxed cursor-pointer transition-all duration-150 text-left ";
              if (revealed) {
                if (i === question.hallucIndex) {
                  cls += "border-coral bg-coral/10 text-ink";
                } else if (i === selected && i !== question.hallucIndex) {
                  cls += "border-red-700 bg-red-900/20 text-muted line-through";
                } else {
                  cls += "border-panelEdge bg-panel/40 text-muted";
                }
              } else {
                if (i === selected) {
                  cls += "border-amber bg-amber/10 text-ink scale-[1.01]";
                } else {
                  cls += "border-panelEdge bg-panel/40 text-ink hover:border-violet/60 hover:bg-panel/70";
                }
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span className="font-mono text-xs text-muted mr-2">{i + 1}.</span>
                  {sent}
                  {revealed && i === question.hallucIndex && (
                    <span className="ml-2 text-coral text-xs font-mono">← hallucination</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after reveal */}
          {revealed && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                selected === question.hallucIndex
                  ? "border-mint/50 bg-mint/5 text-mint"
                  : "border-coral/50 bg-coral/5 text-coral"
              }`}
            >
              <div className="font-semibold mb-1">
                {selected === question.hallucIndex ? "✓ Correct!" : "✗ Not quite."}
              </div>
              <p className="text-ink/80 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {!revealed ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-2.5 text-sm hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_8px_22px_-8px_#e8a33d99] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-violet text-[#0a1020] font-semibold rounded-full px-7 py-2.5 text-sm hover:-translate-y-0.5 active:scale-95 transition-all shadow-[0_8px_22px_-8px_#8aa6ff66]"
              >
                Next question →
              </button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );

  if (embedded) return content;

  return (
    <GameShell
      title="AI Fact-Check"
      stats={[
        { label: "Score", value: score },
        { label: "Best", value: best || "—" },
      ]}
    >
      {content}
    </GameShell>
  );
}
