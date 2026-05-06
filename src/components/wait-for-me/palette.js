// Stage palettes for the e/MOTION generative landing pages.
// Each stage exposes: { id, label, background, fadeTo, ramp, rampWeights, paramOverrides }
// `ramp` is a 5-stop hue ramp sampled per-particle.
// `rampWeights(vec)` returns 5 weights (one per ramp stop) given a Plutchik 8-vector.
// The engine consumes `(vector, stagePalette)` and never references hex literals directly.

export const STAGES = {
  denial: {
    id: "denial",
    label: "Denial",
    background: "#060609",
    fadeTo: "#060609",
    ramp: [
      "#1F2C44", // coldSlate    — sadness weight
      "#6E6F8A", // violetAsh    — disgust weight
      "#6CC8E5", // iceCyan      — joy/trust weight (cold variant)
      "#B9DFEF", // paleFrost    — fear weight
      "#E6F1F7", // nearWhite    — anticipation highlight
    ],
    rampWeights: (v) => [
      0.10 + 0.6 * v.sadness,
      0.10 + 0.4 * v.disgust,
      0.20 + 0.3 * (v.joy + v.trust) / 2,
      0.15 + 0.4 * v.fear,
      0.15 + 0.5 * v.anticipation,
    ],
    paramOverrides: {},
  },
  // Future stages plug in here. anger / bargaining / depression / acceptance.
};

export function getStage(stageId) {
  const s = STAGES[stageId];
  if (!s) throw new Error(`Unknown stage: ${stageId}`);
  return s;
}

// Convert a 5-stop ramp + per-particle 0..1 t into an [r,g,b] triple.
// Used by JS-side preview / fallback rendering. WebGL shader does the same in GLSL.
export function sampleRamp(ramp, t) {
  const clamped = Math.max(0, Math.min(1, t));
  const seg = clamped * (ramp.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = hexToRgb(ramp[i]);
  const b = hexToRgb(ramp[Math.min(i + 1, ramp.length - 1)]);
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
