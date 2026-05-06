// POST /.netlify/functions/feel
// Body: { text: string, stage?: string }
// Returns: { contribution_id, vector }
//
// Day 1: stub. Returns the deterministic-from-text fallback vector.
// Day 3: integrates Anthropic (claude-sonnet-4-6) with cached system prompt + Supabase insert.

import crypto from "node:crypto";

const PLUTCHIK_KEYS = ["joy","trust","fear","surprise","sadness","disgust","anger","anticipation"];
const NEUTRAL = Object.freeze({
  joy: 0.1, trust: 0.1, fear: 0.1, surprise: 0.1,
  sadness: 0.1, disgust: 0.1, anger: 0.1, anticipation: 0.1,
});

const MAX_LEN = 200;

function deterministicVector(text) {
  const s = String(text || "").trim().toLowerCase();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const out = {};
  for (const k of PLUTCHIK_KEYS) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    out[k] = Math.round(((h % 1000) / 1000) * 1000) / 1000;
  }
  return out;
}

function isValidVector(v) {
  if (!v || typeof v !== "object") return false;
  for (const k of PLUTCHIK_KEYS) {
    const n = v[k];
    if (typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 1) return false;
  }
  return true;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method_not_allowed" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "bad_json" }) };
  }

  const text = String(body.text || "").trim().slice(0, MAX_LEN);
  const stage = String(body.stage || "denial").slice(0, 32);

  // Day 1 stub: return deterministic vector based on input text.
  // No Supabase, no Anthropic until env vars + integration land in Day 3.
  const vector = text.length === 0 ? NEUTRAL : deterministicVector(text);
  if (!isValidVector(vector)) {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contribution_id: null, vector: NEUTRAL }),
    };
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contribution_id: crypto.randomUUID(),
      vector,
      stage,
      stub: true,
    }),
  };
}
