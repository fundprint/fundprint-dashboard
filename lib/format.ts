// Confidence phrasing is bound to the evidence (see docs/copy-and-claims.md).
// We downgrade freely and never upgrade past the method.

// The verb strength tracks the method. "Owned by" only when the source
// directly asserts it or a human verified it; otherwise the weaker
// "linked in public records to".
export function ownershipVerb(method: string | null): string {
  if (method === "human_verified" || method === "exact_match") {
    return "is owned by";
  }
  return "is linked in public records to";
}

// The four-dimension confidence, phrased for a reader. The overall badge is the
// clinic's weakest link; the four sub-flags say exactly which questions are
// answered by the owner's own directory and which rest on a registry record. See
// lib/types.ts and the exporter's _confidence().
import type { Confidence, ConfidenceOverall, FirmType } from "./types";

export const CONFIDENCE_OVERALL_LABEL: Record<ConfidenceOverall, string> = {
  owner_verified: "Owner-verified center",
  registry_current: "Registry-listed, current",
  registry_aging: "Registry-listed, aging",
  registry_undated: "Registry-listed, undated",
  registry_stale: "Registry-listed, may be closed",
  in_home: "In-home, no center",
};

// Green when the owner itself attests the site; amber as the registry record ages;
// grey for in-home. Tuned to read in both themes.
export const CONFIDENCE_OVERALL_TONE: Record<ConfidenceOverall, "strong" | "mid" | "weak" | "neutral"> = {
  owner_verified: "strong",
  registry_current: "mid",
  registry_aging: "weak",
  registry_undated: "weak",
  registry_stale: "weak",
  in_home: "neutral",
};

function ownerLabel(firmType: FirmType | null, basis: "curated" | "portfolio"): string {
  const kind =
    firmType === "private_equity"
      ? "private equity"
      : firmType === "pension_fund"
        ? "pension fund"
        : firmType === "family_office"
          ? "family office"
          : "institutional owner";
  const grade = basis === "curated" ? "acquisition on record" : "firm's portfolio page";
  return `${kind} (${grade})`;
}

// The four rows shown behind the "why?" toggle: a dimension, its plain-English
// value, and whether that value is the owner's own statement (strong) or a
// registry inference (weaker).
export function confidenceRows(
  c: Confidence,
): { dim: string; value: string; strong: boolean }[] {
  const openValue: Record<Confidence["open"], string> = {
    owner_listed: "owner lists it today",
    registry_current: "registry record, under 3 years old",
    registry_aging: "registry record, 3 to 6 years old",
    registry_undated: "registry record, no date",
    registry_stale: "registry record, 6+ years old",
    in_home: "in-home therapy, no center",
  };
  const owner = c.ownership;
  return [
    { dim: "Open", value: openValue[c.open], strong: c.open === "owner_listed" },
    {
      dim: "At this address",
      value: c.address === "owner_stated" ? "owner states it" : "registry filing",
      strong: c.address === "owner_stated",
    },
    {
      dim: "Center or in-home",
      value:
        c.site_type === "center"
          ? "a physical center"
          : c.site_type === "in_home"
            ? "in-home therapy"
            : "not independently confirmed",
      strong: c.site_type === "center",
    },
    {
      dim: "Owner",
      value: ownerLabel(owner.firm_type, owner.basis),
      strong: owner.basis === "curated",
    },
  ];
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
