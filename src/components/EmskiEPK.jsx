import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollY, useDelayedLoad } from "../hooks/useAnimations";
import { useInView } from "../hooks/useAnimations";
import Reveal from "./Reveal";
import StaggerCell from "./StaggerCell";
import AnimNum from "./AnimNum";
import ParticleLogo from "./ParticleLogo";
import VideoParticles from "./VideoParticles";
import PasswordGate from "./PasswordGate";
import {
  ARTISTS,
  FESTIVALS,
  LABELS,
  STATS,
  SOCIALS,
  NAV_LINKS,
  YOUTUBE_EMBED_URL,
  SOUNDCLOUD_EMBED_URL,
} from "../data/content";

import logo from "../assets/EMSKI-logo-white-rgb.png";

export default function EmskiEPK() {
  const loaded = useDelayedLoad(300);
  const scrollY = useScrollY();

  return (
    <>
      {/* ━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className={`nav ${scrollY > 60 ? "nav--scrolled" : ""}`}>
        <div className={`nav__logo ${scrollY > 300 ? "nav__logo--visible" : ""}`}>
          <img src={logo} alt="EMSKI" />
        </div>
        <div className="nav__links">
          {NAV_LINKS.map((s) => (
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
          <a href="/ninjatune/" className="nav__link nav__link--ninjatune">
            Ninja Tune
          </a>
        </div>
      </nav>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="hero">
        <div className="hero__glow" />
        <div
          className="hero__content"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.25, 150)}px)`,
            opacity: Math.max(1 - scrollY / 600, 0),
          }}
        >
          <div
            className={`hero__video-wrap ${loaded ? "hero__video-wrap--loaded" : ""}`}
          >
            <VideoParticles src="/E_video_loop.mp4" width={600} height={600} />
          </div>

          <div
            className={`hero__logo-wrap ${loaded ? "hero__logo-wrap--loaded" : ""}`}
          >
            <ParticleLogo />
          </div>

          <p
            className={`hero__subtitle ${loaded ? "hero__subtitle--loaded" : ""}`}
          >
            ARTIST PRESS KIT
          </p>

          <div
            className={`hero__scroll-indicator ${
              loaded ? "hero__scroll-indicator--loaded" : ""
            }`}
          >
            <div className="hero__scroll-indicator-line" />
          </div>
        </div>
      </section>

      {/* ━━ CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="content-wrap">
        {/* ── EMSKI LIVE ─────────────────────────────── */}
        <Reveal className="section-pad" style={{ paddingTop: 40 }}>
          <div id="music">
            <h2 className="section-heading section-heading--lg">THE_EFFECT: LIVE</h2>
            <div className="video-embed">
              <iframe
                src={YOUTUBE_EMBED_URL}
                title="EMSKI Live Performance"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── SHARED THE STAGE WITH ──────────────────── */}
        <Reveal className="section-pad">
          <h2 className="section-heading">SHARED THE STAGE WITH</h2>
          <p className="artist-list">
            {ARTISTS.map((a, i) => (
              <span key={a}>
                {a}{i < ARTISTS.length - 1 && <span className="artist-list__sep"> / </span>}
              </span>
            ))}
          </p>

          <h2 className="section-heading" style={{ marginTop: 60 }}>FESTIVALS</h2>
          <p className="artist-list">
            {FESTIVALS.map((f, i) => (
              <span key={f.name}>
                {f.name}{i < FESTIVALS.length - 1 && <span className="artist-list__sep"> / </span>}
              </span>
            ))}
          </p>
        </Reveal>

        <div className="divider" />

        {/* ── LABEL RELEASES ─────────────────────────── */}
        <Reveal className="section-pad">
          <h2 className="section-heading">LABEL RELEASES</h2>
          <div className="cell-grid cell-grid--labels">
            {LABELS.map((l, i) => (
              <StaggerCell
                key={l.name}
                index={i}
                baseDelay={0.08}
                className={l.cover ? "flip-card" : "cell cell--label"}
              >
                {l.cover ? (
                  l.covers && l.covers.length > 1 ? (
                    <RotatingCoverCard label={l} />
                  ) : (
                    <div className="flip-card__inner">
                      <div className="flip-card__front cell cell--label">
                        {l.name}
                      </div>
                      <div className="flip-card__back">
                        <img src={l.cover} alt={`${l.name} release`} loading="lazy" />
                      </div>
                    </div>
                  )
                ) : (
                  l.name
                )}
              </StaggerCell>
            ))}
          </div>
        </Reveal>

        <div className="divider" />

        {/* ── STATS ──────────────────────────────────── */}
        <div id="stats">
          <Reveal className="section-pad">
            <h2 className="section-heading">STREAMING &amp; SOCIALS</h2>
            <div className="cell-grid cell-grid--stats">
              {STATS.map((s, i) => (
                <StatCell key={s.label} stat={s} index={i} />
              ))}
            </div>
          </Reveal>
        </div>

        <div className="divider" />

        {/* ── UNRELEASED MUSIC ───────────────────────── */}
        <Reveal className="section-pad">
          <h2 className="section-heading section-heading--lg">
            e/MOTION [EP]
          </h2>
          <PasswordGate>
            <div className="sc-embed">
              <iframe
                src={SOUNDCLOUD_EMBED_URL}
                title="EMSKI — E-Motion (Private Playlist)"
                allow="autoplay"
                loading="lazy"
              />
            </div>
          </PasswordGate>
        </Reveal>

        <div className="divider" />

        {/* ── HI-RES PRESS PHOTOS ─────────────────────── */}
        <div id="photos">
          <Reveal className="section-pad">
            <div className="photos-header">
              <h2 className="section-heading section-heading--lg" style={{ margin: 0 }}>
                HI-RES PHOTOS
              </h2>
              <a href="https://www.dropbox.com/scl/fo/d97f64t3bj6qhnmz5v5gi/AGo56OIbpunUZkfeFouyFOo?rlkey=cyw60ahlbxabwiyx10m5pn71x&st=8uquqx8w&dl=0" target="_blank" rel="noopener noreferrer" className="btn-outline">
                Download All
              </a>
            </div>
            <div className="photos-grid">
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
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="divider" />

        {/* ── CONTACT ────────────────────────────────── */}
        <div id="contact">
          <Reveal className="section-pad contact">
            <h2 className="section-heading section-heading--lg">CONTACT</h2>
            <a href="mailto:contact@emskimusic.com" className="contact__email">
              contact@emskimusic.com
            </a>
            <div className="contact__roles">
              <div className="contact__role">
                <span className="contact__role-label">Management</span>
                <a href="mailto:justinb@veridianmgmt.com" className="contact__role-email">
                  justinb@veridianmgmt.com
                </a>
              </div>
              <div className="contact__role">
                <span className="contact__role-label">Agent</span>
                <a href="mailto:maxx.lesnick@roamartists.com" className="contact__role-email">
                  maxx.lesnick@roamartists.com
                </a>
              </div>
            </div>
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

      {/* ━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="site-footer">
        <span className="site-footer__text">&copy; 2026 EMSKI MUSIC</span>
        <a href="/ninjatune/" className="site-footer__ninjatune">
          Ninja Tune Pitch →
        </a>
        <span className="site-footer__text site-footer__text--dim">
          ARTIST PRESS KIT
        </span>
      </footer>
    </>
  );
}

/* ── Rotating cover card for labels with multiple covers ── */
function RotatingCoverCard({ label }) {
  const [hovered, setHovered] = useState(false);
  const [coverIdx, setCoverIdx] = useState(0);
  const intervalRef = useRef(null);

  const startRotation = useCallback(() => {
    setHovered(true);
    setCoverIdx(0);
    intervalRef.current = setInterval(() => {
      setCoverIdx((prev) => (prev + 1) % label.covers.length);
    }, 1000);
  }, [label.covers.length]);

  const stopRotation = useCallback(() => {
    setHovered(false);
    clearInterval(intervalRef.current);
    setCoverIdx(0);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className="flip-card__inner"
      onMouseEnter={startRotation}
      onMouseLeave={stopRotation}
    >
      <div className="flip-card__front cell cell--label">
        {label.name}
      </div>
      <div className={`flip-card__back ${hovered ? "flip-card__back--visible" : ""}`}>
        {label.covers.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${label.name} release ${i + 1}`}
            loading="lazy"
            className={`flip-card__rotating-img ${i === coverIdx ? "flip-card__rotating-img--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Stat cell (needs its own useInView for count-up trigger) ── */
function StatCell({ stat, index }) {
  const [ref, visible] = useInView(0.15);

  return (
    <div
      ref={ref}
      className="stat-cell stagger-item"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(12px)",
        transitionDelay: `${index * 0.06}s`,
      }}
    >
      <div className="stat-value">
        <AnimNum value={stat.val} suffix={stat.suf} visible={visible} />
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}
