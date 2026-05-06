import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";

const CLIP_DURATION_S = 20;
const CLIP_START_S = 60; // tune to actual chorus position

const AudioPlayer = forwardRef(function AudioPlayer(
  { src, onPlay, onPause, onProgress, onEnded, audioElRef },
  ref
) {
  const internalRef = useRef(null);
  const audioEl = audioElRef ?? internalRef;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useImperativeHandle(ref, () => ({
    el: audioEl.current,
    play: () => audioEl.current?.play(),
    pause: () => audioEl.current?.pause(),
  }));

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;

    const onLoaded = () => {
      try { el.currentTime = CLIP_START_S; } catch {}
    };
    const onTime = () => {
      const t = el.currentTime - CLIP_START_S;
      const ratio = Math.max(0, Math.min(1, t / CLIP_DURATION_S));
      setProgress(ratio);
      onProgress?.(t, ratio);
      if (t >= CLIP_DURATION_S) {
        el.pause();
        el.currentTime = CLIP_START_S;
        setPlaying(false);
        onEnded?.();
      }
    };
    const onPlayEv = () => { setPlaying(true); onPlay?.(); };
    const onPauseEv = () => { setPlaying(false); onPause?.(); };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlayEv);
    el.addEventListener("pause", onPauseEv);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlayEv);
      el.removeEventListener("pause", onPauseEv);
    };
  }, [audioEl, onPlay, onPause, onProgress, onEnded]);

  const handleClick = useCallback(() => {
    const el = audioEl.current;
    if (!el) return;
    if (el.paused) {
      try {
        if (el.currentTime < CLIP_START_S || el.currentTime >= CLIP_START_S + CLIP_DURATION_S) {
          el.currentTime = CLIP_START_S;
        }
      } catch {}
      el.play()?.catch(() => {});
    } else {
      el.pause();
    }
  }, [audioEl]);

  return (
    <div className="wfm-mini-player">
      <button
        type="button"
        className="wfm-mini-player__btn"
        onClick={handleClick}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <rect x="0" y="0" width="3" height="12" fill="currentColor" />
            <rect x="7" y="0" width="3" height="12" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <path d="M0 0L10 6L0 12V0Z" fill="currentColor" />
          </svg>
        )}
      </button>
      <div className="wfm-mini-player__bar">
        <div
          className="wfm-mini-player__fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <audio
        ref={audioEl}
        src={src}
        preload="auto"
        crossOrigin="anonymous"
        playsInline
        style={{ display: "none" }}
      />
    </div>
  );
});

export default AudioPlayer;
