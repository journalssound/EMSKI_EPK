import { useEffect, useRef } from "react";

// 10 algorithm directions for the user to pick from.
// Each renders a static composition into its own canvas.
// Shared aesthetic: ice-blue strokes on near-black, square format.

const COLOR = "#9DCFE3";       // ice-blue stroke
const BG = "#060609";

function clearTo(ctx, w, h) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
}

// ─── 1. Curl-noise streamlines (current direction, refined) ──────────────────
function hash(x, y) {
  let h = ((x | 0) * 374761393 + (y | 0) * 668265263) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return ((h >>> 0) & 0x7fffffff) / 0x7fffffff;
}
function valueNoise2(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return ((a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy) * 2 - 1;
}
function curl(x, y, scale) {
  const eps = 0.5;
  return [
    (valueNoise2(x * scale, (y + eps) * scale) - valueNoise2(x * scale, (y - eps) * scale)) / (2 * eps),
    -(valueNoise2((x + eps) * scale, y * scale) - valueNoise2((x - eps) * scale, y * scale)) / (2 * eps),
  ];
}

function renderCurlStreamlines(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.4;
  const N = 200;
  const STEPS = 220;
  const scale = 0.012;
  for (let i = 0; i < N; i++) {
    let x = Math.random() * w;
    let y = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < STEPS; s++) {
      const [vx, vy] = curl(x, y, scale);
      x += vx * 1.8;
      y += vy * 1.8;
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── 2. Pickover strange attractor ────────────────────────────────────────────
function renderPickover(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.fillStyle = COLOR;
  const a = -2.4, b = -2.1, c = -0.74, d = -2.0;
  let x = 0.1, y = 0.1;
  const ITER = 35000;
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < ITER; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx; y = ny;
    if (i > 100) {
      const px = (x + 3) / 6 * w;
      const py = (y + 3) / 6 * h;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

// ─── 3. Lissajous web ─────────────────────────────────────────────────────────
function renderLissajous(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.35;
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.42;
  for (let k = 0; k < 12; k++) {
    const a = 2 + Math.floor(Math.random() * 5);
    const b = 3 + Math.floor(Math.random() * 5);
    const phi = Math.random() * Math.PI;
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.005) {
      const x = cx + R * Math.sin(a * t + phi);
      const y = cy + R * Math.sin(b * t);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── 4. Random bezier curves ──────────────────────────────────────────────────
function renderBezier(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 60; i++) {
    const x0 = Math.random() * w, y0 = Math.random() * h;
    const x1 = Math.random() * w, y1 = Math.random() * h;
    const cx1 = Math.random() * w, cy1 = Math.random() * h;
    const cx2 = Math.random() * w, cy2 = Math.random() * h;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── 5. Calligraphic wisps (long arcs with noise displacement) ────────────────
function renderCalligraphic(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 14; i++) {
    const cx = w / 2 + (Math.random() - 0.5) * w * 0.4;
    const cy = h / 2 + (Math.random() - 0.5) * h * 0.4;
    const len = 80 + Math.random() * 220;
    const angle = Math.random() * Math.PI * 2;
    const curl_amp = 30 + Math.random() * 60;
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.005) {
      const r = -len / 2 + len * t;
      const offset = curl_amp * Math.sin(t * Math.PI * 2);
      const x = cx + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * offset;
      const y = cy + Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * offset;
      const width = 0.5 + 2.5 * Math.sin(t * Math.PI);
      ctx.lineWidth = width;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── 6. Phyllotaxis spiral ────────────────────────────────────────────────────
function renderPhyllotaxis(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.fillStyle = COLOR;
  const cx = w / 2, cy = h / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const N = 1500;
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < N; i++) {
    const r = Math.sqrt(i) * (Math.min(w, h) * 0.018);
    const a = i * goldenAngle;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    const size = 0.8 + (i / N) * 1.2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── 7. Network graph (points + nearest-neighbor connections) ─────────────────
function renderNetwork(ctx, w, h) {
  clearTo(ctx, w, h);
  const points = [];
  const N = 80;
  for (let i = 0; i < N; i++) {
    points.push({ x: Math.random() * w, y: Math.random() * h });
  }
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 0.4;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < N; i++) {
    const dists = [];
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      dists.push({ j, d: Math.hypot(dx, dy) });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < 3; k++) {
      const p2 = points[dists[k].j];
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
  ctx.fillStyle = COLOR;
  ctx.globalAlpha = 0.9;
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── 8. Differential growth ──────────────────────────────────────────────────
function renderDiffGrowth(ctx, w, h) {
  clearTo(ctx, w, h);
  // Initialize circle of points
  let pts = [];
  const cx = w / 2, cy = h / 2;
  const r0 = Math.min(w, h) * 0.1;
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r0, y: cy + Math.sin(a) * r0 });
  }
  // Iterate growth
  const STEP_DIST = 6;
  for (let iter = 0; iter < 220; iter++) {
    // Repel from neighbors
    const newPts = pts.map((p) => ({ x: p.x, y: p.y }));
    for (let i = 0; i < pts.length; i++) {
      let fx = 0, fy = 0;
      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < STEP_DIST * 1.5 && d > 0) {
          fx += (dx / d) * (STEP_DIST * 1.5 - d) * 0.5;
          fy += (dy / d) * (STEP_DIST * 1.5 - d) * 0.5;
        }
      }
      newPts[i].x += fx * 0.1;
      newPts[i].y += fy * 0.1;
    }
    // Insert new points where gaps are too big
    const inserted = [];
    for (let i = 0; i < newPts.length; i++) {
      inserted.push(newPts[i]);
      const next = newPts[(i + 1) % newPts.length];
      const dx = next.x - newPts[i].x;
      const dy = next.y - newPts[i].y;
      if (Math.hypot(dx, dy) > STEP_DIST * 1.2) {
        inserted.push({ x: (newPts[i].x + next.x) / 2, y: (newPts[i].y + next.y) / 2 });
      }
    }
    pts = inserted;
    if (pts.length > 800) break;
  }
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ─── 9. Layered concentric arcs (sumi-e brush feel) ──────────────────────────
function renderConcentric(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.globalAlpha = 0.55;
  const cx = w / 2 + (Math.random() - 0.5) * w * 0.15;
  const cy = h / 2 + (Math.random() - 0.5) * h * 0.15;
  for (let i = 0; i < 30; i++) {
    const r = 10 + i * 6 + Math.random() * 4;
    const startA = Math.random() * Math.PI * 2;
    const sweepA = Math.PI * (0.8 + Math.random() * 1.2);
    ctx.lineWidth = 0.6 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, startA + sweepA);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ─── 10. Drift particles (long curved trails, no jitter — graceful sweep) ────
function renderDrift(ctx, w, h) {
  clearTo(ctx, w, h);
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.45;
  // Each particle starts somewhere and drifts smoothly through curl field
  const N = 80;
  for (let i = 0; i < N; i++) {
    let x = Math.random() * w;
    let y = Math.random() * h;
    let vx = (Math.random() - 0.5) * 1.0;
    let vy = (Math.random() - 0.5) * 1.0;
    const STEPS = 350;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < STEPS; s++) {
      const [cvx, cvy] = curl(x, y, 0.008);
      vx = vx * 0.985 + cvx * 0.45;
      vy = vy * 0.985 + cvy * 0.45;
      x += vx;
      y += vy;
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

const ALGORITHMS = [
  { id: "curl-streamlines", name: "Curl streamlines", desc: "many short paths through a flow field", render: renderCurlStreamlines },
  { id: "pickover", name: "Strange attractor", desc: "chaotic but coherent fractal shape", render: renderPickover },
  { id: "lissajous", name: "Lissajous web", desc: "overlapping parametric curves", render: renderLissajous },
  { id: "bezier", name: "Random Bezier", desc: "intentional confident curves", render: renderBezier },
  { id: "calligraphic", name: "Calligraphic wisps", desc: "long arcs with width modulation", render: renderCalligraphic },
  { id: "phyllotaxis", name: "Phyllotaxis", desc: "golden-ratio spiral of grains", render: renderPhyllotaxis },
  { id: "network", name: "Network graph", desc: "points + nearest-neighbor lines", render: renderNetwork },
  { id: "diff-growth", name: "Differential growth", desc: "organic blob shape that grows", render: renderDiffGrowth },
  { id: "concentric", name: "Concentric arcs", desc: "sumi-e style overlapping arcs", render: renderConcentric },
  { id: "drift", name: "Drift trails", desc: "few long curves through curl noise (no jitter)", render: renderDrift },
];

function GalleryCell({ algo }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssSize = 320;
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    algo.render(ctx, cssSize, cssSize);
  }, [algo]);

  return (
    <div className="gallery-cell">
      <canvas ref={canvasRef} />
      <div className="gallery-cell-label">
        <span className="gallery-cell-name">{algo.name}</span>
        <span className="gallery-cell-desc">{algo.desc}</span>
      </div>
    </div>
  );
}

export default function WaitForMeGallery() {
  return (
    <div className="gallery-root">
      <div className="gallery-header">
        <h1>cover-art directions</h1>
        <p>10 algorithm options. tell me which feel right.</p>
      </div>
      <div className="gallery-grid">
        {ALGORITHMS.map((algo, i) => (
          <div key={algo.id} className="gallery-wrap">
            <span className="gallery-num">{String(i + 1).padStart(2, "0")}</span>
            <GalleryCell algo={algo} />
          </div>
        ))}
      </div>
    </div>
  );
}
