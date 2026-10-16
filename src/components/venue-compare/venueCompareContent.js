/* ─────────────────────────────────────────────────────────
 * Fri Nov 20 2026 — Stardust Garage vs The Baths
 *
 * Private, one reader (Emma). Sources: the Stardust deal as agreed with
 * Adam; The Baths promoter agreement (NineTill, 11/20/2026) and both Baths
 * decks; public research listed in SOURCES. Ticket math uses last year's
 * Stardust numbers (Posh dashboard, Nov 22 2025).
 * ───────────────────────────────────────────────────────── */

export const META = {
  date: "FRI NOV 20 2026",
  prepared: "Oct 16 2026",
};

/* Last year's Stardust night, before 2AM — the ticket base for both rooms.
 * Costs are this year's lowered figure, the same base at either venue. */
export const BASE = {
  ticketsTo2am: 566,
  grossTo2am: 14911,
  costs: 4000,
};

export const STARDUST = {
  name: "Stardust Garage",
  short: "Stardust",
  emskiShare: 0.7,
  extraCosts: [],
};

export const BATHS = {
  name: "The Baths",
  short: "Baths",
  emskiShare: 1,
  /* What the Baths adds on top of the base. Lighting: Austin's 8-mover +
   * haze packages start ~$900/day before delivery, setup and an operator. */
  extraCosts: [
    { label: "lighting rig", amount: 1500 },
    { label: "ticket staff", amount: 250 },
  ],
  scenarios: [350, 400, 450],
};

export const BOTTOM_LINE = [
  "Stardust: ~$6.4K walkaway. The Baths at a 350 sellout: ~$3.5K.",
  "The Baths needs 463 tickets — 113 over its 350 cap — just to match. That means counting on people leaving a 10PM–2AM night.",
  "Stardust is the better show and the safer night: lights included, L-Acoustics, rehearsal, no bar minimum. The Baths is the better look.",
];

/* Side by side. Each row: label, Stardust, Baths. */
export const SPECS = [
  [
    "Deal",
    "70/30 to EMSKI until 2:30AM. 100% Stardust after 2:30.",
    "100% of the door to EMSKI. Rental waived.",
  ],
  [
    "Costs",
    "~$4,000.",
    "~$4,000 + lighting rig (~$1.5K) + ticket staff. Plus any bar shortfall.",
  ],
  [
    "Bar",
    "100% Stardust. No minimum in the terms we have.",
    "100% venue. $5,000 minimum — any shortfall is EMSKI's, paid that night.",
  ],
  [
    "Room",
    "400 capacity. Sells past it as the room turns over — 601 sold last year.",
    "300–350. No ROMA. Plan is to sell past 350 and count on people leaving.",
  ],
  [
    "Hours",
    "Runs past 2AM. EMSKI plays to 3AM.",
    "10PM–2AM. $200/hr after 2AM.",
  ],
  [
    "Talent",
    "EMSKI pays DJs until 2:30. Stardust pays after.",
    "EMSKI pays every DJ.",
  ],
  [
    "Sound",
    "L-Acoustics in a purpose-built, acoustically treated room.",
    'Void Stasys XV2 subs (dual 18"). Tops are Yorkville Paraline PSA1.',
  ],
  [
    "Lighting",
    "Full house rig: moving heads, washes, haze, programmed scenes.",
    "No real lighting. EMSKI rents a full rig and installs it before doors.",
  ],
  ["Booth", "3× CDJ-3000, DJM-V10.", "3× CDJ-3000, A9, RMX-1000."],
  [
    "Setup",
    "Early load-in and full rehearsal.",
    "Before doors only. 3 days' notice for special gear. Load-in by elevator/stairs.",
  ],
  [
    "Staff",
    "Bar, security, ticket scanning in-house.",
    "2 guards. EMSKI supplies the ticket team, or $25/hr.",
  ],
  [
    "Location",
    "South Austin warehouse. A destination.",
    "Downtown, 3rd & San Jacinto. Below ground, alley entrance.",
  ],
];

