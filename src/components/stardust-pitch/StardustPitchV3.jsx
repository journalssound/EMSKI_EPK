import StardustPitchV2 from "./StardustPitchV2";

/* v3 = v2 with this show's bar estimated at $8K and everything about last
 * year left off: no section 01, no last-year column, no vs-last-year row.
 * Ticket math is unchanged. */
export default function StardustPitchV3() {
  return (
    <StardustPitchV2 barLastYear={16000} bar={8000} version="v3" showDelta={false} showLastYear={false} />
  );
}
