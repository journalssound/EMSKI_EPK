import { useEffect } from "react";
import { useScrollY, useDelayedLoad, useInView } from "../../hooks/useAnimations";
import Reveal from "../Reveal";
import VideoParticles from "../VideoParticles";
import EmotionField from "../EmotionField";
import {
  TOUR_META,
  TOUR_STOPS,
  ATTRIBUTION,
  ATTRIBUTION_TITLE,
  TOTALS,
  FINDING,
  NEXT_TOUR,
} from "./tourSummaryData";
import { HERO_VIDEO_R2 } from "../../data/content";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "./tour-summary.css";

/* ── Attribution bars — rendered inside the Dallas section ── */
function AttributionBars() {
  const [ref, visible] = useInView(0.3);

  return (
    <div ref={ref} className="ts-attr">
      <div className="ts-attr__title">{ATTRIBUTION_TITLE}</div>
      {ATTRIBUTION.map((row, i) => (
        <div key={row.source} className="ts-attr__row">
          <div className="ts-attr__source">{row.source}</div>
          <div className="ts-attr__track">
            <div
              className={`ts-attr__fill ${row.organic ? "ts-attr__fill--organic" : ""}`}
              style={{
                width: visible ? `${row.pct}%` : 0,
                transitionDelay: `${i * 0.1}s`,
              }}
            />
          </div>
          <div className="ts-attr__pct">{row.pct}%</div>
        </div>
      ))}
    </div>
  );
}

/* ── TikTok mini-player — pops up muted, beneath the content, hanging off a dotted line ── */
function TikTokPopup({ tiktok, sectionVisible }) {
  return (
    <div className={`ts-tiktok ${sectionVisible ? "ts-tiktok--visible" : ""}`}>
      <span className="ts-tiktok__line" />
      <div className="ts-tiktok__mini">
        {sectionVisible && (
          <iframe
            className="ts-tiktok__frame"
            src={`https://www.tiktok.com/player/v1/${tiktok.videoId}?autoplay=1&muted=1&loop=1&rel=0&native_context_menu=0`}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            title="TikTok video"
          />
        )}
      </div>
      <span className="ts-tiktok__label">{tiktok.label}</span>
    </div>
  );
}

