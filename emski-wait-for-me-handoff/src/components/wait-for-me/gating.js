// localStorage-backed gating for /wait-for-me.
// Records that this device has contributed; lets returning visitors skip the input
// step and see the collective field with their personal vector as a brief halo.

const KEY = "wfm:contribution:v1";

export function getContribution() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.id || !obj.vector) return null;
    return obj;
  } catch {
    return null;
  }
}

export function setContribution({ id, vector, ts }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, vector, ts: ts ?? Date.now() }));
  } catch {
    // localStorage disabled / quota — fall through silently. Gating is best-effort.
  }
}

export function clearContribution() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // no-op
  }
}
