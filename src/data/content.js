// Site-wide data constants

export const ARTISTS = [
  "deadmau5",
  "Devault",
  "Amelie Lens",
  "Brutalismus 3000",
  "Jackie Hollander",
  "Golden Features",
  "MEMBA",
  "No Mana",
  "Sylvan Esso",
  "Crooked Colours",
  "Lastlings",
  "Running Touch",
  "Amtrac",
  "LP Giobbi",
  "Alt-J",
  "Anabel Englund",
];

export const FESTIVALS = [
  { name: "ILLfest", year: "2024" },
  { name: "Freaky Deaky", year: "2024" },
  { name: "Seismic 7.0", year: "2024" },
  { name: "Big Bond", year: "2024" },
];

export const LABELS = [
  { name: "mau5trap", cover: "/covers/Mau5trap.png", covers: ["/covers/Mau5trap.png", "/covers/mautrap2.png"] },
  { name: "Ophelia Records", cover: "/covers/Ophelia.png" },
  { name: "Monstercat", cover: "/covers/Monstercat.png" },
  { name: "Bitbird", cover: "/covers/Bitbird.png" },
  { name: "Hexagon", cover: "/covers/Hexagon.png" },
  { name: "Sable Valley", cover: "/covers/SableValley.png" },
];

export const STATS = [
  { label: "FOLLOWERS", val: 42.3, suf: "K" },
  { label: "STREAMS", val: 3.15, suf: "M" },
  { label: "PLAYLIST REACH", val: 7.7, suf: "M" },
  { label: "PLAYLISTS", val: 332, suf: "" },
  { label: "RADIO PLAYS", val: 1120, suf: "" },
  { label: "DJ SUPPORTS", val: 96, suf: "" },
];

export const SOCIALS = [
  { name: "Spotify", url: "https://open.spotify.com/artist/3UqDUfl2fG8ygrFRlgHVZK?si=mIf5D4rVSuu15HD6MvMpfQ" },
  { name: "Instagram", url: "https://instagram.com/emskimusic" },
  { name: "TikTok", url: "https://tiktok.com/@emskimusic" },
  { name: "YouTube", url: "https://www.youtube.com/@emskimusic333" },
];

export const NAV_LINKS = ["music", "stats", "photos", "contact"];

export const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/Z7tTQKy81CM?rel=0&modestbranding=1";

export const SOUNDCLOUD_EP_EMBED_URL =
  "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/emskiiiiiiiiiii/sets/e-motion&secret_token=s-WTa5AWGV2UH&color=%2300efef&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false&show_artwork=true&show_playcount=true&single_active=true&dark_theme=true";

export const SOUNDCLOUD_SINGLES_EMBED_URL =
  "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/emskiiiiiiiiiii/sets/unreleased-singles&secret_token=s-y0W5iR457NV&color=%2300efef&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&buying=false&sharing=false&download=false&show_artwork=true&show_playcount=true&single_active=true&dark_theme=true";

/* ─────────────────────────────────────────────────────────
 * e/MOTION EP — five tracks mapped to the five stages of grief.
 * Listening order ≠ tracklist numbering: the EP plays as a
 * journey through the stages in canonical order.
 *
 * Audio + lyric video assets live under /public/ninjatune/
 * (originally produced for the Ninja Tune deck). They're the
 * canonical source until the EP is released to DSPs.
 * ───────────────────────────────────────────────────────── */
export const EP_TRACKS = [
  {
    stage: "Denial",
    stageNum: "01",
    title: "Wait For Me",
    duration: "3:15",
    release: "May 28",
    audio: "/ninjatune/songs/wait-for-me.mp3",
    video: "/ninjatune/videos/lyric-waitforme.mp4",
    videoShift: -14,
    note: "Asking the thing that's already gone to wait — as if pleading could keep time from advancing.",
  },
  {
    stage: "Anger",
    stageNum: "02",
    title: "Calm Down",
    duration: "2:54",
    release: "Jul 9",
    audio: "/ninjatune/songs/calm-down.mp3",
    video: "/ninjatune/videos/lyric-calmdown.mp4",
    videoShift: -14,
    note: "Anger wearing the mask of composure. Telling someone to calm down is the anger.",
  },
  {
    stage: "Bargaining",
    stageNum: "03",
    title: "For U",
    duration: "3:46",
    release: "Jun 18",
    audio: "/ninjatune/songs/for-u.mp3",
    video: "/ninjatune/videos/lyric-foru.mp4",
    videoShift: -14,
    note: "The offering. Trading your way back to a version of things that no longer exists.",
  },
  {
    stage: "Depression",
    stageNum: "04",
    title: "Hold Me Up",
    duration: "3:53",
    release: "Jul 30",
    audio: "/ninjatune/songs/hold-me-up.mp3",
    video: "/ninjatune/videos/lyric-holdmeup.mp4",
    note: "The collapse. Nothing left to do but ask to be carried.",
  },
  {
    stage: "Acceptance",
    stageNum: "05",
    title: "Never Let Go",
    duration: "3:36",
    release: "Aug 20 · full EP",
    audio: "/ninjatune/songs/never-let-go.mp3",
    video: "/ninjatune/videos/lyric-nlg.mp4",
    videoShift: -14,
    note: "Acceptance isn't moving on. It's learning to carry it.",
  },
];

export const PRESS_FFO = ["BRONSON", "Golden Features", "IMANU", "Billie Eilish"];

export const HERO_VIDEO_R2 =
  "https://pub-9a90af40c4df4a8aa36505acb79e02b3.r2.dev/warehouse-show-hd.mp4";

