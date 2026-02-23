import { useInView } from "../hooks/useAnimations";

/**
 * A single grid cell with staggered fade-in.
 */
export default function StaggerCell({
  children,
  index = 0,
  baseDelay = 0.04,
  className = "",
}) {
  const [ref, visible] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`stagger-item ${visible ? "stagger-item--visible" : ""} ${className}`}
      style={{ transitionDelay: `${index * baseDelay}s` }}
    >
      {children}
    </div>
  );
}
