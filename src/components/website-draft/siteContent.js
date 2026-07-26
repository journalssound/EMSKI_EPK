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
const ARTIST_EMBED =
  "https://open.spotify.com/embed/artist/3UqDUfl2fG8ygrFRlgHVZK?utm_source=generator&theme=0";

export const RELEASES = [
  { id: "fallback-1", title: "mau5trap Release", label: "mau5trap",     cover: "/covers/Mau5trap.png",    embedUrl: ARTIST_EMBED },
  { id: "fallback-2", title: "mau5trap Release", label: "mau5trap",     cover: "/covers/mautrap2.png",    embedUrl: ARTIST_EMBED },
  { id: "fallback-3", title: "Ophelia Release",  label: "Ophelia",      cover: "/covers/Ophelia.png",     embedUrl: ARTIST_EMBED },
  { id: "fallback-4", title: "Monstercat Release", label: "Monstercat", cover: "/covers/Monstercat.png",  embedUrl: ARTIST_EMBED },
  { id: "fallback-5", title: "Bitbird Release",  label: "Bitbird",      cover: "/covers/Bitbird.png",     embedUrl: ARTIST_EMBED },
  { id: "fallback-6", title: "Hexagon Release",  label: "Hexagon",      cover: "/covers/Hexagon.png",     embedUrl: ARTIST_EMBED },
  { id: "fallback-7", title: "Sable Valley Release", label: "Sable Valley", cover: "/covers/SableValley.png", embedUrl: ARTIST_EMBED },
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
