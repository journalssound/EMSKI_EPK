/* ─────────────────────────────────────────────────────────
 * EMSKI [BLACK OUT] — press-kit data
 *
 * The one-sheet for the [BLACK OUT] DJ product. Shared credits (festivals,
 * labels, stats, socials) come straight from the parent EPK so the two pages
 * never drift; only what's specific to this product lives here.
 * Source: EMSKI_BLACKOUT_Foundation V2 (Aug 2026).
 * ───────────────────────────────────────────────────────── */

import { ARTISTS, SOUNDCLOUD_SINGLES_EMBED_URL } from "../../data/content";

// The guide writes it "[BLACK OUT]"; the artist's call is no space.
export const BO_TAG = "[BLACKOUT]";
export const BO_THESIS = "presence is protest.";

/* Same roster as the parent EPK, techno-credible names first — a promoter
 * scanning a DJ one-sheet should hit these before the indie/pop names. */
const LEAD = ["Amelie Lens", "Brutalismus 3000", "deadmau5", "No Mana"];
export const BO_ARTISTS = [...LEAD, ...ARTISTS.filter((a) => !LEAD.includes(a))];

/* The Concourse Project set, direct support for Amelie Lens. Title reads as
 * a section header; the venue details stay mono underneath. */
export const BO_VIDEO = {
  id: "ay_6H4vmM5E",
  title: "[BLACKOUT] set — The Concourse Project",
  meta: ["AUSTIN, TX", "DIRECT SUPPORT FOR AMELIE LENS"],
};

/* The private "UNRELEASED SINGLES" set — the same set the parent EPK embeds
 * (share link https://on.soundcloud.com/2spQyVP4wbt5ACFY50 resolves to it).
 * The artist keeps the [BLACKOUT] singles in that set, so the player follows
 * it as it changes. Only the play-button tint differs here: cyan is
 * off-palette, off-white is the only light source. */
export const BO_PLAYERS = [
  {
    label: "UNRELEASED",
    src: SOUNDCLOUD_SINGLES_EMBED_URL.replace("color=%2300efef", "color=%23F2EFEA"),
    title: "EMSKI — Unreleased Singles (Private Playlist)",
  },
];

/* Press photos — four on the page as a teaser, web-sized to a 2000px long
 * edge; the full set and hi-res originals live in the Dropbox folder. */
export const BO_PHOTOS = [
  { src: "/photos/blackout/blackout-13.jpg", alt: "EMSKI [BLACKOUT] press — seated, hand on forehead, chain bracelet, studio" },
  { src: "/photos/blackout/blackout-14.jpg", alt: "EMSKI [BLACKOUT] press — night skyline, hand reaching to camera" },
  { src: "/photos/blackout/blackout-06.jpg", alt: "EMSKI [BLACKOUT] press — extreme close-up, eye and bracelet" },
  { src: "/photos/blackout/blackout-10.jpg", alt: "EMSKI [BLACKOUT] press — seated on stairwell steps" },
];
export const BO_PHOTOS_URL =
  "https://www.dropbox.com/scl/fo/xe0z5sygu6v7cvtdjjwwu/AFkKajsjzV5yYniK8bBBYyY?rlkey=biwec993ydxkg1bgd8d2lj2np&dl=0";

export const BO_CONTACT_EMAIL = "contact@emskimusic.com";
