import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { NEUTRAL_VECTOR } from "./plutchikMapping";

// PHASE-SHIFTED FAMILY renderer (approach #3).
//
// One parametric curve (a rose / superformula-lite) drawn M times, each copy
// at a slightly offset phase. Because every copy is sampled from the SAME
// underlying curve, the M lines always read as one object — closest in spirit
// to Emma's reference image where dense parallel lines wrap a single form.
//
// Emotion controls the curve's shape parameters (petal count, radial
// modulation depth, rotation rate, scale, phase spread) — never the count of
// lines, so visual density stays constant and intentional.

const M = 80;        // number of phase-shifted copies
const SAMPLES = 380; // samples per curve

const PhaseCanvas = forwardRef(function PhaseCanvas({ getAudioBands }, ref) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mode: "idle",
    vector: { ...NEUTRAL_VECTOR },
    seed: 0,
    dpr: 1,
    w: 0,
    h: 0,
    t: 0,
    raf: 0,
    dissolveStart: 0,
    dissolveDur: 0,
    fadeAlpha: 0,
    params: null,         // derived from emotion+seed
  });

  useImperativeHandle(ref, () => ({
    setMode: (mode) => { stateRef.current.mode = mode; },
    setEmotion: (vector, seed = 0) => {
      const s = stateRef.current;
      s.vector = { ...vector };
      s.seed = (seed | 0) || 1;
      s.params = deriveParams(s.vector, s.seed);
      s.mode = "personal";
      s.fadeAlpha = 0;
    },
    dissolveToCollective: ({ duration = 1500 } = {}) => {
      const s = stateRef.current;
      s.dissolveStart = performance.now();
      s.dissolveDur = duration;
      s.mode = "dissolving";
    },
  }), []);

  function deriveParams(v, seed) {
    const sR = (k) => ((seed * (9301 + k * 37) + 49297 + k * 131) % 233280) / 233280;
    // Petal/lobe count — anger pushes high, trust pulls low/even.
    const petals = Math.max(2, Math.round(2 + 6 * v.anger + 4 * v.surprise + 2 * v.disgust - 1.5 * v.trust + sR(1) * 2));
    // Inner radial modulation: how spiky vs how smooth.
    const modDepth = Math.min(0.72, 0.18 + 0.50 * v.anger + 0.30 * v.disgust + 0.12 * v.surprise - 0.10 * v.trust - 0.05 * v.sadness);
    // Second harmonic for richer shape — joy/anticipation add it.
    const harm2 = Math.min(0.45, 0.10 + 0.35 * v.joy + 0.25 * v.anticipation);
    const harm2Count = Math.max(2, Math.round(3 + 3 * v.joy + 2 * v.anticipation - v.sadness));
    // Rotation speed — anger fast, sadness near-still.
    const omega = 0.06 + 0.55 * v.anger + 0.30 * v.anticipation + 0.20 * v.surprise - 0.15 * v.sadness - 0.05 * v.fear;
    // Vertical drift bias (sadness sinks, joy lifts).
    const driftY = (v.sadness - v.joy) * 0.12;
    // Asymmetric squish — disgust/anger pull the form off-axis.
    const squash = 1 + 0.35 * v.disgust - 0.15 * v.trust + (sR(3) - 0.5) * 0.2;
    // Phase spread between the M copies (wider = more ribbon-like, narrower = more line-like).
    const phaseSpread = (0.18 + 0.55 * v.trust + 0.35 * v.joy - 0.10 * v.fear) * Math.PI * 2;
    // Per-copy radial offset (gives the "stack of contours" feel).
    const radialSpread = 0.05 + 0.18 * v.trust + 0.10 * v.joy - 0.05 * v.fear;
    // Base radius scale.
    const radiusBase = 0.30 + 0.06 * v.joy + 0.04 * v.trust - 0.03 * v.fear;
    // Static rotation offset per seed.
    const rotOffset = sR(7) * Math.PI * 2;
    // Line styling.
    const lineAlpha = 0.30 + 0.25 * v.joy + 0.15 * v.trust - 0.10 * v.sadness;
    const lineWidth = 0.85 + 0.5 * v.trust + 0.25 * v.joy;
    return {
      petals, modDepth, harm2, harm2Count, omega, driftY,
      squash, phaseSpread, radialSpread, radiusBase,
      rotOffset, lineAlpha, lineWidth,
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = stateRef.current;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      s.dpr = dpr;
      s.w = w;
      s.h = h;
    }

    resize();
    if (!s.params) s.params = deriveParams(s.vector, s.seed || 1);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let last = performance.now();

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.raf = requestAnimationFrame(frame);
      s.t += dt;

      const { w, h, params: p } = s;
      if (!p) return;

      // Audio
      let bass = 0, mid = 0;
      if (s.mode !== "idle") {
        const bands = getAudioBands && getAudioBands();
        if (bands) { bass = bands.bass || 0; mid = bands.mid || 0; }
      }

      // Clear background fully each frame — one clean morphing form.
      ctx.fillStyle = "#060609";
      ctx.fillRect(0, 0, w, h);

      // Dissolve fade
      let alpha = 1;
      if (s.mode === "dissolving") {
        const elapsed = (now - s.dissolveStart) / s.dissolveDur;
        alpha = Math.max(0, 1 - elapsed * 0.7);
        if (elapsed >= 1) s.mode = "collective";
      } else if (s.mode === "collective") {
        alpha = 0.45;
      }

      const cx = w * 0.5;
      const cy = h * (0.5 + p.driftY * 0.5);
      const baseR = Math.min(w, h) * p.radiusBase * (1 + bass * 0.18);

      // Rotation evolves with time
      const theta0 = p.rotOffset + s.t * p.omega;

      ctx.lineWidth = Math.max(0.6, p.lineWidth * s.dpr * 0.8);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(230, 241, 247, ${Math.max(0.05, Math.min(0.7, p.lineAlpha)) * alpha})`;

      // Audio-driven modulation of shape thickness
      const dynMod = p.modDepth * (1 + mid * 0.45);
      const dynHarm2 = p.harm2 * (1 + bass * 0.25);

      // Draw M phase-shifted copies in a single batched path
      ctx.beginPath();
      for (let m = 0; m < M; m++) {
        const t01 = m / (M - 1);                 // 0..1
        const tCentered = t01 - 0.5;             // -0.5..0.5
        const phi = tCentered * p.phaseSpread;
        // each copy slightly offset radially — produces the "stacked layers" feel
        const rMul = 1 + tCentered * 2 * p.radialSpread;
        let started = false;
        for (let i = 0; i <= SAMPLES; i++) {
          const u = (i / SAMPLES) * Math.PI * 2;
          // Base radius with two harmonics
          const r = baseR * rMul * (
            1
            + dynMod * Math.cos(p.petals * u + phi)
            + dynHarm2 * Math.cos(p.harm2Count * u - phi * 0.5 + theta0 * 0.7)
          );
          // Apply non-uniform squash (asymmetry per emotion)
          const px = r * Math.cos(u + theta0);
          const py = r * Math.sin(u + theta0) * p.squash;
          // Rotate the whole form slowly as a coherent body
          const rotG = theta0 * 0.35;
          const cg = Math.cos(rotG), sg = Math.sin(rotG);
          const x = cx + px * cg - py * sg;
          const y = cy + px * sg + py * cg;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", onResize);
    };
  }, [getAudioBands]);

  return <canvas ref={canvasRef} />;
});

export default PhaseCanvas;
