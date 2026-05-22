import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { NEUTRAL_VECTOR } from "./plutchikMapping";

// SWEPT RIBBON renderer (approach #1).
//
// A "comb" of N parallel pens sweeps across the canvas. Each frame we draw a
// short line segment per pen from its previous position to its current one,
// never clearing the canvas — so a coherent ribbon-like surface accumulates,
// exactly the parallel-line aesthetic of Emma's reference.
//
// Emotion modulates HOW the comb moves (speed, turn rate, twist, width,
// vertical bias) — never the particle count, never the visual density of any
// one moment. The piece always reads as a single coherent gesture.

const RibbonCanvas = forwardRef(function RibbonCanvas({ getAudioBands }, ref) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mode: "idle",
    vector: { ...NEUTRAL_VECTOR },
    seed: 0,
    dpr: 1,
    w: 0,
    h: 0,
    N: 70,                  // pen count
    cx: 0,
    cy: 0,
    theta: 0,               // sweep direction (radians)
    twist: 0,               // accumulated twist of the perpendicular axis
    prev: null,             // Float32Array, last frame's pen positions [x0,y0,x1,y1,...]
    t: 0,
    raf: 0,
    dissolveStart: 0,
    dissolveDur: 0,
    fadeAlpha: 0,           // 0 = fully opaque accumulated piece; 1 = wiped
  });

  useImperativeHandle(ref, () => ({
    setMode: (mode) => {
      stateRef.current.mode = mode;
    },
    setEmotion: (vector, seed = 0) => {
      const s = stateRef.current;
      s.vector = { ...vector };
      s.seed = (seed | 0) || 1;
      s.mode = "personal";
      // start fresh: clear canvas and re-seed comb position from emotion
      hardReset(s);
    },
    dissolveToCollective: ({ duration = 1500 } = {}) => {
      const s = stateRef.current;
      s.dissolveStart = performance.now();
      s.dissolveDur = duration;
      s.mode = "dissolving";
    },
  }), []);

  function hardReset(s) {
    s.t = 0;
    s.twist = 0;
    s.fadeAlpha = 0;
    // Seed-derived entry point so different submissions begin from different
    // edges and head different directions — keeps re-renders visually distinct.
    const seed = s.seed || 1;
    const sA = ((seed * 9301 + 49297) % 233280) / 233280;
    const sB = ((seed * 1597 + 7919) % 233280) / 233280;
    s.cx = s.w * (0.15 + sA * 0.7);
    s.cy = s.h * (0.15 + sB * 0.7);
    s.theta = sB * Math.PI * 2;
    // queue an immediate background wipe in the next frame
    s.needsWipe = true;
    s.prev = null;
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
    // initial wipe
    ctx.fillStyle = "#060609";
    ctx.fillRect(0, 0, s.w, s.h);
    s.cx = s.w * 0.5;
    s.cy = s.h * 0.5;
    s.theta = 0;
    s.prev = null;

    const onResize = () => {
      resize();
      // restart the piece on resize — comb dimensions are pixel-relative
      hardReset(s);
    };
    window.addEventListener("resize", onResize);

    let last = performance.now();

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.raf = requestAnimationFrame(frame);
      s.t += dt;

      const { w, h, N, vector, mode } = s;

      if (s.needsWipe) {
        ctx.fillStyle = "#060609";
        ctx.fillRect(0, 0, w, h);
        s.needsWipe = false;
      }

      // Emotion → motion params
      const v = vector;
      const SCALE = s.dpr;
      const speed       = (30 + 70 * v.anger + 45 * v.anticipation - 18 * v.sadness - 10 * v.fear) * SCALE;
      const turnRate    = 0.08 + 1.2 * v.anger + 0.9 * v.surprise + 0.35 * v.fear - 0.15 * v.trust;
      const twistRate   = 0.06 + 0.55 * v.trust + 0.4 * v.joy + 0.3 * v.anticipation - 0.2 * v.sadness;
      const combWidth   = h * 0.16 * (0.45 + 1.3 * v.joy + 0.8 * v.trust + 0.3 * v.anticipation - 0.25 * v.fear);
      const gravity     = (v.sadness * 55 - v.joy * 25) * SCALE;
      const lineAlpha   = 0.32 + 0.35 * v.joy + 0.2 * v.anger - 0.18 * v.sadness;
      const lineWidthPx = Math.max(0.6, (0.7 + 0.6 * v.trust + 0.4 * v.joy) * SCALE * 0.9);

      // Audio bass adds a push along the sweep direction
      let bass = 0, mid = 0;
      if (mode !== "idle") {
        const bands = getAudioBands && getAudioBands();
        if (bands) { bass = bands.bass || 0; mid = bands.mid || 0; }
      }

      // Wander the sweep direction with a slow per-seed sinusoid + emotion turn rate
      const seed = s.seed || 1;
      const sA = ((seed * 9301 + 49297) % 233280) / 233280;
      const sB = ((seed * 1597 + 7919) % 233280) / 233280;
      s.theta += dt * turnRate * Math.sin(s.t * (0.35 + sA * 0.55) + sB * 6.28);
      s.twist += dt * twistRate * (1 + mid * 0.6);

      // Advance comb center
      const v_speed = speed * (1 + bass * 0.7);
      s.cx += Math.cos(s.theta) * v_speed * dt;
      s.cy += Math.sin(s.theta) * v_speed * dt + gravity * dt;

      // Soft bounce off canvas bounds
      const pad = combWidth + 20;
      if (s.cx < pad)       { s.cx = pad;       s.theta = Math.PI - s.theta; s.twist += 0.4; }
      if (s.cx > w - pad)   { s.cx = w - pad;   s.theta = Math.PI - s.theta; s.twist += 0.4; }
      if (s.cy < pad)       { s.cy = pad;       s.theta = -s.theta;          s.twist += 0.4; }
      if (s.cy > h - pad)   { s.cy = h - pad;   s.theta = -s.theta;          s.twist += 0.4; }

      // Compute current pen positions along the (twisted) perpendicular axis
      const perpAngle = s.theta + Math.PI / 2 + s.twist;
      const px = Math.cos(perpAngle);
      const py = Math.sin(perpAngle);

      const cur = new Float32Array(N * 2);
      for (let i = 0; i < N; i++) {
        const t01 = (i / (N - 1)) - 0.5; // -0.5..0.5
        cur[i * 2]     = s.cx + px * t01 * combWidth * 2;
        cur[i * 2 + 1] = s.cy + py * t01 * combWidth * 2;
      }

      // Dissolve fade — slowly wash the piece toward background over duration
      if (mode === "dissolving") {
        const elapsed = (now - s.dissolveStart) / s.dissolveDur;
        s.fadeAlpha = Math.min(1, Math.max(0, elapsed));
        ctx.fillStyle = `rgba(6, 6, 9, ${0.06 + 0.18 * s.fadeAlpha})`;
        ctx.fillRect(0, 0, w, h);
        if (elapsed >= 1) {
          s.mode = "collective";
        }
      }

      // Draw line segment per pen
      if (s.prev) {
        ctx.lineWidth = lineWidthPx;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(230, 241, 247, ${Math.max(0.05, Math.min(0.8, lineAlpha))})`;
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          ctx.moveTo(s.prev[i * 2], s.prev[i * 2 + 1]);
          ctx.lineTo(cur[i * 2], cur[i * 2 + 1]);
        }
        ctx.stroke();
      }
      s.prev = cur;
    }

    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", onResize);
    };
  }, [getAudioBands]);

  return <canvas ref={canvasRef} />;
});

export default RibbonCanvas;
