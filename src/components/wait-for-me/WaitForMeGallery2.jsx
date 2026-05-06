import { useEffect, useRef } from "react";

const COLOR = "#9DCFE3";
const COLOR2 = "#E6F1F7";
const BG = "#060609";

function clearTo(ctx, w, h) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
}
function makeRand(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
    return (s % 10007) / 10007;
  };
}
function hash(x, y) {
  let h = ((x | 0) * 374761393 + (y | 0) * 668265263) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return ((h >>> 0) & 0x7fffffff) / 0x7fffffff;
}
function noise2(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return ((a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy) * 2 - 1;
}
function curl2D(x, y, scale) {
  const eps = 0.5;
  const sx = x * scale;
  const sy = y * scale;
  return [
    (noise2(sx, sy + eps) - noise2(sx, sy - eps)) / (2 * eps),
    -(noise2(sx + eps, sy) - noise2(sx - eps, sy)) / (2 * eps),
  ];
}

// 10 emotions — each with its own flow + attractor shape (the "shape" component)
const EMOTIONS = [
  { name: "sad", word: "sad / heavy", cfg: {
    flowMode: "gravity-down",
    noiseScale: 0.0072, curlIntensity: 80, speedMul: 0.6,
    flowStrength: 0.09, jitter: 0.15,
    attractors: [
      { x: 0.30, y: 0.85, str: 0.20, rad: 0.32 },
      { x: 0.50, y: 0.92, str: 0.20, rad: 0.32 },
      { x: 0.70, y: 0.85, str: 0.20, rad: 0.32 },
    ],
  }},
  { name: "joy", word: "joy / blissful", cfg: {
    flowMode: "radial-out", flowOx: 0.5, flowOy: 0.45,
    noiseScale: 0.006, curlIntensity: 110, speedMul: 1.1,
    flowStrength: 0.10, jitter: 0.20,
    attractors: [
      { x: 0.50, y: 0.20, str: 0.18, rad: 0.25 },
      { x: 0.80, y: 0.45, str: 0.18, rad: 0.25 },
      { x: 0.50, y: 0.72, str: 0.18, rad: 0.25 },
      { x: 0.20, y: 0.45, str: 0.18, rad: 0.25 },
    ],
  }},
  { name: "rage", word: "rage / furious", cfg: {
    flowMode: "radial-out", flowOx: 0.40, flowOy: 0.42,
    noiseScale: 0.011, curlIntensity: 280, speedMul: 1.6,
    flowStrength: 0.13, jitter: 0.65,
    attractors: [
      { x: 0.30, y: 0.32, str: 0.30, rad: 0.30 },
      { x: 0.55, y: 0.40, str: 0.30, rad: 0.30 },
      { x: 0.30, y: 0.55, str: 0.30, rad: 0.30 },
    ],
  }},
  { name: "fear", word: "scared / anxious", cfg: {
    flowMode: "radial-out", flowOx: 0.50, flowOy: 0.50,
    noiseScale: 0.008, curlIntensity: 90, speedMul: 0.85,
    flowStrength: 0.10, jitter: 0.85,
    attractors: [
      { x: 0.50, y: 0.50, str: -0.18, rad: 0.40 },
      { x: 0.15, y: 0.18, str: 0.22, rad: 0.22 },
      { x: 0.85, y: 0.20, str: 0.22, rad: 0.22 },
      { x: 0.18, y: 0.85, str: 0.22, rad: 0.22 },
      { x: 0.86, y: 0.82, str: 0.22, rad: 0.22 },
    ],
  }},
  { name: "trust", word: "calm / safe", cfg: {
    flowMode: "rotational", flowOx: 0.5, flowOy: 0.5,
    noiseScale: 0.0045, curlIntensity: 60, speedMul: 0.65,
    flowStrength: 0.40, jitter: 0.05,
    attractors: [{ x: 0.50, y: 0.50, str: 0.15, rad: 0.55 }],
  }},
  { name: "hopeful", word: "hopeful / waiting", cfg: {
    flowMode: "horizontal-right",
    noiseScale: 0.0065, curlIntensity: 100, speedMul: 1.0,
    flowStrength: 0.10, jitter: 0.20,
    attractors: [
      { x: 0.78, y: 0.30, str: 0.22, rad: 0.28 },
      { x: 0.85, y: 0.55, str: 0.22, rad: 0.28 },
      { x: 0.75, y: 0.78, str: 0.22, rad: 0.28 },
    ],
  }},
  { name: "numb", word: "numb / detached", cfg: {
    flowMode: "radial-out", flowOx: 0.32, flowOy: 0.50,
    noiseScale: 0.009, curlIntensity: 140, speedMul: 0.9,
    flowStrength: 0.08, jitter: 0.30,
    attractors: [
      { x: 0.22, y: 0.40, str: 0.22, rad: 0.28 },
      { x: 0.18, y: 0.60, str: 0.22, rad: 0.28 },
      { x: 0.50, y: 0.50, str: -0.15, rad: 0.30 },
    ],
  }},
  { name: "shocked", word: "shocked / amazed", cfg: {
    flowMode: "radial-out", flowOx: 0.70, flowOy: 0.30,
    noiseScale: 0.010, curlIntensity: 150, speedMul: 1.2,
    flowStrength: 0.12, jitter: 0.35,
    attractors: [
      { x: 0.72, y: 0.20, str: 0.28, rad: 0.25 },
      { x: 0.85, y: 0.30, str: 0.22, rad: 0.20 },
      { x: 0.65, y: 0.40, str: 0.22, rad: 0.20 },
    ],
  }},
  { name: "yearning", word: "yearning / longing", cfg: {
    flowMode: "radial-out", flowOx: 0.5, flowOy: 0.62,
    noiseScale: 0.0055, curlIntensity: 95, speedMul: 0.85,
    flowStrength: 0.10, jitter: 0.18,
    attractors: [
      { x: 0.30, y: 0.30, str: 0.20, rad: 0.25 },
      { x: 0.70, y: 0.30, str: 0.20, rad: 0.25 },
      { x: 0.50, y: 0.65, str: 0.18, rad: 0.30 },
    ],
  }},
  { name: "missing", word: "missing someone", cfg: {
    flowMode: "gravity-down",
    noiseScale: 0.0065, curlIntensity: 100, speedMul: 0.7,
    flowStrength: 0.08, jitter: 0.18,
    attractors: [
      { x: 0.35, y: 0.42, str: 0.18, rad: 0.28 },
      { x: 0.65, y: 0.42, str: 0.18, rad: 0.28 },
      { x: 0.50, y: 0.85, str: 0.20, rad: 0.30 },
    ],
  }},
];

// Core simulator — runs the particle system, calls back per segment with all
// information needed to render in any style.
function simulate(seed, w, h, cfg, opts, onSegment) {
  const rand = makeRand(seed);
  const N = (cfg.N || 1100) * (opts.NMul || 1) | 0;
  const lifeMin = (cfg.lifeMin || 200) * (opts.lifeMul || 1);
  const lifeRange = (cfg.lifeRange || 220) * (opts.lifeMul || 1);
  const noiseScaleParam = (cfg.noiseScale || 0.0072) * (opts.noiseScaleMul || 1);
  const curlIntensityParam = (cfg.curlIntensity || 80) * (opts.curlMul || 1);
  const speedMul = cfg.speedMul || 0.9;
  const drag = opts.drag || cfg.drag || 0.97;
  const flowStrength = (cfg.flowStrength || 0.10) * (opts.flowMul || 1);
  const jitter = (cfg.jitter !== undefined ? cfg.jitter : 0.20) * (opts.jitterMul || 1);
  const flowMode = cfg.flowMode || "gravity-down";
  const flowOx = (cfg.flowOx || 0.5) * w;
  const flowOy = (cfg.flowOy || 0.5) * h;
  const attractorMul = opts.attractorMul !== undefined ? opts.attractorMul : 1;
  const attractorPolarity = opts.attractorPolarity !== undefined ? opts.attractorPolarity : 1;

  const seedRot = (rand() - 0.5) * (Math.PI / 4);
  const flowCosR = Math.cos(seedRot);
  const flowSinR = Math.sin(seedRot);
  const seedJX = (rand() - 0.5) * 0.10;
  const seedJY = (rand() - 0.5) * 0.10;
  const seedCurlMul = 0.75 + rand() * 0.60;

  const attractors = (cfg.attractors || []).map((a) => ({
    x: (a.x + seedJX) * w,
    y: (a.y + seedJY) * h,
    str: a.str * attractorMul * attractorPolarity * (0.85 + rand() * 0.40),
    rad: a.rad * Math.min(w, h),
  }));

  const noiseScaleEff = noiseScaleParam * 580 * seedCurlMul;
  const curlIntensityEff = curlIntensityParam * speedMul * 0.014;

  for (let i = 0; i < N; i++) {
    let x, y, vx0 = 0, vy0 = 0;
    if (flowMode === "gravity-down") {
      x = w * (0.18 + rand() * 0.64); y = -rand() * h * 0.05; vy0 = 0.5;
    } else if (flowMode === "horizontal-right") {
      x = -rand() * w * 0.05; y = h * (0.18 + rand() * 0.64); vx0 = 0.5;
    } else if (flowMode === "radial-out") {
      const sa = rand() * Math.PI * 2;
      const sd = Math.min(w, h) * 0.04;
      x = flowOx + Math.cos(sa) * sd; y = flowOy + Math.sin(sa) * sd;
      vx0 = Math.cos(sa) * 0.4; vy0 = Math.sin(sa) * 0.4;
    } else if (flowMode === "rotational") {
      const r0 = Math.min(w, h) * (0.16 + rand() * 0.20);
      const a0 = rand() * Math.PI * 2;
      x = flowOx + Math.cos(a0) * r0; y = flowOy + Math.sin(a0) * r0;
      vx0 = -Math.sin(a0) * 0.4; vy0 = Math.cos(a0) * 0.4;
    } else { x = w * 0.5; y = h * 0.5; }
    let vx = vx0 + (rand() - 0.5) * 0.2;
    let vy = vy0 + (rand() - 0.5) * 0.2;
    const lifetime = lifeMin + rand() * lifeRange;
    let prevX = x, prevY = y;

    for (let s = 0; s < lifetime; s++) {
      const [cvx, cvy] = curl2D(x, y, noiseScaleEff);
      vx = vx * drag + cvx * curlIntensityEff;
      vy = vy * drag + cvy * curlIntensityEff;

      let baseFx = 0, baseFy = 0;
      if (flowMode === "gravity-down") baseFy = flowStrength;
      else if (flowMode === "horizontal-right") baseFx = flowStrength;
      else if (flowMode === "radial-out") {
        const fdx = x - flowOx, fdy = y - flowOy;
        const fd = Math.hypot(fdx, fdy) + 1;
        baseFx = (fdx / fd) * flowStrength; baseFy = (fdy / fd) * flowStrength;
      } else if (flowMode === "rotational") {
        const fdx = x - flowOx, fdy = y - flowOy;
        baseFx = -fdy * flowStrength * 0.012; baseFy = fdx * flowStrength * 0.012;
      }
      vx += baseFx * flowCosR - baseFy * flowSinR;
      vy += baseFx * flowSinR + baseFy * flowCosR;

      for (let k = 0; k < attractors.length; k++) {
        const a = attractors[k];
        const adx = a.x - x, ady = a.y - y;
        const ad2 = adx * adx + ady * ady;
        if (ad2 < a.rad * a.rad) {
          const ad = Math.sqrt(ad2) + 1;
          const t = 1 - ad / a.rad;
          const f = a.str * t * t;
          vx += (adx / ad) * f; vy += (ady / ad) * f;
        }
      }

      vx += (Math.random() - 0.5) * jitter * 0.06;
      vy += (Math.random() - 0.5) * jitter * 0.06;
      if (vx > 6) vx = 6; else if (vx < -6) vx = -6;
      if (vy > 6) vy = 6; else if (vy < -6) vy = -6;

      x += vx; y += vy;
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) break;

      onSegment(prevX, prevY, x, y, s, lifetime, i);
      prevX = x; prevY = y;
    }
  }
  return attractors;
}

