/**
 * Public-facing site content (fan-facing, lives at /website-draft).
 *
 * Isolated from src/data/content.js — that module is industry/EPK-facing.
 */

import {
  SOCIALS as EPK_SOCIALS,
  YOUTUBE_EMBED_URL,
  HERO_VIDEO_R2,
} from "../../data/content.js";

/* ─── Tour ────────────────────────────────────────────────────────────────
 * Single flat list. Each show uses an ISO date string (YYYY-MM-DD).
 * The render layer auto-splits upcoming vs. past based on today's date,
 * so this list never needs pruning.
 * ──────────────────────────────────────────────────────────────────────── */
export const SHOWS = [
  {
    date: "2026-04-17",
    venue: "Larimer Lounge",
    city: "Denver, CO",
  },
  {
    date: "2026-05-29",
    venue: "Deep Ellum Art Co.",
    city: "Dallas, TX",
    tickets:
      "https://app.opendate.io/e/emski-presents-the_effect-live-audio-visual-set-may-29-2026-691944",
  },
  {
    date: "2026-06-04",
    venue: "1902 Nightclub",
    city: "San Antonio, TX",
    tickets: "https://posh.vip/e/emski-presents-theeffect-a-live-audiovisual-set",
  },
  {
    date: "2026-06-11",
    venue: "ACL3TEN",
    city: "Austin, TX",
    tickets: "https://www.axs.com/events/1423299/emski-tickets?skin=3ten",
  },
  {
    date: "2026-06-20",
    venue: "La Bandida Vivo Bar",
    city: "McAllen, TX",
    tickets:
      "https://www.eventbrite.com/e/emski-presents-the-effect-tour-live-audio-visual-set-tickets-1988201257482?aff=oddtdtcreator",
  },
];

// Date helpers — keep today's shows in "upcoming" until end of day.
const showDate = (iso) => new Date(iso + "T23:59:59");
const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export function splitShows(shows = SHOWS, now = todayStart()) {
  const upcoming = [];
  const past = [];
  for (const s of shows) (showDate(s.date) >= now ? upcoming : past).push(s);
  upcoming.sort((a, b) => showDate(a.date) - showDate(b.date));
  past.sort((a, b) => showDate(b.date) - showDate(a.date));
  return { upcoming, past };
}

export function formatShowDate(iso) {
  // "2026-05-29" → "MAY 29"
  const d = new Date(iso + "T12:00:00");
  return d
    .toLocaleString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

export function formatShowYear(iso) {
  return new Date(iso + "T12:00:00").getFullYear().toString();
}

/* ─── Music — released tracks ─────────────────────────────────────────────
 * At runtime, the site fetches the latest releases from /api/releases
 * (Spotify Web API). The list below is the static fallback used when that
 * call fails (or during local dev without env vars).
 *
 * Shape matches the function's response so the UI doesn't care which source it got.
 * ──────────────────────────────────────────────────────────────────────── */
const SPOTIFY_ARTIST_URL =
  "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK";
const art = (path) => `https://is1-ssl.mzstatic.com/image/thumb/${path}/600x600bb.jpg`;
const sp = (albumId) => `https://open.spotify.com/album/${albumId}`;

export const RELEASES = [
  { id: "fallback-1", title: "For You",      label: "The_Effect", releaseDate: "2026-07-16", cover: art("Music221/v4/dc/25/06/dc2506cb-5aa7-9a75-40a9-233b154730ff/612891035759.jpg"), spotifyUrl: sp("05Ekt5D8yBzFfR9zGrSgVH") },
  { id: "fallback-2", title: "Wait For Me",  label: "The_Effect", releaseDate: "2026-06-04", cover: art("Music221/v4/92/e9/01/92e9017a-7cb1-7ded-6724-c79aec4461ce/612891034462.jpg"), spotifyUrl: sp("2ysj0TVBSCQcxMsbIvlmta") },
  { id: "fallback-3", title: "Relief",       label: "The_Effect", releaseDate: "2026-04-30", cover: art("Music211/v4/a9/47/96/a94796a8-c777-eaea-3e4e-b6ea4693bdcc/663918956571.jpg"), spotifyUrl: sp("3UBxLCQ1zaNGCB2c9C9Yj0") },
  { id: "fallback-4", title: "Reality",      label: "The_Effect", releaseDate: "2026-03-27", cover: art("Music211/v4/d2/92/fc/d292fc74-ba0f-29ef-5ba9-64c2c0255851/663918918524.jpg"), spotifyUrl: sp("6VJSVtx6HhLxPZtBhlT8cV") },
  { id: "fallback-5", title: "DRIP",         label: "The_Effect", releaseDate: "2025-10-15", cover: art("Music211/v4/45/ac/8b/45ac8b03-91b1-c285-aca4-014da1c76db3/663918545966.jpg"), spotifyUrl: sp("42kf3I3ZIyNRdWk4L60OlV") },
  { id: "fallback-6", title: "Body on Mine", label: "HEXAGON",    releaseDate: "2025-09-12", cover: art("Music221/v4/55/c9/66/55c96622-38a9-6ddb-b2df-7fd35bfa27b4/8721416287664.png"), spotifyUrl: sp("1YpryApD3iqq7PCWfffkJm") },
  { id: "fallback-7", title: "Pyro (feat. Emski)", label: "Feed Me", releaseDate: "2025-08-15", cover: art("Music221/v4/35/88/cf/3588cf7d-8576-7585-dd26-bc2debd009bd/5055199579306.png"), spotifyUrl: sp("342mmDGOIUhV5NQOIUTC3b") },
  { id: "fallback-8", title: "SWEAT",        label: "mau5trap",   releaseDate: "2025-04-25", cover: art("Music221/v4/46/4f/c6/464fc66c-247c-9682-e5e4-8abcad5adfc7/663918167199.jpg"), spotifyUrl: sp("2EzhFRr2MsmRsBPeeWR655") },
];

// Streaming destinations (Listen-on links beneath the grid)
export const STREAMING_LINKS = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK?si=mIf5D4rVSuu15HD6MvMpfQ",
  },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/emski/1658955209" },
  { name: "SoundCloud", url: "https://soundcloud.com/emskiiiiiiiiiii" },
];

