import { Link } from "react-router-dom";

export default function GameShell({ title, stats, children }) {
  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <Link
          to="/"
          className="border border-panelEdge text-muted hover:text-ink hover:border-mint text-sm rounded-full px-4 py-2 transition-colors"
        >
          ← Back
        </Link>
        <div className="flex gap-5 font-mono text-sm text-muted">
          {stats.map((s, i) => (
            <span key={i}>
              {s.label} <b className="text-ink text-[15px]">{s.value}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="bg-panel/80 border border-panelEdge rounded-xl2 px-6 py-8 flex flex-col items-center gap-5">
        {children}
      </div>
    </div>
  );
}
