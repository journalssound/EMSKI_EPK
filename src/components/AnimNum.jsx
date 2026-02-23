import { useState, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/useAnimations";

/**
 * Animated counter — counts from 0 to `value` when `visible` becomes true.
 * Respects prefers-reduced-motion.
 */
export default function AnimNum({ value, suffix, visible }) {
  const [current, setCurrent] = useState(0);
  const ran = useRef(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!visible || ran.current) return;
    ran.current = true;

    // If reduced motion, snap to final value immediately
    if (prefersReduced) {
      setCurrent(value);
      return;
    }

    const duration = 2200; // ms
    const t0 = performance.now();

    const tick = (t) => {
      const progress = Math.min((t - t0) / duration, 1);
      // ease-out quartic
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(eased * value);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [visible, value, prefersReduced]);

  const display =
    value >= 1 && Number.isInteger(value)
      ? Math.round(current).toLocaleString()
      : current.toFixed(2);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}
