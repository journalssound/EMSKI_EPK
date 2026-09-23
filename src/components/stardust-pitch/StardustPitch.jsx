import { useEffect } from "react";
import { PITCH_META, LAST_YEAR, SINCE, PROPOSAL, NEXT } from "./stardustPitchContent";
import { HERO_VIDEO_R2 } from "../../data/content";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "./stardust-pitch.css";

const TAG = "[BLACKOUT]";

const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
const k = (n) => (n >= 1000 ? "$" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : usd(n));

/* Same header as the kit: sans title, mono number. */
function H({ n, children }) {
  return (
    <h2 className="bo-h">
      <span className="bo-h__n bo-mono">{n}</span>
      <span className="bo-h__t">{children}</span>
    </h2>
  );
}

function Tiles({ items }) {
  return (
    <div className="sp-tiles">
      {items.map((t) => (
        <div className="sp-tile" key={t.l}>
          <span className="sp-tile__n">{t.n}</span>
          <span className="sp-tile__l bo-mono">{t.l}</span>
          {t.s ? <span className="sp-tile__s bo-mono">{t.s}</span> : null}
        </div>
      ))}
    </div>
  );
}

/* Split bar: EMSKI's share in off-white, Stardust's in rust. */
function Split({ label, emski }) {
  const stardust = 1 - emski;
  return (
    <>
      <span className="sp-split__label bo-mono">{label}</span>
      <div className="sp-split__bar">
        {emski > 0 && (
          <span className="sp-split__seg sp-split__seg--emski" style={{ flex: emski }}>
            EMSKI {Math.round(emski * 100)}
          </span>
        )}
        {stardust > 0 && (
          <span className="sp-split__seg sp-split__seg--stardust" style={{ flex: stardust }}>
            STARDUST {Math.round(stardust * 100)}
          </span>
        )}
      </div>
    </>
  );
}

/* The model. Last year: EMSKI kept 100% before 2AM, Stardust kept the
 * after-2AM tickets and bar. This year: 80/20 before 2AM, same after. */
