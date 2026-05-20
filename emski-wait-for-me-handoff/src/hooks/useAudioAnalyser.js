import { useRef, useCallback, useEffect } from "react";

// Wraps Web Audio API for FFT analysis of an HTMLAudioElement.
// CRITICAL: createMediaElementSource can only be called ONCE per element.
// We cache the source on a module-level WeakMap so re-mounts don't re-bind.
const sourceCache = new WeakMap();

export function useAudioAnalyser(audioElRef) {
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(null);

  const start = useCallback(() => {
    const el = audioElRef.current;
    if (!el || ctxRef.current) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    let source = sourceCache.get(el);
    if (!source) {
      source = ctx.createMediaElementSource(el);
      sourceCache.set(el, source);
    }

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.78;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    if (ctx.state === "suspended") ctx.resume();

    ctxRef.current = ctx;
    analyserRef.current = analyser;
    bufferRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, [audioElRef]);

  const getBands = useCallback(() => {
    const analyser = analyserRef.current;
    const buf = bufferRef.current;
    if (!analyser || !buf) return null;

    analyser.getByteFrequencyData(buf);

    // 512 bins, ~43 Hz each (44.1 kHz / 1024). Group into 5 perceptual bands.
    const avg = (lo, hi) => {
      let sum = 0;
      for (let i = lo; i <= hi; i++) sum += buf[i];
      return sum / (hi - lo + 1) / 255;
    };

    return {
      bass: avg(1, 6),       // ~43-260 Hz
      lowMid: avg(7, 30),    // ~260-1300 Hz
      mid: avg(31, 80),      // ~1300-3500 Hz
      highMid: avg(81, 160), // ~3500-7000 Hz
      treble: avg(161, 400), // ~7000-17000 Hz
    };
  }, []);

  useEffect(() => {
    return () => {
      // Intentionally don't close the AudioContext — the source-element binding
      // persists for the element's lifetime. Letting ctx live until page unload is fine.
    };
  }, []);

  return { start, getBands };
}
