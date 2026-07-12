# Search (the core feature)

**Owns:** the "Is your clinic PE-owned?" lookup: how a person's query becomes an honest answer about a specific clinic.
**Depends on:** the data contract (`data-contract.md`) for the rows it searches, and the methodology for how an answer is phrased.
**Consumed by:** the rendering and framing layers, which present the result and its caveats.

This is the feature a parent actually came for. Everything else on the dashboard is context; the search box is the product. It is also the feature most likely to mislead if built carelessly, because people will read its answer as a verdict about their child's clinic. Treat every result as something you will have to defend to the family who saw it.

## The question the search actually answers

A user types a clinic name, sometimes a city. The honest framing of what we can answer is narrow:

> "In the public records we have collected, is *this clinic* linked (through its operator) to a private-equity owner, and how sure are we?"

That is not the same as "is your clinic PE-owned, yes or no." The gap between those two questions is where the search earns or loses trust. Every result has to communicate the gap, not hide it.

## The three outcomes, and none of them is a bare "no"

A lookup resolves to exactly one of three states. The UI must distinguish them; collapsing them is the core failure mode.

| Outcome              | What it means                                              | What the user must be told                          |
|----------------------|-----------------------------------------------------------|-----------------------------------------------------|
| **Match, PE-linked** | We found this clinic and a chain to a PE firm, above floor | The chain, the confidence, and the source documents |
| **Match, no PE link**| We found this clinic and no PE owner in our records        | "Not found to be PE-owned *in our data*" (not "independent") |
| **No match**         | We have no record of this clinic at all                    | "We don't have this clinic yet" (silence is not an answer) |

The two non-PE outcomes are different and must never be merged. "We have no PE link for this clinic" and "we have never heard of this clinic" feel identical to a user but mean opposite things about our coverage. A clinic absent from the dataset is **not** evidence it is independent; it may be a coverage gap. The UI says so, plainly, every time.

## Absence is not proof

The single most important rule of the search:

> The dashboard tracks PE ownership. It does not certify independence.

A clinic that does not surface as PE-owned has not been cleared. It may be PE-owned through a chain we have not resolved yet, in a state we have not ingested, or under a name we have not matched. The result copy must never imply "safe," "independent," or "clean." It says what we know and marks the edge of what we know. This protects families from false comfort and protects the project from a correction it cannot win.

## How a query becomes a result

```
user query (name [+ city])
      │
      ▼
[ Normalize ]  trim, case-fold, strip punctuation; never "correct" the name
      │
      ▼
[ Match     ]  look up against the published clinic view (name + locality)
      │            exact first, then the dataset's own fuzzy index if exposed
      ▼
[ Classify  ]  one of: PE-linked match / non-PE match / no match
      │
      ▼
[ Present   ]  chain + confidence + sources, OR the honest "no" with its caveat
```

Matching uses what the dataset exposes. The dashboard does **not** invent its own fuzzy-matching to claim a link the dataset did not assert. That would be deriving a claim (see `data-contract.md`). If a near-match is ambiguous, the UI shows candidates and lets the person choose; it does not silently pick one and present it as fact.

## Confidence shapes the phrasing

The result inherits the dataset's `confidence_score` and `confidence_method`, and the wording must track them:

- **High, human-verified** → a direct statement: "X operates this clinic; X is owned by PE firm Y." With sources.
- **Above floor, inferred or fuzzy** → hedged: "Public records link this clinic to Y." With sources and a note on how the link was established.
- **Below floor** → it does not appear as a match at all. Below-floor claims never reach the dashboard (the view filters them out); the search does not resurrect them.

Never round a 0.81 up to a certainty. The confidence is part of the answer, not a detail to hide.

## Every answer is traceable

A search result that asserts a PE link must show, inline, the public source documents behind each hop of the chain: the same `source_record` links the dataset carries. A parent should be able to click from "your clinic is owned by a PE firm" to the filing or page that says so, in one step. An assertion the user cannot verify is exactly the assertion that turns into a complaint.

## What search never does

- **Never returns a bare yes/no.** Every answer carries its confidence, its sources, and the limits of our coverage.
- **Never implies independence.** No-match and no-PE-link both say "in our data," never "this clinic is independent."
- **Never invents a match.** It searches the published data; it does not run its own resolution to manufacture a link.
- **Never stores the query.** Searches are not logged against a person. The lookup is read-only and anonymous (see `deployment.md` on analytics).
- **Never "corrects" the clinic name** into a different clinic. Ambiguity is shown to the user, not resolved on their behalf.