// 20 different rendering DIRECTIONS — each combines simulator opts with a
// segment-rendering style. Together they produce visually distinct outputs
// from the same emotion.

function renderDirection(ctx, w, h, seed, emotion, dir) {
  clearTo(ctx, w, h);
  const cfg = emotion.cfg;
  const opts = dir.opts || {};

  ctx.strokeStyle = COLOR;
  ctx.fillStyle = COLOR;
  ctx.lineWidth = 0.7;

  if (dir.style === "tapered") {
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1, s, life) => {
      const t = s / life;
      const fade = 1 - t;
      ctx.lineWidth = 0.3 + fade * fade * 1.8;
      ctx.globalAlpha = (dir.alpha || 0.5) * (0.4 + fade * 0.7);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });

  } else if (dir.style === "calligraphic") {
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1, s, life) => {
      const t = s / life;
      const press = Math.pow(Math.sin(t * Math.PI), 1.2);
      ctx.lineWidth = 0.3 + press * 2.5;
      ctx.globalAlpha = (dir.alpha || 0.5) * (0.35 + press * 0.55);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });

  } else if (dir.style === "two-tone") {
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1, s, life, i) => {
      ctx.strokeStyle = (i % 2 === 0) ? COLOR : COLOR2;
      ctx.globalAlpha = dir.alpha || 0.32;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });
    ctx.strokeStyle = COLOR;

  } else if (dir.style === "halo") {
    // Two passes: wide soft pass then tight bright pass
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1) => {
      ctx.lineWidth = 3.0;
      ctx.globalAlpha = 0.06;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1) => {
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.40;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });

  } else if (dir.style === "sketchy") {
    // 3 passes with small offset jitter
    for (let pass = 0; pass < 3; pass++) {
      const ox = (pass - 1) * 0.8;
      const oy = (pass - 1) * 0.5;
      simulate(seed + pass, w, h, cfg, opts, (x0, y0, x1, y1) => {
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.moveTo(x0 + ox, y0 + oy); ctx.lineTo(x1 + ox, y1 + oy); ctx.stroke();
      });
    }

  } else if (dir.style === "branching") {
    // Each segment occasionally branches into a short side-stroke
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1, s, life, i) => {
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = dir.alpha || 0.32;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      if (s > 30 && (s + i) % 47 === 0) {
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.hypot(dx, dy) || 1;
        const px = -dy / len, py = dx / len;
        const branchLen = 4 + (s % 7);
        ctx.globalAlpha = (dir.alpha || 0.32) * 0.5;
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + px * branchLen, y1 + py * branchLen); ctx.stroke();
      }
    });

  } else if (dir.style === "highlight-cores") {
    // Standard render then bright dots at attractor positions
    const attractors = simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1) => {
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = dir.alpha || 0.30;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });
    for (const a of attractors) {
      if (a.str <= 0) continue;
      const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.rad * 0.6);
      grad.addColorStop(0, "rgba(230,241,247,0.8)");
      grad.addColorStop(0.4, "rgba(157,207,227,0.3)");
      grad.addColorStop(1, "rgba(157,207,227,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.rad * 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = COLOR;

  } else if (dir.style === "stipple") {
    // Lines + sparse dot accents along the trail
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1, s, life, i) => {
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = (dir.alpha || 0.25);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      if ((s + i) % 11 === 0) {
        ctx.globalAlpha = 0.45;
        ctx.fillRect(x1, y1, 1.2, 1.2);
      }
    });

  } else if (dir.style === "double-layer") {
    // Wide soft layer + sharp foreground layer at half density
    simulate(seed, w, h, cfg, { ...opts, NMul: (opts.NMul || 1) * 1.6 }, (x0, y0, x1, y1) => {
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.10;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });
    simulate(seed + 7, w, h, cfg, { ...opts, NMul: (opts.NMul || 1) * 0.45 }, (x0, y0, x1, y1) => {
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });

  } else {
    // Standard line trails
    simulate(seed, w, h, cfg, opts, (x0, y0, x1, y1) => {
      ctx.lineWidth = dir.lineWidth || 0.7;
      ctx.globalAlpha = dir.alpha || 0.32;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    });
  }

  ctx.globalAlpha = 1;
}

