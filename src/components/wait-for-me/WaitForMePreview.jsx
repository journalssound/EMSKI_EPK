import { useEffect, useRef } from "react";

const COLOR = "#9DCFE3";
const BG = "#060609";

function clearTo(ctx, w, h) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
}

// ── Calligraphic wisps at full size ─────────────────────────────────────────
function renderCalligraphicFull(ctx, w, h, seed = 1) {
  clearTo(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  // Seeded random for reproducibility
  let s = seed >>> 0;
  const rand = () => {
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
    return (s % 10007) / 10007;
  };

  const stroke = (sx, sy, len, angle, curlAmp, maxWidth) => {
    ctx.strokeStyle = COLOR;
    const segments = 60;
    const segLen = len / segments;
    let prevX = sx, prevY = sy;
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const r = -len / 2 + len * (i / segments);
      // Add quadratic bend (sin-shaped curve along the path)
      const offset = curlAmp * Math.sin(t * Math.PI);
      // Add a secondary smaller perturbation
      const offset2 = curlAmp * 0.25 * Math.sin(t * Math.PI * 3);
      const x = sx + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * (offset + offset2);
      const y = sy + Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * (offset + offset2);
      // Width: pen pressure → starts thin, peaks middle, ends thin
      const width = 0.3 + maxWidth * Math.pow(Math.sin(t * Math.PI), 1.4);
      ctx.lineWidth = width;
      ctx.globalAlpha = 0.45 + 0.4 * Math.sin(t * Math.PI);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
      prevX = x;
      prevY = y;
    }
  };

  // 30 wisps, varied length / angle / curl
  const N = 30;
  for (let i = 0; i < N; i++) {
    const sx = cx + (rand() - 0.5) * w * 0.55;
    const sy = cy + (rand() - 0.5) * h * 0.55;
    const len = w * (0.18 + rand() * 0.55);
    const angle = rand() * Math.PI * 2;
    const curlAmp = w * (0.04 + rand() * 0.14);
    const maxWidth = 1.5 + rand() * 4.5;
    stroke(sx, sy, len, angle, curlAmp, maxWidth);
  }
  ctx.globalAlpha = 1;
}

