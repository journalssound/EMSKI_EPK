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
  MERCH_BG,
  MERCH_ITEMS,
  SOCIAL_ICONS,
  CONTACT_EMAIL,
  BOOKING_EMAIL,
  EP_LISTEN_LINKS,
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

/* ─── Image that fades in once loaded (no pop-in) ───────────────────────── */
function FadeImg({ className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  // Cached images may already be complete before onLoad can fire.
  const onRef = useCallback((el) => {
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    <img
      {...props}
      ref={onRef}
      className={`wv-fadeimg ${className}`}
      data-loaded={loaded || undefined}
      onLoad={() => setLoaded(true)}
    />
  );
}

/* ─── YouTube IFrame API loader (shared) ────────────────────────────────── */
let ytApiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

/* ─── Music video card — ambient muted autoplay in a clean frame ────────── */
function MusicVideoCard({ video, index }) {
  const iframeRef = useRef(null);

  // YouTube force-enables captions on muted autoplay and ignores
  // cc_load_policy for that. Attach the official IFrame API to each embed
  // and unload the caption modules on ready and whenever playback starts.
  useEffect(() => {
    let player = null;
    let cancelled = false;
    const kill = (p) => {
      try {
        p.unloadModule("captions");
        p.unloadModule("cc");
      } catch {
        /* player not ready yet — later events retry */
      }
    };
    loadYouTubeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return;
      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: (e) => kill(e.target),
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) kill(e.target);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* already gone */
      }
    };
  }, []);

  return (
    <div
      className="wv-carousel__item wv-mv wv-reveal"
      style={{ "--wv-delay": `${index * 120}ms` }}
    >
      <div className="wv-mv__frame">
        <iframe
          ref={iframeRef}
          src={video.embedUrl}
          title={`${video.title} — music video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="wv-mv__title">{video.title}</p>
    </div>
  );
}

/* ─── Carousel (scroll-snap + arrows, COBRAH prev/next style) ─────────────
 * Arrows disable at the ends, a hairline progress bar tracks position,
 * and the track supports mouse drag-to-scroll (touch scrolls natively). */
function Carousel({ label, children }) {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [pos, setPos] = useState({ atStart: true, atEnd: true, progress: 0 });

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    setPos({
      atStart: x <= 4,
      atEnd: x >= max - 4,
      progress: max > 0 ? Math.min(1, Math.max(0, x / max)) : 1,
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, children]);

  const scrollByPage = useCallback((dir) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector(".wv-carousel__item");
    const step = item ? item.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const onPointerDown = (e) => {
    const track = trackRef.current;
    if (!track || e.pointerType !== "mouse") return;
    dragRef.current = { startX: e.clientX, startLeft: track.scrollLeft, moved: false };
    track.classList.add("is-dragging");
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    const track = trackRef.current;
    if (!d || !track) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) d.moved = true;
    track.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const track = trackRef.current;
    if (!dragRef.current || !track) return;
    track.classList.remove("is-dragging");
    if (dragRef.current.moved) suppressClickRef.current = true;
    dragRef.current = null;
  };
  const onClickCapture = (e) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  return (
    <div className="wv-carousel">
      <div
        className="wv-carousel__track"
        ref={trackRef}
        aria-label={label}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
      <div className="wv-carousel__nav">
        <button
          type="button"
          className="wv-carousel__btn"
          aria-label="Previous"
          disabled={pos.atStart}
          onClick={() => scrollByPage(-1)}
        >
          ←
        </button>
        <div className="wv-carousel__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${pos.progress})` }} />
        </div>
        <button
          type="button"
          className="wv-carousel__btn"
          aria-label="Next"
          disabled={pos.atEnd}
          onClick={() => scrollByPage(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}

/**
 * Public-facing fan site at /website-draft — COBRAH-style redesign.
 *
 * Hero (video + difference-blend wordmark + icon row)
 *   → EP slide (E/MOTION · debut EP · LISTEN NOW, live-show backdrop)
 *   → Music videos (ambient muted autoplay, clean frames)
 *   → Merch (product over live-photo band)
 *   → Music (release carousel — big covers → streaming links)
 *   → Tour (centered · completed dates · Vault signup CTA)
 *   → Footer (subscribe → Vault, icons)
 */
export default function EmskiSiteV2() {
  const [releases, setReleases] = useState(RELEASES);
  const [listenOpen, setListenOpen] = useState(false);
  const rootRef = useRef(null);
  const nameWrapRef = useRef(null);

  // Esc closes the listen overlay
  useEffect(() => {
    if (!listenOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setListenOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listenOpen]);

  const { upcoming, past } = useMemo(() => splitShows(SHOWS), []);

  // Hero parallax — wordmark recedes slower than the video as you scroll.
  useEffect(() => {
    const el = nameWrapRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.setProperty("--wv-parallax", `${y * 0.22}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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

  const spotifyUrl = SOCIAL_ICONS.find((s) => s.icon === "spotify")?.url;
  const appleUrl = SOCIAL_ICONS.find((s) => s.icon === "apple")?.url;

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

        <IconRow className="wv-icons--hero" />

        {/* Wordmark blends the raw video through itself — glassy COBRAH treatment */}
        <div className="wv-hero__name-wrap" ref={nameWrapRef}>
          <img className="wv-hero__name" src={logo} alt="EMSKI" />
        </div>
      </header>

      {/* ── EP slide ─────────────────────────────────────── */}
      <section className="wv-ep">
        <FadeImg className="wv-ep__bg" src={FEATURED_EP.bg} alt="" aria-hidden="true" />
        <div className="wv-ep__veil" />
        <div className="wv-ep__content">
          <h2 className="wv-ep__title wv-reveal">{FEATURED_EP.title}</h2>
          <p className="wv-ep__tagline wv-reveal">{FEATURED_EP.tagline}</p>
          <button
            type="button"
            className="wv-boxlink wv-reveal"
            onClick={() => setListenOpen(true)}
          >
            {FEATURED_EP.cta}
          </button>
        </div>
      </section>

      {/* ── Listen overlay — link-tree platform chooser ──── */}
      {listenOpen ? (
        <div
          className="wv-listen"
          role="dialog"
          aria-modal="true"
          aria-label="Choose a streaming platform"
          onClick={(e) => {
            if (e.target === e.currentTarget) setListenOpen(false);
          }}
        >
          <button
            type="button"
            className="wv-listen__close"
            aria-label="Close"
            onClick={() => setListenOpen(false)}
          >
            ×
          </button>
          <p className="wv-listen__title">{FEATURED_EP.title}</p>
          <p className="wv-listen__sub">Choose your platform</p>
          <div className="wv-listen__links">
            {EP_LISTEN_LINKS.map((l) => (
              <a
                key={l.name}
                className="wv-boxlink"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Music videos ─────────────────────────────────── */}
      <section className="wv-section" id="video">
        <h2 className="wv-section__title wv-reveal">Music Videos</h2>
        <Carousel label="Music videos">
          {MUSIC_VIDEOS.map((v, i) => (
            <MusicVideoCard video={v} index={i} key={v.id} />
          ))}
        </Carousel>
      </section>

      {/* ── Merch ────────────────────────────────────────── */}
      <section className="wv-merch-band" id="merch">
        <FadeImg className="wv-merch-band__bg" src={MERCH_BG} alt="" aria-hidden="true" />
        <div className="wv-merch-band__veil" />
        <div className="wv-merch-band__inner">
          <h2 className="wv-section__title wv-reveal">Merch</h2>
          <div className="wv-merch">
            {MERCH_ITEMS.map((m) => (
              <div className="wv-merch__item wv-reveal" key={m.name}>
                <div className="wv-merch__card">
                  <FadeImg src={m.image} alt={m.name} loading="lazy" />
                </div>
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
        </div>
      </section>

      {/* ── Music — release carousel (COBRAH slides) ─────── */}
      <section className="wv-section wv-music" id="music">
        <h2 className="wv-section__title wv-reveal">Music</h2>
        <Carousel label="Releases">
          {releases.map((r, i) => (
            <div
              className="wv-carousel__item wv-rel wv-reveal"
              key={r.id || r.title}
              style={{ "--wv-delay": `${Math.min(i, 6) * 90}ms` }}
            >
              <a
                className="wv-rel__link"
                href={r.spotifyUrl || spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {r.cover ? (
                  <span className="wv-rel__cover">
                    <FadeImg src={r.cover} alt={`${r.title} cover art`} loading="lazy" />
                  </span>
                ) : null}
                <span className="wv-rel__title">{r.title}</span>
                <span className="wv-rel__meta">
                  {[r.label, r.releaseDate ? String(r.releaseDate).slice(0, 4) : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span className="wv-boxlink wv-boxlink--sm">Listen now</span>
              </a>
            </div>
          ))}
        </Carousel>
        <div className="wv-music__all wv-reveal">
          <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="wv-boxlink">
            All music on Spotify
          </a>
          <a href={appleUrl} target="_blank" rel="noopener noreferrer" className="wv-boxlink">
            Apple Music
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
          <span className="wv-tour__notify-text">Get notified when new events are announced</span>
          <a href={VAULT_URL} target="_blank" rel="noopener noreferrer" className="wv-boxlink">
            Sign up for tour updates
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
    </div>
  );
}
