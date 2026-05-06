import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import createREGL from "regl";
import { STAGES, hexToRgb } from "./palette";
import { vectorToFieldParams, NEUTRAL_VECTOR } from "./plutchikMapping";

// CHLADNI / cymatic cover-art renderer.
// Particles are pushed by a standing-wave field toward its nodes, where they
// settle into intricate web/lattice/spike patterns (real cymatics math).
// Rendered as small soft DOTS that accumulate over the build-up phase, giving
// a sand-on-vibrating-plate aesthetic. Per-submission seed varies (n, m) and
// rotation so different words → visibly different cover art.

const STAGE_ID = "denial";

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
void main() {
  gl_FragColor = vec4(u_color, u_alpha);
}
`;

// Curl noise for organic micro-texture (much weaker than before — Chladni
// drives structure now, curl just adds nuance)
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

function vectorToTint(v, stagePalette) {
  const weights = stagePalette.rampWeights(v);
  const ramp = stagePalette.ramp.map(hexToRgb);
  let r = 0, g = 0, b = 0, sum = 0;
  for (let i = 0; i < weights.length; i++) {
    r += ramp[i][0] * weights[i];
    g += ramp[i][1] * weights[i];
    b += ramp[i][2] * weights[i];
    sum += weights[i];
  }
  if (sum > 0) { r /= sum; g /= sum; b /= sum; }
  const baseR = (108 + 230) / 2;
  const baseG = (200 + 241) / 2;
  const baseB = (229 + 247) / 2;
  return [
    (r * 0.35 + baseR * 0.65) / 255,
    (g * 0.35 + baseG * 0.65) / 255,
    (b * 0.35 + baseB * 0.65) / 255,
  ];
}

const FieldCanvas = forwardRef(function FieldCanvas(
  { className, getAudioBands },
  ref
) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mode: "idle",
    vector: { ...NEUTRAL_VECTOR },
    seed: 0,
    params: vectorToFieldParams(NEUTRAL_VECTOR, STAGES[STAGE_ID], 0),
    tint: [0.7, 0.85, 0.93],
    smoothBands: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
    respawnRequested: false,
    clearRequested: true,
  });

  useImperativeHandle(ref, () => ({
    setMode: (mode) => {
      const prev = stateRef.current.mode;
      stateRef.current.mode = mode;
      if (mode === "personal" && prev !== "personal") {
        stateRef.current.respawnRequested = true;
        stateRef.current.clearRequested = true;
      } else if (mode === "collective" && prev !== "collective") {
        stateRef.current.respawnRequested = true;
        stateRef.current.clearRequested = true;
      } else if (mode === "audio-react") {
        stateRef.current.clearRequested = true;
      }
    },
    setEmotion: (vector, seed = 0) => {
      stateRef.current.vector = vector;
      stateRef.current.seed = seed;
      stateRef.current.params = vectorToFieldParams(vector, STAGES[STAGE_ID], seed);
      stateRef.current.tint = vectorToTint(vector, STAGES[STAGE_ID]);
    },
    dissolveToCollective: ({ duration = 1500 } = {}) => {
      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / duration);
        if (t < 1) requestAnimationFrame(tick);
        else stateRef.current.mode = "collective";
      };
      requestAnimationFrame(tick);
    },
    addContribution: (_vector, _createdAt) => {},
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stagePalette = STAGES[STAGE_ID];
    const bgRgb = hexToRgb(stagePalette.background).map((c) => c / 255);

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

    const drawBuf = new Float32Array(N * 2);     // dots: curr position
    const drawLineBuf = new Float32Array(N * 4); // lines: prev + curr per particle

    function spawnParticle(i, fresh = false) {
      const params = stateRef.current.params;
      const flow = params && params.flow;
      let x, y, vx0 = 0, vy0 = 0;

      if (flow) {
        const ox = (flow.ox != null ? flow.ox : 0.5) * width;
        const oy = (flow.oy != null ? flow.oy : 0.5) * height;
        const jitter = Math.min(width, height) * 0.04;
        // Narrower spawn bands so the composition doesn't fill the whole canvas
        switch (flow.mode) {
          case "gravity-down":
            x = width * (0.18 + Math.random() * 0.64);
            y = -Math.random() * height * 0.05;
            vy0 = 0.5;
            break;
          case "gravity-up":
            x = width * (0.18 + Math.random() * 0.64);
            y = height + Math.random() * height * 0.05;
            vy0 = -0.5;
            break;
          case "horizontal-right":
            x = -Math.random() * width * 0.05;
            y = height * (0.18 + Math.random() * 0.64);
            vx0 = 0.5;
            break;
          case "horizontal-left":
            x = width + Math.random() * width * 0.05;
            y = height * (0.18 + Math.random() * 0.64);
            vx0 = -0.5;
            break;
          case "radial-out": {
            const a0 = Math.random() * Math.PI * 2;
            x = ox + Math.cos(a0) * jitter;
            y = oy + Math.sin(a0) * jitter;
            vx0 = Math.cos(a0) * 0.4;
            vy0 = Math.sin(a0) * 0.4;
            break;
          }
          case "rotational": {
            const r0 = Math.min(width, height) * (0.16 + Math.random() * 0.20);
            const a0 = Math.random() * Math.PI * 2;
            x = ox + Math.cos(a0) * r0;
            y = oy + Math.sin(a0) * r0;
            vx0 = -Math.sin(a0) * 0.4;
            vy0 = Math.cos(a0) * 0.4;
            break;
          }
          default:
            x = width * (0.20 + Math.random() * 0.60);
            y = height * (0.20 + Math.random() * 0.60);
        }
      } else {
        x = width * (0.20 + Math.random() * 0.60);
        y = height * (0.20 + Math.random() * 0.60);
      }

      const xc = Math.max(-40, Math.min(width + 40, x));
      const yc = Math.max(-40, Math.min(height + 40, y));
      posX[i] = xc;
      posY[i] = yc;
      prevX[i] = xc;
      prevY[i] = yc;
      velX[i] = vx0 + (Math.random() - 0.5) * 0.2;
      velY[i] = vy0 + (Math.random() - 0.5) * 0.2;
      ages[i] = 0;
      // Long lifetimes so each particle traces a long sweeping curve
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

    const drawDots = regl({
      vert: POINT_VERT,
      frag: POINT_FRAG,
      attributes: {
        a_pos: drawBuffer,
      },
      uniforms: {
        u_viewport: () => [width, height],
        u_pointSize: regl.prop("size"),
        u_color: regl.prop("color"),
        u_alpha: regl.prop("alpha"),
      },
      count: regl.prop("count"),
      primitive: "points",
      blend: {
        enable: true,
        func: { src: "src alpha", dst: "one minus src alpha" },
      },
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
      blend: {
        enable: true,
        func: { src: "src alpha", dst: "one minus src alpha" },
      },
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
      stateRef.current.clearRequested = true;
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener("resize", onResize);

    let raf;
    let lastTs = 0;

    const tick = (ts) => {
      const state = stateRef.current;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(48, ts - lastTs) / 16.67;
      lastTs = ts;

      if (state.clearRequested) {
        regl.clear({ color: [bgRgb[0], bgRgb[1], bgRgb[2], 1], depth: 1 });
        state.clearRequested = false;
      }

      if (state.respawnRequested) {
        spawnAll();
        state.respawnRequested = false;
      }

      const p = state.params;
      let speedMul = 1;
      let intensityMul = 1;
      let jitterMul = 1;

      if (state.mode === "audio-react" && getAudioBands) {
        const raw = getAudioBands();
        if (raw) {
          const sb = state.smoothBands;
          const a = 0.4;
          sb.bass = sb.bass * (1 - a) + raw.bass * a;
          sb.lowMid = sb.lowMid * (1 - a) + raw.lowMid * a;
          sb.mid = sb.mid * (1 - a) + raw.mid * a;
          sb.highMid = sb.highMid * (1 - a) + raw.highMid * a;
          sb.treble = sb.treble * (1 - a) + raw.treble * a;
          speedMul = 0.6 + sb.bass * 1.6;
          intensityMul = 0.7 + (sb.lowMid + sb.mid) * 1.0;
          jitterMul = 0.4 + sb.treble * 1.5;
        }
      } else if (state.mode === "idle") {
        speedMul = 0.4;
        intensityMul = 0.4;
      }

      // CHLADNI standing-wave force — DISABLED. The cymatic structure was
      // making compositions look too calculated / mathematical.
      const ch = p.chladni || { n: 3, m: 4, strength: 0, rotation: 0 };
      const chN = ch.n;
      const chM = ch.m;
      const chStrength = 0;
      const chCosR = Math.cos(ch.rotation);
      const chSinR = Math.sin(ch.rotation);
      const cx = width * 0.5;
      const cy = height * 0.5;

      // Tuned for graceful curving arcs:
      //   - Larger noise scale → bigger sweeping eddies (paths curve, don't scatter)
      //   - Stronger curl + higher drag → momentum carries particles in curves
      //   - Weaker flow → less straight-line forcing, more curl character
      const flow = p.flow;
      const seedCurlMul = flow && flow.curlMul ? flow.curlMul : 1;
      const time = ts * 0.0005 * (p.noiseSpeed || 0.3) * speedMul;
      const curlIntensity = (p.curlIntensity || 100) * intensityMul * seedCurlMul * 0.014;
      const noiseScale = (p.noiseScale || 0.003) * 580;
      const dragF = Math.pow(0.97, dt);

      const flowS = flow ? flow.strength * 0.18 : 0;
      const flowRotation = flow && flow.rotation ? flow.rotation : 0;
      const flowCosR = Math.cos(flowRotation);
      const flowSinR = Math.sin(flowRotation);

      let drawCount = 0;

      for (let i = 0; i < N; i++) {
        if (!alive[i]) continue;
        if (spawnDelay[i] > 0) {
          spawnDelay[i] -= dt;
          continue;
        }

        const px = posX[i];
        const py = posY[i];

        // ── Chladni standing-wave force ──
        // Rotate position into pattern coords
        const dx0 = px - cx;
        const dy0 = py - cy;
        const rx = dx0 * chCosR + dy0 * chSinR + cx;
        const ry = -dx0 * chSinR + dy0 * chCosR + cy;
        const sx = rx / width;
        const sy = ry / height;
        const npx = chN * Math.PI * sx;
        const mpx = chM * Math.PI * sx;
        const npy = chN * Math.PI * sy;
        const mpy = chM * Math.PI * sy;
        const cosNX = Math.cos(npx), sinNX = Math.sin(npx);
        const cosMX = Math.cos(mpx), sinMX = Math.sin(mpx);
        const cosNY = Math.cos(npy), sinNY = Math.sin(npy);
        const cosMY = Math.cos(mpy), sinMY = Math.sin(mpy);
        // amplitude: cos(nx)cos(my) - cos(mx)cos(ny)
        const amp = cosNX * cosMY - cosMX * cosNY;
        // d/dx amp: -n*pi/W * sin(nx)*cos(my) + m*pi/W * sin(mx)*cos(ny)
        const dAdx = (-chN * Math.PI / width) * sinNX * cosMY + (chM * Math.PI / width) * sinMX * cosNY;
        // d/dy amp: -m*pi/H * cos(nx)*sin(my) + n*pi/H * cos(mx)*sin(ny)
        const dAdy = (-chM * Math.PI / height) * cosNX * sinMY + (chN * Math.PI / height) * cosMX * sinNY;
        // Force = -grad(|amp|^2) = -2*amp*grad(amp), pushes toward nodes
        const chFxRot = -2 * amp * dAdx * chStrength * width;
        const chFyRot = -2 * amp * dAdy * chStrength * height;
        // Rotate force back to world coords
        const chFx = chFxRot * chCosR - chFyRot * chSinR;
        const chFy = chFxRot * chSinR + chFyRot * chCosR;

        // ── Curl noise (subtle organic texture) ──
        const [cvx, cvy] = curl2D(px, py, time, noiseScale);

        let vxNew = velX[i] * dragF + chFx * dt + cvx * curlIntensity * dt;
        let vyNew = velY[i] * dragF + chFy * dt + cvy * curlIntensity * dt;

        // ── Directional flow per emotion, rotated by seed-derived skew ──
        if (flow) {
          let baseFx = 0, baseFy = 0;
          if (flow.mode === "gravity-down") baseFy = flowS;
          else if (flow.mode === "gravity-up") baseFy = -flowS;
          else if (flow.mode === "horizontal-right") baseFx = flowS;
          else if (flow.mode === "horizontal-left") baseFx = -flowS;
          // Apply per-seed rotation so direction varies between submissions
          const rotFx = baseFx * flowCosR - baseFy * flowSinR;
          const rotFy = baseFx * flowSinR + baseFy * flowCosR;
          vxNew += rotFx * dt;
          vyNew += rotFy * dt;
        }

        // ── Jitter ──
        // Jitter heavily damped — was creating the "hair" / fuzz look.
        // Curves come from curl-noise drift, not from random tremor.
        if (p.jitter > 0) {
          vxNew += (Math.random() - 0.5) * p.jitter * jitterMul * 0.06 * dt;
          vyNew += (Math.random() - 0.5) * p.jitter * jitterMul * 0.06 * dt;
        }

        // Cap velocity so particles don't fly off the canvas
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

        // Add this particle's stroke (line) and grain (dot) to draw buffers
        drawLineBuf[drawCount * 4] = px;
        drawLineBuf[drawCount * 4 + 1] = py;
        drawLineBuf[drawCount * 4 + 2] = nx;
        drawLineBuf[drawCount * 4 + 3] = ny;
        drawBuf[drawCount * 2] = nx;
        drawBuf[drawCount * 2 + 1] = ny;
        drawCount++;
      }

      if (drawCount > 0) {
        const brightness = Math.max(0.55, Math.min(1.3, p.brightnessMul || 1));
        // Lines only — dot rendering removed (it was creating the sand-grain
        // buildup at convergence points).
        drawLineBufferGL.subdata(drawLineBuf.subarray(0, drawCount * 4));
        drawLines({
          color: state.tint,
          alpha: 0.30 * brightness,
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
  }, [getAudioBands]);

  return <canvas ref={canvasRef} className={className} />;
});

export default FieldCanvas;
