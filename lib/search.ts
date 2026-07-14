import type { Clinic } from "./types";

// The core feature. See docs/search.md - the discipline here is that no result
// is a bare yes/no, absence is never proof of independence, and every match
// carries its confidence and its sources.

export type Outcome = "pe_linked" | "no_match";

export interface SearchResult {
  outcome: Outcome;
  // For a match: the clinics we show, capped at SHOW_LIMIT.
  matches: Clinic[];
  // Every clinic that matched, before the cap. `matches.length` is a display
  // detail; this is the answer to "how many do you have?", and the UI must
  // quote this one. Reporting the capped length told a parent searching a big
  // chain that we had 25 clinics when we had 222, and their own was not among
  // the 25 shown - a bare wrong answer, which is the one thing search must
  // never give.
  total: number;
  query: string;
}

// A brand search is a legitimate query, not a mistake: every clinic in a chain
// carries the identical name, so "Behavioral Innovations" genuinely matches all
// 222 of them. We cap what we render, never what we count, and we say so.
export const SHOW_LIMIT = 25;

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
  if (!q) return { outcome: "no_match", matches: [], total: 0, query: rawQuery };

  const tokens = q.split(" ").filter(Boolean);

  const scored = clinics
    .map((c) => ({ c, score: scoreClinic(c, q, tokens) }))
    .filter((x) => x.score > 0)
    // Break ties on place, not on snapshot order. Within a chain every clinic
    // scores identically, so an unstable sort made "which 25 do you see?" an
    // accident of the export's ORDER BY. Sorted by state and city, a reader who
    // scrolls can at least tell where in the list their town would fall.
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.c.state ?? "").localeCompare(b.c.state ?? "") ||
        (a.c.city ?? "").localeCompare(b.c.city ?? "") ||
        (a.c.address ?? "").localeCompare(b.c.address ?? ""),
    );

  if (scored.length === 0) {
    return { outcome: "no_match", matches: [], total: 0, query: rawQuery };
  }
  return {
    outcome: "pe_linked",
    matches: scored.slice(0, SHOW_LIMIT).map((x) => x.c),
    total: scored.length,
    query: rawQuery,
  };
}

function scoreClinic(c: Clinic, q: string, tokens: string[]): number {
  const name = normalize(c.name);
  // The street is in the haystack because it is often the only thing a parent
  // can state unambiguously: they know the building they drive to, and every
  // centre in the chain shares the name.
  const hay = normalize(
    [c.name, c.address ?? "", c.city ?? "", c.state ?? "", c.owner_name].join(
      " ",
    ),
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