/* ── One full-viewport section per city ── */
function CitySection({ stop }) {
  const [ref, visible] = useInView(0.25);

  /* Fit each video's true ratio inside a 460×500 box — no cropping,
   * every window lands at a comparable size. */
  let frameStyle;
  if (stop.videoAspect) {
    const [aw, ah] = stop.videoAspect.split("/").map(Number);
    const w = Math.round(Math.min(460, (500 * aw) / ah));
    frameStyle = { aspectRatio: stop.videoAspect, width: `${w}px` };
  }

  /* Optional start offset (seconds) — lets a stop open on a different frame
   * than another section sharing the same source file. `loop` always rewinds
   * to 0, so re-seek on the wrap to keep the clip inside its window. */
  const startAt = stop.videoStart ?? 0;
  const seekStart = (e) => {
    const v = e.currentTarget;
    if (startAt > 0 && v.duration > startAt) v.currentTime = startAt;
  };
  const holdWindow = (e) => {
    const v = e.currentTarget;
    if (startAt > 0 && v.duration > startAt && v.currentTime < startAt - 0.25) {
      v.currentTime = startAt;
    }
  };

  return (
    <section
      ref={ref}
      className={`ts-city ${visible ? "ts-city--visible" : ""}`}
    >
      <div
        className="ts-city__photo"
        style={{ backgroundImage: `url(${stop.photo})` }}
      />
      <div className="ts-city__scrim" />

      <div className="ts-wrap ts-city__inner">
        <div className="ts-city__idx">{stop.idx}</div>

        <div className="ts-city__cols">
          <div className="ts-city__content">
            <div className="ts-city__meta">
              {stop.dateLabel} · <span className="ts-city__venue">{stop.venue}</span>
              {stop.operator ? ` · ${stop.operator}` : ""}
            </div>

            <h2 className="ts-city__name">
              {stop.city}
              <span className="ts-city__state">{stop.state}</span>
            </h2>

            <div className="ts-city__statrow">
              <span className={`ts-city__stat ${stop.soldOut ? "ts-city__stat--sold" : ""}`}>
                {stop.stat}
              </span>
              <span className="ts-city__statlabel">{stop.statLabel}</span>
            </div>

            {stop.blurb && <p className="ts-city__blurb">{stop.blurb}</p>}

            {stop.points?.length > 0 && (
              <ul className="ts-city__points">
                {stop.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}

            {stop.tiktok && <TikTokPopup tiktok={stop.tiktok} sectionVisible={visible} />}

            {stop.showAttribution && <AttributionBars />}
          </div>

          {stop.video && (
            <div className="ts-city__media">
              <div className="ts-city__video-frame" style={frameStyle}>
                {visible && (
                  <video
                    className="ts-city__video"
                    src={stop.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={seekStart}
                    onTimeUpdate={holdWindow}
                  />
                )}
              </div>
              <span className="ts-city__video-label">Recap · {stop.city}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function TourSummary() {
  const loaded = useDelayedLoad(300);
  const scrollY = useScrollY();

  /* Private page: custom title + noindex. */
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "EMSKI — The_Effect Tour 2026";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);

  return (
    <div className="ts-root">
      {/* ━━ TOP BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`ts-topbar ${scrollY > 60 ? "ts-topbar--scrolled" : ""}`}>
        <span className="ts-topbar__logo">
          <img src={logo} alt="EMSKI" />
        </span>
        <span className="ts-topbar__tag">The_Effect Tour {TOUR_META.year}</span>
      </header>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={`ts-hero ${loaded ? "ts-hero--loaded" : ""}`}>        <video
          className="ts-hero__bg"
          src={HERO_VIDEO_R2}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="ts-hero__veil" />        <div className="ts-hero__glow" />
        <div className={`ts-hero__video ${loaded ? "ts-hero__video--loaded" : ""}`}>
          <VideoParticles src={TOUR_META.heroVideo} width={600} height={600} />
        </div>
        <h1 className="ts-hero__title">{TOUR_META.title}</h1>
        <div className="ts-hero__subline">{TOUR_META.subline}</div>
        <div className="ts-hero__tagline">{TOUR_META.kicker}</div>
        <div className="ts-hero__scrollcue" />
      </section>

      {/* ━━ CITIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {TOUR_STOPS.map((stop) => (
        <CitySection key={stop.city} stop={stop} />
      ))}

      {/* ━━ TOTALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="ts-section">
        <div className="ts-wrap">
          <Reveal>
            <div className="ts-totals">
              {TOTALS.map((t) => (
                <div key={t.label} className="ts-totals__cell">
                  <div className="ts-totals__value">{t.value}</div>
                  <div className="ts-totals__label">{t.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="ts-finding">
              <p className="ts-finding__lead">{FINDING.lead}</p>
              {FINDING.lines.map((line) => (
                <p key={line} className="ts-finding__line">
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ WINTER RUN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="ts-next">
        <EmotionField className="ts-next__field" />
        <div className="ts-next__fade" />
        <div className="ts-wrap ts-next__inner">
          <Reveal>
            <h2 className="ts-next__heading">{NEXT_TOUR.heading}</h2>
            <p className="ts-next__body">{NEXT_TOUR.body}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="ts-leads">
              {NEXT_TOUR.leads.map((lead) => (
                <div key={lead.title} className="ts-lead">
                  <span className="ts-lead__title">{lead.title}</span>
                  <span className="ts-lead__body">{lead.body}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <a className="ts-next__cta" href={`mailto:${NEXT_TOUR.contactEmail}`}>
              {NEXT_TOUR.contactEmail}
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="ts-footer">
        EMSKI · The_Effect Tour {TOUR_META.year} · Private
      </footer>
    </div>
  );
}
