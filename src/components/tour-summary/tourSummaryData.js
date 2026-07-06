/* ─────────────────────────────────────────────────────────
 * e/MOTION TOUR 2026 — Summary page data
 *
 * Private, venue-facing recap. Curated toplines only:
 * NO dollar figures, NO deal terms, NO buyer PII.
 *
 * Media paths marked PLACEHOLDER re-use existing site assets —
 * swap for real tour photos/clips by editing the path only.
 * ───────────────────────────────────────────────────────── */

export const TOUR_META = {
  title: "e/MOTION TOUR",
  year: "2026",
  tagline: "Debut headline run · Colorado + Texas",
  heroLine: "5 cities. 8 weeks. 1,700+ fans. Two sellouts.",
  // PLACEHOLDER — swap for real tour recap footage
  heroVideo: "/E_video_loop.mp4",
};

/* One entry per stop, in routing order. */
export const TOUR_STOPS = [
  {
    city: "Denver",
    state: "CO",
    venue: "Larimer Lounge",
    operator: "AEG Presents",
    date: "2026-04-17",
    dateLabel: "APR 17",
    capacity: 250,
    headline: "SOLD OUT",
    soldOut: true,
    stat: "250 / 250",
    result: "Sold out night one of the run — full room in an AEG-operated venue.",
    // PLACEHOLDER — swap for Denver show photo
    photo: "/photos/live-1.jpg",
    /* stylized map coordinates (viewBox 1000×560) */
    mapX: 205,
    mapY: 115,
    labelSide: "left",
  },
  {
    city: "Dallas",
    state: "TX",
    venue: "Deep Ellum Art Co.",
    operator: "Deep Ellum Art Co.",
    date: "2026-05-29",
    dateLabel: "MAY 29",
    capacity: 550,
    headline: "200+ TICKETS",
    soldOut: false,
    stat: "200+",
    result: "200+ tickets in a 550-cap room, powered by a 49-ambassador street team.",
    // PLACEHOLDER — swap for Dallas show photo
    photo: "/photos/live-2.jpg",
    mapX: 640,
    mapY: 255,
    labelSide: "right",
  },
  {
    city: "San Antonio",
    state: "TX",
    venue: "1902",
    operator: "1902 SATX",
    date: "2026-06-04",
    dateLabel: "JUN 4",
    capacity: 800,
    headline: "~700 RSVPs",
    soldOut: false,
    stat: "~700",
    result: "Roughly 700 RSVPs in an 800-cap room on one week of promo.",
    // PLACEHOLDER — swap for San Antonio show photo
    photo: "/photos/live-3.jpg",
    mapX: 555,
    mapY: 405,
    labelSide: "left",
  },
  {
    city: "Austin",
    state: "TX",
    venue: "3TEN at ACL Live",
    operator: "Live Nation / C3 Presents",
    date: "2026-06-11",
    dateLabel: "JUN 11",
    capacity: 360,
    headline: "193 TICKETS",
    soldOut: false,
    stat: "193",
    result: "193 tickets at ACL Live's club room — first Live Nation / C3 date.",
    // PLACEHOLDER — swap for Austin show photo
    photo: "/photos/live-4.jpg",
    mapX: 625,
    mapY: 330,
    labelSide: "right",
  },
  {
    city: "McAllen",
    state: "TX",
    venue: "via Upbeat Live", // PLACEHOLDER — confirm final venue name
    operator: "Upbeat Live",
    date: "2026-06-20", // PLACEHOLDER — confirm final date
    dateLabel: "JUN",
    capacity: 350,
    headline: "SOLD OUT",
    soldOut: true,
    stat: "~350",
    result: "Sold-out finale — first show in the Rio Grande Valley market.",
    // PLACEHOLDER — swap for McAllen show photo
    photo: "/photos/live-5.jpg",
    mapX: 585,
    mapY: 500,
    labelSide: "right",
  },
];

/* Headline counters — AnimNum-ready. */
export const HEADLINE_STATS = [
  { label: "CITIES", val: 5, suf: "" },
  { label: "FANS REACHED", val: 1700, suf: "+" },
  { label: "SOLD-OUT SHOWS", val: 2, suf: "" },
  { label: "IG GROWTH ON TOUR", val: 50, suf: "%" },
];

/* What worked — ranked findings. TikTok IS the organic engine:
 * unpaid social discovery converts to direct buys + walk-ups. */
export const FINDINGS = [
  {
    num: "01",
    title: "TikTok drove the demand — organically",
    body:
      "Ticket attribution shows ~65% of sales came from unpaid discovery, led by TikTok, versus ~7% from paid ads. The audience finds EMSKI on TikTok and buys direct — the draw fills rooms without ad spend.",
  },
  {
    num: "02",
    title: "Social audience grew every week of the run",
    body:
      "Instagram grew +50% over the tour window; TikTok added 4,000 followers on top of a 30K base. Every date compounded the next.",
  },
  {
    num: "03",
    title: "Fan data captured in every city",
    body:
      "Emails and fan data collected at all five stops, routed into the EMSKI vault — a direct channel to remarket every market on the next run.",
  },
];

/* Ticket attribution (Dallas, fully-tracked show) — % of tickets. */
export const ATTRIBUTION = [
  { source: "Organic / word of mouth", pct: 65, organic: true },
  { source: "Walk-up at the door", pct: 18, organic: true },
  { source: "Paid ads", pct: 7, organic: false },
  { source: "Ambassador links", pct: 5, organic: false },
  { source: "Venue website", pct: 4, organic: false },
];

/* Before → after social growth. */
export const SOCIAL_GROWTH = [
  { platform: "Instagram", before: "7K", after: "10.5K", delta: "+50%" },
  { platform: "TikTok", before: "30K", after: "34K", delta: "+4K" },
];

/* Winter tour — proof of inbound demand. */
export const NEXT_TOUR = {
  heading: "The ask: a winter run",
  body:
    "e/MOTION proved the draw is real in five markets. The next window is winter 2026–27 — bigger rooms in proven cities, plus the markets already asking.",
  leads: [
    {
      title: "Denver — return dates requested",
      // PLACEHOLDER — name the specific venues / contact when provided
      body: "[DENVER VENUE LEAD — production contact from the Larimer date has requested EMSKI for her rooms. Names to be confirmed.]",
    },
    {
      title: "Rio Grande Valley — market unlocked",
      body: "The McAllen sellout opened the RGV. Return routing is in discussion with Upbeat Live.",
    },
  ],
  contactEmail: "contact@emskimusic.com",
};

export const OPERATORS = [
  "AEG Presents",
  "Live Nation / C3",
  "Deep Ellum Art Co.",
  "Upbeat Live",
];
