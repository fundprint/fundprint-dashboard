// Confidence phrasing is bound to the evidence (see docs/copy-and-claims.md).
// We downgrade freely and never upgrade past the method.

export function confidenceLabel(
  method: string | null,
  score: number | null,
): string {
  if (method === "human_verified") return "Human-verified";
  if (method === "exact_match") return "Source-asserted";
  if (method === "fuzzy_high") return "Strong name match";
  if (method === "fuzzy_low") return "Possible name match";
  if (method === "llm_inferred") return "Inferred from records";
  if (score != null) return `Confidence ${(score * 100).toFixed(0)}%`;
  return "Linked in records";
}

// The verb strength tracks the method. "Owned by" only when the source
// directly asserts it or a human verified it; otherwise the weaker
// "linked in public records to".
export function ownershipVerb(method: string | null): string {
  if (method === "human_verified" || method === "exact_match") {
    return "is owned by";
  }
  return "is linked in public records to";
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

// The strongest "1 in N" phrasing that is still TRUE of `pct`, derived from the
// data rather than written by hand, so the headline cannot quietly drift out of
// step with the snapshot. 27.4% -> "more than 1 in 4", because 1 in 4 is 25% and
// 27.4 clears it. If the share ever slipped to 24%, this would say "more than 1
// in 5" on its own rather than keep making a claim the number no longer supports.
export function oneInPhrase(pct: number): string {
  if (!Number.isFinite(pct) || pct <= 0) return "";
  const exact = 100 / pct;
  const n = Math.ceil(exact);
  if (Number.isInteger(exact)) return `1 in ${n}`;
  return `more than 1 in ${n}`;
}