/* ─── Vault (newsletter) ─────────────────────────────────────────────── */
export const VAULT_URL = "https://emski.vault.fm/";
export const VAULT_OFFERS = [
  "New music first",
  "Early ticket access",
  "Behind-the-scenes drops",
];

/* ─── Videos ─────────────────────────────────────────────────────────── */
export const VIDEOS = [
  {
    title: "THE_EFFECT — LIVE",
    embedUrl: YOUTUBE_EMBED_URL,
  },
];

/* ─── Hero ───────────────────────────────────────────────────────────── */
export const HERO_VIDEO = HERO_VIDEO_R2;
/* ═══ V2 (COBRAH-style redesign) content ═══════════════════════════
 * Everything below powers EmskiSiteV2. Edit freely — all links/copy in one place.
 * ══════════════════════════════════════════════════════════════ */

// Hero background video ("video behind should change to be something else")
export const HERO_VIDEO_V2 = "/ninjatune/assets/hq-production.mp4";

// Main EP slide — "Listen now" opens the in-page platform chooser below.
// `bg` is a live show photo from the tour recap; `cover` kept for future EP art.
export const FEATURED_EP = {
  title: "E/MOTION",
  tagline: "Debut EP out now",
  cta: "Listen now",
  bg: "/photos/live-3.jpg",
  url: "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK",
};

// Platform chooser for the EP CTA (link-tree style overlay).
export const EP_LISTEN_LINKS = [
  ...STREAMING_LINKS,
  { name: "YouTube", url: "https://www.youtube.com/@emskimusic333" },
];

