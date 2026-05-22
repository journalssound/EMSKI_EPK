import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { NEUTRAL_VECTOR } from "./plutchikMapping";

// STACKED CONTOURS renderer (approach #2).
//
// A scalar field f(x,y,t) is defined over the canvas via a sum of moving
// Gaussian "bumps". We extract K evenly-spaced iso-lines through that field
// each frame via marching squares and stroke them as polylines. Because iso-
// lines of a smooth scalar field are always nested and parallel, the result
// reads as one topographic / sculpted form — never spaghetti.
//
// Emotion controls: bump positions (from per-emotion regions), bump
// amplitudes, field-evolution speed, contour count, and a global tilt.

const GRID = 72;            // field grid resolution (GRID x GRID samples)
const CONTOUR_COUNT = 22;   // number of iso-lines drawn per frame

const ContoursCanvas = forwardRef(function ContoursCanvas({ getAudioBands }, ref) {
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
    field: new Float32Array(GRID * GRID),
    bumps: [],              // [{ ax, ay, amp, fx, fy, phx, phy, wob }]
    rotation: 0,            // global tilt applied to the field
    dissolveStart: 0,
    dissolveDur: 0,
    fadeAlpha: 0,
  });

  useImperativeHandle(ref, () => ({
    setMode: (mode) => { stateRef.current.mode = mode; },
    setEmotion: (vector, seed = 0) => {
      const s = stateRef.current;
      s.vector = { ...vector };
      s.seed = (seed | 0) || 1;
      s.mode = "personal";
      rebuildBumps(s);
    },
    dissolveToCollective: ({ duration = 1500 } = {}) => {
      const s = stateRef.current;
      s.dissolveStart = performance.now();
      s.dissolveDur = duration;
      s.mode = "dissolving";
    },
  }), []);

  function rebuildBumps(s) {
    const v = s.vector;
    const seed = s.seed || 1;
    const sR = (k) => ((seed * (9301 + k * 37) + 49297 + k * 131) % 233280) / 233280;

    // Pick 5–9 bump centers anchored to per-emotion regions; each bump drifts
    // along its own slow elliptical path so contours breathe coherently.
    const bumps = [];
    function add(ax, ay, weight, signHint = 1) {
      if (weight <= 0.04) return;
      const k = bumps.length;
      const phx = sR(k * 2) * Math.PI * 2;
      const phy = sR(k * 2 + 1) * Math.PI * 2;
      // amplitude polarity: positive bumps make ridges, negative make basins
      const amp = signHint * (0.35 + weight * 1.1) * (0.85 + sR(k * 3 + 7) * 0.4);
      bumps.push({
        ax, ay,
        amp,
        fx: 0.07 + sR(k * 5 + 3) * 0.10,   // drift freq x (Hz)
        fy: 0.06 + sR(k * 5 + 11) * 0.10,  // drift freq y (Hz)
        phx, phy,
        wob: 0.05 + sR(k * 5 + 19) * 0.07, // drift amplitude (normalized)
      });
    }

    // Anchored bump centers per Plutchik dimension (mirrors the spatial
    // semantics already used in plutchikMapping.emotionAttractors).
    add(0.50, 0.85, v.sadness, +1);
    add(0.50, 0.15, v.joy, +1);
    add(0.85, 0.50, v.anticipation, +1);
    add(0.18, 0.20, v.fear, -1);
    add(0.50, 0.50, v.trust, +1);
    add(0.32, 0.36, v.anger, +1);
    add(0.20, 0.55, v.disgust, -1);
    add(0.80, 0.25, v.surprise, +1);

    // Always include a soft central bump so neutral inputs still have shape.
    if (bumps.length < 3) add(0.5, 0.5, 0.5, +1);

    s.bumps = bumps;
    s.rotation = (sR(91) - 0.5) * Math.PI / 3; // ±30° global tilt
    s.t = 0;
    s.fadeAlpha = 0;
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
    if (s.bumps.length === 0) rebuildBumps(s);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let last = performance.now();

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.raf = requestAnimationFrame(frame);
      const v = s.vector;
      const evolveSpeed = 0.18 + 0.6 * v.anger + 0.35 * v.anticipation - 0.12 * v.sadness;
      s.t += dt * evolveSpeed;

      const { w, h } = s;

      // Audio modulation
      let bass = 0, mid = 0;
      if (s.mode !== "idle") {
        const bands = getAudioBands && getAudioBands();
        if (bands) { bass = bands.bass || 0; mid = bands.mid || 0; }
      }
      const breathe = 1 + 0.18 * Math.sin(s.t * (0.6 + 0.8 * v.anticipation)) + bass * 0.25;

      // Sample field on GRID x GRID
      const field = s.field;
      const bumps = s.bumps;
      const rot = s.rotation;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const sigma = 0.13 + 0.07 * v.trust - 0.04 * v.anger; // bump radius (normalized)
      const invSig2 = 1 / (2 * sigma * sigma);

      for (let iy = 0; iy < GRID; iy++) {
        const ny = iy / (GRID - 1);
        for (let ix = 0; ix < GRID; ix++) {
          const nx = ix / (GRID - 1);
          // apply global tilt around center
          const dx0 = nx - 0.5, dy0 = ny - 0.5;
          const tx = 0.5 + dx0 * cr - dy0 * sr;
          const ty = 0.5 + dx0 * sr + dy0 * cr;

          let sum = 0;
          for (let b = 0; b < bumps.length; b++) {
            const bp = bumps[b];
            const bx = bp.ax + Math.cos(s.t * bp.fx * 6.28 + bp.phx) * bp.wob;
            const by = bp.ay + Math.sin(s.t * bp.fy * 6.28 + bp.phy) * bp.wob;
            const dx = tx - bx, dy = ty - by;
            sum += bp.amp * Math.exp(-(dx * dx + dy * dy) * invSig2);
          }
          field[iy * GRID + ix] = sum * breathe;
        }
      }

      // Find field min/max for level placement
      let fmin = Infinity, fmax = -Infinity;
      for (let i = 0; i < field.length; i++) {
        const fv = field[i];
        if (fv < fmin) fmin = fv;
        if (fv > fmax) fmax = fv;
      }
      if (fmax - fmin < 1e-4) fmax = fmin + 1e-4;

      // Clear (this approach redraws every frame — coherent form, no buildup)
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

      const lineWidth = Math.max(0.6, 0.85 * s.dpr * (0.85 + 0.4 * v.trust));
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(230, 241, 247, ${0.45 * alpha + mid * 0.1 * alpha})`;

      const cellW = w / (GRID - 1);
      const cellH = h / (GRID - 1);

      // Draw K evenly-spaced contour levels via marching squares.
      // We skip the outermost 8% of levels (near min/max) so we don't draw
      // tiny degenerate loops at field extrema.
      const levelLo = fmin + (fmax - fmin) * 0.08;
      const levelHi = fmin + (fmax - fmin) * 0.92;

      ctx.beginPath();
      for (let lv = 0; lv < CONTOUR_COUNT; lv++) {
        const level = levelLo + (levelHi - levelLo) * (lv / (CONTOUR_COUNT - 1));
        marchingSquares(ctx, field, GRID, GRID, cellW, cellH, level);
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

// Marching squares: emits line segments into the current ctx Path2D
// for the given iso-level. Doesn't stroke (caller batches).
function marchingSquares(ctx, field, nx, ny, cellW, cellH, level) {
  for (let iy = 0; iy < ny - 1; iy++) {
    const y0 = iy * cellH;
    const y1 = y0 + cellH;
    for (let ix = 0; ix < nx - 1; ix++) {
      const i00 = iy * nx + ix;
      const i10 = i00 + 1;
      const i01 = i00 + nx;
      const i11 = i01 + 1;
      const v00 = field[i00];
      const v10 = field[i10];
      const v01 = field[i01];
      const v11 = field[i11];

      let code = 0;
      if (v00 > level) code |= 1;
      if (v10 > level) code |= 2;
      if (v11 > level) code |= 4;
      if (v01 > level) code |= 8;
      if (code === 0 || code === 15) continue;

      const x0 = ix * cellW;
      const x1 = x0 + cellW;

      const interp = (vA, vB, aX, aY, bX, bY) => {
        const t = (level - vA) / (vB - vA);
        return [aX + (bX - aX) * t, aY + (bY - aY) * t];
      };
      // 4 edges: top(0→1), right(1→2), bottom(3→2), left(0→3)
      let p;
      const segs = [];
      switch (code) {
        case 1: case 14:
          segs.push(interp(v00, v10, x0, y0, x1, y0), interp(v00, v01, x0, y0, x0, y1));
          break;
        case 2: case 13:
          segs.push(interp(v00, v10, x0, y0, x1, y0), interp(v10, v11, x1, y0, x1, y1));
          break;
        case 3: case 12:
          segs.push(interp(v00, v01, x0, y0, x0, y1), interp(v10, v11, x1, y0, x1, y1));
          break;
        case 4: case 11:
          segs.push(interp(v10, v11, x1, y0, x1, y1), interp(v01, v11, x0, y1, x1, y1));
          break;
        case 5:
          // saddle — two separate diagonal segments
          segs.push(interp(v00, v10, x0, y0, x1, y0), interp(v10, v11, x1, y0, x1, y1));
          segs.push(interp(v00, v01, x0, y0, x0, y1), interp(v01, v11, x0, y1, x1, y1));
          break;
        case 6: case 9:
          segs.push(interp(v00, v10, x0, y0, x1, y0), interp(v01, v11, x0, y1, x1, y1));
          break;
        case 7: case 8:
          segs.push(interp(v00, v01, x0, y0, x0, y1), interp(v01, v11, x0, y1, x1, y1));
          break;
        case 10:
          segs.push(interp(v00, v10, x0, y0, x1, y0), interp(v00, v01, x0, y0, x0, y1));
          segs.push(interp(v10, v11, x1, y0, x1, y1), interp(v01, v11, x0, y1, x1, y1));
          break;
        default:
          break;
      }
      for (let k = 0; k < segs.length; k += 2) {
        p = segs[k];
        ctx.moveTo(p[0], p[1]);
        p = segs[k + 1];
        ctx.lineTo(p[0], p[1]);
      }
    }
  }
}

export default ContoursCanvas;
