import { useState, useEffect, useRef, useCallback } from "react";
import AudioPlayer from "./AudioPlayer";
import FeelingInput from "./FeelingInput";
import FieldCanvas from "./FieldCanvas";
import { getContribution, setContribution } from "./gating";
import { NEUTRAL_VECTOR, isValidVector, deterministicVectorFromText, hashText } from "./plutchikMapping";
import { useAudioAnalyser } from "../../hooks/useAudioAnalyser";
import "./wait-for-me.css";

const AUDIO_SRC = "/ninjatune/songs/wait-for-me.mp3";
const REVEAL_DATE = "5.28.26";
const PERSONAL_HOLD_MS = 4000;
const DISSOLVE_MS = 1500;
const SETTLE_MS = 500;

// Stages: idle | playing | submitting | personal | dissolving | collective
// (returning visitor: bypasses input → goes to collective with their old vector)

export default function WaitForMe() {
  const [stage, setStage] = useState("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [returning, setReturning] = useState(false);
  const fieldRef = useRef(null);
  const audioElRef = useRef(null);
  const { start: startAudioAnalyser, getBands } = useAudioAnalyser(audioElRef);

  useEffect(() => {
    document.title = "EMSKI — wait for me";
    // NOTE: Returning-visitor gate disabled during design iteration.
    // Re-enable in Day 5 once the real backend is wired and we know the gate
    // is gating an actual stored contribution, not just localStorage from testing.
    // Clear stale local gate so every reload is a fresh visit.
    try { localStorage.removeItem("wfm:contribution:v1"); } catch {}
  }, []);

  const onPlay = useCallback(() => {
    startAudioAnalyser();
    fieldRef.current?.setMode("audio-react");
    setStage((s) => (s === "idle" ? "playing" : s));
  }, [startAudioAnalyser]);

  const onPause = useCallback(() => {}, []);

  const onSubmit = useCallback(async (text) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    let vector;
    let id;

    try {
      const res = await fetch("/api/feel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, stage: "denial" }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      vector = isValidVector(data.vector) ? data.vector : NEUTRAL_VECTOR;
      id = data.contribution_id || `local-${Date.now()}`;
    } catch (e) {
      vector = deterministicVectorFromText(text);
      id = `local-${Date.now()}`;
    }

    setContribution({ id, vector, ts: Date.now() });
    // Pass text hash as seed so different words → visibly different cover art
    // even when emotion vectors are similar.
    fieldRef.current?.setEmotion(vector, hashText(text));
    fieldRef.current?.setMode("personal");
    setStage("personal");
    setSubmitting(false);

    setTimeout(() => {
      setStage("dissolving");
      fieldRef.current?.dissolveToCollective({ duration: DISSOLVE_MS });
      setTimeout(() => setStage("collective"), DISSOLVE_MS + SETTLE_MS);
    }, PERSONAL_HOLD_MS);
  }, [submitting]);

  const showControls = !returning && (stage === "idle" || stage === "playing");
  const showStamp = stage === "personal" || stage === "dissolving" || stage === "collective" || returning;

  return (
    <div className="wfm-root">
      <div className="wfm-container">
        <div className="wfm-art-frame">
          <FieldCanvas
            ref={fieldRef}
            getAudioBands={getBands}
          />
        </div>

        <div className={`wfm-controls ${showControls ? "" : "wfm-controls--gone"}`}>
          <AudioPlayer
            src={AUDIO_SRC}
            onPlay={onPlay}
            onPause={onPause}
            audioElRef={audioElRef}
          />
          <FeelingInput
            ready={!returning && stage !== "submitting"}
            submitting={submitting}
            onSubmit={onSubmit}
          />
          {error && <div className="wfm-status">{error}</div>}
        </div>

        <div className={`wfm-stamp ${showStamp ? "wfm-stamp--visible" : ""}`}>
          cover art reveals {REVEAL_DATE}
        </div>
      </div>
    </div>
  );
}
