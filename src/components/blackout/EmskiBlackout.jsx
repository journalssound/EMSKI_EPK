import { Fragment, useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../../hooks/useAnimations";
import VideoParticles from "../VideoParticles";
import { FESTIVALS, LABELS, STATS, SOCIALS } from "../../data/content";
import {
  BO_TAG,
  BO_THESIS,
  BO_ARTISTS,
  BO_VIDEO,
  BO_PLAYERS,
  BO_PHOTOS,
  BO_CONTACT_EMAIL,
} from "./blackoutContent";
import logo from "../../assets/EMSKI-logo-white-rgb.png";
import "./blackout.css";

/* Types `text` one character at a time with terminal-ish jitter once `start`
 * flips true. Reduced-motion users get the finished line immediately. */
function useTypewriter(text, start) {
  const prefersReduced = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || prefersReduced) return;
    let i = 0;
    let timer;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, 45 + Math.random() * 60);
    };
    timer = setTimeout(tick, 380);
    return () => clearTimeout(timer);
  }, [text, start, prefersReduced]);

  // Reduced motion skips the animation entirely — derived, not set in the effect.
  const shown = prefersReduced && start ? text.length : count;
  return { typed: text.slice(0, shown), done: shown >= text.length };
}

/* Slice tear on the thesis: once `on`, every 3–7s the line splits into three
 * horizontal bands that shear a few px apart for two ~65ms frames, then snap
 * back. Monochrome, hard-edged — no colour fringing, no smear. Drives the
 * DOM directly (class + transforms) so React never re-renders for it. */
function useSliceTear(ref, on) {
  const prefersReduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!on || prefersReduced || !el) return;
    const bands = el.querySelectorAll(".bo-tear");
    const rnd = (a, b) => a + Math.random() * (b - a);
    let alive = true;
    let timer;
    const reset = () => {
      bands.forEach((b) => {
        b.style.transform = "";
      });
      el.classList.remove("is-torn");
    };
    const fire = () => {
      if (!alive) return;
      el.classList.add("is-torn");
      let frame = 0;
      const step = () => {
        if (!alive) return;
        bands.forEach((b, i) => {
          const reach = i === 2 ? 4 : 6;
          b.style.transform = `translateX(${Math.round(rnd(-reach, reach))}px)`;
        });
        frame += 1;
        if (frame < 2) {
          timer = setTimeout(step, rnd(50, 80));
        } else {
          timer = setTimeout(() => {
            reset();
            timer = setTimeout(fire, rnd(3000, 7000));
          }, rnd(50, 80));
        }
      };
      step();
    };
    timer = setTimeout(fire, rnd(3000, 7000));
    return () => {
      alive = false;
      clearTimeout(timer);
      reset();
    };
  }, [ref, on, prefersReduced]);
}

/* Decode: every [data-decode] cell inside `ref` starts as machine glyphs and
 * resolves left-to-right, rows staggered, once `on`. Spaces and colons stay
 * put so the columns never jitter. Final text is what's in the DOM already,
 * so reduced-motion (and no-JS) just shows it. */
function useDecode(ref, on) {
  const prefersReduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const cells = Array.from(el.querySelectorAll("[data-decode]"));
    const finals = cells.map((c) => c.textContent);
    if (prefersReduced) {
      el.classList.add("is-live");
      return;
    }
    const G = "[]/_01";
    const rg = () => G[(Math.random() * G.length) | 0];
    const scramble = (s, upto) =>
      s
        .split("")
        .map((ch, i) => (i < upto || ch === " " || ch === ":" ? ch : rg()))
        .join("");
    cells.forEach((c, i) => {
      c.textContent = scramble(finals[i], 0);
    });
    el.classList.add("is-live");
    let alive = true;
    const timers = [];
    cells.forEach((c, i) => {
      const row = Math.floor(i / 2);
      let k = 0;
      const step = () => {
        if (!alive) return;
        k += 1;
        if (k >= finals[i].length) {
          c.textContent = finals[i];
          return;
        }
        c.textContent = scramble(finals[i], k);
        timers.push(setTimeout(step, 22));
      };
      timers.push(setTimeout(step, row * 90 + (i % 2) * 60));
    });
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      cells.forEach((c, i) => {
        c.textContent = finals[i];
      });
    };
  }, [ref, on, prefersReduced]);
}

/* Section header: the title leads in the parent sans; the mono number beside
 * it is the machine's. Metadata and sub-details stay small and mono. */
function Label({ n, children }) {
  return (
    <h2 className="bo-h">
      <span className="bo-h__n bo-mono">{n}</span>
      <span className="bo-h__t">{children}</span>
    </h2>
  );
}

function List({ items }) {
  return (
    <p className="bo-list">
      {items.map((name, i) => (
        <span key={name}>
          {name}
          {i < items.length - 1 && <span className="bo-list__sep"> / </span>}
        </span>
      ))}
    </p>
  );
}

