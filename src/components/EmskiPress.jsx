import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollY, useDelayedLoad, useInView } from "../hooks/useAnimations";
import Reveal from "./Reveal";
import VideoParticles from "./VideoParticles";
import {
  EP_TRACKS,
  PRESS_FFO,
  HERO_VIDEO_R2,
  ARTISTS,
  FESTIVALS,
  SOCIALS,
} from "../data/content";

import logo from "../assets/EMSKI-logo-white-rgb.png";

const PRESS_NAV = ["ep", "live", "artist", "photos", "contact"];

export default function EmskiPress() {
  const loaded = useDelayedLoad(300);
  const scrollY = useScrollY();

  // Per-route document title + meta
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "EMSKI — Press · E/MOTION EP";

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
      "EMSKI — press materials for E/MOTION, a five-track EP through the stages of grief. Bio, music, photos, contact."
    );
    const undo2 = setMeta('meta[property="og:title"]', "content", "EMSKI — Press · E/MOTION EP");
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
        <div
          className="hero__content"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.25, 150)}px)`,
            opacity: Math.max(1 - scrollY / 600, 0),
          }}
        >
          <div className={`hero__video-wrap ${loaded ? "hero__video-wrap--loaded" : ""}`}>
            <VideoParticles src="/E_video_loop.mp4" width={600} height={600} />
          </div>

          <h1 className={`press-hero__title ${loaded ? "press-hero__title--loaded" : ""}`}>
            E/MOTION
          </h1>

          <div className={`press-hero__definition ${loaded ? "press-hero__definition--loaded" : ""}`}>
            <span className="press-hero__phonetic">/ɪˈmoʊ.ʃən/</span>
            <span className="press-hero__pos">verb</span>
            <span className="press-hero__defn">— evolving through emotion in motion.</span>
          </div>

          <p className={`press-hero__subtitle ${loaded ? "press-hero__subtitle--loaded" : ""}`}>
            AN EP IN FIVE STAGES OF GRIEF
          </p>

          <div className={`hero__scroll-indicator ${loaded ? "hero__scroll-indicator--loaded" : ""}`}>
            <div className="hero__scroll-indicator-line" />
          </div>
        </div>
      </section>

      <div className="content-wrap">
        {/* ── THE EP ──────────────────────────────────── */}
        <Reveal className="section-pad" style={{ paddingTop: 60 }}>
          <div id="ep">
            <p className="press-eyebrow">The Record</p>
            <h2 className="press-h2">Five tracks. Five stages. One arc.</h2>
            <p className="press-prose" style={{ marginBottom: 36 }}>
              <strong>E/MOTION</strong> moves through denial, anger, bargaining,
              depression, acceptance — held inside an electronic record that doesn't
              soften the edges of any of them. Best heard front-to-back.
            </p>

            <div className="stages">
              {EP_TRACKS.map((t, i) => (
                <StageCard key={t.title} track={t} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── LIVE ───────────────────────────────────── */}
        <Reveal className="section-pad">
          <div id="live">
            <p className="press-eyebrow">Live</p>
            <h2 className="press-h2 press-h2--small">An audiovisual world, run by one person.</h2>
            <p className="press-prose" style={{ marginBottom: 24 }}>
              Not a DJ set with visuals attached — a single world. Music, visuals, and
              lighting all built and performed by Emma. DJ and live drummer in the same
              set: the body of a live act, the velocity of an electronic one.
            </p>
            <LiveVideo />
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── THE ARTIST (BIO + AT A GLANCE merged) ───── */}
        <Reveal className="section-pad">
          <div id="artist">
            <p className="press-eyebrow">The Artist</p>
            <h2 className="press-h2 press-h2--small">EMSKI.</h2>

            <p className="press-prose">
              EMSKI is the project of Emma — a multi-instrumentalist who writes,
              produces, sings, drums, and builds the visual world the music lives
              inside. Released on <strong>mau5trap</strong>, <strong>Ophelia</strong>,{" "}
              <strong>Monstercat</strong>, <strong>Bitbird</strong>,{" "}
              <strong>Hexagon</strong>, and <strong>Sable Valley</strong>. <em>For
              fans of {PRESS_FFO.join(", ")}.</em>
            </p>

            <div className="glance-block" style={{ marginTop: 40 }}>
              <p className="glance-label">Festivals</p>
              <p className="artist-list">
                {FESTIVALS.map((f, i) => (
                  <span key={f.name}>
                    {f.name}
                    {i < FESTIVALS.length - 1 && <span className="artist-list__sep"> / </span>}
                  </span>
                ))}
              </p>
            </div>

            <div className="glance-block">
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
                { src: "/photos/shot-2.jpg", alt: "EMSKI press shot 2" },
                { src: "/photos/shot-1.jpg", alt: "EMSKI press shot 1" },
                { src: "/photos/main-press.jpg", alt: "EMSKI main press shot" },
                { src: "/photos/emski-sweat.jpg", alt: "EMSKI sweat" },
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
        <span className="site-footer__text site-footer__text--dim">PRESS · E/MOTION EP</span>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
 * Stage card — one per track. Lyric video plays muted as
 * background; an audio player drives the actual listen.
 * ───────────────────────────────────────────────────────── */
function StageCard({ track, index }) {
  const [ref, visible] = useInView(0.12);
  const videoRef = useRef(null);

  // Lazy-start the lyric video once the card scrolls into view
  // (saves bandwidth and prevents 5 simultaneous decodes on load).
  useEffect(() => {
    if (!visible) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [visible]);

  return (
    <article
      ref={ref}
      className={`stage-card ${visible ? "stage-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div className="stage-card__visual">
        <video
          ref={videoRef}
          src={track.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="stage-card__video"
        />
        <div className="stage-card__overlay" />
        <div className="stage-card__stage">
          <span className="stage-card__stage-num">{track.stageNum}</span>
          <span className="stage-card__stage-name">{track.stage}</span>
        </div>
      </div>

      <div className="stage-card__body">
        <div className="stage-card__head">
          <h3 className="stage-card__title">{track.title}</h3>
          <span className="stage-card__duration">{track.duration}</span>
        </div>
        <p className="stage-card__note">{track.note}</p>
        <audio
          src={track.audio}
          controls
          preload="none"
          controlsList="nodownload"
          className="stage-card__audio"
        />
      </div>
    </article>
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
