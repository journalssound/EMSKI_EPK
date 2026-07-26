import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import {
  SHOWS,
  splitShows,
  formatShowDate,
  formatShowYear,
  RELEASES,
  VAULT_URL,
  HERO_VIDEO_V2,
  FEATURED_EP,
  MUSIC_VIDEOS,
  MERCH_ITEMS,
  SOCIAL_ICONS,
  CONTACT_EMAIL,
  BOOKING_EMAIL,
} from "./siteContent.js";
import "./website-v2.css";

/* ─── Social icons (inline SVG, 1em sizing) ─────────────────────────────── */
const ICON_PATHS = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.6 3c.36 1.98 1.61 3.32 3.66 3.45v2.58c-1.36.05-2.55-.35-3.66-1.12v5.87c0 3.62-2.4 5.72-5.42 5.72-2.84 0-5.18-2.13-5.18-5.03 0-2.98 2.42-5.06 5.5-4.9v2.63c-.3-.06-.6-.09-.9-.07-1.32.08-2.24 1.03-2.24 2.34 0 1.35 1.07 2.4 2.5 2.4 1.6 0 2.66-1.12 2.66-3.03V3h3.08Z"
    />
  ),
  youtube: (
    <>
      <rect x="2" y="5.5" width="20" height="13" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path fill="currentColor" d="M10.2 9.2v5.6l5-2.8-5-2.8Z" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7.6 9.7c3-.85 6.1-.6 8.8.85M8 12.4c2.5-.7 5-.45 7.2.75M8.4 15c2-.55 3.9-.35 5.7.6"
      />
    </>
  ),
  apple: (
    <path
      fill="currentColor"
      d="M16.7 12.6c-.02-2 1.63-2.96 1.7-3-.92-1.35-2.36-1.54-2.87-1.56-1.22-.12-2.38.72-3 .72-.62 0-1.58-.7-2.6-.68-1.33.02-2.56.78-3.25 1.97-1.39 2.4-.36 5.96 1 7.9.66.95 1.45 2.02 2.48 1.98 1-.04 1.37-.64 2.58-.64 1.2 0 1.54.64 2.6.62 1.07-.02 1.75-.97 2.4-1.93.76-1.1 1.07-2.17 1.09-2.23-.03-.01-2.1-.8-2.13-3.15ZM14.7 6.7c.55-.66.92-1.58.82-2.5-.79.03-1.75.53-2.32 1.19-.5.58-.95 1.52-.83 2.42.88.07 1.78-.45 2.33-1.11Z"
    />
  ),
  soundcloud: (
    <path
      fill="currentColor"
      d="M18.1 10.2c-.3 0-.58.05-.85.14A5.06 5.06 0 0 0 12.3 6c-.58 0-1.15.1-1.66.29-.2.07-.25.15-.25.3v9.06c0 .16.12.3.28.31h7.43c1.7 0 3.07-1.34 3.07-3.02a3.05 3.05 0 0 0-3.07-2.74ZM8.9 7.5c-.22 0-.4.18-.4.4v7.66c0 .22.18.4.4.4s.4-.18.4-.4V7.9c0-.22-.18-.4-.4-.4ZM6.6 8.8c-.22 0-.4.18-.4.4v6.36c0 .22.18.4.4.4s.4-.18.4-.4V9.2c0-.22-.18-.4-.4-.4ZM4.3 10.3c-.22 0-.4.18-.4.4v4.86c0 .22.18.4.4.4s.4-.18.4-.4V10.7c0-.22-.18-.4-.4-.4ZM2 11.4c-.22 0-.4.18-.4.4v3.16c0 .22.18.4.4.4s.4-.18.4-.4V11.8c0-.22-.18-.4-.4-.4Z"
    />
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
};

function SocialIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICON_PATHS[icon] || null}
    </svg>
  );
}

function IconRow({ className = "" }) {
  return (
    <div className={`wv-icons ${className}`}>
      {SOCIAL_ICONS.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target={s.url.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="wv-icons__link"
          aria-label={s.label}
        >
          <SocialIcon icon={s.icon} />
        </a>
      ))}
    </div>
  );
}

