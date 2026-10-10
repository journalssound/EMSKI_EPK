import StardustPitchV2 from "./StardustPitchV2";

/* v3 = v2 with the bar estimated at $8K instead of $16K, for both last
 * year and the projections. Ticket math is unchanged. */
export default function StardustPitchV3() {
  return <StardustPitchV2 bar={8000} version="v3" />;
}
