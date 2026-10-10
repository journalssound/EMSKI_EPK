import { useEffect } from "react";
import { PITCH_META, LAST_YEAR, PROPOSAL } from "./stardustPitchContent";
import { PITCH_V2_META, DEALS, NEXT_V2 } from "./stardustPitchV2Content";
import { H, Tiles, Split } from "./pitchParts";
import { usd, k } from "./pitchFormat";
import { HERO_VIDEO_R2 } from "../../data/content";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "./stardust-pitch.css";

const TAG = "[BLACKOUT]";

/* Last year as it happened, then each deal on a 600 sellout of the same
 * tiers. Guarantee comes off ticket gross first; the rest splits. */
function model() {
  const ly = LAST_YEAR;
  const gross = ly.net;
  const afterGross = ly.tiers.filter((t) => t.after2am).reduce((s, t) => s + t.price * t.sold, 0);
  const costs = ly.costs.reduce((s, c) => s + c.amount, 0);

  const lastYear = {
    gross,
    guarantee: 0,
    splitLabel: "100 / 0",
    emski: gross - afterGross,
    stardustTickets: afterGross,
    bar: ly.bar,
  };
  lastYear.emskiNet = lastYear.emski - costs;
  lastYear.stardustTotal = lastYear.stardustTickets + lastYear.bar;

  const deals = DEALS.map((d) => {
    const pool = gross - d.guarantee;
    const r = {
      ...d,
      gross,
      splitLabel: `${Math.round(d.emskiShare * 100)} / ${Math.round((1 - d.emskiShare) * 100)}`,
      emski: d.guarantee + pool * d.emskiShare,
      stardustTickets: pool * (1 - d.emskiShare),
      bar: ly.bar,
    };
    r.emskiNet = r.emski - costs;
    r.stardustTotal = r.stardustTickets + r.bar;
    r.delta = r.stardustTotal - lastYear.stardustTotal;
    return r;
  });

  return { costs, afterGross, lastYear, deals };
}

export default function StardustPitchV2() {
  useEffect(() => {
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = `EMSKI ${TAG} — Stardust Garage, Nov 21 2026 · ${PITCH_V2_META.version}`;
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
  const cols = [{ key: "LY", name: "LAST YEAR", ...m.lastYear }, ...m.deals];
  const head = (c) => (c.key === "LY" ? "Last year" : `${c.key} · ${c.name}`);

  return (
    <div className="bo">
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-hero sp-hero">
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
            Proposal {PITCH_V2_META.version} · {PITCH_META.preparedFor} · {PITCH_V2_META.prepared}
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
              { n: k(ly.net), l: "TICKET GROSS", s: `${usd(m.lastYear.emski)} TO 2AM · ${usd(m.afterGross)} AFTER` },
              {
                n: k(m.lastYear.emskiNet),
                l: "EMSKI WALKAWAY",
                s: `${usd(m.lastYear.emski)} TICKETS − ${usd(m.costs)} COSTS`,
              },
              {
                n: `~${k(m.lastYear.stardustTotal)}`,
                l: "STARDUST WALKAWAY",
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

      {/* ━━ 02 TWO DEALS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="02">The show — {PROPOSAL.dateLabel}</H>
          <p className="sp-line bo-mono" style={{ marginTop: 0, marginBottom: 24 }}>
            {PROPOSAL.format} · {PITCH_META.venue} · CAP {PROPOSAL.capacity}
          </p>
          <div className="sp-deals">
            {m.deals.map((d) => (
              <div className="sp-deal" key={d.key}>
                <span className="sp-deal__key bo-mono">DEAL {d.key}</span>
                <span className="sp-deal__name">{d.name}</span>
                <span className="sp-deal__sub bo-mono">{d.sub}</span>
                <ul className="sp-deal__terms bo-mono">
                  {d.terms.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="sp-split">
                  <Split
                    label={d.guarantee ? `AFTER THE ${k(d.guarantee)} · TICKETS TO 3AM` : "TICKETS TO 3AM"}
                    emski={d.emskiShare}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ 03 WALKAWAYS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="03">Walkaways — 600 sellout</H>
          <Tiles
            items={[
              ...m.deals.map((d) => ({
                n: k(d.emskiNet),
                l: `EMSKI · DEAL ${d.key}`,
                s: `${usd(d.emski)} TICKETS − ${usd(m.costs)} COSTS`,
              })),
              ...m.deals.map((d) => ({
                n: `~${k(d.stardustTotal)}`,
                l: `STARDUST · DEAL ${d.key}`,
                s: `${usd(d.stardustTickets)} TICKETS + ~${k(d.bar)} BAR`,
              })),
            ]}
          />
        </div>
      </section>

      {/* ━━ 04 THE MATH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="04">The math</H>
          <div className="sp-table-wrap">
            <table className="sp-compare is-three">
              <thead>
                <tr>
                  <th />
                  {cols.map((c) => (
                    <th key={c.key}>{head(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ticket gross</td>
                  {cols.map((c) => (
                    <td key={c.key}>{usd(c.gross)}</td>
                  ))}
                </tr>
                <tr>
                  <td>EMSKI guarantee</td>
                  {cols.map((c) => (
                    <td key={c.key}>{c.guarantee ? usd(c.guarantee) : "—"}</td>
                  ))}
                </tr>
                <tr>
                  <td>Split to 3AM</td>
                  {cols.map((c) => (
                    <td key={c.key}>{c.splitLabel}</td>
                  ))}
                </tr>
                <tr>
                  <td>EMSKI tickets</td>
                  {cols.map((c) => (
                    <td key={c.key}>{usd(c.emski)}</td>
                  ))}
                </tr>
                <tr>
                  <td>EMSKI costs</td>
                  {cols.map((c) => (
                    <td key={c.key}>−{usd(m.costs)}</td>
                  ))}
                </tr>
                <tr className="is-total">
                  <td>EMSKI walkaway</td>
                  {cols.map((c) => (
                    <td key={c.key}>{usd(c.emskiNet)}</td>
                  ))}
                </tr>
                <tr className="is-gap">
                  <td>Stardust tickets</td>
                  {cols.map((c) => (
                    <td key={c.key}>{usd(c.stardustTickets)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Bar</td>
                  {cols.map((c) => (
                    <td key={c.key}>~{usd(c.bar)}</td>
                  ))}
                </tr>
                <tr className="is-total">
                  <td>Stardust walkaway</td>
                  {cols.map((c) => (
                    <td key={c.key}>~{usd(c.stardustTotal)}</td>
                  ))}
                </tr>
                <tr>
                  <td>vs last year</td>
                  {cols.map((c) => (
                    <td key={c.key} className={c.delta ? "is-delta" : ""}>
                      {c.delta ? `+${usd(c.delta)}` : "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="sp-line bo-mono">
            600 sellout on last year's tiers. Bar held at last year's ~{k(ly.bar)}. Guarantee comes off ticket gross
            before the split. After-3AM tickets not projected — last year's sales closed at 3AM.
          </p>
        </div>
      </section>

      {/* ━━ 05 NEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <H n="05">Next</H>
          <p className="bo-list">
            {NEXT_V2.map((line, i) => (
              <span key={line}>
                {line}
                {i < NEXT_V2.length - 1 && <span className="bo-list__sep"> / </span>}
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
