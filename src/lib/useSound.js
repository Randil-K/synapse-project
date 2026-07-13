import { useRef, useCallback } from "react";

export function useSound() {
  const ctxRef = useRef(null);

  // Initialize or retrieve AudioContext
  const getContext = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (common browser policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  // 1. Crisp haptic tap (short, organic click)
  const playTap = useCallback((pitchScale = 1) => {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Slide frequency down quickly to sound like a physical click
      osc.frequency.setValueAtTime(800 * pitchScale, now);
      osc.frequency.exponentialRampToValueAtTime(150 * pitchScale, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Very quick volume envelope (instant attack, rapid decay)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  // 2. Light, organic chime for memorization tile flashes
  const playFlash = useCallback((index = 0) => {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pentatonic scale starting at E5 for pleasing, harmonious intervals
      const pentatonic = [659.25, 739.99, 830.61, 987.77, 1108.73, 1318.51];
      const freq = pentatonic[index % pentatonic.length];

      osc.type = "triangle"; // softer and warmer than sine/saw
      osc.frequency.setValueAtTime(freq, now);
      // Soft pitch envelope up to make it sound like a light droplet
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  // 3. Ascending chord arpeggio for level complete / success
  const playSuccess = useCallback(() => {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;
      
      // Warm E-Major Pentatonic chord: E5, G#5, B5, E6
      const notes = [659.25, 830.61, 987.77, 1318.51];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + i * 0.06; // sequential arpeggio

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.start(noteTime);
        osc.stop(noteTime + 0.38);
      });
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  // 4. Detuned descending sound for level failure
  const playFailure = useCallback(() => {
    try {
      const ctx = getContext();
      const now = ctx.currentTime;

      // Two detuned oscillators for a richer, warmer, analog feel
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "triangle";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.linearRampToValueAtTime(110, now + 0.45);

      osc2.frequency.setValueAtTime(222, now); // slightly detuned
      osc2.frequency.linearRampToValueAtTime(109, now + 0.45);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  return { playTap, playFlash, playSuccess, playFailure };
}
