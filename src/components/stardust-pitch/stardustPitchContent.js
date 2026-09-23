/* ─────────────────────────────────────────────────────────
 * Stardust Garage — Nov 21 2026 proposal
 *
 * Private, one reader (Adam). Big numbers, one comparison, no prose.
 * Last year's ticketing is from the Posh dashboard for "The_Effect: Live
 * A/V Set", Nov 22 2025. Bar figure and deal terms from the artist.
 * ───────────────────────────────────────────────────────── */

export const PITCH_META = {
  venue: "Stardust Garage",
  city: "Austin, TX",
  preparedFor: "Adam · Stardust Garage",
  prepared: "Sep 2026",
  contactEmail: "contact@emskimusic.com",
};

export const LAST_YEAR = {
  dateLabel: "SAT NOV 22 2025",
  capacity: 600,
  // Dashboard totals. The tier rows below sum to 590 / $16,657 — eleven
  // tickets aren't itemised there; the headline uses the dashboard.
  sold: 601,
  net: 16661,
  // Net price to the organiser (display price adds fees), tickets sold.
  tiers: [
    { name: "PRE SALE", price: 18, sold: 20 },
    { name: "TIER 1", price: 20, sold: 50 },
    { name: "TIER 2", price: 23, sold: 99 },
    { name: "TIER 3", price: 25, sold: 162 },
    { name: "FINAL RELEASE", price: 30, sold: 124 },
    { name: "DOOR", price: 35, sold: 100 },
    { name: "AFTERS 2AM+", price: 50, sold: 35, after2am: true },
  ],
  bar: 16000, // Stardust's bar take, approx.
  /* What EMSKI paid to put the show on — her ticket share was gross, not net. */
  costs: [
    { label: "PRODUCTION", amount: 3000 },
    { label: "DJS + EVENT STAFF", amount: 2000 },
  ],
  /* Last year's terms: EMSKI kept every ticket sold before 2AM; Stardust
   * kept the after-2AM tickets and all bar. */
  emskiShareTo2am: 1.0,
};

/* What the show set off. */
export const SINCE = {
  tiles: [
    { n: "2", l: "MORE SELLOUTS", s: "DENVER (AEG) · MCALLEN" },
    { n: "65%", l: "TICKETS ORGANIC", s: "TIKTOK-LED · PAID ADS 7%" },
    { n: "140K", l: "VIEWS, ONE TIKTOK", s: "SOLD OUT MCALLEN" },
    { n: "53K", l: "FOLLOWERS", s: "+25% SINCE FEB" },
  ],
  line: "THE_EFFECT TOUR · 5 CITIES · APR–JUN 2026 · DIRECT SUPPORT FOR AMELIE LENS, THE CONCOURSE PROJECT",
};

/* The ask. */
export const PROPOSAL = {
  dateLabel: "SAT NOV 21 2026",
  format: "EMSKI LIVE SET → [BLACKOUT] DJ SET · FIRST [BLACKOUT] SHOW",
  capacity: 600,
  emskiShareTo2am: 0.8,
  /* Scenarios: a straight repeat of last year's tiers, and every tier $5 up. */
  scenarios: [
    { label: "SAME TIERS", priceDelta: 0 },
    { label: "EVERY TIER +$5", priceDelta: 5 },
  ],
};

export const NEXT = ["HOLD SAT NOV 21", "CONFIRM 80/20 TO 2AM", "ANNOUNCE + ON-SALE LATE OCT"];
