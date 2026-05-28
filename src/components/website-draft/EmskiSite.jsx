import { useState, useEffect } from "react";
import ParticleLogo from "../ParticleLogo.jsx";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import {
  NAV,
  UPCOMING_SHOWS,
  PAST_SHOWS,
  FEATURED_RELEASE,
  TRACKS,
  VAULT_URL,
  VAULT_BULLETS,
  VIDEOS,
  HERO_VIDEO,
  SOCIALS,
  CONTACT_EMAIL,
  BOOKING_EMAIL,
} from "./siteContent.js";
import "./website-draft.css";

/**
 * Public-facing fan site at /website-draft.
 *
 * Single long-scroll page: Hero → Tour → Music → Vault → Videos → Merch → Footer.
 * All styles scoped under .ws-root. Reuses the existing ParticleLogo for the hero
 * "E" without modifying it.
 */
export default function EmskiSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPast, setShowPast] = useState(false);

  // Close mobile menu on resize past breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const nextShow = UPCOMING_SHOWS[0];
  const heroCtaLabel = nextShow
    ? `Next show · ${nextShow.date} · ${nextShow.city.split(",")[0]}`
    : "Tickets";

  return (
    <div className="ws-root">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="ws-nav" aria-label="Primary">
        <a href="#top" aria-label="EMSKI home" onClick={() => setMenuOpen(false)}>
          <img className="ws-nav__logo" src={logo} alt="EMSKI" />
        </a>
        <div className="ws-nav__links">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="ws-nav__link">
              {item.label}
            </a>
          ))}
        </div>
        <button
          className={`ws-nav__burger ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Mobile takeover menu ────────────────────────── */}
      <div className={`ws-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="ws-menu__link"
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <header id="top" className="ws-hero">
        {HERO_VIDEO ? (
          <video
            className="ws-hero__video"
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : null}
        <div className="ws-hero__veil" />
        <div className="ws-hero__inner">
          <ParticleLogo />
          <div className="ws-hero__tagline">Electronic · Live A/V</div>
        </div>
        {nextShow ? (
          <a href="#tour" className="ws-hero__cta">
            {heroCtaLabel}
            <span className="ws-arrow">→</span>
          </a>
        ) : null}
      </header>

      {/* ── Tour ────────────────────────────────────────── */}
      <section id="tour" className="ws-section">
        <p className="ws-section__eyebrow">01 — Tour</p>
        <h2 className="ws-section__title">On the road</h2>

        <ul className="ws-tour__list">
          {UPCOMING_SHOWS.map((show) => (
            <li key={show.date + show.city} className="ws-tour__row">
              <div className="ws-tour__date">
                {show.date}
                <span className="ws-tour__year">{show.year}</span>
              </div>
              <div className="ws-tour__venue">
                <span className="ws-tour__venue-name">{show.venue}</span>
                <span className="ws-tour__venue-city">{show.city}</span>
              </div>
              <a
                href={show.tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="ws-tour__tickets"
              >
                Tickets <span className="ws-arrow">→</span>
              </a>
            </li>
          ))}

          {showPast &&
            PAST_SHOWS.map((show) => (
              <li key={show.date + show.city} className="ws-tour__row is-past">
                <div className="ws-tour__date">
                  {show.date}
                  <span className="ws-tour__year">{show.year}</span>
                </div>
                <div className="ws-tour__venue">
                  <span className="ws-tour__venue-name">{show.venue}</span>
                  <span className="ws-tour__venue-city">{show.city}</span>
                </div>
                <span className="ws-tour__past-label">Past</span>
              </li>
            ))}
        </ul>

        {PAST_SHOWS.length > 0 ? (
          <button
            className="ws-tour__toggle"
            onClick={() => setShowPast((v) => !v)}
          >
            {showPast ? "Hide past shows" : `Show past shows (${PAST_SHOWS.length})`}
          </button>
        ) : null}

        <div className="ws-tour__footer">
          <a
            href={VAULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ws-tour__vault-link"
          >
            All shows on Vault <span className="ws-arrow">→</span>
          </a>
        </div>
      </section>

      {/* ── Music ───────────────────────────────────────── */}
      <section id="music" className="ws-section">
        <p className="ws-section__eyebrow">02 — Music</p>
        <h2 className="ws-section__title">Latest</h2>

        <div className="ws-music__featured">
          <div className="ws-music__cover">
            <img src={FEATURED_RELEASE.cover} alt={FEATURED_RELEASE.title} />
          </div>
          <div>
            <p className="ws-music__featured-label">{FEATURED_RELEASE.label}</p>
            <h3 className="ws-music__featured-title">{FEATURED_RELEASE.title}</h3>
            <p className="ws-music__featured-tagline">{FEATURED_RELEASE.tagline}</p>
            <p className="ws-music__featured-window">{FEATURED_RELEASE.releaseWindow}</p>
            <div className="ws-music__links">
              {FEATURED_RELEASE.links.spotify ? (
                <a href={FEATURED_RELEASE.links.spotify} target="_blank" rel="noopener noreferrer" className="ws-music__link">Spotify</a>
              ) : null}
              {FEATURED_RELEASE.links.apple ? (
                <a href={FEATURED_RELEASE.links.apple} target="_blank" rel="noopener noreferrer" className="ws-music__link">Apple Music</a>
              ) : null}
              {FEATURED_RELEASE.links.soundcloud ? (
                <a href={FEATURED_RELEASE.links.soundcloud} target="_blank" rel="noopener noreferrer" className="ws-music__link">SoundCloud</a>
              ) : null}
            </div>
          </div>
        </div>

        <ul className="ws-music__tracks">
          {TRACKS.map((t) => (
            <li key={t.title} className="ws-music__track">
              <span className="ws-music__track-num">{t.stageNum}</span>
              <span className="ws-music__track-stage">{t.stage}</span>
              <span className="ws-music__track-title">{t.title}</span>
              <span className="ws-music__track-release">{t.release}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Vault ───────────────────────────────────────── */}
      <section id="vault" className="ws-section ws-vault">
        <div className="ws-vault__inner">
          <p className="ws-section__eyebrow">03 — Vault</p>
          <h2 className="ws-section__title">The Vault</h2>
          <p className="ws-vault__lede">
            The home base for fans. Shows, drops, and behind-the-scenes — all in one place.
          </p>
          <ul className="ws-vault__bullets">
            {VAULT_BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <a
            href={VAULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ws-vault__cta"
          >
            Enter the Vault <span className="ws-arrow">→</span>
          </a>
        </div>
      </section>

      {/* ── Videos ──────────────────────────────────────── */}
      {VIDEOS.length > 0 ? (
        <section className="ws-section">
          <p className="ws-section__eyebrow">04 — Live</p>
          <h2 className="ws-section__title">Watch</h2>
          <div className="ws-videos__grid">
            {VIDEOS.map((v) => (
              <div key={v.title}>
                <div className="ws-video">
                  <iframe
                    src={v.embedUrl}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="ws-video__title">{v.title}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Merch (coming soon) ─────────────────────────── */}
      <section id="merch" className="ws-merch">
        <p className="ws-section__eyebrow">05 — Merch</p>
        <h2 className="ws-merch__big">Coming Soon</h2>
        <p className="ws-merch__sub">In production · drops soon</p>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="ws-footer">
        <div className="ws-footer__left">
          <div className="ws-footer__contact">
            Booking &amp; press · <a href={`mailto:${BOOKING_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <div className="ws-footer__copy">© {new Date().getFullYear()} EMSKI</div>
        </div>
        <div className="ws-footer__socials">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ws-footer__social"
            >
              {s.name}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
