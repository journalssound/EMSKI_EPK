import { useEffect, useRef } from "react";
import createREGL from "regl";

// EmotionField — drop-in for the EMSKI press site.
// This is a literal copy of /wait-for-me's FieldCanvas in its IDLE state
// (the visual on the home page before the user types or submits anything),
// modified only so that particles respawn when they die — so the canvas
// keeps moving forever instead of going static after a few seconds.

const POINT_VERT = `
precision highp float;
attribute vec2 a_pos;
uniform vec2 u_viewport;
uniform float u_pointSize;
void main() {
  vec2 ndc = (a_pos / u_viewport) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = u_pointSize;
}
`;
const POINT_FRAG = `
precision highp float;
uniform vec3 u_color;
uniform float u_alpha;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r = length(c);
  if (r > 0.5) discard;
  float falloff = smoothstep(0.5, 0.05, r);
  gl_FragColor = vec4(u_color, u_alpha * falloff * falloff);
}
`;
const LINE_VERT = `
precision highp float;
attribute vec2 a_pos;
uniform vec2 u_viewport;
void main() {
  vec2 ndc = (a_pos / u_viewport) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;
const LINE_FRAG = `
precision highp float;
uniform vec3 u_color;
uniform float u_alpha;
void main() { gl_FragColor = vec4(u_color, u_alpha); }
`;
const FADE_VERT = `
precision highp float;
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const FADE_FRAG = `
precision highp float;
uniform vec3 u_color;
uniform float u_alpha;
void main() { gl_FragColor = vec4(u_color, u_alpha); }
`;

function hash2(x, y) {
  let h = ((x | 0) * 374761393 + (y | 0) * 668265263) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return ((h >>> 0) & 0x7fffffff) / 0x7fffffff;
}
const lerp = (a, b, t) => a * (1 - t) + b * t;
function valueNoise(x, y, t) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const tOff = Math.floor(t);
  const tFrac = t - tOff;
  const a = lerp(hash2(ix, iy + tOff * 17), hash2(ix, iy + (tOff + 1) * 17), tFrac);
  const b = lerp(hash2(ix + 1, iy + tOff * 17), hash2(ix + 1, iy + (tOff + 1) * 17), tFrac);
  const c = lerp(hash2(ix, iy + 1 + tOff * 17), hash2(ix, iy + 1 + (tOff + 1) * 17), tFrac);
  const d = lerp(hash2(ix + 1, iy + 1 + tOff * 17), hash2(ix + 1, iy + 1 + (tOff + 1) * 17), tFrac);
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy) * 2.0 - 1.0;
}
function curl2D(x, y, t, scale) {
  const eps = 0.5;
  const sx = x * scale;
  const sy = y * scale;
  const dx = (valueNoise(sx, sy + eps, t) - valueNoise(sx, sy - eps, t)) / (2 * eps);
  const dy = (valueNoise(sx + eps, sy, t) - valueNoise(sx - eps, sy, t)) / (2 * eps);
  return [dy, -dx];
}

// Neutral vector params (vectorToFieldParams with all-0.1 emotion values).
// These match exactly what FieldCanvas computes in its initial idle state.
const NEUTRAL_PARAMS = {
  noiseScale: 0.00155,
  noiseSpeed: 0.12,
  curlIntensity: 91,
  jitter: 0.355,
  speedMul: 1.02,
  brightnessMul: 0.39, // clamped to 0.55 in tick
  flow: null,
  attractors: [],
};

// Tint matches FieldCanvas's default for neutral
const NEUTRAL_TINT = [0.42, 0.55, 0.62];
const BG_RGB = [6 / 255, 6 / 255, 9 / 255]; // #060609

