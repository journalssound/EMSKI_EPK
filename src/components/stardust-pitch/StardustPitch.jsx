import { Fragment, useEffect } from "react";
import { PITCH_META, LAST_YEAR, SINCE, PROPOSAL, NEXT } from "./stardustPitchContent";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "./stardust-pitch.css";

const TAG = "[BLACKOUT]";

const usd = (n) =>
  n == null ? "—" : "$" + Math.round(n).toLocaleString("en-US");
const num = (n) => (n == null ? "—" : Math.round(n).toLocaleString("en-US"));

/* Same header as the kit: sans title, mono number. */
function H({ n, children }) {
  return (
    <h2 className="bo-h">
      <span className="bo-h__n bo-mono">{n}</span>
      <span className="bo-h__t">{children}</span>
    </h2>
  );
}

/* Key: value readout, static (no decode) — this page is read once, fast. */
function Console({ rows }) {
  return (
    <div className="bo-console is-live sp-console">
      {rows.map(([k, v]) => (
        <Fragment key={k}>
          <span className="bo-console__k">{k}:</span>
          <span className="bo-console__v">{v}</span>
        </Fragment>
      ))}
    </div>
  );
}

/* Projections. Everything keys off last year's gross and its pre/post-2AM
 * split; without those the table renders dashes rather than guesses. */
function projections() {
  const ly = LAST_YEAR;
  const ready = ly.gross != null && ly.sold != null && ly.pre2am.gross != null;
  const avg = ly.avgPrice ?? (ready ? ly.gross / ly.sold : null);
  const preShare = ready ? ly.pre2am.gross / ly.gross : null;

  const baseline = ready
    ? {
        label: "LAST YEAR",
        tickets: ly.sold,
        avg,
        gross: ly.gross,
        emski: ly.pre2am.gross,
        stardustTickets: ly.post2am.gross ?? ly.gross - ly.pre2am.gross,
        bar: ly.bar,
      }
    : { label: "LAST YEAR", tickets: ly.sold, avg, gross: ly.gross, emski: null, stardustTickets: null, bar: ly.bar };
  baseline.stardustTotal =
    baseline.stardustTickets == null ? null : baseline.stardustTickets + baseline.bar;

  const rows = PROPOSAL.scenarios.map((s) => {
    if (!ready) return { label: s.label, tickets: s.tickets };
    const price = avg + s.priceDelta;
    const gross = s.tickets * price;
    const preGross = gross * preShare;
    const postGross = gross - preGross;
    const bar = ly.bar * (s.tickets / ly.sold);
    const stardustTickets = preGross * (1 - PROPOSAL.emskiShare) + postGross;
    return {
      label: s.label,
      tickets: s.tickets,
      avg: price,
      gross,
      emski: preGross * PROPOSAL.emskiShare,
      stardustTickets,
      bar,
      stardustTotal: stardustTickets + bar,
    };
  });
  return { ready, baseline, rows };
}

export default function StardustPitch() {
  useEffect(() => {
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = `EMSKI ${TAG} — Stardust Garage, Nov 21 2026`;
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

  const { ready, baseline, rows } = projections();
  const ly = LAST_YEAR;

  return (
    <div className="bo">
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-hero sp-hero">
        <div className="bo-wrap">
          <div
            className="bo-hero__mark is-on"
            style={{ "--bo-mark": `url(${logo})` }}
            role="img"
            aria-label="EMSKI"
          />
          <p className="bo-hero__tag">
            <span>{TAG}</span>
          </p>
          <div className="bo-hero__rule-row" aria-hidden="true">
            <span className="bo-hero__rule is-on" />
          </div>
          <p className="sp-hero__line bo-mono">
            {PITCH_META.venue} · {PITCH_META.city} · {PROPOSAL.dateLabel}
          </p>
        </div>
        <div className="bo-hero__foot bo-wrap">
          <p className="bo-hero__kicker bo-mono is-on">
            Proposal · {PITCH_META.preparedFor} · {PITCH_META.prepared}
          </p>
        </div>
      </section>

      {/* ━━ 01 LAST YEAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="01">Last year — {ly.dateLabel}</H>
          <Console
            rows={[
              ["VENUE", PITCH_META.venue],
              ["CAPACITY", num(ly.capacity)],
              ["TICKETS", `${num(ly.sold)} — SOLD OUT`],
              ["GROSS", usd(ly.gross)],
              ["AVG TICKET", ly.avgPrice != null || ready ? usd(ly.avgPrice ?? ly.gross / ly.sold) : "—"],
              ["TO 2AM", `${num(ly.pre2am.tickets)} TICKETS · ${usd(ly.pre2am.gross)}`],
              ["AFTER 2AM", `${num(ly.post2am.tickets)} TICKETS · ${usd(ly.post2am.gross)}`],
              ["BAR (STARDUST)", `~${usd(ly.bar)}`],
            ]}
          />
          <Console rows={ly.deal} />
        </div>
      </section>

      {/* ━━ 02 SINCE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="02">Since then</H>
          <p className="bo-list">
            {SINCE.map((line, i) => (
              <span key={line}>
                {line}
                {i < SINCE.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ━━ 03 THE SHOW ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="03">The show — {PROPOSAL.dateLabel}</H>
          <Console
            rows={[
              ["FORMAT", PROPOSAL.format],
              ["VENUE", `${PITCH_META.venue} · CAP ${num(PROPOSAL.capacity)}`],
              ...PROPOSAL.deal,
            ]}
          />
        </div>
      </section>

      {/* ━━ 04 PROJECTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="04">Projections</H>
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Tickets</th>
                  <th>Avg</th>
                  <th>Gross</th>
                  <th>EMSKI</th>
                  <th>Stardust tickets</th>
                  <th>Bar</th>
                  <th>Stardust total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="is-baseline">
                  <td>{baseline.label}</td>
                  <td>{num(baseline.tickets)}</td>
                  <td>{usd(baseline.avg)}</td>
                  <td>{usd(baseline.gross)}</td>
                  <td>{usd(baseline.emski)}</td>
                  <td>{usd(baseline.stardustTickets)}</td>
                  <td>~{usd(baseline.bar)}</td>
                  <td>{usd(baseline.stardustTotal)}</td>
                </tr>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>{num(r.tickets)}</td>
                    <td>{usd(r.avg)}</td>
                    <td>{usd(r.gross)}</td>
                    <td>{usd(r.emski)}</td>
                    <td>{usd(r.stardustTickets)}</td>
                    <td>~{usd(r.bar)}</td>
                    <td className="is-key">{usd(r.stardustTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sp-note bo-mono">
            {ready
              ? "Sellout assumed. 2AM split at last year's ratio. Bar scaled to attendance."
              : "Awaiting last year's ticketing figures."}
          </p>
        </div>
      </section>

      {/* ━━ 05 NEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <span className="bo-rust-line" aria-hidden="true" />
        <div className="bo-wrap">
          <H n="05">Next</H>
          <p className="bo-list">
            {NEXT.map((line, i) => (
              <span key={line}>
                {line}
                {i < NEXT.length - 1 && <span className="bo-list__sep"> / </span>}
              </span>
            ))}
          </p>
          <p style={{ marginTop: 26 }}>
            <a className="bo-contact__email" href={`mailto:${PITCH_META.contactEmail}`}>
              {PITCH_META.contactEmail}
            </a>
          </p>
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
