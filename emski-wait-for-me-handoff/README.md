# EMSKI — `/wait-for-me` generative cover art

Drop-in handoff for the cover-art landing page for EMSKI's e/MOTION EP, single #1 "wait for me." A viewer types how they feel; particles arrange themselves into an abstract composition where the line shape carries the emotional content. The piece is part of a 5-single rollout (Kübler-Ross stages) launching 2026-05-28.

This folder contains the **current production version** plus a **V0 reference** of the original pre-iteration state for visual comparison.

---

## What this is for

- Drop into a Vite + React + react-router project, wire the route, deploy as static SPA.
- Live page where Emma (collaborator) can review the current visual design and react.
- No backend strictly required — the keyword fallback handles emotion mapping locally. An `/api/feel` endpoint with Anthropic is supported but optional.

---

## File map

```
src/
  components/wait-for-me/
    FieldCanvas.jsx        ← main renderer (regl/WebGL). Current line-shape design.
    plutchikMapping.js     ← maps text → emotion vector → flow/attractor params.
    WaitForMe.jsx          ← page-level component (audio + input + canvas).
    AudioPlayer.jsx        ← audio playback UI.
    FeelingInput.jsx       ← text input UI.
    palette.js             ← stage color ramps (denial palette is used).
    gating.js              ← localStorage gate for returning visitors (currently disabled).
    wait-for-me.css        ← page styles.

    FieldCanvasV0.jsx      ← reference: original pre-iteration version.
    plutchikMappingV0.js   ← reference: original mapping.
    WaitForMeV0.jsx        ← reference: original page component.
  hooks/
    useAudioAnalyser.js    ← audio-bands hook for the reactive idle state.

public/ninjatune/songs/
    wait-for-me.mp3        ← the song (3.7 MB).
```

External npm dependencies needed:
- `react` 18+
- `react-dom` 18+
- `react-router-dom` 6+
- `regl` 2+

That's it. No Anthropic SDK required for the static page (fallback works offline).

---

## Integration (drop into a Vite+React project)

1. Copy `src/components/wait-for-me/` and `src/hooks/useAudioAnalyser.js` into your project's `src/`.
2. Copy `public/ninjatune/songs/wait-for-me.mp3` to your project's `public/` (preserving the subpath).
3. Register the route in your router:
   ```jsx
   import WaitForMe from "./components/wait-for-me/WaitForMe";
   import WaitForMeV0 from "./components/wait-for-me/WaitForMeV0";
   // ...
   <Route path="/wait-for-me" element={<WaitForMe />} />
   <Route path="/wait-for-me/v0" element={<WaitForMeV0 />} />
   ```
4. `npm i regl` if not already installed.
5. `npm run dev` — page is at `/wait-for-me`, original reference at `/wait-for-me/v0`.

---

## Design language (current)

Each of Plutchik's 8 primary emotions gets a **distinct line shape**, all sharing the same starting gesture: particles bloom outward from canvas center (the "self"). What differs is **the shape each line draws as it travels**.

| Emotion | Line shape signature |
|---|---|
| **Joy** | Smooth outward straight lines — radial bloom |
| **Sad** | Same bloom, lines **bow downward** as they travel (drooping willow) |
| **Anticipation** | Same bloom, lines **bow upward** (mirror of sad) |
| **Fear** | Lines **tremble/waver** — perpendicular sinusoidal wobble |
| **Disgust** | Lines **pulse thick/thin** — speed modulation along length |
| **Surprise** | Lines start bold and **taper fast** (flash photography) |
| **Anger** | 6 sharp angled rays with zigzag jitter (not 360°) |
| **Trust** | Lines **spiral** — tangential force + weak inward pull |

Wash + gesture two-layer rendering:
- ~20% of particles are "hero" gesture strokes (high alpha, full force pipeline).
- ~80% are "wash" particles drifting on curl noise only (low alpha, ambient texture).
- The wash carries the per-emotion mood texture (sad = slow smooth, anger = active jagged) via the existing noiseScale/jitter mappings.

