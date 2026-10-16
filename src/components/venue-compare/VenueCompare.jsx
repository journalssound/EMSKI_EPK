import { useEffect } from "react";
import {
  META,
  BASE,
  STARDUST,
  BATHS,
  BOTTOM_LINE,
  SPECS,
  PROS_CONS,
  ASK_BATHS,
  ASK_STARDUST,
  SAME_WEEK,
  SOURCES,
} from "./venueCompareContent";
import { H } from "../stardust-pitch/pitchParts";
import { usd } from "../stardust-pitch/pitchFormat";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "../stardust-pitch/stardust-pitch.css";
import "./venue-compare.css";

/* EMSKI's side of each venue. Stardust: last year's before-2AM night at
 * 70%. Baths: 100% of a smaller room at last year's average ticket price. */
function model() {
  const costs = BASE.costs.reduce((s, c) => s + c.amount, 0);
  const avg = BASE.grossTo2am / BASE.ticketsTo2am;

  const stardust = {
    key: "SD",
    head: "Stardust",
    tickets: BASE.ticketsTo2am,
    gross: BASE.grossTo2am,
    share: STARDUST.emskiShare,
    costs: costs + STARDUST.extraCosts,
  };
  const baths = BATHS.scenarios.map((n) => ({
    key: `B${n}`,
    head: `Baths · ${n}`,
    tickets: n,
    gross: n * avg,
    share: BATHS.emskiShare,
    costs: costs + BATHS.extraCosts,
  }));
  const cols = [stardust, ...baths].map((c) => {
    c.emski = c.gross * c.share;
    c.walk = c.emski - c.costs;
    return c;
  });

  /* Tickets the Baths needs for EMSKI to walk with what Stardust pays. */
  const breakEven = Math.ceil((cols[0].walk + costs + BATHS.extraCosts) / avg);
  const perK = Math.round(1000 / avg);
  return { cols, avg, costs, breakEven, perK };
}

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

  const m = model();

  return (
    <div className="bo">
      {/* ━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
          <H n="02">EMSKI walkaway</H>
          <div className="sp-tiles vc-tiles">
            {m.cols.map((c) => (
              <div
                className={`sp-tile${c.key === "SD" ? " is-lead" : ""}`}
                key={c.key}
              >
                <span className="sp-tile__n">{usd(c.walk)}</span>
                <span className="sp-tile__l bo-mono">{c.head}</span>
                <span className="sp-tile__s bo-mono">
                  {c.tickets} tickets · {Math.round(c.share * 100)}%
                </span>
              </div>
            ))}
          </div>

          <div className="sp-table-wrap">
            <table className="sp-compare vc-money">
              <thead>
                <tr>
                  <th />
                  {m.cols.map((c) => (
                    <th key={c.key}>{c.head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tickets before 2AM</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>{c.tickets}</td>
                  ))}
                </tr>
                <tr>
                  <td>Ticket gross</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>{usd(c.gross)}</td>
                  ))}
                </tr>
                <tr>
                  <td>EMSKI share</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>{Math.round(c.share * 100)}%</td>
                  ))}
                </tr>
                <tr>
                  <td>EMSKI tickets</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>{usd(c.emski)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Costs</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>−{usd(c.costs)}</td>
                  ))}
                </tr>
                <tr className="is-total">
                  <td>Walkaway</td>
                  {m.cols.map((c) => (
                    <td key={c.key}>{usd(c.walk)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="vc-call">
            The Baths needs <b>{m.breakEven} tickets</b> just to match Stardust.
            Every $1K of lighting rental adds ~{m.perK} more.
          </p>
          <p className="sp-line bo-mono">
            Same ticket prices at both. Stardust = last year's{" "}
            {BASE.ticketsTo2am} tickets before 2AM at 70%; tickets 2:00–2:30 not
            counted. Baths = 100% at last year's average ${m.avg.toFixed(2)} a ticket.
            Costs = last year's {usd(m.costs)} (
            {BASE.costs
              .map((c) => `${c.label.toLowerCase()} ${usd(c.amount)}`)
              .join(", ")}
            ); Baths adds ~{usd(BATHS.extraCosts)} ticket staff. Not included:
            Baths lighting rental, bar shortfall, $200/hr past 2AM.
          </p>
        </div>
      </section>

      {/* ━━ 03 SIDE BY SIDE ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="03">Side by side</H>
          <div className="vc-specs">
            <div className="vc-specs__row vc-specs__row--head bo-mono">
              <span />
              <span>{STARDUST.name}</span>
              <span>{BATHS.name}</span>
            </div>
            {SPECS.map(([label, a, b]) => (
              <div className="vc-specs__row" key={label}>
                <span className="vc-specs__label bo-mono">{label}</span>
                <span className="vc-specs__cell" data-venue={STARDUST.name}>
                  {a}
                </span>
                <span className="vc-specs__cell" data-venue={BATHS.name}>
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 04 / 05 PROS & CONS ━━━━━━━━━━━━━━━━━━━━━━━ */}
      {[
        ["04", STARDUST.name, PROS_CONS.stardust],
        ["05", BATHS.name, PROS_CONS.baths],
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

      {/* ━━ 06 BEFORE DECIDING ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="06">Before deciding</H>
          <h3 className="vc-pc__h bo-mono">Ask The Baths</h3>
          <ol className="vc-ask">
            {ASK_BATHS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <h3 className="vc-pc__h bo-mono" style={{ marginTop: 28 }}>
            Lock with Stardust
          </h3>
          <ol className="vc-ask">
            {ASK_STARDUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* ━━ 07 SAME WEEK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="07">Same week in Austin</H>
          <div className="vc-week">
            {SAME_WEEK.map(([d, t]) => (
              <div className="vc-week__row" key={d}>
                <span className="vc-week__d bo-mono">{d}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p className="sp-line bo-mono">
            Hits both venues the same. Favors whichever room runs later on the
            20th.
          </p>
        </div>
      </section>

      {/* ━━ SOURCES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="08">Sources</H>
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
        </div>
      </section>

      <footer className="bo-wrap">
        <div className="bo-footer bo-mono">
          <span>&copy; 2026 EMSKI music</span>
          <span>Private · not for distribution</span>
        </div>
      </footer>
    </div>
  );
}
