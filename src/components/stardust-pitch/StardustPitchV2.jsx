import { useEffect } from "react";
import { PITCH_META, LAST_YEAR, PROPOSAL } from "./stardustPitchContent";
import { PITCH_V2_META, SHOW_V2, DEALS, NEXT_V2 } from "./stardustPitchV2Content";
import { H, Tiles, Split } from "./pitchParts";
import { usd, k } from "./pitchFormat";
import { HERO_VIDEO_R2 } from "../../data/content";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "../blackout/blackout.css";
import "./stardust-pitch.css";

const TAG = "[BLACKOUT]";

const pct = (emski) => `${Math.round(emski * 100)} / ${Math.round((1 - emski) * 100)}`;

/* One table row: a label, then one cell per column. */
function Row({ cols, label, get, cls = "", cellCls }) {
  return (
    <tr className={cls}>
      <td>{label}</td>
      {cols.map((c) => (
        <td key={c.key} className={cellCls ? cellCls(c) : ""}>
          {get(c)}
        </td>
      ))}
    </tr>
  );
}
/* Group header: the block's name, then the column labels again so no
 * block is read without knowing which deal is which. */
function Group({ cols, head, children }) {
  return (
    <tr className="is-group">
      <td>{children}</td>
      {cols.map((c) => (
        <td key={c.key} className="is-colhead">
          {head(c)}
        </td>
      ))}
    </tr>
  );
}

/* Last year as it happened, then each deal on a 600 sellout of the same
 * tiers. Tickets to 2AM: guarantee off the top, the rest splits. Tickets
 * after 2AM (last year: 35 × $50): 50/50 in both deals. */
function model(bar) {
  const ly = LAST_YEAR;
  const afterGross = ly.tiers.filter((t) => t.after2am).reduce((s, t) => s + t.price * t.sold, 0);
  const toGross = ly.net - afterGross;
  const costs = ly.costs.reduce((s, c) => s + c.amount, 0);

  /* Each column keeps its pieces separate so the table can add them up in
   * the open: guarantee + split to 2AM + split after 2AM − costs. */
  const build = (base, guarantee, shareTo, shareAfter) => {
    const pool = toGross - guarantee;
    const r = {
      ...base,
      toGross,
      afterGross,
      guarantee,
      splitLabel: pct(shareTo),
      afterLabel: pct(shareAfter),
      emskiTo: pool * shareTo,
      emskiAfter: afterGross * shareAfter,
      stardustTo: pool * (1 - shareTo),
      stardustAfter: afterGross * (1 - shareAfter),
      bar,
    };
    r.emski = guarantee + r.emskiTo + r.emskiAfter;
    r.emskiNet = r.emski - costs;
    r.stardustTickets = r.stardustTo + r.stardustAfter;
    r.stardustTotal = r.stardustTickets + r.bar;
    return r;
  };

  const lastYear = build({}, 0, ly.emskiShareTo2am, ly.emskiShareAfter2am);
  const deals = DEALS.map((d) => {
    const r = build(d, d.guarantee, d.emskiShare, SHOW_V2.emskiShareAfter);
    r.delta = r.stardustTotal - lastYear.stardustTotal;
    return r;
  });

  return { costs, afterGross, toGross, lastYear, deals };
}

/* `bar` is Stardust's bar take, held at the same figure for last year and
 * the projections. v3 is this page with the bar estimated lower. */
