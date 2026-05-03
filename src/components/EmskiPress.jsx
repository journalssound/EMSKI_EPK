import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollY, useDelayedLoad } from "../hooks/useAnimations";
import Reveal from "./Reveal";
import VideoParticles from "./VideoParticles";
import {
  EP_TRACKS,
  PRESS_FFO,
  HERO_VIDEO_R2,
  ARTISTS,
  SOCIALS,
} from "../data/content";

import logo from "../assets/EMSKI-logo-white-rgb.png";

const PRESS_NAV = ["ep", "artist", "rollout", "live", "photos", "contact"];

export default function EmskiPress() {
  const loaded = useDelayedLoad(300);
  const scrollY = useScrollY();

  // Per-route document title + meta
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "EMSKI — Press · e/MOTION EP";

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      const prev = el?.getAttribute(attr);
      if (el) el.setAttribute(attr, value);
      return () => {
        if (el && prev != null) el.setAttribute(attr, prev);
      };
    };
    const undo1 = setMeta(
      'meta[name="description"]',
      "content",
      "EMSKI — press materials for e/MOTION, a five-track EP through the stages of grief. Bio, music, photos, contact."
    );
    const undo2 = setMeta('meta[property="og:title"]', "content", "EMSKI — Press · e/MOTION EP");
    const undo3 = setMeta(
      'meta[property="og:description"]',
      "content",
      "An EP in five stages. Press materials, music, and photos for EMSKI."
    );

    return () => {
      document.title = prevTitle;
      undo1?.();
      undo2?.();
      undo3?.();
    };
  }, []);

  return (
    <>
      {/* ━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className={`nav ${scrollY > 60 ? "nav--scrolled" : ""}`}>
        <Link to="/" className={`nav__logo ${scrollY > 300 ? "nav__logo--visible" : ""}`}>
          <img src={logo} alt="EMSKI" />
        </Link>
        <div className="nav__links">
          {PRESS_NAV.map((s) => (
            <button
              key={s}
              className="nav__link"
              onClick={() =>
                document.getElementById(s)?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hero press-hero">
        <div className="hero__glow" />
        <div className="hero__content">
          <div className={`hero__video-wrap press-hero__video-wrap ${loaded ? "hero__video-wrap--loaded" : ""}`}>
            <VideoParticles src="/E_video_loop.mp4" width={340} height={340} />
          </div>

          <h1 className={`press-hero__title ${loaded ? "press-hero__title--loaded" : ""}`}>
            e/MOTION
          </h1>

          <div className={`press-hero__definition ${loaded ? "press-hero__definition--loaded" : ""}`}>
            <span className="press-hero__phonetic">/ɪˈmoʊ.ʃən/</span>
            <span className="press-hero__pos">verb</span>
            <span className="press-hero__defn">— evolving through emotion in motion.</span>
          </div>

          <p className={`press-hero__lede ${loaded ? "press-hero__lede--loaded" : ""}`}>
            <span className="press-hero__lede-line">A five-track EP built as one arc through the five stages of grief.</span>
            <span className="press-hero__lede-sub">From <strong>EMSKI</strong> — hard-edged, vocal-forward electronic music.</span>
          </p>

          <p className={`press-hero__meta ${loaded ? "press-hero__meta--loaded" : ""}`}>
            Independent release · May 28 – Aug 20, 2026 · 16-week rollout
          </p>

          <ol id="ep" className={`press-stages ${loaded ? "press-stages--loaded" : ""}`}>
            {EP_TRACKS.map((t, i) => (
              <StageTile key={t.title} track={t} index={i} />
            ))}
          </ol>
        </div>
      </section>

      <div className="content-wrap">
        <div className="divider" />

        {/* ── THE ARTIST ───────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="artist">
            <p className="press-eyebrow">The Artist</p>
            <h2 className="press-h2 press-h2--small">EMSKI.</h2>

            <p className="press-prose">
              EMSKI is the electronic project of Emma — released on{" "}
              <strong>mau5trap</strong>, <strong>Ophelia</strong>,{" "}
              <strong>Monstercat</strong>, <strong>Bitbird</strong>,{" "}
              <strong>Hexagon</strong>, and <strong>Sable Valley</strong>.{" "}
              <em>For fans of {PRESS_FFO.join(", ")}.</em>
            </p>

            <p className="press-prose" style={{ marginTop: 18 }}>
              The audience is the person standing at the edge of a change they
              haven't made yet — scared, in transition, looking for permission to
              be messy and against the grain. Earlier EMSKI material gave them the
              adrenaline to jump. <strong>e/MOTION</strong> is the companion that
              walks beside them through the mess.
            </p>

            <div className="glance-block" style={{ marginTop: 40 }}>
              <p className="glance-label">Shared the stage with</p>
              <p className="artist-list">
                {ARTISTS.map((a, i) => (
                  <span key={a}>
                    {a}
                    {i < ARTISTS.length - 1 && <span className="artist-list__sep"> / </span>}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── THE ROLLOUT ──────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="rollout">
            <p className="press-eyebrow">The Rollout</p>
            <h2 className="press-h2 press-h2--small">Five chapters. Sixteen weeks. One arc.</h2>

            <p className="press-prose">
              <strong>e/MOTION</strong> drops as five chapters across a 16-week
              independent rollout. Each single is an episode, not a post — built
              from two threads that run in parallel.
            </p>

            <ul className="rollout-list">
              <li>
                <span className="rollout-list__label">Documentary thread.</span>{" "}
                Tight, body-part close-ups in a Netflix-grade interview format. An
                off-camera voice asks one question per chapter. Every answer is
                deliberately ambiguous — it reads as the loss of someone, or the
                loss of who you used to be. Both are true.
              </li>
              <li>
                <span className="rollout-list__label">Narrative thread.</span>{" "}
                Each answer cuts into trailer footage from that chapter's music
                video, announcing the next single. The character introduced in{" "}
                <em>Wait For Me</em>'s overdose narrative is the through-line —
                we follow them across all five stages.
              </li>
              <li>
                <span className="rollout-list__label">The engine.</span> The five
                chapters track the five stages of grief, never named on screen.
                The viewer feels the arc through color, pacing, and weight before
                the lyrics ever land.
              </li>
              <li>
                <span className="rollout-list__label">The breaks.</span> Two
                chapters break the interview format on purpose. <em>Calm Down</em>{" "}
                erupts. <em>Hold Me Up</em> collapses into silence. The format is
                the rule; the breaks are the bridges.
              </li>
            </ul>

            <p className="press-prose" style={{ marginTop: 18, color: "rgba(255,255,255,0.65)" }}>
              The intent: an episodic release viewers stay with for 16 weeks
              because they want to know what happens to her — not just what song
              drops next.
            </p>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── LIVE ─────────────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="live">
            <p className="press-eyebrow">Live</p>
            <h2 className="press-h2 press-h2--small">A full live audiovisual set.</h2>
            <p className="press-prose" style={{ marginBottom: 24 }}>
              Not a DJ set with visuals attached — music, visuals, and lighting move
              as one. DJ and live drummer in the same set: the body of a live act,
              the velocity of an electronic one.
            </p>
            <LiveVideo />
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── PHOTOS ──────────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="photos">
            <div className="photos-header">
              <h2 className="press-h2 press-h2--small" style={{ margin: 0 }}>
                Press photos.
              </h2>
              <a
                href="https://www.dropbox.com/scl/fo/d97f64t3bj6qhnmz5v5gi/AGo56OIbpunUZkfeFouyFOo?rlkey=cyw60ahlbxabwiyx10m5pn71x&st=8uquqx8w&dl=0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Download All
              </a>
            </div>

            <div className="photos-grid" style={{ marginTop: 24 }}>
              {[
                { src: "/photos/live-2.jpg", alt: "EMSKI live 2" },
                { src: "/photos/emotion-2.jpg", alt: "EMSKI e/MOTION press 2" },
                { src: "/photos/live-4.jpg", alt: "EMSKI live 4" },
                { src: "/photos/emotion-1.jpg", alt: "EMSKI e/MOTION press 1" },
                { src: "/photos/live-1.jpg", alt: "EMSKI live 1" },
                { src: "/photos/emotion-3.jpg", alt: "EMSKI e/MOTION press 3" },
                { src: "/photos/live-3.jpg", alt: "EMSKI live 3" },
              ].map((photo, i) => (
                <div
                  key={photo.src}
                  className={`photo-cell ${i === 0 ? "photo-cell--hero" : "photo-cell--std"}`}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── CONTACT ─────────────────────────────────── */}
        <div id="contact">
          <Reveal className="section-pad contact">
            <h2 className="press-h2 press-h2--small" style={{ marginBottom: 24 }}>
              Interviews, premieres, review copies.
            </h2>
            <a href="mailto:contact@emskimusic.com" className="contact__email">
              contact@emskimusic.com
            </a>
            <div className="contact__socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="site-footer">
        <span className="site-footer__text">&copy; 2026 EMSKI MUSIC</span>
        <span className="site-footer__text site-footer__text--dim">PRESS · e/MOTION EP</span>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
 * Stage tile — vertical card in the 5-across hero strip.
 * Lyric video as ambient background; click to play audio.
 * ───────────────────────────────────────────────────────── */
function StageTile({ track, index }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const id = setTimeout(() => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }, 200 + index * 120);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <li className={`stage-tile ${open ? "stage-tile--open" : ""}`}>
      <button
        type="button"
        className="stage-tile__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${track.stage} — ${track.title}`}
      >
        <video
          ref={videoRef}
          src={track.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="stage-tile__video"
          style={{
            ...(track.videoShift ? { transform: `translateY(${track.videoShift}%)` } : null),
            ...(track.videoFit ? { objectFit: track.videoFit } : null),
          }}
        />
        <div className="stage-tile__overlay" />
        <div className="stage-tile__content">
          <span className="stage-tile__num">{track.stageNum}</span>
          <span className="stage-tile__title">{track.title}</span>
          <span className="stage-tile__stage">[{track.stage}]</span>
          {track.release && (
            <span className="stage-tile__release">{track.release}</span>
          )}
          <span className="stage-tile__cta" aria-hidden="true">
            {open ? "■ close" : "▶ play"}
          </span>
        </div>
      </button>
      {open && (
        <audio
          src={track.audio}
          controls
          autoPlay
          preload="none"
          controlsList="nodownload"
          className="stage-tile__audio"
        />
      )}
    </li>
  );
}

/* ─────────────────────────────────────────────────────────
 * Live video — click to load + unmute. Mirrors the Ninja
 * Tune deck's hero video pattern (R2-hosted MP4).
 * ───────────────────────────────────────────────────────── */
function LiveVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    setPlaying(true);
  };

  return (
    <div className="live-video">
      <video
        ref={videoRef}
        src={HERO_VIDEO_R2}
        poster="/ninjatune/assets/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        controls={playing}
        className="live-video__media"
      />
      {!playing && (
        <button className="live-video__play" onClick={start} type="button">
          <span className="live-video__play-icon" aria-hidden="true">▶</span>
          <span className="live-video__play-label">Play with sound</span>
        </button>
      )}
    </div>
  );
}
