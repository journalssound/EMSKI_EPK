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
  title: "THE_EFFECT TOUR",
  year: "2026",
  subline: "Live audio-visual set",
  kicker: "First regional tour · Five cities · April – June 2026",
  // PLACEHOLDER — swap for real tour recap footage
  heroVideo: "/E_video_loop.mp4",
};

/* One entry per stop, in routing order.
 * Copy discipline: fragments, not sentences. Facts only. */
export const TOUR_STOPS = [
  {
    idx: "01",
    city: "Denver",
    state: "CO",
    venue: "Larimer Lounge",
    operator: "AEG Presents",
    dateLabel: "FRI APR 17",
    stat: "SOLD OUT",
    statLabel: "250 / 250",
    soldOut: true,
    points: [
      "First show of tour",
      "Sold-out show in an AEG venue",
      "Return date requested — Richmond & Portland booking leads via venue staff",
    ],
    // PLACEHOLDER — swap for Denver show photo
    photo: "/photos/live-1.jpg",
  },
  {
    idx: "02",
    city: "Dallas",
    state: "TX",
    venue: "Deep Ellum Art Co.",
    operator: null,
    dateLabel: "FRI MAY 29",
    stat: "204",
    statLabel: "Tickets · 550 cap",
    soldOut: false,
    points: [
      "The test market — every ticket tracked to its source",
      "Promoter partnerships · paid Meta ads · organic TikTok & Instagram",
      "TikTok converted highest by far — set the strategy for the rest of the run",
    ],
    showAttribution: true,
    // PLACEHOLDER — swap for Dallas show photo
    photo: "/photos/live-2.jpg",
  },
  {
    idx: "03",
    city: "San Antonio",
    state: "TX",
    venue: "1902 Nightclub",
    operator: null,
    dateLabel: "THU JUN 4",
    stat: "941",
    statLabel: "RSVPs · 800 cap",
    soldOut: false,
    points: [],
    // PLACEHOLDER — swap for San Antonio show photo
    photo: "/photos/live-3.jpg",
  },
  {
    idx: "04",
    city: "Austin",
    state: "TX",
    venue: "3TEN at ACL Live",
    operator: "Live Nation / C3",
    dateLabel: "THU JUN 11",
    stat: "193",
    statLabel: "Tickets · 360 cap",
    soldOut: false,
    points: [
      "Debuted a live fan camera in the set — crowd projected onto the LED wall in real time",
    ],
    // PLACEHOLDER — swap for Austin show photo
    photo: "/photos/live-4.jpg",
  },
  {
    idx: "05",
    city: "McAllen",
    state: "TX",
    venue: "La Bandida Vivo Bar",
    operator: "Upbeat Live",
    dateLabel: "SAT JUN 20",
    stat: "350 / 350",
    statLabel: "Sold out",
    soldOut: true,
    points: ["120K-view TikTok drove the sellout"],
    tiktok: {
      videoId: "7651755227023969549",
      label: "Watch the TikTok · 120K views",
    },
    // PLACEHOLDER — swap for McAllen show photo
    photo: "/photos/live-5.jpg",
  },
];

/* Ticket attribution (Dallas, fully-tracked show) — % of tickets.
 * Rendered inside the Dallas section. */
export const ATTRIBUTION_TITLE = "Ticket breakdown — by source";
export const ATTRIBUTION = [
  { source: "Organic / word of mouth", pct: 65, organic: true },
  { source: "Door walk-up", pct: 18, organic: true },
  { source: "Paid ads", pct: 7, organic: false },
  { source: "Promoters", pct: 5, organic: false },
  { source: "Venue site", pct: 4, organic: false },
];

/* Aggregate strip after the cities. Numbers only. */
export const TOTALS = [
  { label: "Fans reached", value: "1,700+" },
  { label: "Sellouts", value: "2" },
  { label: "Instagram", value: "7K → 10.5K" },
  { label: "TikTok", value: "30K → 34K" },
];

/* The finding. One lead line, quiet receipts under it. */
export const FINDING = {
  lead: "TikTok sold this tour.",
  lines: [
    "~65% of tickets came from organic discovery — led by TikTok. Paid ads: 7%.",
    "A single TikTok hit 120K views and sold out McAllen.",
    "30K → 34K followers over the run. Tickets sold direct — fan data from every stop is in the vault.",
  ],
};

/* Winter run — the ask. */
export const NEXT_TOUR = {
  heading: "Winter 2026 – Spring 2027",
  body: "Booking now.",
  leads: [
    {
      title: "Denver",
      // PLACEHOLDER — name the specific venues / contact when provided
      body: "Return dates requested. [Venues TBC]",
    },
    {
      title: "Rio Grande Valley",
      body: "Return routing in discussion with Upbeat Live.",
    },
    {
      title: "Arizona",
      body: "Booking lead via Ekonovah's team.",
    },
    {
      title: "Richmond",
      body: "Venue interest — Gallery5, Rhythm City Collective.",
    },
    {
      title: "New markets",
      body: "Inbound fan demand via Reddit — San Francisco, Los Angeles, Chicago, Portland.",
    },
  ],
  contactEmail: "contact@emskimusic.com",
};
