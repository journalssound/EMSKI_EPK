/* ─────────────────────────────────────────────────────────
 * EMSKI [BLACK OUT] — press-kit data
 *
 * The one-sheet for the [BLACK OUT] DJ product. Shared credits (festivals,
 * labels, stats, socials) come straight from the parent EPK so the two pages
 * never drift; only what's specific to this product lives here.
 * Source: EMSKI_BLACKOUT_Foundation V2 (Aug 2026).
 * ───────────────────────────────────────────────────────── */

import {
  ARTISTS,
  SPOTIFY_EP_EMBED_URL,
  SOUNDCLOUD_SINGLES_EMBED_URL,
} from "../../data/content";

export const BO_TAG = "[BLACK OUT]";
export const BO_THESIS = "presence is protest.";

/* Same roster as the parent EPK, techno-credible names first — a promoter
 * scanning a DJ one-sheet should hit these before the indie/pop names. */
const LEAD = ["Amelie Lens", "Brutalismus 3000", "deadmau5", "No Mana"];
export const BO_ARTISTS = [...LEAD, ...ARTISTS.filter((a) => !LEAD.includes(a))];

/* The Concourse Project set, direct support for Amelie Lens. Mono metadata
 * reads as a slate above the player. */
export const BO_VIDEO = {
  id: "ay_6H4vmM5E",
  meta: ["[BLACK OUT] SET", "THE CONCOURSE PROJECT", "AUSTIN, TX", "DIRECT SUPPORT FOR AMELIE LENS"],
};

/* PLACEHOLDERS — the [BLACK OUT] singles aren't on SoundCloud yet, so the
 * parent EPK players stand in. Swap the URLs when the singles land. */
export const BO_PLAYERS = [
  { label: "E/MOTION EP", src: SPOTIFY_EP_EMBED_URL, title: "EMSKI — e/MOTION EP on Spotify" },
  {
    label: "UNRELEASED",
    // Same private set as the parent EPK; only the play-button tint changes
    // (cyan is off-palette here — off-white is the only light source).
    src: SOUNDCLOUD_SINGLES_EMBED_URL.replace("color=%2300efef", "color=%23F2EFEA"),
    title: "EMSKI — Unreleased Singles (Private Playlist)",
  },
];

/* Press photos — populated once the [BLACK OUT] shoot is selected. The
 * section renders only when this has entries. */
export const BO_PHOTOS = [];

export const BO_CONTACT_EMAIL = "contact@emskimusic.com";