function model() {
  const ly = LAST_YEAR;
  const afters = ly.tiers.filter((t) => t.after2am);
  const before = ly.tiers.filter((t) => !t.after2am);
  const afterGross = afters.reduce((s, t) => s + t.price * t.sold, 0);
  const afterCount = afters.reduce((s, t) => s + t.sold, 0);
  const beforeGross = ly.net - afterGross; // dashboard net minus the afters
  const beforeCount = ly.sold - afterCount;
  const beforeCountItemised = before.reduce((s, t) => s + t.sold, 0);

  const costs = ly.costs.reduce((s, c) => s + c.amount, 0);
  const lastYear = {
    label: "LAST YEAR",
    emski: beforeGross * ly.emskiShareTo2am + afterGross * ly.emskiShareAfter2am,
    costs,
    stardustTickets:
      beforeGross * (1 - ly.emskiShareTo2am) + afterGross * (1 - ly.emskiShareAfter2am),
    bar: ly.bar,
  };
  lastYear.emskiNet = lastYear.emski - costs;
  lastYear.stardustTotal = lastYear.stardustTickets + lastYear.bar;

  /* This year the changeover is 3AM, and last year's sales closed at 3AM —
   * so every ticket last year (afters included) sits in the 80/20 bucket,
   * and the after-3AM bucket has nothing to project from. */
  const allCountItemised = beforeCountItemised + afterCount;
  const scenarios = PROPOSAL.scenarios.map((s) => {
    const toGross = ly.net + s.priceDelta * allCountItemised;
    const afterChangeoverGross = 0;
    const r = {
      label: s.label,
      emski:
        toGross * PROPOSAL.emskiShareToChangeover +
        afterChangeoverGross * PROPOSAL.emskiShareAfterChangeover,
      stardustTickets:
        toGross * (1 - PROPOSAL.emskiShareToChangeover) +
        afterChangeoverGross * (1 - PROPOSAL.emskiShareAfterChangeover),
      bar: ly.bar,
    };
    r.stardustTotal = r.stardustTickets + r.bar;
    r.delta = r.stardustTotal - lastYear.stardustTotal;
    return r;
  });

  return { afterGross, afterCount, beforeGross, beforeCount, lastYear, scenarios };
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

  const ly = LAST_YEAR;
  const m = model();
  const repeat = m.scenarios[0];

  return (
    <div className="bo">
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-hero sp-hero">
        {/* Last year's show, behind everything, in black and white. */}
        <video className="sp-hero__bg" src={HERO_VIDEO_R2} autoPlay muted loop playsInline aria-hidden="true" />
        <div className="sp-hero__veil" aria-hidden="true" />
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
          <Tiles
            items={[
              { n: ly.sold.toLocaleString(), l: "TICKETS", s: `SOLD OUT · CAP ${ly.capacity}` },
              { n: k(ly.net), l: "NET TICKET REVENUE", s: `${usd(m.beforeGross)} TO 2AM · ${usd(m.afterGross)} AFTER` },
              {
                n: k(m.lastYear.emskiNet),
                l: "EMSKI NET",
                s: `${usd(m.lastYear.emski)} TICKETS − ${usd(m.lastYear.costs)} COSTS`,
              },
              {
                n: `~${k(m.lastYear.stardustTotal)}`,
                l: "STARDUST",
                s: `${usd(m.afterGross)} AFTER-2AM + ~${k(ly.bar)} BAR`,
              },
            ]}
          />
          <p className="sp-line bo-mono">
            EMSKI COSTS: {ly.costs.map((c) => `${c.label} ${usd(c.amount)}`).join(" · ")} — PAID FROM HER SHARE
          </p>
          <div className="sp-ladder">
            {ly.tiers.map((t) => (
              <div className={`sp-ladder__cell bo-mono${t.after2am ? " is-after" : ""}`} key={t.name}>
                <b>${t.price}</b>
                {t.name}
                <br />
                {t.sold} sold
              </div>
            ))}
          </div>
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

      {/* ━━ 03 THE DEAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="03">The show — {PROPOSAL.dateLabel}</H>
          <p className="sp-line bo-mono" style={{ marginTop: 0, marginBottom: 24 }}>
            {PROPOSAL.format} · {PITCH_META.venue} · CAP {PROPOSAL.capacity}
          </p>
          <div className="sp-split">
            <Split label={`TICKETS TO ${PROPOSAL.changeover}`} emski={PROPOSAL.emskiShareToChangeover} />
            <Split
              label={`TICKETS AFTER ${PROPOSAL.changeover}`}
              emski={PROPOSAL.emskiShareAfterChangeover}
            />
            <Split label="BAR" emski={0} />
          </div>
        </div>
      </section>

      {/* ━━ 04 STARDUST'S NUMBERS ━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="04">What Stardust makes</H>
          <div className="sp-table-wrap">
            <table className="sp-compare">
              <thead>
                <tr>
                  <th />
                  <th>Last year</th>
                  {m.scenarios.map((s) => (
                    <th key={s.label}>{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tickets</td>
                  <td>{usd(m.lastYear.stardustTickets)}</td>
                  {m.scenarios.map((s) => (
                    <td key={s.label}>{usd(s.stardustTickets)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Bar</td>
                  <td>~{usd(m.lastYear.bar)}</td>
                  {m.scenarios.map((s) => (
                    <td key={s.label}>~{usd(s.bar)}</td>
                  ))}
                </tr>
                <tr className="is-total">
                  <td>Total</td>
                  <td>~{usd(m.lastYear.stardustTotal)}</td>
                  {m.scenarios.map((s) => (
                    <td key={s.label}>~{usd(s.stardustTotal)}</td>
                  ))}
                </tr>
                <tr>
                  <td>vs last year</td>
                  <td>—</td>
                  {m.scenarios.map((s) => (
                    <td key={s.label} className="is-delta">
                      +{usd(s.delta)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="sp-line bo-mono">
            EMSKI: {usd(m.lastYear.emski)} tickets − {usd(m.lastYear.costs)} costs = {usd(m.lastYear.emskiNet)} net
            last year → {usd(repeat.emski)} under the new split, before costs. Sellout assumed.
            After-{PROPOSAL.changeover} tickets not projected — last year's sales closed at 3AM.
          </p>
        </div>
      </section>

      {/* ━━ 05 NEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
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
          {PITCH_META.contacts.map((email, i) => (
            <p key={email} style={{ marginTop: i === 0 ? 26 : 12 }}>
              <a className="bo-contact__email" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          ))}
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
