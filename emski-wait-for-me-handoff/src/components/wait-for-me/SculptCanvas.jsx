import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { NEUTRAL_VECTOR } from "./plutchikMapping";

// SCULPTED RIBBON renderer.
//
// Mathematically, a torus knot is a closed 3D curve:
//   x(u) = (R + r·cos(q·u)) · cos(p·u)
//   y(u) = (R + r·cos(q·u)) · sin(p·u)
//   z(u) =       r·sin(q·u)
// with (p, q) coprime integers determining the knot's topology.
//
// We turn that curve into a RIBBON by sampling K parallel copies, each
// offset along a vector perpendicular to the curve's tangent. Projected
// orthographically to 2D, this produces the parallel-line surface aesthetic
// of Emma's reference image — every line is mathematically related to every
// other, so the form is inherently coherent.
//
// Animation: a single DRAW-IN reveal over ~3.2s (eased), then the form is
// STATIC. Optional very subtle yaw oscillation after reveal keeps it alive
// without ever being "in motion." No audio reactivity in the form itself —
// the music is the sound, the form is the cover.

const SculptCanvas = forwardRef(function SculptCanvas({ getAudioBands }, ref) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mode: "idle",
    vector: { ...NEUTRAL_VECTOR },
    seed: 0,
    dpr: 1,
    w: 0,
    h: 0,
    raf: 0,

    // Per-emotion parameters (set by setEmotion)
    params: null,
    // Pre-computed 3D ribbon: K polylines, each an array of {x,y,z}
    ribbon3D: null,

    // Reveal animation
    revealStart: 0,
    revealMs: 3200,

    // Dissolve fade
    dissolveStart: 0,
    dissolveDur: 0,
    fadeAlpha: 0,
  });

  useImperativeHandle(ref, () => ({
    setMode: (mode) => {
      const s = stateRef.current;
      s.mode = mode;
      // First-time entry to audio-react with no emotion yet → reveal a
      // neutral form so the canvas isn't blank while the listener decides.
      if ((mode === "audio-react" || mode === "playing") && !s.params) {
        s.vector = { ...NEUTRAL_VECTOR };
        s.seed = 1;
        s.params = deriveParams(s.vector, s.seed);
        s.ribbon3D = buildRibbon(s.params);
        s.revealStart = performance.now();
      }
    },
    setEmotion: (vector, seed = 0) => {
      const s = stateRef.current;
      s.vector = { ...vector };
      s.seed = (seed | 0) || 1;
      s.params = deriveParams(s.vector, s.seed);
      s.ribbon3D = buildRibbon(s.params);
      s.revealStart = performance.now();
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
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    function frame(now) {
      s.raf = requestAnimationFrame(frame);

      const { w, h } = s;
      // Clear (this is a redraw-every-frame approach; the form is composed
      // as a whole, not accumulated, so clearing is correct.)
      ctx.fillStyle = "#060609";
      ctx.fillRect(0, 0, w, h);

      if (!s.ribbon3D || !s.params) return;

      // Reveal progress: 0 → 1 over revealMs, eased
      const elapsedReveal = now - s.revealStart;
      const tRaw = Math.max(0, Math.min(1, elapsedReveal / s.revealMs));
      const tEased = easeOutCubic(tRaw);

      // Post-reveal: very subtle yaw breath, ±1.2°
      const postT = (now - s.revealStart - s.revealMs) / 1000;
      const breath = postT > 0 ? Math.sin(postT * 0.45) * (1.2 * Math.PI / 180) : 0;

      // Dissolve fade
      let alpha = 1;
      if (s.mode === "dissolving") {
        const e = (now - s.dissolveStart) / s.dissolveDur;
        alpha = Math.max(0, 1 - e);
        if (e >= 1) s.mode = "collective";
      } else if (s.mode === "collective") {
        alpha = 0.5;
      }

      drawSculpt(ctx, s, tEased, breath, alpha);
    }

    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", onResize);
    };
  }, [getAudioBands]);

  return <canvas ref={canvasRef} />;
});

// ─────────────────────────────────────────────────────────────────────────────
// Math helpers
// ─────────────────────────────────────────────────────────────────────────────

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