/* ─── Carousel (scroll-snap + arrows, COBRAH prev/next style) ───────────── */
function Carousel({ label, children }) {
  const trackRef = useRef(null);
  const scrollByPage = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector(".wv-carousel__item");
    const step = item ? item.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <div className="wv-carousel">
      <div className="wv-carousel__track" ref={trackRef} aria-label={label}>
        {children}
      </div>
      <div className="wv-carousel__nav">
        <button type="button" className="wv-carousel__btn" aria-label="Previous" onClick={() => scrollByPage(-1)}>
          ←
        </button>
        <button type="button" className="wv-carousel__btn" aria-label="Next" onClick={() => scrollByPage(1)}>
          →
        </button>
      </div>
    </div>
  );
}

/**
 * Public-facing fan site at /website-draft — COBRAH-style redesign.
 *
 * Hero (video + blend-mode wordmark + icon row)
 *   → EP slide (debut EP out now / get it now)
 *   → Video carousel (lyric + live videos, modal player)
 *   → Merch (shop cards)
 *   → Music carousel (full-bleed covers, GET IT NOW → Spotify)
 *   → Tour (upcoming + completed dates, get-notified → Vault)
 *   → Footer (subscribe → Vault, icons)
 */
export default function EmskiSiteV2() {
  const [releases, setReleases] = useState(RELEASES);
  const [activeVideo, setActiveVideo] = useState(null); // MUSIC_VIDEOS entry or null
  const rootRef = useRef(null);

  const { upcoming, past } = useMemo(() => splitShows(SHOWS), []);

  // Latest releases from Spotify via Cloudflare Pages Function; silent fallback.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/releases")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`http_${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data?.releases) && data.releases.length > 0) {
          setReleases(data.releases);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll reveal (data attribute so React re-renders can't wipe it).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      root.querySelectorAll(".wv-reveal").forEach((el) => {
        el.dataset.revealed = "true";
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    root.querySelectorAll(".wv-reveal").forEach((el) => {
      if (!el.dataset.revealed) io.observe(el);
    });
    return () => io.disconnect();
  }, [releases]);

  // Close video modal on Escape; lock scroll while open.
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeVideo]);

  const spotifyUrl = SOCIAL_ICONS.find((s) => s.icon === "spotify")?.url;

  return (
    <div className="wv-root" ref={rootRef}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="wv-hero" id="top">
        <video
          className="wv-hero__video"
          src={HERO_VIDEO_V2}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="wv-hero__grade" />

        <IconRow className="wv-icons--hero" />

        <div className="wv-hero__name-wrap">
          <img className="wv-hero__name" src={logo} alt="EMSKI" />
          <div className="wv-hero__release">
            <span className="wv-hero__release-title">{FEATURED_EP.title}</span>
            <a
              className="wv-hero__release-link"
              href={FEATURED_EP.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it now
            </a>
          </div>
        </div>
      </header>

      {/* ── EP slide ─────────────────────────────────────── */}
      <section className="wv-ep" id="music">
        <img className="wv-ep__bg" src={FEATURED_EP.cover} alt="" aria-hidden="true" />
        <div className="wv-ep__veil" />
        <div className="wv-ep__content">
          <h2 className="wv-ep__title wv-reveal">{FEATURED_EP.title}</h2>
          <p className="wv-ep__tagline wv-reveal">{FEATURED_EP.tagline}</p>
          <a
            className="wv-boxlink wv-reveal"
            href={FEATURED_EP.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            get it now
          </a>
        </div>
      </section>

      {/* ── Video ────────────────────────────────────────── */}
      <section className="wv-section" id="video">
        <h2 className="wv-section__title wv-reveal">Video</h2>
        <Carousel label="Music and live videos">
          {MUSIC_VIDEOS.map((v) => (
            <div className="wv-carousel__item wv-video-card" key={v.title}>
              <button
                type="button"
                className="wv-video-card__thumb"
                onClick={() => setActiveVideo(v)}
                aria-label={`Play ${v.title}`}
              >
                <img src={v.thumb} alt={v.title} loading="lazy" />
                <span className="wv-video-card__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <p className="wv-video-card__title">{v.title}</p>
            </div>
          ))}
        </Carousel>
      </section>

      {/* ── Merch ────────────────────────────────────────── */}
      <section className="wv-section" id="merch">
        <h2 className="wv-section__title wv-reveal">Merch</h2>
        <div className="wv-merch">
          {MERCH_ITEMS.map((m) => (
            <div className="wv-merch__item wv-reveal" key={m.name}>
              <img src={m.image} alt={m.name} loading="lazy" />
              <p className="wv-merch__note">{m.note}</p>
              <a
                className="wv-boxlink"
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Music ────────────────────────────────────────── */}
      <section className="wv-music">
        <h2 className="wv-section__title wv-reveal">Music</h2>
        <Carousel label="Releases">
          {releases.map((r) => (
            <div className="wv-carousel__item wv-music-slide" key={r.id || r.title}>
              {r.cover ? (
                <img className="wv-music-slide__bg" src={r.cover} alt="" aria-hidden="true" loading="lazy" />
              ) : null}
              <div className="wv-music-slide__veil" />
              <span className="wv-music-slide__title">{r.title}</span>
              <a
                className="wv-boxlink wv-music-slide__link"
                href={r.spotifyUrl || spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get it now
              </a>
            </div>
          ))}
        </Carousel>
        <div className="wv-music__all wv-reveal">
          <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="wv-underline-link">
            All music on Spotify
          </a>
        </div>
      </section>

      {/* ── Tour ─────────────────────────────────────────── */}
      <section className="wv-section wv-tour" id="tour">
        <h2 className="wv-section__title wv-reveal">Tour</h2>

        {upcoming.length > 0 ? (
          <ul className="wv-tour__list wv-reveal">
            {upcoming.map((show) => (
              <li key={show.date + show.city} className="wv-tour__row">
                <span className="wv-tour__date">
                  {formatShowDate(show.date)} {formatShowYear(show.date)}
                </span>
                <span className="wv-tour__venue">
                  <span className="wv-tour__venue-name">{show.venue}</span>
                  <span className="wv-tour__venue-city">{show.city}</span>
                </span>
                {show.tickets ? (
                  <a className="wv-boxlink wv-boxlink--sm" href={show.tickets} target="_blank" rel="noopener noreferrer">
                    Tickets
                  </a>
                ) : (
                  <span className="wv-tour__tba">TBA</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="wv-tour__empty wv-reveal">There are no upcoming events.</p>
        )}

        {past.length > 0 ? (
          <ul className="wv-tour__list wv-tour__list--past wv-reveal">
            {past.map((show) => (
              <li key={show.date + show.city} className="wv-tour__row is-past">
                <span className="wv-tour__date">
                  {formatShowDate(show.date)} {formatShowYear(show.date)}
                </span>
                <span className="wv-tour__venue">
                  <span className="wv-tour__venue-name">{show.venue}</span>
                  <span className="wv-tour__venue-city">{show.city}</span>
                </span>
                <span className="wv-tour__tba">Completed</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="wv-tour__notify wv-reveal">
          <span>Get notified when new events are announced</span>
          <a href={VAULT_URL} target="_blank" rel="noopener noreferrer" className="wv-underline-link">
            Follow EMSKI
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="wv-footer">
        <div className="wv-footer__row">
          <a
            href={VAULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="wv-footer__subscribe"
          >
            Subscribe
          </a>
          <IconRow className="wv-icons--footer" />
        </div>
        <div className="wv-footer__meta">
          <span>
            Booking &amp; press · <a href={`mailto:${BOOKING_EMAIL}`}>{CONTACT_EMAIL}</a>
          </span>
          <span>© {new Date().getFullYear()} EMSKI</span>
        </div>
      </footer>

      {/* ── Video modal ──────────────────────────────────── */}
      {activeVideo ? (
        <div
          className="wv-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div className="wv-modal__body" onClick={(e) => e.stopPropagation()}>
            {activeVideo.kind === "youtube" ? (
              <iframe
                src={activeVideo.src}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={activeVideo.src} controls autoPlay playsInline />
            )}
            <button
              type="button"
              className="wv-modal__close"
              aria-label="Close video"
              onClick={() => setActiveVideo(null)}
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
