/* ─────────────────────────────────────────────────────────
 * Stardust Garage — Nov 21 2026 proposal, v2
 *
 * Same show, same last-year numbers as v1. What changed: the venue pushed
 * back on 80/20, so v2 puts two deals side by side and shows what each
 * side walks away with. Projections assume a 600 sellout on last year's
 * tiers; the bar is held at last year's figure.
 * ───────────────────────────────────────────────────────── */

export const PITCH_V2_META = {
  prepared: "Oct 2026",
  version: "v2",
};

/* Two deals. `guarantee` is paid to EMSKI off the top of ticket gross; the
 * rest of the tickets to 3AM split at `emskiShare`. After 3AM stays 50/50
 * in both, bar stays 100% Stardust in both. */
export const DEALS = [
  {
    key: "A",
    name: "80 / 20",
    sub: "NO GUARANTEE",
    guarantee: 0,
    emskiShare: 0.8,
    terms: ["TICKETS TO 3AM — 80/20", "AFTER 3AM — 50/50", "BAR — 100% STARDUST"],
  },
  {
    key: "B",
    name: "$5K + 60 / 40",
    sub: "$5,000 GUARANTEE TO EMSKI · OFF THE TOP",
    guarantee: 5000,
    emskiShare: 0.6,
    terms: ["REMAINING TICKETS TO 3AM — 60/40", "AFTER 3AM — 50/50", "BAR — 100% STARDUST"],
  },
];

export const NEXT_V2 = ["HOLD SAT NOV 21", "PICK A OR B", "ANNOUNCE + ON-SALE LATE OCT"];
