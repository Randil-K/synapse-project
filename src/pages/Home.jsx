import { useState } from "react";
import { Link } from "react-router-dom";
import { getScores } from "../lib/storage";
import AboutModal from "../components/AboutModal";

export default function Home() {
  const scores = getScores();
  const [aboutOpen, setAboutOpen] = useState(false);

  const cards = [
    // ── Pillar 1 & 2: Built games ──────────────────────────────────────────
    {
      to: "/play/echo",
      accent: "#e8a33d",
      pillar: "Memory",
      name: "Echo",
      desc: "Watch a sequence of lights fire, then repeat it back. Sequence recall — grows every round.",
      best: scores.echo,
      label: "Best round",
    },
    {
      to: "/play/grid",
      accent: "#8aa6ff",
      pillar: "Memory",
      name: "Grid",
      desc: "A handful of tiles flash for a moment. Click the ones you remember. Working memory, expanding.",
      best: scores.grid,
      label: "Best round",
    },
    {
      to: "/play/pattern",
      accent: "#4fd1c5",
      pillar: "Pattern",
      name: "Pattern",
      desc: "Spot the rule behind a shape sequence — rotation, color, count — and pick what's next.",
      best: scores.pattern,
      label: "Best streak",
    },
    // ── Pillar 3 & 4: New Phase 2 games ───────────────────────────────────
    {
      to: "/play/factcheck",
      accent: "#f26d5b",
      pillar: "Critical",
      name: "AI Fact-Check",
      desc: "Find the planted hallucination in an AI-style answer. The most on-theme game in the arcade.",
      best: scores.factcheck,
      label: "Best score",
    },
    {
      to: "/play/compress",
      accent: "#c084fc",
      pillar: "Problem",
      name: "Compress It",
      desc: "Rewrite a 70-word paragraph in ≤ 20 words without losing the key idea. Precision thinking.",
      best: scores.compress,
      label: "Best score",
    },
  ];

  return (
    <>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <div className="max-w-4xl mx-auto px-5">
        {/* Hero */}
        <div className="text-center py-8">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-mint/85 mb-2">
            cognitive resistance training
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold bg-gradient-to-r from-ink to-mint bg-clip-text text-transparent leading-none">
            Synapse
          </h1>
          <p className="text-muted text-[15.5px] mt-3 max-w-md mx-auto">
            Five short games to keep the skills AI is quietly offloading sharp.
          </p>

          {/* ── About trigger — placed directly under tagline ── */}
          <button
            id="about-synapse-btn"
            onClick={() => setAboutOpen(true)}
            className="
              relative inline-flex items-center gap-2 mt-4
              border border-panelEdge rounded-full
              px-4 py-1.5
              text-xs font-mono text-muted
              hover:text-ink hover:border-mint/60
              transition-all duration-200
              group
            "
          >
            {/* Tracing yellow light border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="16"
                fill="none"
                stroke="#e8a33d"
                strokeWidth="1.2"
                pathLength="100"
                className="border-trace-path"
              />
            </svg>

            {/* Info icon */}
            <span className="
              relative z-10
              w-4 h-4 rounded-full border border-muted/50 flex items-center justify-center
              text-[10px] leading-none font-bold
              group-hover:border-mint group-hover:text-mint transition-colors
            ">
              i
            </span>
            <span className="relative z-10">Why does this exist?</span>
            <span className="relative z-10 text-muted/50 group-hover:text-mint/60 transition-colors">→</span>
          </button>
        </div>

        {/* Game cards grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="bg-panel/80 border border-panelEdge rounded-xl2 p-5 transition-all hover:-translate-y-1 block group"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="font-display text-xl" style={{ color: c.accent }}>
                  {c.name}
                </h3>
                <span
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                  style={{ color: c.accent, borderColor: c.accent + "55", background: c.accent + "11" }}
                >
                  {c.pillar}
                </span>
              </div>
              <p className="text-muted text-[13.5px] leading-relaxed mb-4">{c.desc}</p>
              <div className="font-mono text-xs text-muted flex justify-between border-t border-dashed border-panelEdge pt-3">
                <span>{c.label}</span>
                <b className="text-ink font-semibold">{c.best || "—"}</b>
              </div>
            </Link>
          ))}
        </div>

        {/* Daily challenge + Learn CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mt-10 mb-4">
          <Link
            to="/daily"
            className="inline-block bg-panel/80 border border-panelEdge rounded-full px-6 py-3 text-sm text-ink hover:border-amber transition-colors"
          >
            🔥 Today's Daily Challenge →
          </Link>
          <Link
            to="/learn"
            className="inline-block bg-panel/80 border border-panelEdge rounded-full px-6 py-3 text-sm text-ink hover:border-mint transition-colors"
          >
            📖 Micro-lessons →
          </Link>
        </div>

        <footer className="text-center text-muted text-xs opacity-80 mt-4 pb-6">
          Five focused minutes a day beats one long session.
        </footer>
      </div>
    </>
  );
}
