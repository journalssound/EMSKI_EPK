# EMSKI EPK — Chat Summary

## Project Overview
Production EPK (Electronic Press Kit) website for EMSKI, built with Vite + React, deployed to Cloudflare Pages.

- **Local path:** `/Users/weix/Downloads/files/emski-epk/`
- **GitHub:** https://github.com/journalssound/EMSKI_EPK
- **Live URL:** https://emski-epk.pages.dev
- **Cloudflare Pages project:** `emski-epk`

---

## Tech Stack
- **Vite v7.3.1 + React**
- **Fonts:** Aktiv Grotesk Extended Bold (Adobe Typekit `sag3htb`), Jura (Google Fonts)
- **Hosting:** Cloudflare Pages

---

## Deploy Command
```bash
cd /Users/weix/Downloads/files/emski-epk
npx vite build && npx wrangler pages deploy dist --project-name emski-epk --no-bundle
```
> The `--no-bundle` flag is **required** — without it Cloudflare throws an internal error.

After connecting GitHub to Cloudflare Pages, deploys will be automatic on push (build command: `npm run build`, output dir: `dist`).

---

## Color System (CSS Custom Properties)
- `--c-bg: #060609` (near-black background)
- `--c-cyan: #00EFEF` (primary accent)
- `--c-neon-blue: #7272FE`
- `--c-purple: #A349FD`
- `--c-ultra: #340597`
- EMSKI wordmark ice blue gradient: `#A7D0E3`, `#B9DFEF`, `#C2E7F7`

---

## Key Components

### `VideoParticles.jsx`
- Renders `E_video_loop.mp4` (seamless loop created via ffmpeg crossfade)
- Full native resolution, dark pixels made transparent (BG_THRESHOLD=35)
- Mouse/touch repulsion effect (MOUSE_RADIUS=80, PUSH_FORCE=30)
- Multiple load event listeners for iOS compatibility
- Autoplay retry on user interaction fallback

### `ParticleLogo.jsx`
- White EMSKI logo PNG used as CSS mask
- Filled with ice blue gradient (`#A7D0E3 → #B9DFEF → #C2E7F7`)
- Mouse parallax tilt effect (±8deg rotateX/Y)
- Width: `min(340px, 60vw)`

### `PasswordGate.jsx`
- Wraps the SoundCloud embed (unreleased e/MOTION EP)
- Password: `e/motion` (case-insensitive)
- Lock icon + shake animation on wrong password
- Styled to match site aesthetic

### `EmskiEPK.jsx`
- Main page component with all sections
- Hero: accent line → VideoParticles → ParticleLogo → subtitle
- Sections: Music (YouTube embed), Stats (6 items, 3×2 grid), Labels (6 cards with cover art pop-up), e/MOTION EP (password-gated SoundCloud), Photos (masonry layout), Contact

---

## Content Data (`src/data/content.js`)

### Artists (shared stage with)
deadmau5, Devault, Brutalismus 3000, Jackie Hollander, Golden Features, MEMBA, No Mana, Sylvan Esso, Crooked Colours, Lastlings, Running Touch, Amtrac, LP Giobbi, Alt-J, Anabel Englund

### Festivals
ILLfest, Freaky Deaky, Seismic 7.0, Big Bond

### Labels (with cover art in `/public/covers/`)
mau5trap, Ophelia Records, Monstercat, Bitbird, Hexagon, Sable Valley

### Stats
- Followers: 42.3K
- Streams: 3.15M
- Playlist Reach: 7.7M
- Playlists: 332
- Radio Plays: 1120
- DJ Supports: 96

### Socials
Spotify, Instagram, TikTok, YouTube (placeholder URLs — need real ones)

### Embeds
- YouTube: `Z7tTQKy81CM`
- SoundCloud: private playlist with `secret_token=s-WTa5AWGV2UH`

---

## Public Assets
- `public/E_video_loop.mp4` — seamless loop video (5.3MB, 3.4s, 60fps, 1024×1024)
- `public/og-image.jpg` — OG link preview (1200×630, E on dark bg)
- `public/covers/` — Mau5trap.png, Ophelia.png, Monstercat.png, Bitbird.png, Hexagon.png, SableValley.png
- `public/photos/` — shot-1.jpg, shot-2.jpg, main-press.jpg, emski-sweat.jpg (all resized to 1600px wide)
- `src/assets/EMSKI-logo-white-rgb.png` — white logo used for CSS mask

---

## Remaining Production Tasks
1. **Custom domain** — buy domain, add in Cloudflare Pages dashboard, update OG meta URLs in `index.html`
2. **Real social media URLs** — currently placeholder in `content.js`
3. **SoundCloud embed** — verify private playlist actually loads after password entry
4. **Favicon** — replace generic `favicon.svg` with EMSKI-branded one
5. **Analytics** — optionally add Cloudflare Web Analytics (free, one toggle)
6. **Connect GitHub to Cloudflare Pages** — for auto-deploys on push

---

## Responsive Breakpoints
- **640px:** Labels grid → 3 columns, stats → 2 columns
- **420px:** Labels grid → 2 columns, nav wraps

## Key CSS Notes
- Photos use CSS `columns: 2` masonry layout (not grid)
- Label cards: square aspect-ratio, pop-up reveal on hover (opacity+scale)
- Stat labels: `font-weight: 600`, `color: rgba(255,255,255,0.75)`
- `hero__subtitle` opacity: 0.5
- Section heading "THE_EFFECT: LIVE" for live section