const DIRECTIONS = [
  { name: "Baseline", desc: "the algorithm at /wait-for-me with shape attractors" },
  { name: "Gestural", desc: "fewer (180) but very long paths — deliberate brushstrokes",
    opts: { NMul: 0.18, lifeMul: 1.7 }, alpha: 0.55, lineWidth: 0.85 },
  { name: "Atmospheric", desc: "many (3500) faint paths layered — soft cloudy buildup",
    opts: { NMul: 3.2 }, alpha: 0.08, lineWidth: 0.5 },
  { name: "Tapered comet", desc: "thick start, fade to thin tip per particle",
    style: "tapered", alpha: 0.55 },
  { name: "Heavy ink", desc: "fewer paths drawn at heavy line weight",
    opts: { NMul: 0.5 }, alpha: 0.55, lineWidth: 1.5 },
  { name: "Whisper", desc: "dense paths at very low alpha — ethereal",
    opts: { NMul: 2.0 }, alpha: 0.10, lineWidth: 0.4 },
  { name: "Calligraphic", desc: "pen-pressure width modulation — peak at middle of trail",
    style: "calligraphic", alpha: 0.55 },
  { name: "Concentrated cores", desc: "5× attractor strength — paths converge tightly",
    opts: { attractorMul: 5 }, alpha: 0.38 },
  { name: "Spread", desc: "weak attractors — paths flow freely across canvas",
    opts: { attractorMul: 0.2 }, alpha: 0.32 },
  { name: "High curl", desc: "3× curl intensity — paths bend dramatically",
    opts: { curlMul: 3 }, alpha: 0.32 },
  { name: "Drifting", desc: "0.3× curl — gentle straight drift through flow",
    opts: { curlMul: 0.3 }, alpha: 0.32 },
  { name: "Two-tone", desc: "alternating ice-cyan and near-white strokes",
    style: "two-tone", alpha: 0.32 },
  { name: "Halo glow", desc: "wide soft halo + sharp bright core (2-pass)",
    style: "halo", opts: { NMul: 0.6 } },
  { name: "Sketchy ink", desc: "3 slightly-offset passes — sketched ink quality",
    style: "sketchy", opts: { NMul: 0.4 } },
  { name: "Branching", desc: "occasional perpendicular branches off main trails",
    style: "branching", alpha: 0.32 },
  { name: "Highlight cores", desc: "main composition + radiant glow at attractors",
    style: "highlight-cores", opts: { NMul: 0.7 }, alpha: 0.30 },
  { name: "Stipple shadow", desc: "lines with sparse grain dots accenting the path",
    style: "stipple", opts: { NMul: 0.5 }, alpha: 0.32 },
  { name: "Double layer", desc: "wide soft background pass + sharp foreground pass",
    style: "double-layer" },
  { name: "Negative space", desc: "attractors flipped to repulsors — paths flow around shapes",
    opts: { attractorPolarity: -1 }, alpha: 0.30 },
  { name: "Slow + dense", desc: "low drag (0.99) + dense — long persistent flowing paths",
    opts: { drag: 0.99, NMul: 1.5 }, alpha: 0.20 },
];

