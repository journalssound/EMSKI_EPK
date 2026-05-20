import { useState, useCallback } from "react";

const MAX_LEN = 200;

export default function FeelingInput({ ready, submitting, onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed || submitting) return;
      onSubmit(trimmed);
    },
    [text, submitting, onSubmit]
  );

  return (
    <form className="wfm-input-wrap" onSubmit={handleSubmit}>
      <input
        className="wfm-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
        placeholder="how does this make you feel"
        autoComplete="off"
        spellCheck="false"
        disabled={!ready || submitting}
        maxLength={MAX_LEN}
      />
      <button
        type="submit"
        className="wfm-submit"
        disabled={!ready || submitting || !text.trim()}
      >
        {submitting ? "interpreting" : "leave a piece"}
      </button>
    </form>
  );
}