// Music videos — embedded YouTube players (autoplay muted, unmute via controls).
// cc_load_policy=3 keeps captions off by default (YouTube force-enables them on
// muted autoplay otherwise); iv_load_policy=3 hides annotation overlays.
// controls=0: no YouTube chrome at all — the on-page shield toggles sound
const ytEmbed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1&cc_load_policy=3&iv_load_policy=3&enablejsapi=1`;

export const MUSIC_VIDEOS = [
  { title: "Wait For Me", id: "I-bVDnsQJIs", embedUrl: ytEmbed("I-bVDnsQJIs") },
  { title: "DRIP", id: "T4FQgsZhEY8", embedUrl: ytEmbed("T4FQgsZhEY8") },
  { title: "Psycho", id: "rZBWLj2rZsQ", embedUrl: ytEmbed("rZBWLj2rZsQ") },
];

// Music section — one live-photo backdrop behind all release slides (COBRAH).
// Brightened in CSS so the overlay-blend titles still read glassy.
export const MUSIC_BG = "/photos/live-1.jpg";

/* ─── Merch ───────────────────────────────────────────────────────────────
 * Store-agnostic: each item just needs a `url` pointing at its product page.
 * When the Square Online store is live, set MERCH_STORE_URL and swap each
 * item's `url` for its Square product link — nothing else has to change.
 *
 * Per item:
 *   name        — product title
 *   image       — card thumbnail
 *   views       — [{label, src}] for the front/back toggle in the overlay
 *   price       — display string, e.g. "$35"; omit while unannounced
 *   sizes       — ["S","M","L","XL"] or [{size, soldOut}] for per-size state
 *   status      — "available" | "soon" | "sold-out" (drives badge + CTA)
 *   checkoutUrl — Square payment link (https://square.link/u/XXXX). When set
 *                 and status is "available", the CTA becomes real checkout.
 *   url         — fallback link (Vault signup) while there's no checkout
 *
 * IMPORTANT — Square payment links do NOT reliably enforce inventory
 * (Square's own dev forum confirms; merchants report overselling races).
 * So stock is guarded HERE: mark a size soldOut as it runs out, and flip
 * `status` to "sold-out" when the run is gone. Treat this file as the
 * source of truth for what's buyable, not the Square dashboard.
 * ──────────────────────────────────────────────────────────────────────── */
export const MERCH_BG = "/photos/live-5.jpg";

// Set this once the Square store exists — powers the "Shop all" link.
export const MERCH_STORE_URL = "";

export const MERCH_ITEMS = [
  {
    id: "blurred-faces-tee",
    name: "Blurred Faces Tee",
    // Cut from the Industry Print Shop proof (#19123) — real garment, real
    // print placement. Swap for restyled/on-model shots when they exist.
    image: "/photos/merch/blurred-faces-front-dark.jpg",
    views: [
      { label: "Front", src: "/photos/merch/blurred-faces-front-dark.jpg" },
      { label: "Back", src: "/photos/merch/blurred-faces-back-dark.jpg" },
    ],
    price: "$45",
    // Flip `soldOut` per size as stock runs out — this is the real guard.
    // `stock` = units REMAINING from the Industry Print Shop run (invoice
    // #26693). 20 left of the 102 printed; S and L are gone. Reference only —
    // nothing reads it, so update soldOut by hand as sizes run out.
    sizes: [
      { size: "S", stock: 0, soldOut: true },
      { size: "M", stock: 4, soldOut: false },
      { size: "L", stock: 0, soldOut: true },
      { size: "XL", stock: 8, soldOut: false },
      { size: "2XL", stock: 8, soldOut: false },
    ],
    status: "available",
    // Square payment link (item "Blurred Faces Tee", all 5 size variations).
    // Square does NOT hard-enforce stock on payment links — the soldOut flags
    // above are the guard. Keep them current.
    checkoutUrl: "https://square.link/u/GbX8Ntbd",
    url: VAULT_URL,
    tagline: "Numb isn't neutral",
    description:
      "Oversized black tee from the E/MOTION run. Front carries the Blurred Faces print in cyan and white; the back runs the e/MOTION column type down the spine, with the E mark on the left sleeve.",
    details: [
      "Shaka Wear 6.5oz retro garment dye, Shadow",
      "Oversized fit, 3-colour screen print",
      "Front print 16\" × 16.5\"",
      "Back print 11.6\" × 17\"",
      "Screen printed in Austin, TX",
    ],
  },
];

// Icon row at the top of the hero + footer (order matters).
export const SOCIAL_ICONS = [
  { icon: "instagram", label: "Instagram", url: "https://instagram.com/emskimusic" },
  { icon: "tiktok", label: "TikTok", url: "https://tiktok.com/@emskimusic" },
  { icon: "youtube", label: "YouTube", url: "https://www.youtube.com/@emskimusic333" },
  {
    icon: "spotify",
    label: "Spotify",
    url: "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK?si=mIf5D4rVSuu15HD6MvMpfQ",
  },
  {
    icon: "apple",
    label: "Apple Music",
    url: "https://music.apple.com/us/artist/emski/1658955209",
  },
  { icon: "soundcloud", label: "SoundCloud", url: "https://soundcloud.com/emskiiiiiiiiiii" },
  { icon: "mail", label: "Contact", url: "mailto:contact@emskimusic.com" },
];
/* ─── Footer / contact ───────────────────────────────────────────────── */
export const SOCIALS = [
  ...EPK_SOCIALS,
  { name: "SoundCloud", url: "https://soundcloud.com/emskiiiiiiiiiii" },
  { name: "Vault", url: VAULT_URL },
];

export const CONTACT_EMAIL = "contact@emskimusic.com";
export const BOOKING_EMAIL = "contact@emskimusic.com";

/* ─── Nav ────────────────────────────────────────────────────────────── */
export const NAV = [
  { label: "Tour", href: "#tour" },
  { label: "Music", href: "#music" },
  { label: "Vault", href: "#vault" },
  { label: "Merch", href: "#merch" },
];
