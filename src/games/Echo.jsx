import { useState, useRef, useCallback, useEffect } from "react";
import GameShell from "../components/GameShell";
import { useBeep } from "../lib/useBeep";
import { recordScore, addXP } from "../lib/storage";

const FREQS = [329.6, 392.0, 466.2, 554.4];
const COLORS = ["amber", "coral", "violet", "mint"];

// ── Motivational message bank ─────────────────────────────────────────────
const ROUND_MSGS = {
  correct: [
    "Perfect! 🎯",
    "Keep it up! 🔥",
    "You're doing great!",
    "Sharp memory! ✨",
    "Nailed it!",
    "Flawless! ⚡",
    "That's the one! 💫",
    "Smooth! 🌊",
  ],
  milestone: {
    3:  "Warming up… 🌡️",
    5:  "Solid focus! 🧠",
    7:  "You're in the zone! ⚡",
    10: "Double digits! 🏅",
    12: "Elite territory! 🏆",
    15: "Legendary memory! 🌟",
    20: "UNSTOPPABLE! 🚀",
  },
  faster: [
    "Faster than usual! ⚡",
    "Speed run mode! 🏎️",
    "Lightning quick! ⚡",
  ],
  newBest: [
    "NEW RECORD! 🏆",
    "Personal best! 🥇",
    "You just broke your record! 🏆",
  ],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Vibration helper (gracefully silently skipped on unsupported devices) ─
function vibrate(pattern) {
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
}

// ── Floating particle for confetti burst ─────────────────────────────────
function Particle({ x, y, color, size, angle, speed, onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dur = 700 + Math.random() * 400;
    el.animate(
      [
        { transform: `translate(0px, 0px) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * speed}px, ${
            Math.sin(angle) * speed - 60
          }px) rotate(${360 * (Math.random() > 0.5 ? 1 : -1)}deg)`,
          opacity: 0,
        },
      ],
      { duration: dur, easing: "cubic-bezier(0,0.9,0.57,1)", fill: "forwards" }
    ).onfinish = onDone;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        background: color,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

const CONFETTI_COLORS = ["#e8a33d", "#4fd1c5", "#8aa6ff", "#f26d5b", "#c084fc", "#fff"];

function ConfettiBurst({ originX, originY, onDone }) {
  const count = 28;
  const [alive, setAlive] = useState(count);

  const handleDone = useCallback(() => {
    setAlive((a) => {
      if (a - 1 <= 0) onDone?.();
      return a - 1;
    });
  }, [onDone]);

  return Array.from({ length: count }).map((_, i) => (
    <Particle
      key={i}
      x={originX}
      y={originY}
      color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
      size={6 + Math.random() * 6}
      angle={(i / count) * Math.PI * 2}
      speed={80 + Math.random() * 80}
      onDone={handleDone}
    />
  ));
}

// ── Main Echo component ───────────────────────────────────────────────────
export default function Echo() {
  const [seq, setSeq] = useState([]);
  const [lit, setLit] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [level, setLevel] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(
    () => JSON.parse(localStorage.getItem("brainarcade:scores") || "{}").echo || 0
  );
  const [msg, setMsg] = useState("Watch the sequence, then repeat it.");
  const [subMsg, setSubMsg] = useState(""); // secondary floating message
  const [levelPulse, setLevelPulse] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState(null);
  const [speedBadge, setSpeedBadge] = useState(false);

  const userIdxRef = useRef(0);
  const roundStartRef = useRef(null); // timestamp when input phase begins
  const avgSpeedRef = useRef(null);   // running average ms-per-round
  const beep = useBeep();

  // ── Show a floating sub-message then fade ──────────────────────────────
  const flash = useCallback((text) => {
    setSubMsg(text);
    setTimeout(() => setSubMsg(""), 2200);
  }, []);

  // ── Pulse the level counter ────────────────────────────────────────────
  const pulseLvl = useCallback(() => {
    setLevelPulse(true);
    setTimeout(() => setLevelPulse(false), 600);
  }, []);

  // ── Play the sequence back to the user ────────────────────────────────
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
          roundStartRef.current = Date.now();
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
    setStreak(0);
    setSubMsg("");
    setSpeedBadge(false);
    avgSpeedRef.current = null;
    userIdxRef.current = 0;
    playSeq(first);
  };

  const nextRound = useCallback(
    (curSeq) => {
      const next = [...curSeq, Math.floor(Math.random() * 4)];
      setSeq(next);
      const newLevel = next.length;
      setLevel(newLevel);
      pulseLvl();
      userIdxRef.current = 0;
      playSeq(next);
    },
    [playSeq, pulseLvl]
  );

  const handleInput = (padIdx) => {
    if (phase !== "input") return;
    beep(FREQS[padIdx], 110);
    setLit(padIdx);
    setTimeout(() => setLit(null), 180);

    // ── Correct tap ──────────────────────────────────────────────────
    if (padIdx === seq[userIdxRef.current]) {
      vibrate(18); // short crisp haptic on correct tap
      userIdxRef.current += 1;

      // Sequence fully entered
      if (userIdxRef.current === seq.length) {
        const elapsed = Date.now() - roundStartRef.current;
        const newStreak = streak + 1;
        setStreak(newStreak);

        // ── Speed tracking ──────────────────────────────────────────
        let fasterThanUsual = false;
        if (avgSpeedRef.current !== null && elapsed < avgSpeedRef.current * 0.85) {
          fasterThanUsual = true;
          setSpeedBadge(true);
          setTimeout(() => setSpeedBadge(false), 2000);
        }
        avgSpeedRef.current =
          avgSpeedRef.current === null
            ? elapsed
            : (avgSpeedRef.current * 0.7 + elapsed * 0.3);

        // ── Milestone or motivational message ───────────────────────
        const milestoneMsg = ROUND_MSGS.milestone[level];
        if (milestoneMsg) {
          setMsg(milestoneMsg);
          flash(milestoneMsg);
        } else if (fasterThanUsual) {
          const m = pick(ROUND_MSGS.faster);
          setMsg(m);
          flash(m);
        } else {
          setMsg(pick(ROUND_MSGS.correct));
        }

        vibrate([40, 30, 80]); // success triple-buzz

        setPhase("watch");
        setTimeout(() => nextRound(seq), 650);
      }

    // ── Wrong tap ────────────────────────────────────────────────────
    } else {
      setWrong(padIdx);
      vibrate([120, 60, 120, 60, 200]); // long error pattern
      setPhase("over");

      const finalLevel = level - 1;
      const scores = recordScore("echo", finalLevel);
      addXP(finalLevel * 4);
      const isNewBest = finalLevel > best;
      setBest(scores.echo);

      if (isNewBest) {
        const nm = pick(ROUND_MSGS.newBest);
        setMsg(nm);
        flash(nm);
        // Trigger confetti burst from center of viewport
        setConfettiOrigin({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        vibrate([60, 40, 60, 40, 60, 40, 200]); // celebration pattern
      } else {
        setMsg(
          `Round over — you reached round ${level}.${
            streak >= 3 ? ` ${streak}-round streak! 🔥` : ""
          }`
        );
      }

      setTimeout(() => setWrong(null), 400);
    }
  };

  const PAD_STYLE = [
    { gridColumn: "2", gridRow: "1" },
    { gridColumn: "3", gridRow: "2" },
    { gridColumn: "2", gridRow: "3" },
    { gridColumn: "1", gridRow: "2" },
  ];

  // Compute streak flame indicators
  const flames = Math.min(streak, 5);

  return (
    <>
      {/* Confetti burst on new personal best */}
      {confettiOrigin && (
        <ConfettiBurst
          originX={confettiOrigin.x}
          originY={confettiOrigin.y}
          onDone={() => setConfettiOrigin(null)}
        />
      )}

      <GameShell
        title="Echo"
        stats={[
          {
            label: "Round",
            value: (
              <span
                key={level}
                style={{
                  display: "inline-block",
                  transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: levelPulse ? "scale(1.45)" : "scale(1)",
                  color: levelPulse ? "#e8a33d" : "inherit",
                }}
              >
                {level || 1}
              </span>
            ),
          },
          { label: "Best", value: best || "—" },
        ]}
      >
        {/* ── Streak flames ──────────────────────────────────────────────── */}
        {streak >= 2 && (
          <div
            className="flex gap-0.5 text-sm"
            style={{ animation: "fadeIn 0.3s ease" }}
          >
            {Array.from({ length: flames }).map((_, fi) => (
              <span
                key={fi}
                style={{
                  opacity: 0.5 + fi * 0.12,
                  fontSize: 12 + fi * 2,
                  animation: `pulseDot ${1 + fi * 0.15}s ease-in-out infinite`,
                }}
              >
                🔥
              </span>
            ))}
            <span className="font-mono text-[11px] text-amber ml-1 self-end pb-0.5">
              {streak}× streak
            </span>
          </div>
        )}

        {/* ── Speed badge ────────────────────────────────────────────────── */}
        {speedBadge && (
          <div
            className="font-mono text-[11px] text-mint bg-mint/10 border border-mint/30 rounded-full px-3 py-1"
            style={{ animation: "fadeIn 0.2s ease" }}
          >
            ⚡ Faster than usual!
          </div>
        )}

        {/* ── Diamond pads ───────────────────────────────────────────────── */}
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
                  ? `brightness-[1.5] scale-[1.07] shadow-glow`
                  : phase === "input"
                  ? "brightness-[0.65] hover:brightness-[0.85] hover:scale-[1.04]"
                  : "brightness-[0.55]",
                wrong === i ? "!brightness-40 !saturate-50 !scale-95" : "",
                // Extra glow on long streaks
                streak >= 5 && lit === i ? "shadow-[0_0_28px_8px_currentColor]" : "",
              ].join(" ")}
              aria-label={`Echo pad ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Primary message ────────────────────────────────────────────── */}
        <div
          className={`text-[15px] text-center min-h-[22px] font-medium transition-all duration-300 ${
            phase === "over"
              ? "text-coral"
              : phase === "input"
              ? "text-mint"
              : "text-muted"
          }`}
          key={msg} // re-triggers fade when msg changes
          style={{ animation: "fadeIn 0.35s ease" }}
        >
          {msg}
        </div>

        {/* ── Floating sub-message (motivational flash) ───────────────────── */}
        {subMsg && (
          <div
            className="absolute pointer-events-none text-center font-display text-lg text-amber font-semibold"
            style={{
              animation: "floatUp 2.2s ease forwards",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {subMsg}
          </div>
        )}

        {/* ── Start / Play again ─────────────────────────────────────────── */}
        {phase !== "watch" && phase !== "input" && (
          <button
            onClick={start}
            className="bg-amber text-[#1c1305] font-semibold rounded-full px-7 py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d99]"
          >
            {phase === "over" ? "Play again" : "Start"}
          </button>
        )}

        {/* ── Inline keyframes ───────────────────────────────────────────── */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatUp {
            0%   { opacity: 0; transform: translateX(-50%) translateY(0px); }
            15%  { opacity: 1; transform: translateX(-50%) translateY(-6px); }
            75%  { opacity: 1; transform: translateX(-50%) translateY(-18px); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-32px); }
          }
        `}</style>
      </GameShell>
    </>
  );
}
