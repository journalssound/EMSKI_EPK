import { useRef, useCallback } from "react";
import logo from "../assets/EMSKI-logo-white-rgb.png";

/**
 * EMSKI logo — the actual logo image masked with an ice-blue gradient.
 * Reacts to mouse with a subtle parallax tilt.
 *
 * Colors: #B9DFEF / #C2E7F7 / #A7D0E3
 */
export default function ParticleLogo({ className = "" }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);

  const handleMouse = useCallback((e) => {
    const el = imgRef.current;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!el || !rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);

  const handleLeave = useCallback(() => {
    const el = imgRef.current;
    if (el) el.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`particle-logo ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      <div
        ref={imgRef}
        className="particle-logo__tinted"
        style={{
          WebkitMaskImage: `url(${logo})`,
          maskImage: `url(${logo})`,
        }}
        role="img"
        aria-label="EMSKI"
      />
    </div>
  );
}
