import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import EmotionField from "./EmotionField";

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
            Distribution & administration by Create Music Group · May 28 – Aug 20, 2026 · 16-week rollout
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
            <h2 className="press-h2 press-h2--small">EMSKI</h2>

            <p className="press-prose">
              EMSKI is the electronic project of Emma — released on{" "}
              <strong>mau5trap</strong>, <strong>Monstercat</strong>,{" "}
              <strong>Bitbird</strong>, <strong>Hexagon</strong>, and{" "}
              <strong>Sable Valley</strong>.{" "}
              <em>For fans of {PRESS_FFO.join(", ")}.</em>
            </p>

            <p className="press-prose" style={{ marginTop: 18 }}>
              The <strong>e/MOTION</strong> EP is for the person standing at
              the edge of a change they haven't made yet — scared, in
              transition, looking for permission to be messy and against the
              grain. It's EMSKI branching into a new direction: something more
              vulnerable, emotional, honest.
            </p>

            <div className="glance-block" style={{ marginTop: 40 }}>
              <p className="glance-label">Supported by</p>
              <ul className="artist-chips">
                {ARTISTS.map((a) => (
                  <li key={a} className="artist-chip">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── THE ROLLOUT ──────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="rollout">
            <p className="press-eyebrow">The Rollout</p>
            <h2 className="press-h2 press-h2--small">5 chapters. 16 weeks. 1 arc</h2>

            <p className="press-prose" style={{ marginBottom: 36 }}>
              <strong>e/MOTION</strong> releases as five episodes from{" "}
              <strong>May 28 – Aug 20</strong>, following one character across
              the five stages of grief — never named on screen. Built from two
              threads running in parallel: a narrative arc and a documentary
              throughline. Each chapter ships with a single, a music video, and
              a documentary episode.
            </p>

            <div className="rollout-callout rollout-callout--media">
              <LazyEmotionField />
              <div className="rollout-callout__text">
                <p className="rollout-callout__eyebrow">Fan-built cover art</p>
                <p className="rollout-callout__body">
                  An EMSKI-designed algorithm powers an immersive, interactive
                  art experience built around community. Before each track
                  drops, fans hear a snippet and log how it makes them feel.
                  Their response is rendered as a unique, ID-tagged visual
                  fragment. Every fragment becomes one tile in the song's
                  final cover artwork — bringing fans in to be a part of the
                  project itself.
                </p>
                <p className="rollout-callout__caption">
                  Live preview — the field at rest, before any fan input.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── LIVE ─────────────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="live">
            <p className="press-eyebrow">Live</p>
            <h2 className="press-h2 press-h2--small">A full live audiovisual set</h2>
            <p className="press-prose" style={{ marginBottom: 24 }}>
              Vocals, drums, and visuals created by EMSKI.
            </p>
            <p className="press-prose" style={{ marginBottom: 24 }}>
              <strong>Currently on tour</strong> in support of <strong>e/MOTION</strong> — stops in <strong>Dallas</strong>, <strong>Austin</strong>, <strong>McAllen</strong>, <strong>San Antonio</strong>, and <strong>Denver</strong>.
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
                Press photos
              </h2>
              <a
                href="https://www.dropbox.com/scl/fo/j8pvftivxe1zumur6whs9/AN7Ce3QCd3P98XSqkxR8TIw?rlkey=58h37m73nbt98bsnkbihoxm6c&e=1&dl=0"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Download full photo set ↗
              </a>
            </div>

            <PhotoGrid
              photos={[
                { src: "/photos/live-2.jpg", alt: "EMSKI live 2" },
                { src: "/photos/emotion-2.jpg", alt: "EMSKI e/MOTION press 2" },
                { src: "/photos/live-5.jpg", alt: "EMSKI live 5" },
                { src: "/photos/portrait-1.jpg", alt: "EMSKI portrait 1" },
                { src: "/photos/live-4.jpg", alt: "EMSKI live 4" },
                { src: "/photos/emotion-1.jpg", alt: "EMSKI e/MOTION press 1" },
                { src: "/photos/live-6.jpg", alt: "EMSKI live 6" },
                { src: "/photos/live-1.jpg", alt: "EMSKI live 1" },
              ]}
            />
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── CONTACT ─────────────────────────────────── */}
        <div id="contact">
          <Reveal className="section-pad contact">
            <h2 className="press-h2 press-h2--small" style={{ marginBottom: 24 }}>
              Contact
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
function LazyEmotionField() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="rollout-callout__preview" aria-hidden="true">
      {show && <EmotionField />}
    </div>
  );
}

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
            {open ? "close" : "play"}
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
          <span className="live-video__play-icon" aria-hidden="true">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <path d="M0 0 L14 8 L0 16 Z" />
            </svg>
          </span>
          <span className="live-video__play-label">Play with sound</span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * Photo masonry grid + lightbox
 * ───────────────────────────────────────────────────────── */
function PhotoGrid({ photos }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, photos.length]);

  return (
    <>
      <div className="photos-grid" style={{ marginTop: 24 }}>
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className="photo-cell"
            onClick={() => setActive(i)}
            style={{ "--i": i }}
          >
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
            <span className="photo-cell__overlay" aria-hidden="true">
              <span className="photo-cell__expand">VIEW</span>
            </span>
          </button>
        ))}
      </div>

      {active !== null && createPortal(
        <div
          className="photo-lightbox"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="photo-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              setActive(null);
            }}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className="photo-lightbox__nav photo-lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <img
            className="photo-lightbox__img"
            src={photos[active].src}
            alt={photos[active].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="photo-lightbox__nav photo-lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              setActive((i) => (i + 1) % photos.length);
            }}
            aria-label="Next"
          >
            ›
          </button>
          <div className="photo-lightbox__counter">
            {active + 1} / {photos.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
