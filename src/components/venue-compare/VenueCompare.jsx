import { useEffect } from "react";
import {
  META,
  TICKET,
  STARDUST,
  BATHS,
  COSTS,
  MAYBE_COSTS,
  MATCHED,
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

/* Same tickets in both rooms: same gross, different share, different costs.
 * Walkaway = gross × share − every cost line. */
function model() {
  const avg = TICKET.avg;
  const sdCosts = COSTS.reduce((s, c) => s + c.sd, 0);
  const btCosts = COSTS.reduce((s, c) => s + c.bt, 0);
  const sdPer = avg * STARDUST.emskiShare;
  const btPer = avg * BATHS.emskiShare;

  const rows = MATCHED.map(({ n, note }) => {
    const gross = n * avg;
    const sd = gross * STARDUST.emskiShare - sdCosts;
    const bt = gross * BATHS.emskiShare - btCosts;
    return { n, note, gross, sd, bt, diff: bt - sd };
  });

  /* Ticket count where the Baths' bigger share covers its extra costs. */
  const tieSameTickets = Math.ceil((btCosts - sdCosts) / (btPer - sdPer));
  /* Tickets the Baths needs to match Stardust selling N. */
  const bathsToMatch = (n) =>
    Math.ceil((n * sdPer - sdCosts + btCosts) / btPer);

  return {
    avg,
    sdCosts,
    btCosts,
    sdPer,
    btPer,
    rows,
    tieSameTickets,
    bathsToMatch,
  };
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

      {/* ━━ 02 COSTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="02">Costs, line by line</H>
          <div className="sp-table-wrap">
            <table className="sp-compare vc-costs">
              <thead>
                <tr>
                  <th />
                  <th>{STARDUST.short}</th>
                  <th>{BATHS.short}</th>
                </tr>
              </thead>
              <tbody>
                {COSTS.map((c) => (
                  <tr key={c.label}>
                    <td>{c.label}</td>
                    <td>
                      {usd(c.sd)}
                      <span className="vc-note bo-mono">{c.sdNote}</span>
                    </td>
                    <td className={c.bt > c.sd ? "is-more" : ""}>
                      {usd(c.bt)}
                      <span className="vc-note bo-mono">{c.btNote}</span>
                    </td>
                  </tr>
                ))}
                <tr className="is-total">
                  <td>Total costs</td>
                  <td>{usd(m.sdCosts)}</td>
                  <td>{usd(m.btCosts)}</td>
                </tr>
                <tr>
                  <td>Venue's cut of tickets</td>
                  <td>{Math.round((1 - STARDUST.emskiShare) * 100)}%</td>
                  <td>{Math.round((1 - BATHS.emskiShare) * 100)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3
            className="vc-pc__h vc-pc__h--con bo-mono"
            style={{ marginTop: 34 }}
          >
            Only if something goes wrong
          </h3>
          <div className="sp-table-wrap">
            <table className="sp-compare vc-costs vc-costs--maybe">
              <tbody>
                {MAYBE_COSTS.map((c) => (
                  <tr key={c.label}>
                    <td>{c.label}</td>
                    <td>{c.sd}</td>
                    <td>{c.bt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ━━ 03 SAME TICKETS ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="03">Same tickets, both rooms</H>
          <div className="sp-tiles vc-tiles">
            <div className="sp-tile">
              <span className="sp-tile__n">${m.sdPer.toFixed(2)}</span>
              <span className="sp-tile__l bo-mono">
                Per ticket · {STARDUST.short}
              </span>
              <span className="sp-tile__s bo-mono">
                70% of ${m.avg.toFixed(2)}
              </span>
            </div>
            <div className="sp-tile">
              <span className="sp-tile__n">${m.btPer.toFixed(2)}</span>
              <span className="sp-tile__l bo-mono">
                Per ticket · {BATHS.short}
              </span>
              <span className="sp-tile__s bo-mono">
                100% of ${m.avg.toFixed(2)}
              </span>
            </div>
            <div className="sp-tile">
              <span className="sp-tile__n">{usd(m.btCosts - m.sdCosts)}</span>
              <span className="sp-tile__l bo-mono">
                Extra costs · {BATHS.short}
              </span>
              <span className="sp-tile__s bo-mono">lights + door staff</span>
            </div>
            <div className="sp-tile is-lead">
              <span className="sp-tile__n">{m.tieSameTickets}</span>
              <span className="sp-tile__l bo-mono">Tickets to break even</span>
              <span className="sp-tile__s bo-mono">
                past this, Baths pays more
              </span>
            </div>
          </div>

          <div className="sp-table-wrap">
            <table className="sp-compare vc-matched">
              <thead>
                <tr>
                  <th>Tickets</th>
                  <th>Gross</th>
                  <th>{STARDUST.short}</th>
                  <th>{BATHS.short}</th>
                  <th>Baths vs Stardust</th>
                </tr>
              </thead>
              <tbody>
                {m.rows.map((r) => (
                  <tr key={r.n}>
                    <td>
                      {r.n}
                      {r.note && (
                        <span className="vc-note bo-mono">{r.note}</span>
                      )}
                    </td>
                    <td>{usd(r.gross)}</td>
                    <td>{usd(r.sd)}</td>
                    <td>{usd(r.bt)}</td>
                    <td className="is-delta">
                      {r.diff >= 0 ? "+" : "−"}
                      {usd(Math.abs(r.diff))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="vc-call">
            The real question is how many each room sells. If Stardust sells{" "}
            {STARDUST.cap}, the Baths ties at{" "}
            <b>{m.bathsToMatch(STARDUST.cap)}</b>. If Stardust repeats last
            year's {TICKET.lastYearTo2am}, the Baths needs{" "}
            <b>{m.bathsToMatch(TICKET.lastYearTo2am)}</b> on a {BATHS.cap} room.
          </p>
          <p className="sp-line bo-mono">
            Walkaway = EMSKI's share of tickets − total costs. Same tiers and
            prices at both, last year's average ${m.avg.toFixed(2)} a ticket,
            all sold before 2AM. After-2AM door left out at both: Stardust keeps
            it after 2:30, the Baths charges $200/hr.
          </p>
        </div>
      </section>

      {/* ━━ 04 SIDE BY SIDE ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="04">Side by side</H>
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
        ["05", STARDUST.name, PROS_CONS.stardust],
        ["06", BATHS.name, PROS_CONS.baths],
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
          <H n="07">Before deciding</H>
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
          <H n="08">Same week in Austin</H>
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
          <H n="09">Sources</H>
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
