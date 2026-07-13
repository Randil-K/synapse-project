import { useMemo } from "react";

export default function NeuralBg() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        dur: 4 + Math.random() * 4,
      })),
    []
  );
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
      {dots.map((d, i) => (
        <div
          key={i}
          className="n-dot absolute w-[3px] h-[3px] rounded-full bg-mint"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
