/* ─────────────────────────────────────────────────────────
 * Fri Nov 20 2026 — Stardust Garage vs The Baths
 *
 * Private, one reader (Emma). Sources: the Stardust deal as agreed with
 * Adam; The Baths promoter agreement (NineTill, 11/20/2026) and decks;
 * public research in SOURCES. Ticket price = last year's Stardust average
 * before 2AM ($14,911 / 566), same tiers at both rooms.
 * ───────────────────────────────────────────────────────── */

export const META = {
  date: "FRI NOV 20 2026",
  prepared: "Oct 16 2026",
};

export const AVG_TICKET = 14911 / 566;

/* Each room's costs, every line. */
export const VENUES = {
  sd: {
    name: "Stardust",
    share: 0.7,
    costs: { show: 4000, lights: 0, door: 0 },
  },
  bt: {
    name: "The Baths",
    share: 1,
    costs: { show: 4000, lights: 1500, door: 250 },
  },
};

/* Each room at what it can realistically sell: at capacity, and with
 * the room turning over. */
export const SCENARIOS = [
  { venue: "sd", tickets: 400, note: "at capacity" },
  { venue: "sd", tickets: 566, note: "last year's actual" },
  { venue: "bt", tickets: 350, note: "at capacity" },
  { venue: "bt", tickets: 450, note: "100 over cap" },
];

export const BOTTOM_LINE = [
  "The money is close. At capacity both rooms pay about $3.4K. With turnover, Stardust pays ~$6.4K and the Baths ~$6.1K.",
  "Stardust's number already happened last year. The Baths' needs 100 people past capacity in a 10PM–2AM night.",
  "So decide on risk and the show. Stardust includes lights, sound and rehearsal, with no bar minimum. The Baths looks better but adds a lighting rental, a $5K bar minimum and a midnight takeover clause.",
];

export const PROS_CONS = {
  stardust: {
    pros: [
      "Sold 601 here last year on a 400 room.",
      "Lights, L-Acoustics and staff included. Nothing to rent.",
      "Load in early and rehearse the live set.",
      "No bar minimum.",
      "Runs to 3AM — catches the Kaskade crowd leaving Concourse around 1AM.",
    ],
    cons: [
      "She keeps 70%: $18.44 a ticket vs $26.34 at the Baths.",
      "Every ticket after 2:30 goes to Stardust.",
      "She pays the DJs until 2:30.",
      "South Austin destination. No walk-ins.",
      "A return to last year's room, not a new one.",
    ],
  },
  baths: {
    pros: [
      "100% of the door: $26.34 a ticket.",
      "Venue rental waived.",
      "Looks like [BLACKOUT] — red-lit, underground, concrete.",
      "Downtown walk-ins.",
      "Void subs. Big low end.",
    ],
    cons: [
      "No real lights. ~$1,500 rental plus her own load-in.",
      "350 room. Beating capacity means overselling a 4-hour night.",
      "$5,000 bar minimum. She pays any gap that night.",
      "Under $2K at the bar by midnight: the venue can take the door, go free, or end early.",
      "Hard 2AM finish. $200/hr after.",
      "Four columns on the dance floor. Booth on the end wall. Weak sightlines for visuals.",
      "Cancel late: $2,500 inside 2 weeks, $5,000 inside 1.",
    ],
  },
};

export const ASK = [
  [
    "Baths",
    "What's the occupant load on the permit, and how far past it can we sell?",
  ],
  ["Baths", "Do VIP and bottle sales count toward the $5,000 minimum?"],
  ["Baths", "Strike the midnight clause."],
  ["Baths", "Load-in time and power for our lights."],
  [
    "Stardust",
    "Get 70/30 to 2:30, the DJ split and the ticket count in writing.",
  ],
];

export const SOURCES = [
  [
    "Stardust venue rental — sound, lights, staff",
    "https://www.sdgatx.com/venue-rental",
  ],
  ["The Baths — promoter agreement + decks", null],
  [
    "Lighting package pricing, Austin",
    "https://thepenn.group/residential/gear-rentals/austin/",
  ],
  ["Void Stasys XV2", "https://voidacoustics.com/products/stasys/stasysxv2/"],
  [
    "Yorkville PSA1",
    "https://yorkville.com/loudspeakers/paraline/product/psa1",
  ],
  ["AFD night inspections", "https://austintexas.gov/content/969/faq/5247"],
  ["Kaskade, Fri Nov 20", "https://www.axs.com/events/1594252/kaskade-tickets"],
];