export default function EmotionField({ className, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function readSize() {
      const rect = canvas.getBoundingClientRect();
      return {
        cssW: Math.max(2, Math.round(rect.width)),
        cssH: Math.max(2, Math.round(rect.height)),
      };
    }
    let { cssW, cssH } = readSize();
    let width = cssW;
    let height = cssH;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    let regl;
    try {
      regl = createREGL({
        canvas,
        attributes: {
          antialias: true,
          alpha: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
        },
      });
    } catch (e) {
      console.warn("regl init failed", e);
      return;
    }

    const isMobile = width <= 480 || (navigator.hardwareConcurrency || 8) <= 4;
    const N = isMobile ? 750 : 1400;

    const posX = new Float32Array(N);
    const posY = new Float32Array(N);
    const prevX = new Float32Array(N);
    const prevY = new Float32Array(N);
    const velX = new Float32Array(N);
    const velY = new Float32Array(N);
    const ages = new Float32Array(N);
    const lifeMax = new Float32Array(N);
    const alive = new Uint8Array(N);
    const spawnDelay = new Float32Array(N);

    const drawBuf = new Float32Array(N * 2);
    const drawLineBuf = new Float32Array(N * 4);

    // Same spawn function as FieldCanvas — neutral vector means flow=null, so
    // we hit the default branch (random in middle 60% of canvas).
    function spawnParticle(i, fresh = false) {
      const x = width * (0.20 + Math.random() * 0.60);
      const y = height * (0.20 + Math.random() * 0.60);
      const xc = Math.max(-40, Math.min(width + 40, x));
      const yc = Math.max(-40, Math.min(height + 40, y));
      posX[i] = xc;
      posY[i] = yc;
      prevX[i] = xc;
      prevY[i] = yc;
      velX[i] = (Math.random() - 0.5) * 0.2;
      velY[i] = (Math.random() - 0.5) * 0.2;
      ages[i] = 0;
      lifeMax[i] = 240 + Math.random() * 200;
      alive[i] = 1;
      spawnDelay[i] = fresh ? Math.random() * 70 : 0;
    }

    function spawnAll() {
      for (let i = 0; i < N; i++) spawnParticle(i, true);
    }

    spawnAll();

    const drawBuffer = regl.buffer({ data: drawBuf, usage: "dynamic", length: N * 2 * 4 });
    const drawLineBufferGL = regl.buffer({ data: drawLineBuf, usage: "dynamic", length: N * 4 * 4 });

    // Fullscreen quad for per-frame fade toward background (prevents trail buildup → white).
    const fadeQuadBuffer = regl.buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
    const drawFade = regl({
      vert: FADE_VERT,
      frag: FADE_FRAG,
      attributes: { a_pos: fadeQuadBuffer },
      uniforms: {
        u_color: [BG_RGB[0], BG_RGB[1], BG_RGB[2]],
        u_alpha: regl.prop("alpha"),
      },
      count: 4,
      primitive: "triangle strip",
      blend: { enable: true, func: { src: "src alpha", dst: "one minus src alpha" } },
      depth: { enable: false },
    });

    const drawLines = regl({
      vert: LINE_VERT,
      frag: LINE_FRAG,
      attributes: { a_pos: drawLineBufferGL },
      uniforms: {
        u_viewport: () => [width, height],
        u_color: regl.prop("color"),
        u_alpha: regl.prop("alpha"),
      },
      count: regl.prop("count"),
      primitive: "lines",
      blend: { enable: true, func: { src: "src alpha", dst: "one minus src alpha" } },
      depth: { enable: false },
      lineWidth: 1,
    });

    function onResize() {
      const next = readSize();
      if (next.cssW === width && next.cssH === height) return;
      width = next.cssW;
      height = next.cssH;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener("resize", onResize);

    // Initial clear to bg
    regl.clear({ color: [BG_RGB[0], BG_RGB[1], BG_RGB[2], 1], depth: 1 });

    let raf;
    let lastTs = 0;

    const tick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(48, ts - lastTs) / 16.67;
      lastTs = ts;

      const p = NEUTRAL_PARAMS;
      // Slightly more motion than the actual idle mode (which uses 0.4×).
      const speedMul = 0.6;
      const intensityMul = 0.6;
      const jitterMul = 1;

      // Same physics constants as FieldCanvas
      const time = ts * 0.0005 * (p.noiseSpeed || 0.3) * speedMul;
      const curlIntensity = (p.curlIntensity || 100) * intensityMul * 1 * 0.014;
      const noiseScale = (p.noiseScale || 0.003) * 580;
      const dragF = Math.pow(0.97, dt);

      let drawCount = 0;

      for (let i = 0; i < N; i++) {
        if (!alive[i]) {
          // KEY CHANGE vs FieldCanvas: respawn dead particles so motion never stops
          spawnParticle(i, false);
          continue;
        }
        if (spawnDelay[i] > 0) {
          spawnDelay[i] -= dt;
          continue;
        }

        const px = posX[i];
        const py = posY[i];

        // Curl noise (only force in neutral state — no Chladni, no flow, no attractors)
        const [cvx, cvy] = curl2D(px, py, time, noiseScale);

        let vxNew = velX[i] * dragF + cvx * curlIntensity * dt;
        let vyNew = velY[i] * dragF + cvy * curlIntensity * dt;

        // Jitter
        if (p.jitter > 0) {
          vxNew += (Math.random() - 0.5) * p.jitter * jitterMul * 0.06 * dt;
          vyNew += (Math.random() - 0.5) * p.jitter * jitterMul * 0.06 * dt;
        }

        // Velocity cap
        const vMax = 6;
        if (vxNew > vMax) vxNew = vMax;
        else if (vxNew < -vMax) vxNew = -vMax;
        if (vyNew > vMax) vyNew = vMax;
        else if (vyNew < -vMax) vyNew = -vMax;

        velX[i] = vxNew;
        velY[i] = vyNew;

        const nx = px + vxNew * dt;
        const ny = py + vyNew * dt;

        ages[i] += dt;
        const dead = ages[i] > lifeMax[i];
        const oob = nx < -10 || nx > width + 10 || ny < -10 || ny > height + 10;

        if (dead || oob) {
          alive[i] = 0;
          continue;
        }

        prevX[i] = px;
        prevY[i] = py;
        posX[i] = nx;
        posY[i] = ny;

        drawLineBuf[drawCount * 4] = px;
        drawLineBuf[drawCount * 4 + 1] = py;
        drawLineBuf[drawCount * 4 + 2] = nx;
        drawLineBuf[drawCount * 4 + 3] = ny;
        drawCount++;
      }

      if (drawCount > 0) {
        const brightness = Math.max(0.75, Math.min(1.3, p.brightnessMul || 1));
        drawLineBufferGL.subdata(drawLineBuf.subarray(0, drawCount * 4));
        drawLines({
          color: NEUTRAL_TINT,
          alpha: 0.18 * brightness,
          count: drawCount * 2,
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      try { regl.destroy(); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", background: "#060609", ...style }}
    />
  );
}
