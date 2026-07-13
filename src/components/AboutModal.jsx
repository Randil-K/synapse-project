import { useEffect, useRef } from "react";

// ─── Section data ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "purpose",
    icon: "🎯",
    color: "#e8a33d",
    title: "What is Synapse?",
    body: [
      "Synapse is a short, daily cognitive resistance-training session — five focused games designed to actively exercise the mental skills that AI tools are quietly handling for you.",
      "This is not generic 'brain training.' Every game targets a specific, nameable skill: memory recall, pattern reasoning, critical thinking, or compression under constraints — chosen because these are exactly the skills most at risk of atrophy in an AI-assisted world.",
    ],
  },
  {
    id: "problem",
    icon: "🧠",
    color: "#4fd1c5",
    title: "The AI impact on your thinking",
    body: [
      "As AI absorbs more everyday tasks — writing emails, fact-checking, summarising, planning, decision-making — the human brain gets less practice at those tasks. Neuroscientists call this cognitive offloading: outsourcing mental effort to an external tool.",
      "A 2025 study of 666 participants found a significant negative correlation between frequent AI usage and critical thinking ability. An MIT Media Lab EEG study found people writing with ChatGPT showed the lowest brain engagement across 32 regions — lower than using a search engine or no tool at all.",
      "The effect is strongest in 17–35 year olds — the exact demographic that uses AI tools most heavily.",
    ],
    highlight: "Frequent AI use correlates with measurably lower critical thinking scores.",
  },
  {
    id: "solution",
    icon: "⚡",
    color: "#8aa6ff",
    title: "How Synapse fights back",
    body: [
      "Synapse gives those underused circuits deliberate, short bursts of exercise — not to fight AI, but to stay sharp alongside it.",
      "The four training pillars are: Memory & Recall, Pattern & Analytical Reasoning, Critical Thinking (including catching AI hallucinations), and Problem Solving under real constraints.",
      "Each session takes 5 minutes or less. The streak mechanic builds a daily habit over time — research shows consistent short practice beats occasional long sessions for skill retention.",
    ],
    stats: [
      { label: "Memory", icon: "🟡", desc: "Echo · Grid" },
      { label: "Pattern", icon: "🟢", desc: "Pattern" },
      { label: "Critical", icon: "🔴", desc: "AI Fact-Check" },
      { label: "Problem", icon: "🟣", desc: "Compress It" },
    ],
  },
  {
    id: "difference",
    icon: "🔬",
    color: "#f26d5b",
    title: "What makes it different",
    body: [
      "Most brain-training apps use abstract puzzles. Synapse leans toward near-real tasks: spotting a fabricated claim in an AI-style answer, compressing an argument under a word limit, or catching a logical flaw — tasks that are useful in their own right, even before any transfer effect.",
      "The skill radar chart on your Progress page shows four separate pillar scores instead of one meaningless overall number — because your strengths and weaknesses are different, and you deserve to see which is which.",
    ],
  },
  {
    id: "honesty",
    icon: "📋",
    color: "#c084fc",
    title: "What we don't claim",
    body: [
      "We will never say Synapse boosts your IQ, prevents cognitive decline, or produces any clinical outcome. The 'brain training' category has a credibility problem — Lumosity paid a $2M FTC settlement for overstating these claims.",
      "What we do claim, honestly: regular deliberate practice at reasoning tasks is better than no practice. The research supports that. Whether gains fully transfer to every area of life is uncertain. We say so plainly — and that honesty is itself part of what makes Synapse trustworthy.",
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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
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
              About this system
            </div>
            <h2 className="font-display text-2xl text-ink">Why Synapse exists</h2>
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

                {/* Optional highlighted callout */}
                {s.highlight && (
                  <div
                    className="mt-3 rounded-xl px-4 py-3 border-l-4 text-[13px] leading-relaxed"
                    style={{
                      borderColor: s.color,
                      background: s.color + "12",
                      color: s.color,
                    }}
                  >
                    <strong>Research finding: </strong>{s.highlight}
                  </div>
                )}

                {/* Optional pillar stats grid */}
                {s.stats && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {s.stats.map((st) => (
                      <div
                        key={st.label}
                        className="flex items-center gap-2 bg-[#0f2a2e] border border-panelEdge rounded-xl px-3 py-2"
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

          {/* Source footnote */}
          <div className="text-muted text-[11px] font-mono leading-relaxed pb-2">
            Sources: Gerlich (2025), MIT Media Lab EEG study (2025), FTC v. Lumos Labs (2016).<br />
            Synapse makes no clinical claims. See Micro-lessons for full details.
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-7 py-5 border-t border-panelEdge flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber to-[#e8a33d] text-[#1c1305] font-semibold rounded-full py-3 text-sm hover:-translate-y-0.5 active:scale-95 transition-transform shadow-[0_8px_22px_-8px_#e8a33d88]"
          >
            Got it — let's train →
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
