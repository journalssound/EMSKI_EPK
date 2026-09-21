import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "../../hooks/useAnimations";
import AnimNum from "../AnimNum";
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
        <p className="bo-label bo-mono">{meta.join("  /  ")}</p>
        <div className="bo-video">
          {visible && (
            <iframe
              src={src}
              title="EMSKI [BLACK OUT] set — The Concourse Project, direct support for Amelie Lens"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const [ref, visible] = useInView(0.3);
  return (
    <div className="bo-stats" ref={ref}>
      {STATS.map((s) => (
        <div className="bo-stat" key={s.label}>
          <span className="bo-stat__value">
            <AnimNum value={s.val} suffix={s.suf} visible={visible} />
          </span>
          <span className="bo-stat__label bo-mono">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function EmskiBlackout() {
  const [markOn, setMarkOn] = useState(false);
  const { typed, done } = useTypewriter(BO_TAG, markOn);

  useEffect(() => {
    // The parent EPK's body background is a shade off this palette's
    // off-black; set it for the life of this page and hand it back after.
    const prev = { bg: document.body.style.background, title: document.title };
    document.body.style.background = "#0a0a0a";
    document.title = "EMSKI [BLACK OUT] — Artist Press Kit";
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
          <p className="bo-hero__tag bo-mono" aria-label={BO_TAG}>
            <span aria-hidden="true">{typed}</span>
            <span className="bo-cursor" aria-hidden="true" />
          </p>
          {/* The hero's one rust instance — the short centred rule from the
              guide cover. Steady; the glitch lives on the thesis below. */}
          <div className="bo-hero__rule-row" aria-hidden="true">
            <span className={`bo-hero__rule ${done ? "is-on" : ""}`} />
          </div>
          <p className={`bo-hero__thesis ${done ? "is-on" : ""}`}>
            <span>{BO_THESIS}</span>
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
