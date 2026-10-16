import { useEffect } from "react";
import {
  META,
  AVG_TICKET,
  VENUES,
  SCENARIOS,
  BOTTOM_LINE,
  PROS_CONS,
  SOURCES,
} from "./venueCompareContent";
import { H } from "../stardust-pitch/pitchParts";
import { usd } from "../stardust-pitch/pitchFormat";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "../stardust-pitch/stardust-pitch.css";
import "./venue-compare.css";

/* One column per scenario: tickets → gross → her share → every cost → walkaway. */
function columns() {
  return SCENARIOS.map((s) => {
    const v = VENUES[s.venue];
    const gross = s.tickets * AVG_TICKET;
    const kept = gross * v.share;
    const { show, lights, door } = v.costs;
    return {
      ...s,
      v,
      gross,
      kept,
      show,
      lights,
      door,
      walk: kept - show - lights - door,
    };
  });
}

const minus = (n) => (n ? `−${usd(n)}` : "$0");

function List({ items, mark }) {
  return (
    <ul className={`vc-list vc-list--${mark}`}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function VenueCompare() {
  useEffect(() => {
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = "EMSKI — Nov 20: Stardust vs The Baths";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.body.style.background = prev.bg;
      document.title = prev.title;
      robots.remove();
    };
  }, []);

  const cols = columns();
  const rows = [
    ["Tickets", (c) => c.tickets],
    [`Gross at $${AVG_TICKET.toFixed(2)}`, (c) => usd(c.gross)],
    ["Her share", (c) => `${Math.round(c.v.share * 100)}%`],
    ["Her ticket money", (c) => usd(c.kept)],
    ["Show costs", (c) => minus(c.show)],
    ["Lighting rig", (c) => minus(c.lights), "lights"],
    ["Door staff", (c) => minus(c.door)],
  ];

  return (
    <div className="bo">
      <header className="vc-head bo-wrap">
        <div
          className="bo-hero__mark is-on vc-head__mark"
          style={{ "--bo-mark": `url(${logo})` }}
          role="img"
          aria-label="EMSKI"
        />
        <h1 className="vc-head__title">Stardust vs The Baths</h1>
        <span className="vc-head__rule" aria-hidden="true" />
        <p className="vc-head__line bo-mono">
          {META.date} · Austin · venue call · {META.prepared}
        </p>
      </header>

      {/* ━━ 01 BOTTOM LINE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="01">Bottom line</H>
          <ul className="vc-bottom">
            {BOTTOM_LINE.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ━━ 02 THE MONEY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="02">The money</H>
          <div className="sp-table-wrap">
            <table className="sp-compare vc-money">
              <thead>
                <tr className="vc-money__venues">
                  <th />
                  <th colSpan={2}>{VENUES.sd.name}</th>
                  <th colSpan={2}>{VENUES.bt.name}</th>
                </tr>
                <tr>
                  <th />
                  {cols.map((c) => (
                    <th key={`${c.venue}${c.tickets}`}>{c.note}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, get, cls]) => (
                  <tr key={label} className={cls ? `is-${cls}` : ""}>
                    <td>{label}</td>
                    {cols.map((c) => (
                      <td key={`${c.venue}${c.tickets}`}>{get(c)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="is-total">
                  <td>Walkaway</td>
                  {cols.map((c) => (
                    <td key={`${c.venue}${c.tickets}`}>{usd(c.walk)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="vc-call">
            Baths only: if the bar misses $5,000, she pays the gap — up to{" "}
            <b>$5,000</b> more.
          </p>
          <p className="sp-line bo-mono">
            Same tiers and prices at both, at last year's average. Tickets sold
            before 2AM only. Lighting is an estimate: Austin packages start
            ~$900 before delivery and an operator.
          </p>
        </div>
      </section>

      {/* ━━ 03 / 04 PROS & CONS ━━━━━━━━━━━━━━━━━━━━━━━ */}
      {[
        ["03", "Stardust Garage", PROS_CONS.stardust],
        ["04", "The Baths", PROS_CONS.baths],
      ].map(([n, name, pc]) => (
        <section className="bo-section" key={n}>
          <div className="bo-wrap">
            <H n={n}>{name}</H>
            <div className="vc-pc">
              <div>
                <h3 className="vc-pc__h bo-mono">Pros</h3>
                <List items={pc.pros} mark="pro" />
              </div>
              <div>
                <h3 className="vc-pc__h vc-pc__h--con bo-mono">Cons</h3>
                <List items={pc.cons} mark="con" />
              </div>
            </div>
          </div>
        </section>
      ))}

      <footer className="bo-wrap">
        <ul className="vc-sources bo-mono">
          {SOURCES.map(([label, url]) => (
            <li key={label}>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          ))}
        </ul>
        <div className="bo-footer bo-mono">
          <span>&copy; 2026 EMSKI music</span>
          <span>Private · not for distribution</span>
        </div>
      </footer>
    </div>
  );
}