export default function StardustPitchV2({ bar = LAST_YEAR.bar, version = PITCH_V2_META.version }) {
  useEffect(() => {
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = `EMSKI ${TAG} — Stardust Garage, Nov 20 2026 · ${version}`;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.body.style.background = prev.bg;
      document.title = prev.title;
      robots.remove();
    };
  }, [version]);

  const ly = LAST_YEAR;
  const m = model(bar);
  const cols = [{ key: "LY", name: "LAST YEAR", ...m.lastYear }, ...m.deals];
  const head = (c) => (c.key === "LY" ? "Last year" : `Deal ${c.key} · ${c.name}`);

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
            {PITCH_META.venue} · {PITCH_META.city} · {SHOW_V2.dateLabel}
          </p>
        </div>
        <div className="bo-hero__foot bo-wrap">
          <p className="bo-hero__kicker bo-mono is-on">
            Proposal {version} · {PITCH_META.preparedFor} · {PITCH_V2_META.prepared}
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
              { n: k(ly.net), l: "TICKET GROSS", s: `${usd(m.toGross)} TO 2AM · ${usd(m.afterGross)} AFTER` },
              {
                n: k(m.lastYear.emskiNet),
                l: "EMSKI WALKAWAY",
                s: `${usd(m.lastYear.emski)} TICKETS − ${usd(m.costs)} COSTS`,
              },
              {
                n: `~${k(m.lastYear.stardustTotal)}`,
                l: "STARDUST WALKAWAY",
                s: `${usd(m.afterGross)} AFTER-2AM + ~${k(bar)} BAR`,
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
          <H n="02">The show — {SHOW_V2.dateLabel}</H>
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
                    label={
                      d.guarantee
                        ? `AFTER THE ${k(d.guarantee)} · TICKETS TO ${SHOW_V2.changeover}`
                        : `TICKETS TO ${SHOW_V2.changeover}`
                    }
                    emski={d.emskiShare}
                  />
                  <Split label={`AFTER ${SHOW_V2.changeover}`} emski={SHOW_V2.emskiShareAfter} />
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
                s: `${d.guarantee ? `${usd(d.guarantee)} + ${usd(d.emski - d.guarantee)}` : usd(d.emski)} TICKETS − ${usd(m.costs)} COSTS`,
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
              <tbody>
                <Group cols={cols} head={head}>Tickets to {SHOW_V2.changeover}</Group>
                <Row cols={cols} label="Gross" get={(c) => usd(c.toGross)} />
                <Row cols={cols} label="Guarantee to EMSKI, off the top" get={(c) => (c.guarantee ? `−${usd(c.guarantee)}` : "—")} />
                <Row cols={cols} label="Left to split" get={(c) => usd(c.toGross - c.guarantee)} />
                <Row cols={cols} label="Split" get={(c) => c.splitLabel} />
                <Row cols={cols} label="EMSKI share" get={(c) => usd(c.emskiTo)} />
                <Row cols={cols} label="Stardust share" get={(c) => (c.stardustTo ? usd(c.stardustTo) : "—")} />

                <Group cols={cols} head={head}>Tickets after {SHOW_V2.changeover}</Group>
                <Row cols={cols} label="Gross" get={(c) => usd(c.afterGross)} />
                <Row cols={cols} label="Split" get={(c) => c.afterLabel} />
                <Row cols={cols} label="EMSKI share" get={(c) => (c.emskiAfter ? usd(c.emskiAfter) : "—")} />
                <Row cols={cols} label="Stardust share" get={(c) => usd(c.stardustAfter)} />

                <Group cols={cols} head={head}>EMSKI</Group>
                <Row cols={cols} label="Guarantee" get={(c) => (c.guarantee ? usd(c.guarantee) : "—")} />
                <Row cols={cols} label={`Share to ${SHOW_V2.changeover}`} get={(c) => usd(c.emskiTo)} />
                <Row cols={cols} label={`Share after ${SHOW_V2.changeover}`} get={(c) => (c.emskiAfter ? usd(c.emskiAfter) : "—")} />
                <Row cols={cols} label="Costs" get={() => `−${usd(m.costs)}`} />
                <Row cols={cols} label="EMSKI walkaway" get={(c) => usd(c.emskiNet)} cls="is-total" />

                <Group cols={cols} head={head}>Stardust</Group>
                <Row cols={cols} label={`Share to ${SHOW_V2.changeover}`} get={(c) => (c.stardustTo ? usd(c.stardustTo) : "—")} />
                <Row cols={cols} label={`Share after ${SHOW_V2.changeover}`} get={(c) => usd(c.stardustAfter)} />
                <Row cols={cols} label="Bar" get={(c) => `~${usd(c.bar)}`} />
                <Row cols={cols} label="Stardust walkaway" get={(c) => `~${usd(c.stardustTotal)}`} cls="is-total" />
                <Row
                  cols={cols}
                  label="vs last year"
                  get={(c) => (c.delta ? `+${usd(c.delta)}` : "—")}
                  cellCls={(c) => (c.delta ? "is-delta" : "")}
                />
              </tbody>
            </table>
          </div>
          <p className="sp-line bo-mono">
            600 sellout on last year's tiers. Bar estimated at ~{k(bar)}, same as last year. In Deal B the $5,000 comes
            out of the gross before the 60/40 — so it shrinks both sides' pool, and Stardust's share is 40% of
            what's left. After-{SHOW_V2.changeover} = last year's afters tickets, split 50/50.
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
