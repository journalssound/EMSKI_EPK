import { useState, useEffect, useRef, useMemo } from "react";
import ParticleLogo from "../ParticleLogo.jsx";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import {
  NAV,
  SHOWS,
  splitShows,
  formatShowDate,
  formatShowYear,
  RELEASES,
  STREAMING_LINKS,
  VAULT_URL,
  VAULT_OFFERS,
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
 * All styles scoped under .ws-root. Scroll-reveal via IntersectionObserver — no deps.
 */
export default function EmskiSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [flippedRelease, setFlippedRelease] = useState(null); // index of flipped card, or null
  const [releases, setReleases] = useState(RELEASES); // static fallback; replaced by live data on mount
  const rootRef = useRef(null);

  const { upcoming, past } = useMemo(() => splitShows(SHOWS), []);

  // Pull latest releases from Spotify via Netlify function. Silent fallback on failure.
  useEffect(() => {
    let cancelled = false;
    fetch("/.netlify/functions/releases")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`http_${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data?.releases) && data.releases.length > 0) {
          setReleases(data.releases);
        }
      })
      .catch(() => {
        /* Keep static fallback. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close mobile menu on resize past breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll-reveal: add .is-in to any .ws-reveal as it enters viewport
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      root.querySelectorAll(".ws-reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll(".ws-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const nextShow = upcoming[0];
  const heroCtaLabel = nextShow
    ? `Next show · ${formatShowDate(nextShow.date)} · ${nextShow.city.split(",")[0]}`
    : "All shows";

  // Helper for stagger delays
  const delay = (ms) => ({ "--ws-reveal-delay": `${ms}ms` });

  return (
    <div className="ws-root" ref={rootRef}>
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
        </div>
        {nextShow ? (
          <a href="#tour" className="ws-hero__cta" aria-label={`Next show — ${nextShow.city}`}>
            {heroCtaLabel}
            <span className="ws-arrow">→</span>
          </a>
        ) : null}
      </header>

      {/* ── Tour ────────────────────────────────────────── */}
      <section id="tour" className="ws-section">
        <div className="ws-section__head">
          <h2 className="ws-section__title ws-reveal">Tour</h2>
        </div>

        {upcoming.length > 0 ? (
          <ul className="ws-tour__list">
            {upcoming.map((show, i) => (
              <li
                key={show.date + show.city}
                className="ws-tour__row ws-reveal"
                style={delay(80 * i)}
              >
                <div className="ws-tour__date">
                  {formatShowDate(show.date)}
                  <span className="ws-tour__year">{formatShowYear(show.date)}</span>
                </div>
                <div className="ws-tour__venue">
                  <span className="ws-tour__venue-name">{show.venue}</span>
                  <span className="ws-tour__venue-city">{show.city}</span>
                </div>
                {show.tickets ? (
                  <a
                    href={show.tickets}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ws-tour__tickets"
                  >
                    Tickets <span className="ws-arrow">→</span>
                  </a>
                ) : (
                  <span className="ws-tour__past-label">TBA</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ws-tour__empty ws-reveal">
            No shows announced yet — check back soon.
          </p>
        )}

        {past.length > 0 && showPast && (
          <ul className="ws-tour__list ws-tour__list--past">
            {past.map((show) => (
              <li key={show.date + show.city} className="ws-tour__row is-past">
                <div className="ws-tour__date">
                  {formatShowDate(show.date)}
                  <span className="ws-tour__year">{formatShowYear(show.date)}</span>
                </div>
                <div className="ws-tour__venue">
                  <span className="ws-tour__venue-name">{show.venue}</span>
                  <span className="ws-tour__venue-city">{show.city}</span>
                </div>
                <span className="ws-tour__past-label">Past</span>
              </li>
            ))}
          </ul>
        )}

        {past.length > 0 && (
          <button
            className="ws-tour__toggle ws-reveal"
            onClick={() => setShowPast((v) => !v)}
          >
            {showPast ? "Hide past shows" : `Show past shows (${past.length})`}
          </button>
        )}

        <div className="ws-tour__footer ws-reveal">
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
        <div className="ws-section__head">
          <h2 className="ws-section__title ws-reveal">Music</h2>
        </div>

        <div className="ws-releases">
          {releases.map((r, i) => {
            const isFlipped = flippedRelease === i;
            return (
              <div
                key={r.id || r.cover}
                className={`ws-release ws-reveal ${isFlipped ? "is-flipped" : ""}`}
                style={delay(80 * (i % 4))}
              >
                <div className="ws-release__inner">
                  <button
                    type="button"
                    className="ws-release__face ws-release__front"
                    aria-label={`Play ${r.title}`}
                    onClick={() => setFlippedRelease(i)}
                  >
                    {r.cover ? <img src={r.cover} alt={r.title} loading="lazy" /> : null}
                    <div className="ws-release__overlay">
                      <span className="ws-release__label">{r.label || r.title}</span>
                      <span className="ws-release__play">▶ Listen</span>
                    </div>
                  </button>
                  <div className="ws-release__face ws-release__back" aria-hidden={!isFlipped}>
                    {isFlipped ? (
                      <iframe
                        src={r.embedUrl}
                        title={`${r.title} — Spotify`}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : null}
                    <button
                      type="button"
                      className="ws-release__close"
                      aria-label="Close player"
                      onClick={() => setFlippedRelease(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ws-music__listen ws-reveal">
          <span className="ws-music__listen-label">Listen on</span>
          <div className="ws-music__listen-links">
            {STREAMING_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ws-music__link"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vault (newsletter) ──────────────────────────── */}
      <div className="ws-vault-wrap">
        <section id="vault" className="ws-section ws-vault">
          <div className="ws-section__head">
            <p className="ws-vault__eyebrow ws-reveal">Newsletter</p>
            <h2 className="ws-section__title ws-reveal" style={delay(80)}>The Vault</h2>
          </div>
          <ul className="ws-vault__offers">
            {VAULT_OFFERS.map((o, i) => (
              <li key={o} className="ws-reveal" style={delay(160 + 80 * i)}>
                {o}
              </li>
            ))}
          </ul>
          <a
            href={VAULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ws-vault__cta ws-reveal"
            style={delay(480)}
          >
            Sign up <span className="ws-arrow">→</span>
          </a>
        </section>
      </div>

      {/* ── Videos ──────────────────────────────────────── */}
      {VIDEOS.length > 0 ? (
        <section className="ws-section">
          <div className="ws-section__head">
            <h2 className="ws-section__title ws-reveal">Watch</h2>
          </div>
          <div className="ws-videos__grid">
            {VIDEOS.map((v, i) => (
              <div key={v.title} className="ws-reveal" style={delay(80 * i)}>
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
        <h2 className="ws-merch__big ws-reveal">Merch</h2>
        <p className="ws-merch__sub ws-reveal" style={delay(120)}>In production · drops soon</p>
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