function GalleryCell({ direction, emotion, seed, idx }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const RENDER = 600;
    canvas.width = RENDER;
    canvas.height = RENDER;
    const ctx = canvas.getContext("2d");
    renderDirection(ctx, RENDER, RENDER, seed + idx * 37, emotion, direction);
  }, [direction, emotion, seed, idx]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "1 / 1",
          display: "block",
          background: "#060609",
        }}
      />
      <div style={{ fontSize: 11, letterSpacing: "0.04em", color: "#E6F1F7" }}>
        {String(idx + 1).padStart(2, "0")} · {direction.name}
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.02em", color: "rgba(230,241,247,0.5)", lineHeight: 1.35 }}>
        {direction.desc} · <em>{emotion.word}</em>
      </div>
    </div>
  );
}

export default function WaitForMeGallery2() {
  const seed = (Date.now() & 0xffffffff) >>> 0;
  const emotionFor = (i) => EMOTIONS[(seed + i * 31) % EMOTIONS.length];
  return (
    <div style={{
      minHeight: "100vh",
      background: "#060609",
      color: "#E6F1F7",
      fontFamily: 'var(--f-body, "Jura"), system-ui, sans-serif',
      padding: "24px 16px 48px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, letterSpacing: "0.18em", textTransform: "lowercase", fontWeight: 400, margin: "0 0 12px" }}>
          20 directions × rotating emotions
        </h1>
        <p style={{ fontSize: 12, letterSpacing: "0.14em", color: "rgba(230,241,247,0.55)", margin: 0 }}>
          refresh = new emotions across all 20 cells
        </p>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "20px 14px",
        maxWidth: 1800,
        margin: "0 auto",
      }}>
        {DIRECTIONS.map((direction, i) => (
          <GalleryCell
            key={direction.name}
            direction={direction}
            emotion={emotionFor(i)}
            seed={seed}
            idx={i}
          />
        ))}
      </div>
    </div>
  );
}
