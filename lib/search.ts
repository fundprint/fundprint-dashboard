import type { Clinic } from "./types";

// The core feature. See docs/search.md - the discipline here is that no result
// is a bare yes/no, absence is never proof of independence, and every match
// carries its confidence and its sources.

export type Outcome = "pe_linked" | "no_match";

export interface SearchResult {
  outcome: Outcome;
  // For a match: the clinics that matched (may be several across cities).
  matches: Clinic[];
  query: string;
}

// Normalize without ever "correcting" into a different clinic: trim, case-fold,
// collapse whitespace, strip punctuation. We do not autocorrect spellings.
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,'"()\-/&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Every clinic in the snapshot is, by construction, PE/institution-linked
// (it only appears if it has a published ownership chain). So a match IS a
// linked match; the absence of a match is the honest "we don't have this
// clinic" outcome - which is a coverage statement, never a claim of
// independence. We never manufacture a link the dataset did not assert.
export function search(clinics: Clinic[], rawQuery: string): SearchResult {
  const q = normalize(rawQuery);
  if (!q) return { outcome: "no_match", matches: [], query: rawQuery };

  const tokens = q.split(" ").filter(Boolean);

  const scored = clinics
    .map((c) => ({ c, score: scoreClinic(c, q, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25)
    .map((x) => x.c);

  if (scored.length === 0) {
    return { outcome: "no_match", matches: [], query: rawQuery };
  }
  return { outcome: "pe_linked", matches: scored, query: rawQuery };
}

function scoreClinic(c: Clinic, q: string, tokens: string[]): number {
  const name = normalize(c.name);
  const hay = normalize(
    [c.name, c.city ?? "", c.state ?? "", c.owner_name].join(" "),
  );

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;

  // All query tokens present somewhere (name/city/state/brand).
  if (tokens.every((t) => hay.includes(t))) return 40;

  // Partial: most tokens present.
  const hits = tokens.filter((t) => hay.includes(t)).length;
  if (hits >= Math.ceil(tokens.length / 2)) return 20 + hits;

  return 0;
}
