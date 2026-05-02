import { useInView } from "../hooks/useAnimations";

/**
 * Fade-up reveal wrapper — triggers once on scroll into view.
 */
export default function Reveal({ children, delay = 0, className = "", style }) {
  const [ref, visible] = useInView(0.08);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}
