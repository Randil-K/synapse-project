import { useEffect, useRef } from "react";

// ─── Section data ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "purpose",
    icon: "🎯",
    color: "#e8a33d",
    title: "What is Synapse?",
    body: [
      "Synapse is a small personal arcade built for your working memory, attention, and logical reasoning. It consists of three focused games that challenge different areas of active thinking.",
      "The app runs entirely offline with local storage, meaning no accounts, no subscriptions, and zero ads. It is designed to be a clean, five-minute daily habit to stretch your mind.",
    ],
  },
  {
    id: "science",
    icon: "🧠",
    color: "#4fd1c5",
    title: "How does it help your brain?",
    body: [
      "Just like physical exercise, consistent daily cognitive workouts help keep your mind active. Working memory (storing and manipulating information short-term) and pattern reasoning are fundamental building blocks of focus and problem solving.",
      "Scientific research suggests that short, daily sessions of focused mental tasks are far more effective for cognitive habit formation than occasional long marathon sessions. Synapse is designed to fit right into your daily routine.",
    ],
  },
  {
    id: "games",
    icon: "⚡",
    color: "#8aa6ff",
    title: "Three training modes",
    body: [
      "Each game targets a unique cognitive mechanism to exercise your recall and analytical skills:",
    ],
    stats: [
      { label: "Echo", icon: "🟡", desc: "Sequence recall & auditory memory loop" },
      { label: "Grid", icon: "🔵", desc: "Spatial recall & working memory expansion" },
      { label: "Pattern", icon: "🟢", desc: "Rule inference & logical sequence reasoning" },
    ],
  },
  {
    id: "approach",
    icon: "🔬",
    color: "#f26d5b",
    title: "An honest approach",
    body: [
      "Many brain training apps make bold, unproven claims about boosting your IQ or delaying cognitive diseases. Synapse takes a different path.",
      "We do not make medical or clinical claims. Think of these games like stretching exercises: they challenge your focus and memory in a fun, game-like setting. We believe that deliberate, focused practice is a healthy daily habit — nothing more, nothing less.",
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function AboutModal({ open, onClose }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#0a1d1f]/80 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      {/* Panel — slides in from right */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="About Synapse"
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] bg-[#0d2b2f] border-l border-panelEdge flex flex-col shadow-2xl"
        style={{ animation: "slideInRight 0.28s cubic-bezier(0.4,0,0.2,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-panelEdge flex-shrink-0">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-mint/80 mb-1">
              About this arcade
            </div>
            <h2 className="font-display text-2xl text-ink">How Synapse works</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-panelEdge text-muted hover:text-ink hover:border-coral transition-colors flex items-center justify-center text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-panelEdge bg-panel/50 overflow-hidden"
            >
              {/* Section header */}
              <div
                className="flex items-center gap-3 px-5 py-4 border-b border-panelEdge"
                style={{ background: s.color + "10" }}
              >
                <span className="text-xl">{s.icon}</span>
                <h3
                  className="font-display text-[17px] font-semibold"
                  style={{ color: s.color }}
                >
                  {s.title}
                </h3>
              </div>

              {/* Section body */}
              <div className="px-5 py-4 space-y-3">
                {s.body.map((para, i) => (
                  <p key={i} className="text-ink/80 text-[13.5px] leading-[1.7]">
                    {para}
                  </p>
                ))}

                {/* Optional pillar stats grid */}
                {s.stats && (
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    {s.stats.map((st) => (
                      <div
                        key={st.label}
                        className="flex items-center gap-3 bg-[#0f2a2e] border border-panelEdge rounded-xl px-4 py-2"
                      >
                        <span className="text-base">{st.icon}</span>
                        <div>
                          <div className="text-ink text-xs font-semibold">{st.label}</div>
                          <div className="text-muted text-[11px] font-mono">{st.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Footnote */}
          <div className="text-muted text-[11px] font-mono leading-relaxed pb-2 text-center">
            Synapse runs entirely locally on your device.
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-7 py-5 border-t border-panelEdge flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber to-[#e8a33d] text-[#1c1305] font-semibold rounded-full py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d88]"
          >
            Got it — let's play →
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