Time-scale: dt is multiplied by 0.6 globally so the whole simulation runs at 60% speed (calmer, more contemplative).

---

## Design history / what NOT to retry

The visual went through many iterations. Useful to know what failed and why:

1. **8-point Plutchik wheel (V1)** — laid the 8 emotions out as fixed positions on a circle. Was readable as a chart but Emma said it felt mechanical, like a diagram instead of art. Don't go back to the wheel.
2. **Comet trajectories (V4)** — explicit curve formulas. Visually similar to V2 (center burst) so not distinct enough.
3. **Inward wheel (V5)** — particles flowed from wheel positions to center. Got into "veiny" / "creepy" territory before being abandoned.
4. **Over-smoothing** — applying very high drag + large noise scale produced "stragglers" (random wisps wandering off). Sweet spot is medium drag (0.97), medium noise scale.
5. **"Sad falls from above"** — original V0 spawned sad particles ABOVE the canvas, raining in. Emma flagged this as feeling random — the emotion shouldn't arrive from outside the self. Fixed: every emotion now originates from center.
6. **"Sad = particles fall straight down"** — even after center-origin fix, vertical lines felt mechanical. Pivoted to **line-shape philosophy**: same outward bloom as joy, but each line bows downward over its length. This is what's currently live and Emma reacted positively to it.

The current direction was unlocked by Wei's insight: *change the SHAPE of the lines, not their direction*.

---

## Open questions for next iteration

- Color is still pale blue across all emotions. Could explore per-emotion color tinting (joy = warm gold, sad = deep blue, anger = red, etc.) to layer emotional content via color in addition to shape.
- Mixed-emotion vectors (e.g. "hopeful" = joy + trust + anticipation) currently pick a single dominant emotion's gesture. A blended approach where multiple line-shape signatures overlay each other could be richer.
- Whether to dial back the line-shape effects further (sad's bow might still be too strong) or push further (more dramatic per-emotion variance).
- The original Plutchik wheel reading ("joy at top, sad at bottom") was abandoned in favor of "every emotion blooms from center." Decision: stick with center-origin, or revisit?

---

## Deployment

Previously deployed on Railway as a Node service running both frontend and `/api/feel`. For a static-only deploy (no backend), any static host works — Vercel, Netlify, Cloudflare Pages, Railway static.

The `/api/feel` endpoint expects:
- POST with `{ text: "what the user typed", stage: "denial" }`
- Returns `{ vector: { joy: 0..1, ... }, contribution_id: "..." }`
- If backend is missing, frontend falls back to `deterministicVectorFromText(text)` — keyword-based mapping in `plutchikMapping.js`.

Supabase project: `emski-e_motion` (referenced by user's memory file — not exposed in code yet).

---

## Conversation context for continuing Claude work

This handoff was created mid-session. Key context the next Claude should know:

- **Wei** (the user, EMSKI's brother) is managing the artist's web presence. Iterative, opinionated, wants concise responses.
- **Emma** is the artist collaborator who provides design feedback. Her latest take: the line-shape direction is "pretty solid"; she wanted differences between emotions to be more obvious (which the current main branch now addresses).
- **The user explicitly wants tighter responses** — no preamble, no "what to expect" lists, short bullets, multi-round clarifying questions before code when relevant.
- **The line-shape design philosophy is the current creative direction.** Don't pivot back to wheel diagrams or directional flows; ground new ideas in "how is the line itself drawn."
- **V0 is preserved as a reference** so Emma can A/B compare. Don't delete it.

Live working session deltas (rough order, most recent first):
1. Amplified per-emotion line shapes — fear trembles, disgust pulses, surprise tapers, trust spirals, anticipation bows up.
2. Added wash + gesture two-layer rendering for visual hierarchy.
3. Pivoted from "each emotion has a different flow direction" to "each emotion has a different LINE SHAPE on a shared outward bloom."
4. Sad in particular went through several attempts before landing on "drooping line shape."
5. Restored V0 to original `checkpoint-emma-handoff` state after smoothing changes had drifted it.
6. Slowed the whole simulation to 60% speed via dt scaling.