function Video() {
  const [ref, visible] = useInView(0.2);
  const { id, title, meta } = BO_VIDEO;
  // Muted autoplay + loop so the set is already moving when the booker gets
  // to it; controls stay on so they can unmute.
  const src =
    `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&rel=0&modestbranding=1&playsinline=1`;
  return (
    <section className="bo-section" ref={ref}>
      <div className="bo-wrap">
        <Label n="01">{title}</Label>
        {/* Same treatment as the credit lists so it reads at the same weight. */}
        <List items={meta} />
        <div className="bo-video">
          {visible && (
            <iframe
              src={src}
              title="EMSKI [BLACKOUT] set — The Concourse Project, direct support for Amelie Lens"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* Stats as a console readout — LABEL: value, two aligned columns, decoding
 * in when scrolled to. 42.3K not 42.30K: integers get thousands separators,
 * decimals print as written in the data. */
function Stats() {
  const [ref, visible] = useInView(0.3);
  useDecode(ref, visible);
  const fmt = (s) => (Number.isInteger(s.val) ? s.val.toLocaleString() : String(s.val)) + s.suf;
  return (
    <div className="bo-console" ref={ref}>
      {STATS.map((s) => (
        <Fragment key={s.label}>
          <span className="bo-console__k" data-decode>
            {s.label}:
          </span>
          <span className="bo-console__v" data-decode>
            {fmt(s)}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export default function EmskiBlackout() {
  const [markOn, setMarkOn] = useState(false);
  const { typed, done } = useTypewriter(BO_TAG, markOn);
  const thesisRef = useRef(null);
  useSliceTear(thesisRef, done);

  useEffect(() => {
    // The parent EPK's body background is a shade off this palette's
    // off-black; set it for the life of this page and hand it back after.
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = "EMSKI [BLACKOUT] — Artist Press Kit";
    const t = setTimeout(() => setMarkOn(true), 250);
    return () => {
      clearTimeout(t);
      document.body.style.background = prev.bg;
      document.title = prev.title;
    };
  }, []);

  return (
    <div className="bo">
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-hero">
        <div className="bo-wrap">
          {/* Parent E, same clip as the homepage hero, recolored to off-white. */}
          <div className={`bo-hero__e ${markOn ? "is-on" : ""}`} aria-hidden="true">
            <VideoParticles src="/E_video_loop.mp4" width={520} height={520} tint={[242, 239, 234]} />
          </div>
          <div
            className={`bo-hero__mark ${markOn ? "is-on" : ""}`}
            style={{ "--bo-mark": `url(${logo})` }}
            role="img"
            aria-label="EMSKI"
          />
          <p className="bo-hero__tag" aria-label={BO_TAG}>
            <span aria-hidden="true">{typed}</span>
            <span className="bo-cursor" aria-hidden="true" />
          </p>
          {/* The hero's one rust instance — the short centred rule from the
              guide cover. */}
          <div className="bo-hero__rule-row" aria-hidden="true">
            <span className={`bo-hero__rule ${done ? "is-on" : ""}`} />
          </div>
          <p className={`bo-hero__thesis ${done ? "is-on" : ""}`} ref={thesisRef}>
            <span className="bo-hero__thesis-text">{BO_THESIS}</span>
            {/* Tear bands — copies clipped to thirds, shown only mid-tear. */}
            {[1, 2, 3].map((i) => (
              <span key={i} className={`bo-tear bo-tear--${i}`} aria-hidden="true">
                {BO_THESIS}
              </span>
            ))}
          </p>
        </div>
        {/* Own .bo-wrap so it shares the content column's exact left edge. */}
        <div className="bo-hero__foot bo-wrap">
          <p className={`bo-hero__kicker bo-mono ${done ? "is-on" : ""}`}>Artist press kit</p>
        </div>
      </section>

      {/* ━━ SET ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Video />

      {/* ━━ CREDITS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <Label n="02">Shared the stage with</Label>
          <List items={BO_ARTISTS} />
          <Label n="03">Festivals</Label>
          <List items={FESTIVALS.map((f) => f.name)} />
          <Label n="04">Label releases</Label>
          <List items={LABELS.map((l) => l.name)} />
        </div>
      </section>

      {/* ━━ STATS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <Label n="05">Streaming &amp; socials</Label>
          <Stats />
        </div>
      </section>

      {/* ━━ SINGLES (placeholders) ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <div className="bo-wrap">
          <Label n="06">{BO_TAG} singles</Label>
          <div className="bo-players">
            {BO_PLAYERS.map((p) => (
              <div className="bo-player" key={p.label}>
                <p className="bo-player__label bo-label bo-mono">{p.label}</p>
                <iframe src={p.src} title={p.title} allow="autoplay; encrypted-media" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ PHOTOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {BO_PHOTOS.length > 0 && (
        <section className="bo-section">
          <div className="bo-wrap">
            <Label n="07">Press photos</Label>
            <div className="bo-photos">
              {BO_PHOTOS.map((p) => (
                <img key={p.src} src={p.src} alt={p.alt} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━ CONTACT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bo-section">
        <span className="bo-rust-line" aria-hidden="true" />
        <div className="bo-wrap">
          <Label n={BO_PHOTOS.length > 0 ? "08" : "07"}>Contact</Label>
          <a className="bo-contact__email" href={`mailto:${BO_CONTACT_EMAIL}`}>
            {BO_CONTACT_EMAIL}
          </a>
          <div className="bo-contact__socials bo-mono">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="bo-wrap">
        <div className="bo-footer bo-mono">
          <span>&copy; 2026 EMSKI music</span>
          <span>Artist press kit</span>
        </div>
      </footer>
    </div>
  );
}