// ── Strange attractor (Pickover) at full size ────────────────────────────────
function renderAttractorFull(ctx, w, h, seed = 1) {
  clearTo(ctx, w, h);
  // Vary attractor params slightly per seed for distinct shapes
  let s = seed >>> 0;
  const r1 = (Math.imul(s ^ (s >>> 13), 1274126177) >>> 0) % 10007 / 10007;
  s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
  const r2 = (Math.imul(s ^ (s >>> 13), 1274126177) >>> 0) % 10007 / 10007;
  s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
  const r3 = (Math.imul(s ^ (s >>> 13), 1274126177) >>> 0) % 10007 / 10007;
  s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
  const r4 = (Math.imul(s ^ (s >>> 13), 1274126177) >>> 0) % 10007 / 10007;

  const a = -2.4 + (r1 - 0.5) * 0.6;
  const b = -2.1 + (r2 - 0.5) * 0.6;
  const c = -0.74 + (r3 - 0.5) * 0.6;
  const d = -2.0 + (r4 - 0.5) * 0.6;

  ctx.fillStyle = COLOR;
  let x = 0.1, y = 0.1;
  // Discover bounds from a sample run
  let minX = 999, maxX = -999, minY = 999, maxY = -999;
  let tx = 0.1, ty = 0.1;
  for (let i = 0; i < 5000; i++) {
    const nx = Math.sin(a * ty) + c * Math.cos(a * tx);
    const ny = Math.sin(b * tx) + d * Math.cos(b * ty);
    tx = nx; ty = ny;
    if (i > 200) {
      if (tx < minX) minX = tx;
      if (tx > maxX) maxX = tx;
      if (ty < minY) minY = ty;
      if (ty > maxY) maxY = ty;
    }
  }
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const padding = 0.08;
  const sx = (w * (1 - padding * 2)) / rangeX;
  const sy = (h * (1 - padding * 2)) / rangeY;
  const scale = Math.min(sx, sy);
  const centerX = w / 2 - ((minX + maxX) / 2) * scale;
  const centerY = h / 2 - ((minY + maxY) / 2) * scale;

  // Render with progressively varying alpha so dense regions glow
  ctx.globalAlpha = 0.10;
  const ITER = 120000;
  x = 0.1; y = 0.1;
  for (let i = 0; i < ITER; i++) {
    const nx = Math.sin(a * y) + c * Math.cos(a * x);
    const ny = Math.sin(b * x) + d * Math.cos(b * y);
    x = nx; y = ny;
    if (i > 200) {
      const px = centerX + x * scale;
      const py = centerY + y * scale;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

// ── HYBRID: Calligraphic SHAPES rendered as particle/dot TEXTURE ────────────
// Each wisp's path is sampled densely; particles are scattered with a
// Gaussian-ish spread perpendicular to the path, denser at center, softer at
// edges. Pen-pressure modulation along the length (thin tips, fat middle).
// Result: elegant calligraphic arcs made of thousands of fine grains.
function renderHybridFull(ctx, w, h, seed = 1) {
  clearTo(ctx, w, h);
  ctx.fillStyle = COLOR;

  const cx = w / 2, cy = h / 2;
  let s = seed >>> 0;
  const rand = () => {
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
    return (s % 10007) / 10007;
  };

  ctx.strokeStyle = COLOR;
  const N = 22;
  const SEGMENTS_PER_WISP = 220;

  for (let i = 0; i < N; i++) {
    const sx = cx + (rand() - 0.5) * w * 0.55;
    const sy = cy + (rand() - 0.5) * h * 0.55;
    const len = w * (0.22 + rand() * 0.55);
    const angle = rand() * Math.PI * 2;
    const curlAmp = w * (0.04 + rand() * 0.16);
    const curlAmp2 = w * (0.01 + rand() * 0.05);
    const maxWidth = 4 + rand() * 12;
    const phase2 = rand() * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const cosP = Math.cos(angle + Math.PI / 2);
    const sinP = Math.sin(angle + Math.PI / 2);

    // Faint baseline stroke — the spine of the wisp, always visible underneath
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    for (let j = 0; j <= 40; j++) {
      const t = j / 40;
      const r = -len / 2 + len * t;
      const offset = curlAmp * Math.sin(t * Math.PI) + curlAmp2 * Math.sin(t * Math.PI * 3 + phase2);
      const x = sx + cosA * r + cosP * offset;
      const y = sy + sinA * r + sinP * offset;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Spray of short line segments scattered around the spine — these create
    // the "cloud of lines" texture. Each segment aligned roughly with the
    // path direction so they read as cohesive flow, not random noise.
    for (let p = 0; p < SEGMENTS_PER_WISP; p++) {
      const t = rand();
      const r = -len / 2 + len * t;
      const offset = curlAmp * Math.sin(t * Math.PI) + curlAmp2 * Math.sin(t * Math.PI * 3 + phase2);
      const baseX = sx + cosA * r + cosP * offset;
      const baseY = sy + sinA * r + sinP * offset;
      const pressure = Math.pow(Math.sin(t * Math.PI), 1.3);
      const widthAtT = maxWidth * pressure;
      // Gaussian-ish perpendicular offset (sum-of-randoms)
      const g = (rand() - 0.5) + (rand() - 0.5);
      const perp = g * widthAtT;
      const px = baseX + cosP * perp;
      const py = baseY + sinP * perp;
      // Short segment in path direction with slight angle jitter
      const segLen = 1.5 + rand() * 5;
      const segAngle = angle + (rand() - 0.5) * 0.4;
      const sC = Math.cos(segAngle), sS = Math.sin(segAngle);
      const ax = px - sC * segLen * 0.5;
      const ay = py - sS * segLen * 0.5;
      const bx = px + sC * segLen * 0.5;
      const by = py + sS * segLen * 0.5;
      const edgeFade = 1 - Math.min(1, Math.abs(g));
      const alpha = (0.05 + 0.22 * edgeFade) * Math.pow(Math.sin(t * Math.PI), 0.55);
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

const ENTRIES = [
  { id: "calligraphic", title: "Calligraphic wisps", desc: "30 long arcs with pen-pressure width modulation", render: renderCalligraphicFull },
  { id: "attractor", title: "Strange attractor", desc: "Pickover dot-field, ~120k iterations", render: renderAttractorFull },
  { id: "hybrid", title: "Hybrid — calligraphic shape, particle texture", desc: "Wisp arcs (#1's shape) rendered as scattered grains (#2's texture). 28 strokes × 1200 particles each, pen pressure + edge falloff.", render: renderHybridFull },
];

function PreviewCell({ entry, seed }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = 560;
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    entry.render(ctx, cssSize, cssSize, seed);
  }, [entry, seed]);
  return (
    <div className="preview-cell">
      <canvas ref={canvasRef} />
      <div className="preview-cell-label">
        <span className="preview-cell-name">{entry.title}</span>
        <span className="preview-cell-desc">{entry.desc}</span>
      </div>
    </div>
  );
}

export default function WaitForMePreview() {
  // Three different seeds so each renders distinctly each load
  const seed = (Date.now() & 0xffffffff) >>> 0;
  return (
    <div className="preview-root">
      <div className="preview-header">
        <h1>full-size preview — pick the direction</h1>
      </div>
      <div className="preview-grid">
        {ENTRIES.map((entry, i) => (
          <div key={entry.id} className="preview-wrap">
            <span className="preview-num">{String(i + 1).padStart(2, "0")}</span>
            <PreviewCell entry={entry} seed={seed + i * 17} />
          </div>
        ))}
      </div>
    </div>
  );
}
