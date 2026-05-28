/**
 * Public-facing site content (fan-facing, lives at /website-draft).
 *
 * Isolated from src/data/content.js — that module is industry/EPK-facing.
 * Some values (socials, EP tracks) reference content.js to stay in sync.
 */

import {
  SOCIALS as EPK_SOCIALS,
  EP_TRACKS,
  YOUTUBE_EMBED_URL,
  HERO_VIDEO_R2,
} from "../../data/content.js";

// ── Tour (mirrored from public/emski-music/index.html) ──────────────────
export const UPCOMING_SHOWS = [
  {
    date: "MAY 29",
    year: "2026",
    venue: "Deep Ellum Art Co.",
    city: "Dallas, TX",
    tickets: "https://app.opendate.io/e/emski-presents-the_effect-live-audio-visual-set-may-29-2026-691944",
  },
  {
    date: "JUN 4",
    year: "2026",
    venue: "1902 Nightclub",
    city: "San Antonio, TX",
    tickets: "https://posh.vip/e/emski-presents-theeffect-a-live-audiovisual-set",
  },
  {
    date: "JUN 11",
    year: "2026",
    venue: "ACL3TEN",
    city: "Austin, TX",
    tickets: "https://www.axs.com/events/1423299/emski-tickets?skin=3ten",
  },
  {
    date: "JUN 20",
    year: "2026",
    venue: "La Bandida Vivo Bar",
    city: "McAllen, TX",
    tickets: "https://www.eventbrite.com/e/emski-presents-the-effect-tour-live-audio-visual-set-tickets-1988201257482?aff=oddtdtcreator",
  },
];

export const PAST_SHOWS = [
  {
    date: "APR 17",
    year: "2026",
    venue: "Larimer Lounge",
    city: "Denver, CO",
  },
];

// ── Music ───────────────────────────────────────────────────────────────
export const FEATURED_RELEASE = {
  label: "NEW EP",
  title: "e/MOTION",
  tagline: "Five tracks. Five stages. One arc.",
  releaseWindow: "Jun – Aug 2026 · Singles weekly → Full EP Aug 27",
  cover: "/ninjatune/assets/EMSKI-logo-white-rgb.png", // placeholder until EP art lands
  links: {
    spotify: "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK?si=mIf5D4rVSuu15HD6MvMpfQ",
    soundcloud: "https://soundcloud.com/emskiiiiiiiiiii",
    apple: "https://music.apple.com/us/artist/emski/1568068420",
  },
};

// Re-export EP tracks for the music section
export const TRACKS = EP_TRACKS;

// ── Vault ───────────────────────────────────────────────────────────────
export const VAULT_URL = "https://emski.vault.fm/";
export const VAULT_BULLETS = [
  "All upcoming + past shows in one place",
  "Early access to merch drops and new music",
  "Behind-the-scenes from the studio and the road",
];

// ── Videos ──────────────────────────────────────────────────────────────
export const VIDEOS = [
  {
    title: "THE_EFFECT — LIVE",
    embedUrl: YOUTUBE_EMBED_URL,
  },
];

// ── Hero ────────────────────────────────────────────────────────────────
export const HERO_VIDEO = HERO_VIDEO_R2;

// ── Footer / contact ────────────────────────────────────────────────────
export const SOCIALS = [
  ...EPK_SOCIALS,
  { name: "SoundCloud", url: "https://soundcloud.com/emskiiiiiiiiiii" },
  { name: "Vault", url: VAULT_URL },
];

export const CONTACT_EMAIL = "contact@emskimusic.com";
export const BOOKING_EMAIL = "contact@emskimusic.com";

// ── Nav ─────────────────────────────────────────────────────────────────
export const NAV = [
  { label: "Tour", href: "#tour" },
  { label: "Music", href: "#music" },
  { label: "Vault", href: "#vault" },
  { label: "Merch", href: "#merch" },
];
