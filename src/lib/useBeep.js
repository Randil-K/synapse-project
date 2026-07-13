import { useRef, useCallback } from "react";

export function useBeep() {
  const ctxRef = useRef(null);
  return useCallback((freq, dur = 180) => {
    try {
      ctxRef.current = ctxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
      o.start();
      o.stop(ctx.currentTime + dur / 1000 + 0.02);
    } catch {
      /* audio not available — silently continue */
    }
  }, []);
}
