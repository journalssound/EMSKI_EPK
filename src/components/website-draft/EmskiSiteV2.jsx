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
  MUSIC_BG,
  MERCH_BG,
  MERCH_ITEMS,
  MERCH_STORE_URL,
  BACKORDER_NOTE,
  SOCIAL_ICONS,
  CONTACT_EMAIL,
  BOOKING_EMAIL,
  EP_LISTEN_LINKS,
} from "./siteContent.js";
import "./website-v2.css";
import SocialIcon from "../SocialIcon";

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

/* ─── Product overlay — front/back views, sizes, details ────────────────
 * Checkout slots in at `wv-product__buy`: drop the Square buy-button embed
 * there (or a per-size link) once the store exists. */
function ProductOverlay({ item, onClose }) {
  const views = item.views?.length
    ? item.views
    : [{ label: "Front", src: item.image }];
  // sizes accept plain strings or {size, soldOut, backorder}
  const sizes = (item.sizes || []).map((s) =>
    typeof s === "string" ? { size: s } : s
  );
  const [view, setView] = useState(0);
  const [size, setSize] = useState(null);
  const soldOut = item.status === "sold-out" || sizes.every((s) => s.soldOut);
  const soon = item.status === "soon";
  const canBuy = !soldOut && !soon && Boolean(item.checkoutUrl);
  // Square doesn't enforce stock, so require a size before we hand off.
  const needsSize = canBuy && sizes.length > 0 && !size;
  const picked = sizes.find((s) => s.size === size);
  const anyBackorder = sizes.some((s) => s.backorder && !s.soldOut);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="wv-product"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button type="button" className="wv-product__close" aria-label="Close" onClick={onClose}>
        ×
      </button>

      <div className="wv-product__inner">
        <div className="wv-product__media">
          <div className="wv-product__frame">
            <FadeImg src={views[view].src} alt={`${item.name} — ${views[view].label}`} />
          </div>
          {views.length > 1 ? (
            <div className="wv-product__views">
              {views.map((v, i) => (
                <button
                  key={v.label}
                  type="button"
                  className={`wv-product__view${i === view ? " is-active" : ""}`}
                  onClick={() => setView(i)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="wv-product__info">
          <h3 className="wv-product__name">{item.name}</h3>
          {item.tagline ? <p className="wv-product__tagline">{item.tagline}</p> : null}
          {item.price ? <p className="wv-product__price">{item.price}</p> : null}
          {item.description ? (
            <p className="wv-product__desc">{item.description}</p>
          ) : null}

          {sizes.length ? (
            <div className="wv-product__sizes">
              <span className="wv-product__label">Size</span>
              <div className="wv-product__sizerow">
                {sizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    className={`wv-product__size${size === s.size ? " is-active" : ""}${
                      s.soldOut ? " is-out" : ""
                    }${s.backorder && !s.soldOut ? " is-backorder" : ""}`}
                    aria-pressed={size === s.size}
                    disabled={s.soldOut}
                    title={
                      s.soldOut
                        ? "Sold out"
                        : s.backorder
                          ? "Made to order — ships later"
                          : undefined
                    }
                    onClick={() => setSize(s.size)}
                  >
                    {s.size}
                    {s.backorder && !s.soldOut ? (
                      <span className="wv-product__dot" aria-hidden="true">
                        *
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              {anyBackorder ? (
                <p className="wv-product__legend">* Made to order</p>
              ) : null}
            </div>
          ) : null}

          {picked?.backorder && !picked.soldOut ? (
            <p className="wv-product__backorder">{BACKORDER_NOTE}</p>
          ) : null}

          <div className="wv-product__buy">
            <a
              className={`wv-boxlink${soldOut || needsSize ? " is-disabled" : ""}`}
              href={canBuy ? item.checkoutUrl : item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {soldOut
                ? "Sold out"
                : soon
                  ? "Get notified"
                  : needsSize
                    ? "Select a size"
                    : "Buy now"}
            </a>
            {canBuy && size ? (
              <p className="wv-product__note">
                Checkout opens on Square — choose {size} there to match.
              </p>
            ) : null}
          </div>

          {item.details?.length ? (
            <ul className="wv-product__details">
              {item.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── COBRAH albumTitle sizing: long titles step down so they fit ────────
 * Measured on cobrahcore.com: DOG/HUSH/TEA 8.75vw, SIGN FROM GOD 5.9vw,
 * BRAND NEW BITCH 5vw. */
function albumTitleSize(title) {
  const n = title.length;
  if (n <= 8) return "clamp(34px, 8.75vw, 160px)";
  if (n <= 13) return "clamp(26px, 5.9vw, 108px)";
  return "clamp(22px, 5vw, 92px)";
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
  const playerRef = useRef(null);
  // Permanent shield: hover never reaches the player (no YouTube chrome),
  // and tapping toggles sound via the API instead of exposing controls.
  const [muted, setMuted] = useState(true);

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
      playerRef.current = player;
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
        <button
          type="button"
          className="wv-mv__shield"
          aria-label={muted ? `Enable sound for ${video.title}` : `Mute ${video.title}`}
          onClick={() => {
            try {
              if (muted) playerRef.current?.unMute();
              else playerRef.current?.mute();
              setMuted(!muted);
            } catch {
              /* player not ready yet — tap again once it is */
            }
          }}
        >
          <span>{muted ? "Tap for sound" : "Mute"}</span>
        </button>
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
      {/* Window wraps the track so the side arrows center on it (COBRAH:
          arrows flank the cards mid-height, progress hairline below). */}
      <div className="wv-carousel__window">
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
        <button
          type="button"
          className="wv-carousel__btn wv-carousel__btn--prev"
          aria-label="Previous"
          disabled={pos.atStart}
          onClick={() => scrollByPage(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="wv-carousel__btn wv-carousel__btn--next"
          aria-label="Next"
          disabled={pos.atEnd}
          onClick={() => scrollByPage(1)}
        >
          →
        </button>
      </div>
      <div className="wv-carousel__nav">
        <div className="wv-carousel__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${pos.progress})` }} />
        </div>
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
  const [product, setProduct] = useState(null);
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
        <h2 className="wv-section__title wv-reveal">Video</h2>
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
            {MERCH_ITEMS.map((m) => {
              const allOut =
                Array.isArray(m.sizes) &&
                m.sizes.length > 0 &&
                m.sizes.every((s) => typeof s !== "string" && s.soldOut);
              const soldOut = m.status === "sold-out" || allOut;
              const soon = m.status === "soon";
              // Some sizes ship on a reprint — surfaced on the card so it's
              // known before opening the product.
              const hasBackorder =
                Array.isArray(m.sizes) &&
                m.sizes.some((s) => typeof s !== "string" && s.backorder && !s.soldOut);
              return (
                <div className="wv-merch__item wv-reveal" key={m.name}>
                  <button
                    type="button"
                    className="wv-merch__card"
                    onClick={() => setProduct(m)}
                    aria-label={`View ${m.name}`}
                  >
                    <FadeImg src={m.image} alt={m.name} loading="lazy" />
                    {soldOut || soon || hasBackorder ? (
                      <span className="wv-merch__badge">
                        {soldOut
                          ? "Sold out"
                          : soon
                            ? "Coming soon"
                            : "Some sizes made to order"}
                      </span>
                    ) : null}
                  </button>
                  <p className="wv-merch__name">{m.name}</p>
                  {m.price ? <p className="wv-merch__price">{m.price}</p> : null}
                  {m.sizes?.length ? (
                    <p className="wv-merch__sizes">
                      {m.sizes
                        .map((s) => (typeof s === "string" ? s : s.size))
                        .join(" · ")}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className={`wv-boxlink${soldOut ? " is-disabled" : ""}`}
                    onClick={() => setProduct(m)}
                    aria-disabled={soldOut || undefined}
                  >
                    {soldOut ? "Sold out" : soon ? "Get notified" : "Shop now"}
                  </button>
                </div>
              );
            })}
          </div>
          {MERCH_STORE_URL ? (
            <div className="wv-merch__all wv-reveal">
              <a
                className="wv-boxlink"
                href={MERCH_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop all merch
              </a>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Product overlay ──────────────────────────────── */}
      {product ? (
        <ProductOverlay item={product} onClose={() => setProduct(null)} />
      ) : null}

      {/* ── Music — COBRAH: one backdrop, titles scroll over it ── */}
      <section className="wv-music-band" id="music">
        <FadeImg className="wv-music-band__bg" src={MUSIC_BG} alt="" aria-hidden="true" />
        <div className="wv-music-band__veil" />
        <div className="wv-music-band__inner">
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
                  <span className="wv-rel__title" style={{ fontSize: albumTitleSize(r.title) }}>
                    {r.title}
                  </span>
                  <span className="wv-rel__meta">
                    {[r.label, r.releaseDate ? String(r.releaseDate).slice(0, 4) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  <span className="wv-boxlink">Listen now</span>
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
        </div>
      </section>

      {/* ── Tour ─────────────────────────────────────────── */}
      <section className="wv-section wv-tour" id="tour">
        <h2 className="wv-section__title wv-reveal">Tour</h2>

        {upcoming.length > 0 ? (
          <ul className="wv-tour__list wv-reveal">
            {upcoming.map((show) => (
              <li key={show.date + show.city} className="wv-tour__row">
                <span className="wv-tour__info">
                  <span className="wv-tour__date">
                    {formatShowDate(show.date)} {formatShowYear(show.date)}
                  </span>
                  <span className="wv-tour__venue">
                    <span className="wv-tour__venue-name">{show.venue}</span>
                    <span className="wv-tour__venue-city">{show.city}</span>
                  </span>
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
                <span className="wv-tour__info">
                  <span className="wv-tour__date">
                    {formatShowDate(show.date)} {formatShowYear(show.date)}
                  </span>
                  <span className="wv-tour__venue">
                    <span className="wv-tour__venue-name">{show.venue}</span>
                    <span className="wv-tour__venue-city">{show.city}</span>
                  </span>
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
