import StardustPitchV2 from "./StardustPitchV2";

/* v3 = v2 with this show's bar estimated at $8K. Last year's bar stays at
 * what it did ($16K). Ticket math is unchanged. */
export default function StardustPitchV3() {
  return <StardustPitchV2 barLastYear={16000} bar={8000} version="v3" />;
}
