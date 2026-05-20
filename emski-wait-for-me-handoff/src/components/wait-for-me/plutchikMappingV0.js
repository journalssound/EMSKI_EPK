// Maps a Plutchik 8-emotion vector to flow-field parameters.
// Pure function — no DOM, no React, no side effects.

export const PLUTCHIK_KEYS = [
  "joy", "trust", "fear", "surprise",
  "sadness", "disgust", "anger", "anticipation",
];

export const NEUTRAL_VECTOR = Object.freeze({
  joy: 0.1, trust: 0.1, fear: 0.1, surprise: 0.1,
  sadness: 0.1, disgust: 0.1, anger: 0.1, anticipation: 0.1,
});

export function isValidVector(v) {
  if (!v || typeof v !== "object") return false;
  for (const k of PLUTCHIK_KEYS) {
    const n = v[k];
    if (typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 1) return false;
  }
  return true;
}

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

// Default seed (0) reproduces a stable result if no text seed provided.
let __defaultSeed = 0;
export function setDefaultSeed(s) { __defaultSeed = s | 0; }

// Field params consumed by FieldCanvas. Each emotion drives a distinct
// motion CHARACTER, not just intensity:
//   - sadness → gravity pulls particles down, slows motion, dims
//   - joy → expands outward from center, brightens
//   - anger → surges + chaos (jitter + speed)
//   - fear → erratic random force, dims
//   - trust → smooth, persistent (high drag), calm
//   - disgust → sharp angular jolts
//   - surprise → bursty, sudden direction changes
//   - anticipation → pulsing intensity (handled in shader via pulseFreq)
export function vectorToFieldParams(v, stagePalette, seed = __defaultSeed) {
  const { joy, trust, fear, surprise, sadness, disgust, anger, anticipation } = v;

  return {
    // Field topology — wide ranges so anger (chaotic small eddies) and trust
    // (laminar smooth) produce visibly different curl patterns.
    noiseScale: clamp(0.0015 + 0.0085 * anger + 0.003 * sadness * sadness - 0.0018 * trust, 0.0005, 0.014),
    noiseSpeed: clamp(0.05 + 0.85 * anger + 0.35 * anticipation - 0.35 * sadness - 0.15 * trust, 0.02, 1.2),
    curlIntensity: clamp(50 + 280 * anger + 110 * surprise + 50 * joy - 30 * trust, 30, 460),

    // Jitter sources — fear is a steady tremor, surprise is bursty,
    // anger is high-frequency turbulence (gives chaos to its clusters)
    jitter: clamp(0.05 + 1.8 * fear + 0.4 * surprise + 0.85 * anger, 0, 2.4),
    burstChance: clamp(surprise * 0.06 + disgust * 0.045, 0, 0.10),
    burstScale: clamp(disgust * 1.6 + surprise * 1.0, 0, 2.6),

    // Drag — trust stretches trails very long, disgust truncates them sharply
    drag: clamp(0.93 + 0.06 * trust - 0.08 * disgust, 0.83, 0.995),

    // DIRECTIONAL forces — primary cover-art compositional drivers.
    // Y axis: sad sinks bottom, joy floats up
    gravityY: clamp(sadness * 1.4 - joy * 0.65, -0.75, 1.4),
    // X axis: anticipation leans right (forward), fear leans left (retreating)
    directionBiasX: clamp(anticipation * 0.65 - fear * 0.5 + anger * 0.2 * (anger - 0.5), -0.55, 0.75),
    // Radial: joy bursts outward, fear retracts to edges
    centerForce: clamp(joy * 1.05 - fear * 0.75, -0.85, 1.05),
    randomForce: clamp(fear * 1.2 + surprise * 0.45, 0, 1.4),

    // Spawn-position bias (re-rolled on emotion change). Drives where the
    // composition is heavy in the static frame.
    spawnBiasX: clamp(anticipation * 0.35 - fear * 0.25, -0.3, 0.35),
    spawnBiasY: clamp(sadness * 0.35 - joy * 0.25, -0.3, 0.35),
    spawnSpread: clamp(0.6 - joy * 0.35 + fear * 0.25, 0.25, 0.95),  // 1.0 = whole canvas, low = clustered near bias

    // Speed differentiation — anger surges, sadness/fear stall
    speedMul: clamp(1.0 + 0.7 * anger + 0.4 * anticipation - 0.6 * sadness - 0.3 * fear, 0.35, 2.4),

    // Brightness — wide range for cover-art differentiation. Bright emotions
    // produce luminous compositions; cool emotions produce dim, ghostly ones.
    brightnessMul: clamp(0.3 + 1.1 * joy + 0.8 * anger + 0.55 * anticipation - 0.7 * sadness - 0.55 * fear - 0.3 * disgust, 0.15, 2.2),

    // Pulse (anticipation breathes through the field)
    pulseFreq: clamp(0.3 + 2.5 * anticipation, 0.3, 2.8),
    pulseDepth: clamp(0.15 * anticipation + 0.1 * surprise, 0, 0.25),

    particleSize: clamp(1.0 + 1.4 * trust + 0.6 * joy, 1.0, 3.4),
    additiveBlend: (joy + trust + anger - disgust - sadness) > 0,

    rampWeights: stagePalette.rampWeights(v),

    flow: emotionFlow(v, seed),
    attractors: emotionAttractors(v, seed),
    chladni: emotionChladni(v, seed),
    seed,
  };
}

