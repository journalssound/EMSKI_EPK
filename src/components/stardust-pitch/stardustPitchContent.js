/* ─────────────────────────────────────────────────────────
 * Stardust Garage — Nov 21 2026 proposal
 *
 * Private, one recipient (Adam, Stardust Garage). Numbers only, no prose.
 * Last year's ticketing fields come from the ticketing screenshot; null
 * renders as "—" until filled, and the projections stay blank until
 * `gross` and `sold` exist.
 * ───────────────────────────────────────────────────────── */

export const PITCH_META = {
  venue: "Stardust Garage",
  city: "Austin, TX",
  preparedFor: "Adam · Stardust Garage",
  prepared: "Sep 2026",
  contactEmail: "contact@emskimusic.com",
};

/* Nov 22 2025 — the first THE_EFFECT show. Ticketing fields TBD from the
 * screenshot; deal terms and bar figure from the artist. */
export const LAST_YEAR = {
  dateLabel: "SAT NOV 22 2025",
  capacity: 600,
  sold: 600,
  gross: null, // total ticket gross, $
  avgPrice: null, // gross / sold
  pre2am: { tickets: null, gross: null },
  post2am: { tickets: null, gross: null },
  bar: 16000, // Stardust's bar take, approx.
  deal: [
    ["TICKETS TO 2AM", "100% EMSKI"],
    ["TICKETS AFTER 2AM", "100% STARDUST"],
    ["BAR", "100% STARDUST"],
  ],
};

/* What happened after that show — the run it launched. */
export const SINCE = [
  "THE_EFFECT TOUR · APR–JUN 2026 · DENVER / DALLAS / SAN ANTONIO / AUSTIN / MCALLEN",
  "2 MORE SELLOUTS — LARIMER LOUNGE, DENVER (AEG) · LA BANDIDA, MCALLEN",
  "65% OF TICKETS ORGANIC, TIKTOK-LED · PAID ADS 7%",
  "ONE TIKTOK → 140K VIEWS → MCALLEN SOLD OUT",
  "DIRECT SUPPORT FOR AMELIE LENS — THE CONCOURSE PROJECT, [BLACKOUT] SET",
  "FOLLOWERS 42.3K → 53K · STREAMS 3.15M → 4.08M (FEB → SEP)",
];

/* The ask. */
export const PROPOSAL = {
  dateLabel: "SAT NOV 21 2026",
  format: "EMSKI LIVE SET → [BLACKOUT] DJ SET — FIRST [BLACKOUT] SHOW",
  capacity: 600,
  deal: [
    ["TICKETS TO 2AM", "80% EMSKI / 20% STARDUST"],
    ["TICKETS AFTER 2AM", "100% STARDUST"],
    ["BAR", "100% STARDUST"],
  ],
  emskiShare: 0.8,
  /* Price levers on last year's average — filled once avgPrice exists. */
  scenarios: [
    { label: "REPEAT", tickets: 600, priceDelta: 0 },
    { label: "+$5", tickets: 600, priceDelta: 5 },
    { label: "+$10", tickets: 600, priceDelta: 10 },
  ],
};

export const NEXT = ["HOLD SAT NOV 21", "CONFIRM 80/20 TO 2AM", "ANNOUNCE + ON-SALE LATE OCT"];
