import { useEffect, useRef } from "react";

const AXES = ["Memory", "Pattern", "Critical", "Problem"];
const AXIS_KEYS = ["memory", "pattern", "critical", "problem"];
const AXIS_COLORS = ["#e8a33d", "#4fd1c5", "#f26d5b", "#8aa6ff"]; // amber, mint, coral, violet

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 85;

function polarToCart(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function buildPolygon(scores) {
  return AXIS_KEYS.map((key, i) => {
    const angle = (360 / AXIS_KEYS.length) * i;
    const r = (scores[key] / 100) * RADIUS;
    return polarToCart(angle, r);
  });
}

export default function RadarChart({ scores }) {
  const polyRef = useRef(null);

  // Animate the fill polygon on mount / score change
  useEffect(() => {
    if (!polyRef.current) return;
    const el = polyRef.current;
    const length = el.getTotalLength?.() ?? 0;
    if (!length) return;
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
    // Trigger reflow
    void el.getBoundingClientRect();
    el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
    el.style.strokeDashoffset = "0";
  }, [scores]);

  const rings = [0.25, 0.5, 0.75, 1.0];
  const pts = buildPolygon(scores);
  const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");

  const allZero = AXIS_KEYS.every((k) => !scores[k]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="overflow-visible"
        aria-label="Skill radar chart"
      >
        {/* Grid rings */}
        {rings.map((r) => {
          const ringPts = AXIS_KEYS.map((_, i) => {
            const angle = (360 / AXIS_KEYS.length) * i;
            return polarToCart(angle, r * RADIUS);
          });
          const rStr = ringPts.map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <polygon
              key={r}
              points={rStr}
              fill="none"
              stroke="#2a5158"
              strokeWidth="1"
              opacity={0.6}
            />
          );
        })}

        {/* Axis lines */}
        {AXIS_KEYS.map((_, i) => {
          const angle = (360 / AXIS_KEYS.length) * i;
          const tip = polarToCart(angle, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={tip.x}
              y2={tip.y}
              stroke="#2a5158"
              strokeWidth="1"
              opacity={0.7}
            />
          );
        })}

        {/* Axis dots at tips */}
        {AXIS_KEYS.map((_, i) => {
          const angle = (360 / AXIS_KEYS.length) * i;
          const tip = polarToCart(angle, RADIUS);
          return (
            <circle
              key={`dot-${i}`}
              cx={tip.x}
              cy={tip.y}
              r={3}
              fill={AXIS_COLORS[i]}
              opacity={0.8}
            />
          );
        })}

        {/* Score fill polygon */}
        {!allZero && (
          <polygon
            ref={polyRef}
            points={pointsStr}
            fill="url(#radarGrad)"
            fillOpacity={0.25}
            stroke="url(#radarStroke)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Score dots */}
        {!allZero &&
          pts.map((p, i) => (
            <circle
              key={`score-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={AXIS_COLORS[i]}
              stroke="#0a1d1f"
              strokeWidth="1.5"
            />
          ))}

        {/* Axis labels */}
        {AXIS_KEYS.map((key, i) => {
          const angle = (360 / AXIS_KEYS.length) * i;
          const labelR = RADIUS + 22;
          const pos = polarToCart(angle, labelR);
          return (
            <text
              key={`label-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={AXIS_COLORS[i]}
              fontSize="10"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              {AXES[i]}
            </text>
          );
        })}

        {/* Gradient defs */}
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a33d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4fd1c5" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a33d" />
            <stop offset="100%" stopColor="#8aa6ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {AXIS_KEYS.map((key, i) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: AXIS_COLORS[i] }}
            />
            <span className="font-mono text-[11px] text-muted">{AXES[i]}</span>
            <span
              className="font-mono text-[11px] font-semibold ml-auto"
              style={{ color: AXIS_COLORS[i] }}
            >
              {scores[key] || 0}
            </span>
          </div>
        ))}
      </div>

      {allZero && (
        <p className="text-muted text-xs font-mono text-center mt-1">
          Complete the assessment to seed your radar chart.
        </p>
      )}
    </div>
  );
}