export const PROS_CONS = {
  stardust: {
    pros: [
      "Proven past capacity — 601 sold on a 400 room last November.",
      "Lighting rig in-house. Saves a ~$1.5K rental and a load-in.",
      "L-Acoustics, tuned to the room.",
      "Early load-in and a real rehearsal.",
      "No bar minimum, no takeover clause.",
      "DJ cost stops at 2:30 — Stardust pays after.",
      "Runs late enough to catch the Kaskade crowd leaving Concourse around 1AM.",
      "One year since THE_EFFECT debuted here. First [BLACKOUT] night in the same room.",
    ],
    cons: [
      "EMSKI keeps 70%. Stardust takes ~$4.5K of a sellout's tickets.",
      "Every ticket after 2:30 is Stardust's. The late crowd pays them, not her.",
      "EMSKI still pays DJs until 2:30.",
      "A return, not a reveal — less new-story value.",
      "South Austin destination. No walk-in traffic.",
      "Selling past 400 still depends on people leaving — it worked last year.",
    ],
  },
  baths: {
    pros: [
      "100% of the door is hers.",
      "Venue rental waived.",
      "The look is pure [BLACKOUT] — red-lit, underground, concrete columns.",
      "Void Stasys XV2 subs: serious low end for techno.",
      "Already a house/techno room — Auricle, Julian Fijma, after-hours nights.",
      "Downtown: walk-ins, easy rideshare, near hotels.",
      "Late set is cheap — $200/hr, and the door after 2AM is still 100% hers.",
      "A new room — a new chapter.",
    ],
    cons: [
      "Smaller room. At 350 she walks with ~$3.5K vs ~$6.4K at Stardust.",
      "No lighting package. Renting a rig (~$1.5K) and loading it in is on her.",
      "Overselling 350 in a 4-hour night is a bet. The door is run by the venue's two guards.",
      "AFD night inspections count heads against occupant load downtown — fines, or the room gets cleared.",
      "$5,000 bar minimum. Any shortfall is hers, due that night.",
      "Midnight clause: under $2K bar by 12AM, the venue can take the door, go free entry, or end early.",
      'Only the subs are Void. Tops are compact Yorkville boxes, not "world-class."',
      "Four columns in the dance floor. Booth on the end wall between VIP — weak sightlines for visuals.",
      "Hard 2AM finish. Bar closes at 2AM, so the minimum has to land before then.",
      "She pays all talent and the ticket team. 2 guards for 350+.",
      'No comp drinks. Artist bottle only for "larger talent," plus 20% gratuity.',
      "Cancel inside 2 weeks: $2,500. Inside 1 week: $5,000.",
      "No rehearsal time stated. Untested for her crowd.",
    ],
  },
};

export const ASK_BATHS = [
  "Occupant load on the permit for the Baths room?",
  "How far past 350 will they let us sell — and who holds the door once it's full?",
  "Do VIP and bottle sales count toward the $5,000 minimum?",
  "Strike the midnight clause, or move the check to 1AM.",
  "Load-in time, power and rigging points for our lighting rig.",
  "Playing to 3AM: confirm $200, and that post-2AM tickets stay 100% ours.",
];

export const ASK_STARDUST = [
  "Get 70/30 to 2:30, the DJ split, and the ticket count past 400 in writing.",
];

export const SAME_WEEK = [
  [
    "FRI NOV 20",
    "Kaskade — Concourse Project, outdoors, ~8PM–1AM. Fights for the early crowd, feeds a late one.",
  ],
  ["SAT NOV 21", "Eric Prydz — Concourse Project."],
  [
    "NOV 13–15",
    "Seismic 9.0 — Austin's techno crowd spends big the weekend before.",
  ],
];

export const SOURCES = [
  [
    "Stardust — venue rental (sound, lighting, booth, staff)",
    "https://www.sdgatx.com/venue-rental",
  ],
  ["The Baths — promoter agreement + decks (NineTill)", null],
  [
    "Void Stasys XV2 spec",
    "https://voidacoustics.com/products/stasys/stasysxv2/",
  ],
  [
    "Yorkville Paraline PSA1 spec",
    "https://yorkville.com/loudspeakers/paraline/product/psa1",
  ],
  [
    "Lighting package pricing — The Penn Group, Austin",
    "https://thepenn.group/residential/gear-rentals/austin/",
  ],
  [
    "AFD night inspections — City of Austin FAQ",
    "https://austintexas.gov/content/969/faq/5247",
  ],
  [
    "Kaskade, Fri Nov 20 — AXS",
    "https://www.axs.com/events/1594252/kaskade-tickets",
  ],
  [
    "Eric Prydz, Sat Nov 21 — SeatGeek",
    "https://seatgeek.com/eric-prydz-tickets/austin",
  ],
  ["Seismic 9.0", "https://www.seismicdanceevent.com/"],
  ["The Baths on RA", "https://ra.co/clubs/us/austin"],
];