// Per-emotion FLOW — particles travel ACROSS the canvas in a characteristic
// direction (sad falls down, joy radiates outward, anticipation drifts right,
// etc.). This is what produces distinct visible trail-strokes instead of
// fuzzy orbiting blobs. Picks the dominant emotion to define the flow.
function emotionFlow(v, seed = 0) {
  const entries = [
    ["sadness", v.sadness], ["joy", v.joy], ["anger", v.anger],
    ["fear", v.fear], ["anticipation", v.anticipation],
    ["trust", v.trust], ["disgust", v.disgust], ["surprise", v.surprise],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [name, weight] = entries[0];
  if (weight < 0.25) return null;

  // Seed-derived perturbations — strong enough that different words within
  // the same emotion class produce visibly different cover art.
  const s1 = ((seed >>> 0) % 10007) / 10007;
  const s2 = ((seed >>> 13) % 10007) / 10007;
  const s3 = ((seed >>> 7) % 10007) / 10007;
  const s4 = ((seed >>> 19) % 10007) / 10007;
  const s5 = ((seed >>> 5) % 10007) / 10007;
  const ox = (base) => base + (s1 - 0.5) * 0.24;       // ±0.12 origin offset
  const oy = (base) => base + (s2 - 0.5) * 0.24;
  const strMul = 0.65 + s3 * 0.7;                       // 0.65–1.35
  const rotation = (s4 - 0.5) * (Math.PI / 3.5);        // ±25° flow tilt
  const curlMul = 0.7 + s5 * 0.8;                       // 0.7–1.5 curl variation

  switch (name) {
    case "sadness":
      return { mode: "gravity-down", strength: weight * 0.55 * strMul, rotation, curlMul };
    case "joy":
      return { mode: "radial-out", strength: weight * 0.55 * strMul, ox: ox(0.5), oy: oy(0.48), rotation, curlMul };
    case "anger":
      return { mode: "radial-out", strength: weight * 0.6 * strMul, ox: ox(0.40), oy: oy(0.42), rotation, curlMul };
    case "fear":
      return { mode: "radial-out", strength: weight * 0.5 * strMul, ox: ox(0.5), oy: oy(0.5), rotation, curlMul };
    case "anticipation":
      return { mode: "horizontal-right", strength: weight * 0.5 * strMul, rotation, curlMul };
    case "trust":
      return { mode: "rotational", strength: weight * 0.35 * strMul, ox: ox(0.5), oy: oy(0.5), rotation, curlMul };
    case "disgust":
      return { mode: "radial-out", strength: weight * 0.5 * strMul, ox: ox(0.32), oy: oy(0.5), rotation, curlMul };
    case "surprise":
      return { mode: "radial-out", strength: weight * 0.55 * strMul, ox: ox(0.7), oy: oy(0.3), rotation, curlMul };
    default:
      return null;
  }
}

// Per-emotion attractor layout. Attractors pull particles toward (positive
// strength) or push them away from (negative strength) specific normalized
// positions [0..1] in the canvas. This is what creates COMPOSITIONAL SHAPE —
// without attractors, curl noise alone produces uniform texture (a "block").
// Per-emotion attractor layouts. Following what works for sadness:
// EVERY attractor for a given emotion sits in ONE LOCALIZED REGION of the
// canvas. Per-seed perturbations shift positions, strengths, and radii so
// different words within the same emotion class produce distinct results.
function emotionAttractors(v, seed = 0) {
  const out = [];

  // Seed-derived perturbations
  const s1 = ((seed >>> 0) % 10007) / 10007;
  const s2 = ((seed >>> 13) % 10007) / 10007;
  const s3 = ((seed >>> 7) % 10007) / 10007;
  const s4 = ((seed >>> 19) % 10007) / 10007;
  const jx = (s1 - 0.5) * 0.12;        // ±0.06 position jitter
  const jy = (s2 - 0.5) * 0.12;
  const strMul = 0.80 + s3 * 0.40;     // 0.80–1.20 strength variation
  const radMul = 0.85 + s4 * 0.30;     // 0.85–1.15 radius variation

  const STR = 0.9 * strMul;
  const RAD = 0.45 * radMul;

  // BOTTOM band — sadness sinks
  if (v.sadness > 0.25) {
    out.push({ x: 0.30 + jx, y: 0.85 + jy, strength: v.sadness * STR, radius: RAD });
    out.push({ x: 0.50 - jx, y: 0.92 + jy, strength: v.sadness * STR, radius: RAD });
    out.push({ x: 0.70 + jx * 0.5, y: 0.85 - jy, strength: v.sadness * STR, radius: RAD });
  }

  // TOP band — joy lifts
  if (v.joy > 0.25) {
    out.push({ x: 0.30 + jx, y: 0.18 + jy, strength: v.joy * STR, radius: RAD });
    out.push({ x: 0.50 - jx, y: 0.12 + jy, strength: v.joy * STR, radius: RAD });
    out.push({ x: 0.70 + jx * 0.5, y: 0.18 - jy, strength: v.joy * STR, radius: RAD });
  }

  // RIGHT band — anticipation leans forward
  if (v.anticipation > 0.25) {
    out.push({ x: 0.82 + jx, y: 0.30 + jy, strength: v.anticipation * STR, radius: RAD });
    out.push({ x: 0.88 - jx * 0.5, y: 0.50 + jy, strength: v.anticipation * STR, radius: RAD });
    out.push({ x: 0.82 + jx * 0.5, y: 0.70 - jy, strength: v.anticipation * STR, radius: RAD });
  }

  // UPPER-LEFT diagonal — fear retreats to corner
  if (v.fear > 0.25) {
    out.push({ x: 0.18 + jx, y: 0.20 + jy, strength: v.fear * STR, radius: RAD });
    out.push({ x: 0.30 - jx, y: 0.12 + jy, strength: v.fear * STR, radius: RAD });
    out.push({ x: 0.10 + jx * 0.5, y: 0.32 - jy, strength: v.fear * STR, radius: RAD });
  }

  // CENTER — trust gathers softly
  if (v.trust > 0.25) {
    out.push({ x: 0.42 + jx, y: 0.50 + jy, strength: v.trust * STR, radius: RAD });
    out.push({ x: 0.58 - jx, y: 0.50 - jy, strength: v.trust * STR, radius: RAD });
    out.push({ x: 0.50 + jx * 0.5, y: 0.42 + jy, strength: v.trust * STR, radius: RAD });
  }

  // ASYMMETRIC EXPLOSION — tight cluster in upper-left quadrant
  if (v.anger > 0.25) {
    out.push({ x: 0.32 + jx, y: 0.32 + jy, strength: v.anger * STR, radius: 0.32 * radMul });
    out.push({ x: 0.46 - jx, y: 0.28 + jy, strength: v.anger * STR, radius: 0.32 * radMul });
    out.push({ x: 0.28 + jx * 0.5, y: 0.45 - jy, strength: v.anger * STR, radius: 0.32 * radMul });
    out.push({ x: 0.45 - jx * 0.5, y: 0.48 + jy * 0.5, strength: v.anger * STR, radius: 0.32 * radMul });
  }

  // OFFSET-LEFT cluster — disgust pulls aside
  if (v.disgust > 0.25) {
    out.push({ x: 0.22 + jx, y: 0.40 + jy, strength: v.disgust * STR, radius: RAD });
    out.push({ x: 0.18 - jx, y: 0.60 + jy, strength: v.disgust * STR, radius: RAD });
    out.push({ x: 0.32 + jx * 0.5, y: 0.50 - jy, strength: v.disgust * STR, radius: RAD });
  }

  // UPPER-RIGHT pole — surprise punches there
  if (v.surprise > 0.25) {
    out.push({ x: 0.72 + jx, y: 0.20 + jy, strength: v.surprise * STR, radius: RAD });
    out.push({ x: 0.85 - jx, y: 0.30 + jy, strength: v.surprise * STR, radius: RAD });
    out.push({ x: 0.65 + jx * 0.5, y: 0.32 - jy, strength: v.surprise * STR, radius: RAD });
  }

  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Local fallback: keyword → emotion vector. Used when Anthropic API is
// unavailable (e.g. local dev with no backend). Keyword-based so contrasting
// inputs ("rage" vs "still") produce semantically-distinct vectors.
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORDS = {
  // Joy
  happy:    { joy: 0.85, trust: 0.3 },
  joyful:   { joy: 0.9, trust: 0.4 },
  joy:      { joy: 0.9 },
  glad:     { joy: 0.7, trust: 0.4 },
  love:     { joy: 0.75, trust: 0.85 },
  blissful: { joy: 0.95, trust: 0.6 },
  ecstatic: { joy: 1.0, anticipation: 0.8 },
  elated:   { joy: 0.9, anticipation: 0.5 },
  warm:     { joy: 0.55, trust: 0.65 },
  light:    { joy: 0.55, trust: 0.4 },

  // Trust / calm
  calm:     { trust: 0.75, joy: 0.3 },
  peaceful: { trust: 0.85, joy: 0.45 },
  serene:   { trust: 0.85, joy: 0.5 },
  still:    { trust: 0.6, sadness: 0.25 },
  steady:   { trust: 0.7 },
  safe:     { trust: 0.85 },
  grounded: { trust: 0.75 },
  comforting: { trust: 0.8, joy: 0.5 },
  held:     { trust: 0.75, joy: 0.3 },

  // Fear
  afraid:    { fear: 0.9 },
  scared:    { fear: 0.85 },
  fear:      { fear: 0.9 },
  terrified: { fear: 1.0 },
  anxious:   { fear: 0.7, anticipation: 0.55 },
  nervous:   { fear: 0.6, anticipation: 0.5 },
  worried:   { fear: 0.6, anticipation: 0.5, sadness: 0.3 },
  panicked:  { fear: 0.9, surprise: 0.5 },
  uncertain: { fear: 0.45, anticipation: 0.4 },

  // Surprise
  surprised: { surprise: 0.85 },
  shocked:   { surprise: 0.95, fear: 0.5 },
  stunned:   { surprise: 0.85, fear: 0.4 },
  amazed:    { surprise: 0.7, joy: 0.6 },

  // Sadness
  sad:       { sadness: 0.9 },
  sadness:   { sadness: 0.9 },
  lonely:    { sadness: 0.85, fear: 0.3 },
  alone:     { sadness: 0.7, fear: 0.3 },
  empty:     { sadness: 0.75, disgust: 0.3 },
  grief:     { sadness: 0.95, disgust: 0.2 },
  grieving:  { sadness: 0.9, disgust: 0.2 },
  missing:   { sadness: 0.8, anticipation: 0.5 },
  miss:      { sadness: 0.7, anticipation: 0.5 },
  hurt:      { sadness: 0.8, anger: 0.3 },
  broken:    { sadness: 0.85, disgust: 0.3 },
  depressed: { sadness: 0.9, disgust: 0.4 },
  blue:      { sadness: 0.6 },
  heartbroken: { sadness: 0.95, anger: 0.3 },
  melancholy: { sadness: 0.7, trust: 0.3 },
  longing:   { sadness: 0.55, anticipation: 0.7 },
  yearning:  { sadness: 0.5, anticipation: 0.8 },

  // Disgust
  disgusted: { disgust: 0.9 },
  disgust:   { disgust: 0.9 },
  sick:      { disgust: 0.75, sadness: 0.3 },
  repulsed:  { disgust: 0.95 },
  hateful:   { disgust: 0.7, anger: 0.8 },
  hate:      { disgust: 0.7, anger: 0.8 },
  bitter:    { disgust: 0.65, anger: 0.5, sadness: 0.4 },

  // Anger
  angry:      { anger: 0.9 },
  anger:      { anger: 0.9 },
  mad:        { anger: 0.75 },
  rage:       { anger: 1.0, disgust: 0.6 },
  enraged:    { anger: 0.95, disgust: 0.5 },
  furious:    { anger: 0.95 },
  fury:       { anger: 0.95, disgust: 0.4 },
  frustrated: { anger: 0.7, disgust: 0.45 },
  annoyed:    { anger: 0.55 },
  pissed:     { anger: 0.8, disgust: 0.4 },

  // Anticipation
  hopeful:   { anticipation: 0.75, joy: 0.45, trust: 0.4 },
  hope:      { anticipation: 0.75, joy: 0.4 },
  eager:     { anticipation: 0.85, joy: 0.4 },
  waiting:   { anticipation: 0.8, sadness: 0.35 },
  expectant: { anticipation: 0.85 },
  pleading:  { anticipation: 0.7, sadness: 0.6 },
  asking:    { anticipation: 0.55, sadness: 0.3 },

  // Mixed / ambiguous
  numb:      { sadness: 0.55, disgust: 0.45 },
  detached:  { sadness: 0.45, disgust: 0.4 },
  hollow:    { sadness: 0.7, disgust: 0.4 },
  bittersweet: { joy: 0.4, sadness: 0.55, trust: 0.4 },
  nostalgic: { joy: 0.45, sadness: 0.55, trust: 0.45 },
  conflicted: { fear: 0.45, anger: 0.4, sadness: 0.4 },

  // Intensity modifiers (boost the dominant emotion further)
  very:    { __intensify: 1.25 },
  really:  { __intensify: 1.2 },
  deeply:  { __intensify: 1.3 },
  totally: { __intensify: 1.25 },
  so:      { __intensify: 1.15 },
};

// Soft hash for variation when no keywords match.
function hashSeed(text) {
  let h = 2166136261 >>> 0;
  const s = String(text || "").trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// Public hash for text → seed, used to vary the visual pattern per submission
// so different words with the same emotion class produce different artwork.
export function hashText(text) {
  return hashSeed(text);
}

// Per-emotion Chladni / cymatic standing-wave parameters (n, m) plus a
// per-submission seed variation. Different emotions favor different patterns;
// different words within the same emotion shift (n, m) within that range.
export function emotionChladni(v, seed = 0) {
  const PLUTCHIK = ["sadness", "joy", "anger", "fear", "trust", "anticipation", "disgust", "surprise"];
  let dom = "trust", domW = 0;
  for (const k of PLUTCHIK) {
    if (v[k] > domW) { dom = k; domW = v[k]; }
  }

  // Two seed-derived 0..1 floats for variation
  const s1 = ((seed >>> 0) % 10007) / 10007;
  const s2 = ((seed >>> 13) % 10007) / 10007;
  const s3 = ((seed >>> 7) % 10007) / 10007;

  let n, m, strength, rotation;
  switch (dom) {
    case "sadness":
      n = 2 + Math.floor(s1 * 2);   // 2-3
      m = 4 + Math.floor(s2 * 2);   // 4-5
      strength = 0.9;
      break;
    case "joy":
      n = 3 + Math.floor(s1 * 2);   // 3-4
      m = 3 + Math.floor(s2 * 2);   // 3-4 — symmetric mandala
      strength = 1.1;
      break;
    case "anger":
      n = 4 + Math.floor(s1 * 3);   // 4-6
      m = 5 + Math.floor(s2 * 4);   // 5-8 — asymmetric chaotic
      strength = 1.3;
      break;
    case "fear":
      n = 1 + Math.floor(s1 * 2);   // 1-2 sparse
      m = 5 + Math.floor(s2 * 3);   // 5-7
      strength = 0.85;
      break;
    case "trust":
      n = 4 + Math.floor(s1 * 2);   // 4-5
      m = 4 + Math.floor(s2 * 2);   // 4-5 — symmetric calm
      strength = 1.0;
      break;
    case "anticipation":
      n = 2 + Math.floor(s1 * 2);   // 2-3
      m = 5 + Math.floor(s2 * 3);   // 5-7 — directional waves
      strength = 1.0;
      break;
    case "disgust":
      n = 3 + Math.floor(s1 * 3);   // 3-5
      m = 6 + Math.floor(s2 * 3);   // 6-8 — broken
      strength = 1.05;
      break;
    case "surprise":
      n = 5 + Math.floor(s1 * 3);   // 5-7
      m = 6 + Math.floor(s2 * 4);   // 6-9 — high-frequency burst
      strength = 1.2;
      break;
    default:
      n = 3; m = 4; strength = 1.0;
  }

  // Tasteful skew — rotate the pattern slightly off the axis (-25°..+25°)
  rotation = (s3 - 0.5) * (Math.PI / 4);

  // Allow occasional swap so n vs m sometimes inverts (more variety)
  if (s1 < 0.3) { const t = n; n = m; m = t; }

  return { n, m, strength, rotation };
}

// Map text to a Plutchik vector via keyword detection. Falls back to a faint
// hash-derived signature when nothing matches, so identical input is reproducible
// but typical text still produces something. Outputs intensities ∈ [0, 1].
export function deterministicVectorFromText(text) {
  const s = String(text || "").trim().toLowerCase();
  if (!s) return { ...NEUTRAL_VECTOR };

  // Tokenize on word boundaries
  const tokens = s.split(/[^a-z'’]+/).filter(Boolean);

  let intensify = 1.0;
  const accum = {
    joy: 0, trust: 0, fear: 0, surprise: 0,
    sadness: 0, disgust: 0, anger: 0, anticipation: 0,
  };
  let hits = 0;

  for (const tok of tokens) {
    const entry = KEYWORDS[tok];
    if (!entry) continue;
    if (entry.__intensify) {
      intensify *= entry.__intensify;
      continue;
    }
    hits++;
    for (const k of PLUTCHIK_KEYS) {
      if (typeof entry[k] === "number") {
        accum[k] = Math.max(accum[k], entry[k]);
      }
    }
  }

  if (hits > 0) {
    // Normalize then apply intensifier; clamp.
    for (const k of PLUTCHIK_KEYS) {
      accum[k] = clamp(accum[k] * intensify, 0, 1);
    }
    // Add tiny hash-derived noise so two "sad" inputs aren't byte-identical
    const seed = hashSeed(s);
    let h = seed;
    for (const k of PLUTCHIK_KEYS) {
      h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
      const noise = ((h % 1000) / 1000 - 0.5) * 0.05;
      accum[k] = clamp(accum[k] + noise, 0, 1);
    }
    return accum;
  }

  // No keyword hits — produce a vector with one or two "selected" emotions
  // based on the hash, rather than uniform random across all 8.
  const seed = hashSeed(s);
  let h = seed;
  const out = { ...NEUTRAL_VECTOR };
  // Pick two emotions to lean into based on the hash, with moderate intensity.
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  const primary = PLUTCHIK_KEYS[h % 8];
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  const secondary = PLUTCHIK_KEYS[h % 8];
  out[primary] = 0.55 + ((h % 1000) / 1000) * 0.35;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  out[secondary] = 0.35 + ((h % 1000) / 1000) * 0.4;
  return out;
}
