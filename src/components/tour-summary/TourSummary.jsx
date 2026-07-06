import { useEffect } from "react";
import { useScrollY, useDelayedLoad, useInView } from "../../hooks/useAnimations";
import Reveal from "../Reveal";
import AnimNum from "../AnimNum";
import StaggerCell from "../StaggerCell";
import VideoParticles from "../VideoParticles";
import EmotionField from "../EmotionField";
import {
  TOUR_META,
  TOUR_STOPS,
  HEADLINE_STATS,
  FINDINGS,
  ATTRIBUTION,
  SOCIAL_GROWTH,
  NEXT_TOUR,
  OPERATORS,
} from "./tourSummaryData";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "./tour-summary.css";

/* ── Route map — stylized run: Denver → Dallas → San Antonio → Austin → McAllen ── */
function RouteMap() {
  const [ref, visible] = useInView(0.35);

  const routePath =
    "M 205 115 " +
    "C 380 128, 560 185, 640 255 " +
    "C 685 318, 625 385, 555 405 " +
    "C 545 362, 578 338, 625 330 " +
    "C 662 382, 618 442, 585 500";

  return (
    <div ref={ref} className={`ts-map ${visible ? "ts-map--visible" : ""}`}>
      <svg viewBox="0 0 1000 560" aria-label="Tour routing map">
        {/* static ghost of the full route */}
        <path className="ts-map__route-ghost" d={routePath} />
        {/* animated draw-in */}
        <path className="ts-map__route" d={routePath} pathLength="1" />

        {TOUR_STOPS.map((stop, i) => {
          const onLeft = stop.labelSide === "left";
          const lx = onLeft ? stop.mapX - 22 : stop.mapX + 22;
          return (
            <g key={stop.city}>
              <circle
                className="ts-map__pulse"
                cx={stop.mapX}
                cy={stop.mapY}
                r="7"
                style={{ animationDelay: `${0.6 + i * 0.5}s` }}
              />
              <circle
                className={`ts-map__node ${stop.soldOut ? "ts-map__node--sold" : ""}`}
                cx={stop.mapX}
                cy={stop.mapY}
                r="6"
                style={{ transitionDelay: `${0.5 + i * 0.45}s` }}
              />
              <text
                className="ts-map__label"
                x={lx}
                y={stop.mapY + 1}
                textAnchor={onLeft ? "end" : "start"}
                style={{ transitionDelay: `${0.7 + i * 0.45}s` }}
              >
                {stop.city.toUpperCase()}
                <tspan
                  className="ts-map__sublabel"
                  x={lx}
                  dy="16"
                >
                  {stop.dateLabel}
                  {stop.soldOut ? " · SOLD OUT" : ""}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Attribution bars — fills animate in on view ── */
function AttributionBars() {
  const [ref, visible] = useInView(0.3);

  return (
    <div ref={ref} className="ts-attr">
      <div className="ts-attr__title">
        Where the tickets came from — fully-tracked show (Dallas)
      </div>
      {ATTRIBUTION.map((row, i) => (
        <div key={row.source} className="ts-attr__row">
          <div className="ts-attr__source">{row.source}</div>
          <div className="ts-attr__track">
            <div
              className={`ts-attr__fill ${row.organic ? "ts-attr__fill--organic" : ""}`}
              style={{
                width: visible ? `${row.pct}%` : 0,
                transitionDelay: `${i * 0.12}s`,
              }}
            />
          </div>
          <div className="ts-attr__pct">{row.pct}%</div>
        </div>
      ))}
      <div className="ts-attr__note">
        83% of tickets came from unpaid channels. Paid ads: 7%.
      </div>
    </div>
  );
}

/* ── Headline counters ── */
function HeadlineStats() {
  const [ref, visible] = useInView(0.3);

  return (
    <div ref={ref} className="ts-stats">
      {HEADLINE_STATS.map((s, i) => (
        <StaggerCell key={s.label} index={i} baseDelay={0.08} className="ts-stats__cell">
          <div className="ts-stats__num">
            <AnimNum value={s.val} suffix={s.suf} visible={visible} />
          </div>
          <div className="ts-stats__label">{s.label}</div>
        </StaggerCell>
      ))}
    </div>
  );
}

export default function TourSummary() {
  const loaded = useDelayedLoad(300);
  const scrollY = useScrollY();

  /* Private page: custom title + noindex. */
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "EMSKI — e/MOTION Tour 2026 · Summary";

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
        <span className="ts-topbar__tag">e/MOTION Tour 2026 · Recap</span>
      </header>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className={`ts-hero ${loaded ? "ts-hero--loaded" : ""}`}>
        <div className="ts-hero__glow" />
        <div className={`ts-hero__video ${loaded ? "ts-hero__video--loaded" : ""}`}>
          <VideoParticles src={TOUR_META.heroVideo} width={280} height={280} />
        </div>
        <div className="ts-hero__kicker">Tour Summary · {TOUR_META.year}</div>
        <h1 className="ts-hero__title">
          e/<em>MOTION</em> TOUR
        </h1>
        <div className="ts-hero__tagline">{TOUR_META.tagline}</div>
        <div className="ts-hero__line">
          <strong>5 cities.</strong> 8 weeks. <strong>1,700+ fans.</strong> Two sellouts.
        </div>
        <div className="ts-hero__scrollcue" />
      </section>

      {/* ━━ THE STOPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="ts-section">
        <div className="ts-wrap">
          <Reveal>
            <div className="ts-section__kicker">The Run</div>
            <h2 className="ts-section__heading">Five stops. Every number up.</h2>
          </Reveal>

          <RouteMap />

          <div className="ts-stops">
            {TOUR_STOPS.map((stop, i) => (
              <StaggerCell key={stop.city} index={i} baseDelay={0.07} className="ts-stop">
                <div
                  className="ts-stop__photo"
                  style={{ backgroundImage: `url(${stop.photo})` }}
                />
                <div className="ts-stop__inner">
                  <div className="ts-stop__date">
                    {stop.dateLabel} · {TOUR_META.year}
                  </div>
                  {stop.soldOut ? (
                    <span className="ts-badge">Sold Out</span>
                  ) : (
                    <span className="ts-badge ts-badge--outline">{stop.headline}</span>
                  )}
                  <h3 className="ts-stop__city">
                    {stop.city}, {stop.state}
                  </h3>
                  <div className="ts-stop__venue">{stop.venue}</div>
                  <div className="ts-stop__operator">{stop.operator}</div>
                  <div className="ts-stop__stat">
                    {stop.stat}
                    <span>{stop.capacity} cap</span>
                  </div>
                  <p className="ts-stop__result">{stop.result}</p>
                </div>
              </StaggerCell>
            ))}
          </div>

          <Reveal delay={0.1}>
            <HeadlineStats />
          </Reveal>
        </div>
      </section>

      {/* ━━ WHAT WORKED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="ts-section">
        <div className="ts-wrap">
          <Reveal>
            <div className="ts-section__kicker">What Worked</div>
            <h2 className="ts-section__heading">The demand is organic.</h2>
          </Reveal>

          <div className="ts-findings">
            {FINDINGS.map((f, i) => (
              <StaggerCell key={f.num} index={i} baseDelay={0.09} className="ts-finding">
                <div className="ts-finding__num">{f.num}</div>
                <div>
                  <h3 className="ts-finding__title">{f.title}</h3>
                  <p className="ts-finding__body">{f.body}</p>
                </div>
              </StaggerCell>
            ))}
          </div>

          <AttributionBars />

          <div className="ts-social">
            {SOCIAL_GROWTH.map((s, i) => (
              <StaggerCell key={s.platform} index={i} baseDelay={0.1} className="ts-social__cell">
                <div className="ts-social__platform">{s.platform}</div>
                <div className="ts-social__nums">
                  <span className="ts-social__before">{s.before}</span>
                  <span className="ts-social__arrow">→</span>
                  <span className="ts-social__after">{s.after}</span>
                </div>
                <span className="ts-social__delta">{s.delta} on tour</span>
              </StaggerCell>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="ts-operators">
              <span className="ts-operators__label">Rooms operated by</span>
              {OPERATORS.map((op) => (
                <span key={op} className="ts-operators__name">
                  {op}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━ WINTER TOUR — THE ASK ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="ts-next">
        <EmotionField className="ts-next__field" />
        <div className="ts-next__fade" />
        <div className="ts-wrap ts-next__inner">
          <Reveal>
            <div className="ts-section__kicker">Next</div>
            <h2 className="ts-section__heading">{NEXT_TOUR.heading}</h2>
            <p className="ts-next__body">{NEXT_TOUR.body}</p>
          </Reveal>

          <div className="ts-leads">
            {NEXT_TOUR.leads.map((lead, i) => (
              <StaggerCell key={lead.title} index={i} baseDelay={0.12} className="ts-lead">
                <div className="ts-lead__title">{lead.title}</div>
                <div className="ts-lead__body">{lead.body}</div>
              </StaggerCell>
            ))}
          </div>

          <Reveal delay={0.15}>
            <a className="ts-next__cta" href={`mailto:${NEXT_TOUR.contactEmail}`}>
              Book the winter run
            </a>
            <span className="ts-next__email">{NEXT_TOUR.contactEmail}</span>
          </Reveal>
        </div>
      </section>

      <footer className="ts-footer">
        EMSKI — e/MOTION Tour {TOUR_META.year} · Private recap, not for distribution
      </footer>
    </div>
  );
}