// Dominant emotion → torus-knot (p, q) family. Each pair gives a visually
// distinct topology. (p, q) must be coprime to produce a single connected
// closed knot rather than a degenerate multi-loop.
const KNOT_BY_EMOTION = {
  joy:          { p: 2, q: 3 },  // classic trefoil — 3-lobed, balanced
  trust:        { p: 3, q: 5 },  // symmetric, calm
  anticipation: { p: 2, q: 5 },  // reaching, elongated
  sadness:      { p: 2, q: 3 },  // trefoil with heavy pitch (set elsewhere)
  fear:         { p: 3, q: 7 },  // tight, retracted
  anger:        { p: 2, q: 7 },  // spiky, many lobes
  surprise:     { p: 4, q: 3 },  // punchy
  disgust:      { p: 5, q: 4 },  // asymmetric, awkward
};

function dominantEmotion(v) {
  let dom = "trust", w = 0;
  for (const k of Object.keys(KNOT_BY_EMOTION)) {
    if (v[k] > w) { w = v[k]; dom = k; }
  }
  return { name: dom, weight: w };
}

function deriveParams(v, seed) {
  const dom = dominantEmotion(v);
  const knot = KNOT_BY_EMOTION[dom.name] || { p: 2, q: 3 };

  const sR = (k) => ((seed * (9301 + k * 37) + 49297 + k * 131) % 233280) / 233280;

  // R = major radius (torus center → tube center), r = tube radius
  const R = 1.0;
  const r = clamp(0.32 + 0.20 * v.anger + 0.15 * v.anticipation - 0.08 * v.trust + (sR(1) - 0.5) * 0.06, 0.20, 0.62);

  // Ribbon: how many parallel curves, how wide is the perpendicular spread
  const K = Math.round(clamp(95 + 35 * v.trust + 20 * v.joy - 10 * v.fear + sR(2) * 18, 70, 160));
  const ribbonWidth = clamp(0.12 + 0.10 * v.joy + 0.06 * v.trust + 0.04 * v.anticipation - 0.04 * v.fear + (sR(3) - 0.5) * 0.04, 0.08, 0.28);

  // View angles (degrees), per-seed so different submissions look different
  const yawDeg   = (sR(4) - 0.5) * 80;                    // ±40°
  const pitchDeg = 18 + sR(5) * 28 + v.sadness * 18 - v.joy * 10; // 18..56° (sadness tips forward)
  const rollDeg  = (sR(6) - 0.5) * 30 + v.disgust * 22;   // ±15° + disgust skew

  // Line styling
  const lineAlpha = clamp(0.38 + 0.18 * v.joy + 0.10 * v.trust - 0.08 * v.sadness, 0.22, 0.65);
  const lineWidth = clamp(0.8 + 0.4 * v.trust + 0.2 * v.joy, 0.7, 1.5);

  // Curve resolution: more spiky knots (high q) need more samples
  const samples = clamp(220 + 40 * Math.max(knot.p, knot.q) / 7, 220, 460) | 0;

  return {
    p: knot.p,
    q: knot.q,
    R,
    r,
    K,
    ribbonWidth,
    yaw: yawDeg * Math.PI / 180,
    pitch: pitchDeg * Math.PI / 180,
    roll: rollDeg * Math.PI / 180,
    lineAlpha,
    lineWidth,
    samples,
    dominant: dom.name,
  };
}

// Build the K-line ribbon as an array of K polylines in 3D model space.
// Each polyline is a flat Float32Array [x0,y0,z0, x1,y1,z1, ...].
// We compute the ribbon perpendicular at each sample using the curve's
// 3D tangent crossed with a world-up reference vector, so the ribbon
// behaves like a real Frenet-frame surface.
function buildRibbon(p) {
  const { p: pp, q: qq, R, r, K, ribbonWidth, samples } = p;
  const lines = new Array(K);

  const TWO_PI = Math.PI * 2;
  // Precompute curve positions + tangents
  const pos = new Float32Array(samples * 3);
  const perp = new Float32Array(samples * 3);
  for (let i = 0; i < samples; i++) {
    const u = (i / (samples - 1)) * TWO_PI;
    const cosQu = Math.cos(qq * u);
    const sinQu = Math.sin(qq * u);
    const cosPu = Math.cos(pp * u);
    const sinPu = Math.sin(pp * u);
    const rad = R + r * cosQu;

    const x = rad * cosPu;
    const y = rad * sinPu;
    const z = r * sinQu;

    // Tangent dC/du
    const dRad = -r * qq * sinQu;
    const tx = dRad * cosPu - rad * pp * sinPu;
    const ty = dRad * sinPu + rad * pp * cosPu;
    const tz = r * qq * cosQu;

    // Perpendicular: tangent × world-up (0,0,1) → ribbon lies in plane
    // containing the tangent and is offset toward a stable "side."
    // P = T × (0,0,1) = (Ty·1 - Tz·0, Tz·0 - Tx·1, Tx·0 - Ty·0) = (Ty, -Tx, 0)
    let px = ty;
    let py = -tx;
    let pz = 0;
    let len = Math.hypot(px, py, pz);
    // Degenerate case (tangent parallel to up): fall back to world-x as up
    if (len < 1e-6) {
      px = 0; py = tz; pz = -ty;
      len = Math.hypot(px, py, pz) || 1;
    }
    const inv = 1 / len;
    px *= inv; py *= inv; pz *= inv;

    pos[i * 3]     = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    perp[i * 3]     = px;
    perp[i * 3 + 1] = py;
    perp[i * 3 + 2] = pz;
  }

  // Generate K parallel polylines
  for (let k = 0; k < K; k++) {
    const t01 = (k / (K - 1)) - 0.5; // -0.5..0.5
    const offset = t01 * ribbonWidth;
    const buf = new Float32Array(samples * 3);
    for (let i = 0; i < samples; i++) {
      buf[i * 3]     = pos[i * 3]     + perp[i * 3]     * offset;
      buf[i * 3 + 1] = pos[i * 3 + 1] + perp[i * 3 + 1] * offset;
      buf[i * 3 + 2] = pos[i * 3 + 2] + perp[i * 3 + 2] * offset;
    }
    lines[k] = buf;
  }
  return { lines, samples };
}

