/* ─────────────────────────────────────────────────────────
 * e/MOTION TOUR 2026 — Summary page data
 *
 * Private, venue-facing recap. Curated toplines only:
 * NO dollar figures, NO deal terms, NO buyer PII.
 *
 * Media paths marked PLACEHOLDER re-use existing site assets —
 * swap for real tour photos/clips by editing the path only.
 * ───────────────────────────────────────────────────────── */

import { HERO_VIDEO_R2 } from "../../data/content";

export const TOUR_META = {
  title: "THE_EFFECT TOUR",
  year: "2026",
  subline: "Live audio-visual set",
  kicker: "First regional tour · Six shows, five cities",
  // PLACEHOLDER — swap for real tour recap footage
  heroVideo: "/E_video_loop.mp4",
};

/* One entry per stop, in routing order.
 * Copy discipline: fragments, not sentences. Facts only. */
export const TOUR_STOPS = [
  {
    idx: "01",
    city: "Austin",
    state: "TX",
    venue: "Stardust Garage",
    operator: null,
    dateLabel: "SAT NOV 22 2025",
    stat: "SOLD OUT",
    statLabel: "600 / 600",
    soldOut: true,
    points: [
      "First performance of THE_EFFECT live set",
    ],
    // Nov 22 warehouse show — same R2 clip the hero uses (136s long),
    // started mid-clip so it doesn't mirror the hero frame-for-frame.
    video: HERO_VIDEO_R2,
    videoAspect: "16 / 9",
    videoStart: 70,
    // PLACEHOLDER — swap for Stardust Garage show photo
    photo: "/photos/live-6.jpg",
  },
  {
    idx: "02",
    city: "Denver",
    state: "CO",
    venue: "Larimer Lounge",
    operator: "AEG Presents",
    dateLabel: "FRI APR 17",
    stat: "SOLD OUT",
    statLabel: "250 / 250",
    soldOut: true,
    points: [
      "First show of the 2026 run",
      "Sold-out show in an AEG venue",
      "Return date requested — Richmond & Portland booking leads via venue staff",
    ],
    video: "/tour/denver-montage.mp4",
    videoAspect: "3 / 4",
    // PLACEHOLDER — swap for Denver show photo
    photo: "/photos/live-1.jpg",
  },
  {
    idx: "03",
    city: "Dallas",
    state: "TX",
    venue: "Deep Ellum Art Co.",
    operator: null,
    dateLabel: "FRI MAY 29",
    stat: "224",
    statLabel: "Tickets · 550 cap",
    soldOut: false,
    points: [
      "The test market — every ticket tracked to its source",
      "Promoter partnerships · paid Meta ads · organic TikTok & Instagram",
      "TikTok converted highest by far — set the strategy for the rest of the run",
    ],
    showAttribution: true,
    video: "/tour/dallas-montage.mp4",
    videoAspect: "9 / 16",
    // PLACEHOLDER — swap for Dallas show photo
    photo: "/photos/live-2.jpg",
  },
  {
    idx: "04",
    city: "San Antonio",
    state: "TX",
    venue: "1902 Nightclub",
    operator: null,
    dateLabel: "THU JUN 4",
    stat: "1,035",
    statLabel: "RSVPs · 800 cap",
    soldOut: false,
    points: [],
    video: "/tour/san-antonio-montage.mp4",
    videoAspect: "4 / 3",
    // PLACEHOLDER — swap for San Antonio show photo
    photo: "/photos/live-3.jpg",
  },
  {
    idx: "05",
    city: "Austin",
    state: "TX",
    venue: "3TEN at ACL Live",
    operator: "Live Nation / C3",
    dateLabel: "THU JUN 11",
    stat: "212",
    statLabel: "Tickets · 360 cap",
    soldOut: false,
    points: [
      "Debuted a live fan camera in the set — crowd projected onto the LED wall in real time",
    ],
    video: "/tour/austin-montage.mp4",
    videoAspect: "16 / 9",
    // PLACEHOLDER — swap for Austin show photo
    photo: "/photos/live-4.jpg",
  },
  {
    idx: "06",
    city: "McAllen",
    state: "TX",
    venue: "La Bandida Vivo Bar",
    operator: "Upbeat Live",
    dateLabel: "SAT JUN 20",
    stat: "350 / 350",
    statLabel: "Sold out",
    soldOut: true,
    points: ["140K-view TikTok drove the sellout"],
    tiktok: {
      videoId: "7651755227023969549",
      label: "Watch the TikTok · 140K views",
    },
    video: "/tour/mcallen-montage.mp4",
    videoAspect: "9 / 16",
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
  { label: "Fans reached", value: "2,470+" },
  { label: "Sellouts", value: "3" },
  { label: "Instagram", value: "7K → 10.5K" },
  { label: "TikTok", value: "30K → 34K" },
];

/* The finding. One lead line, quiet receipts under it. */
export const FINDING = {
  lead: "TikTok sold this tour.",
  lines: [
    "~65% of tickets came from organic discovery — led by TikTok. Paid ads: 7%.",
    "A single TikTok hit 140K views and sold out McAllen.",
    "30K → 34K followers over the run. Tickets sold direct — fan data from every stop is in the vault.",
  ],
};
