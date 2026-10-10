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

/* v2 show: Friday, changeover back to 2AM. Tickets after 2AM split 50/50 in
 * both deals — and last year's 35 afters tickets give that bucket a number. */
export const SHOW_V2 = {
  dateLabel: "FRI NOV 20 2026",
  dateShort: "FRI NOV 20",
  changeover: "2AM",
  emskiShareAfter: 0.5,
};

/* Two deals. `guarantee` is paid to EMSKI off the top of the to-2AM gross;
 * the rest of those tickets split at `emskiShare`. Bar stays 100% Stardust. */
export const DEALS = [
  {
    key: "A",
    name: "80 / 20",
    sub: "NO GUARANTEE",
    guarantee: 0,
    emskiShare: 0.8,
    terms: ["TICKETS TO 2AM — 80/20", "AFTER 2AM — 50/50", "BAR — 100% STARDUST"],
  },
  {
    key: "B",
    name: "$5K + 60 / 40",
    sub: "$5,000 GUARANTEE TO EMSKI · OFF THE TOP",
    guarantee: 5000,
    emskiShare: 0.6,
    terms: ["REMAINING TICKETS TO 2AM — 60/40", "AFTER 2AM — 50/50", "BAR — 100% STARDUST"],
  },
];

export const NEXT_V2 = ["HOLD FRI NOV 20", "PICK A OR B", "ANNOUNCE + ON-SALE LATE OCT"];
