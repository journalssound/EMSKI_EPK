import { useState, useRef } from "react";

const CORRECT = "e/motion";

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim().toLowerCase() === CORRECT) {
      setUnlocked(true);
    } else {
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="pw-gate">
      <div className="pw-gate__lock">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pw-gate__icon"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <p className="pw-gate__label">THIS CONTENT IS PASSWORD PROTECTED</p>
      <form onSubmit={handleSubmit} className="pw-gate__form">
        <input
          ref={inputRef}
          type="text"
          className={`pw-gate__input ${shake ? "pw-gate__input--shake" : ""}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter password"
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit" className="pw-gate__btn">
          UNLOCK
        </button>
      </form>
    </div>
  );
}