// Apply 3D rotation (yaw → pitch → roll) and orthographic project to 2D.
// Returns screen coords. Canvas size + scale fit are baked in.
function projectAndDraw(ctx, ribbon, params, viewYawOffset, w, h, dpr, revealT) {
  const { yaw, pitch, roll, lineWidth, lineAlpha } = params;
  const yawT = yaw + viewYawOffset;

  const cy = Math.cos(yawT),   sy = Math.sin(yawT);
  const cp = Math.cos(pitch),  sp = Math.sin(pitch);
  const cr = Math.cos(roll),   sr = Math.sin(roll);

  // Combined rotation matrix R = Rz(roll) · Rx(pitch) · Ry(yaw)
  // Pre-compute the 9 entries.
  const m00 = cr * cy + sr * sp * sy;
  const m01 = -sr * cp;
  const m02 = cr * sy - sr * sp * cy;
  const m10 = sr * cy - cr * sp * sy;
  const m11 = cr * cp;
  const m12 = sr * sy + cr * sp * cy;
  // m20 = -cp * sy;
  // m21 = -sp;
  // m22 = cp * cy;

  // Fit the curve into the canvas with margin. Torus knot extent is
  // ~ R + r ≈ 1.6 worst case, so we scale by min(w,h) * 0.35.
  const scale = Math.min(w, h) * 0.36;
  const ox = w * 0.5;
  const oy = h * 0.5;

  ctx.lineWidth = Math.max(0.5, lineWidth * dpr * 0.85);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgba(230, 241, 247, ${lineAlpha})`;

  const lines = ribbon.lines;
  const samples = ribbon.samples;

  // Determine how many samples of each line to draw based on revealT.
  // The reveal sweeps the parameter u from 0 → 1 across the whole knot for
  // EVERY line in lockstep — so we see the form being traced out coherently.
  const lastIdx = Math.max(2, Math.floor(samples * revealT));

  ctx.beginPath();
  for (let k = 0; k < lines.length; k++) {
    const buf = lines[k];
    let started = false;
    for (let i = 0; i < lastIdx; i++) {
      const x3 = buf[i * 3];
      const y3 = buf[i * 3 + 1];
      const z3 = buf[i * 3 + 2];
      // Rotate (only x,y matter for orthographic projection)
      const xr = m00 * x3 + m01 * y3 + m02 * z3;
      const yr = m10 * x3 + m11 * y3 + m12 * z3;
      const px = ox + xr * scale;
      const py = oy + yr * scale;
      if (!started) { ctx.moveTo(px, py); started = true; }
      else          { ctx.lineTo(px, py); }
    }
  }
  ctx.stroke();
}

function drawSculpt(ctx, s, tEased, breath, alpha) {
  // Apply overall alpha by temporarily reducing the lineAlpha in params.
  const original = s.params.lineAlpha;
  s.params.lineAlpha = original * alpha;
  projectAndDraw(ctx, s.ribbon3D, s.params, breath, s.w, s.h, s.dpr, tEased);
  s.params.lineAlpha = original;
}

export default SculptCanvas;
