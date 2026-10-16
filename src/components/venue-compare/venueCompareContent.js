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

/* Last year's Stardust night, before 2AM — the base for both venues. */
export const BASE = {
  ticketsTo2am: 566,
  grossTo2am: 14911,
  costs: [
    { label: "Production", amount: 3000 },
    { label: "DJs + event staff", amount: 3000 },
    { label: "Marketing", amount: 1000 },
  ],
};

export const STARDUST = {
  name: "Stardust Garage",
  emskiShare: 0.7,
  extraCosts: 0,
};

export const BATHS = {
  name: "The Baths",
  emskiShare: 1,
  /* Ticketing team: 2 people × 5 hrs × $25 (the venue's rate). */
  extraCosts: 250,
  scenarios: [350, 400],
};

export const BOTTOM_LINE = [
  "On the numbers we have, Stardust pays more and carries less risk.",
  "The Baths only wins if it can sell 406+ tickets. The first two questions in section 06 settle that.",
  "The Baths is the better look. Stardust is the better show: lights, sound, rehearsal time, and no bar minimum.",
];

/* Side by side. Each row: label, Stardust, Baths. */
export const SPECS = [
  [
    "Deal",
    "70/30 to EMSKI until 2:30AM. 100% Stardust after 2:30.",
    "100% of the door to EMSKI. Rental waived.",
  ],
  [
    "Bar",
    "100% Stardust. No minimum in the terms we have.",
    "100% venue. $5,000 minimum — any shortfall is EMSKI's, paid that night.",
  ],
  [
    "Room",
    "~400 capacity. Up to 600 tickets across the night.",
    "300–350 (Baths room). One deck says 400. 450–650 if ROMA is opened up.",
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
    "Ambient red uplighting. Extra production is EMSKI's, installed before doors.",
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
      "Proven room — 601 sold here last November.",
      "Full lighting rig in-house. The live A/V set needs nothing rented.",
      "L-Acoustics, tuned to the room.",
      "Early load-in and a real rehearsal.",
      "600 tickets on a ~400 room — the longer night turns the room over.",
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
      "600 tickets only works if people leave. If they stay, the door has to hold at ~400.",
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
      "If ROMA opens up (450–650) and it sells, she out-earns Stardust.",
      "A new room — a new chapter.",
    ],
    cons: [
      "Smaller room. At 350 she walks with ~$2.0K vs ~$3.4K at Stardust.",
      "$5,000 bar minimum. Any shortfall is hers, due that night.",
      "Midnight clause: under $2K bar by 12AM, the venue can take the door, go free entry, or end early.",
      "Lighting is ambient. A live A/V show means renting a rig — her cost.",
      'Only the subs are Void. Tops are compact Yorkville boxes, not "world-class."',
      "Four columns in the dance floor. Booth on the end wall between VIP — weak sightlines for visuals.",
      "Hard 2AM finish. Bar closes at 2AM, so the minimum has to land before then.",
      "She pays all talent, the ticket team, and maybe extra security — 2 guards for 350+.",
      'No comp drinks. Artist bottle only for "larger talent," plus 20% gratuity.',
      "Cancel inside 2 weeks: $2,500. Inside 1 week: $5,000.",
      "No rehearsal time stated. Untested for her crowd.",
    ],
  },
};

export const ASK_BATHS = [
  "Fire-marshal capacity for the Baths room alone? Is ROMA included on Nov 20?",
  "Is there a ticket cap, or can we sell past capacity as people turn over?",
  "Do VIP and bottle sales count toward the $5,000 minimum?",
  "Strike the midnight clause, or move the check to 1AM.",
  "Lighting inventory — movers, haze, DMX access? Earliest load-in?",
  "Playing to 3AM: confirm $200, and that post-2AM tickets stay 100% ours.",
];

export const ASK_STARDUST = [
  "Get 70/30 to 2:30, the DJ split, and the 600-ticket count in writing.",
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
