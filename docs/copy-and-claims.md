# Copy and claims (the editorial gate)

**Owns:** what the dashboard is allowed to *say* — the framing, the labels, the tooltips, the citations, and the neutral-on-ABA line.
**Depends on:** the methodology repo for definitions and contested positions; the data contract for what is true.
**Consumed by:** every rendered surface. No claim-bearing pixel ships without passing this gate.

The dataset earns trust by being source-traceable. The dashboard can squander that trust in a single sentence. This layer is the dashboard's equivalent of the data repo's validation gate: it decides which words the project is willing to put in front of a parent, a journalist, a PE firm's lawyer, and a Senate staffer. It is the layer most likely to be rushed under launch pressure, and rushing it is what makes the project a liability instead of a reference.

## The neutral-on-ABA line (hold it everywhere)

ABA therapy is contested inside the autism community. **Fundprint is not in that debate.** The dashboard tracks who owns the clinics that serve autistic children — full stop. This position is held in copy, consistently, on every page, tooltip, and error message:

- The dashboard does not call ABA good, bad, harmful, or essential.
- It does not frame autistic children as victims, burdens, or objects of pity.
- It does not speak *for* autistic people.
- When a number looks damning (a chain's clinics closing), the copy states the sourced sequence and stops. The reader draws the conclusion; the dashboard does not editorialize the modality.

If a label, tooltip, or headline takes a side on ABA-as-therapy, it does not ship. The frame is always consumer-protection: *families deserve to know who owns their clinic, regardless of how anyone feels about ABA.*

## What the dashboard may claim, and how strongly

The strength of a sentence must match the strength of the evidence behind it. The dataset hands the dashboard a `confidence_score` and a `confidence_method`; the copy is bound by them.

| Evidence                         | Allowed phrasing                                  | Forbidden phrasing                  |
|----------------------------------|---------------------------------------------------|-------------------------------------|
| Human-verified, high confidence  | "X owns this clinic." (with source)               | —                                   |
| Above floor, inferred / fuzzy    | "Public records link this clinic to X."           | "X owns this clinic" as bare fact   |
| Below floor                      | *(not shown at all)*                              | any phrasing — it never appears     |
| No record                        | "We don't have this clinic in our data."          | "This clinic is independent."       |

"Linked in public records" and "owned by" are different claims. Use the weaker one whenever the evidence is anything short of verified. Downgrading a claim is never wrong; upgrading one past its evidence is the bug.

## Every claim carries its citation

A claim on the dashboard without a reachable public source is not a claim; it is an assertion the project cannot defend. So:

- Every ownership statement links to the `source_record` document(s) behind it.
- Every aggregate links to the methodology that defines its terms ("what counts as PE-backed") and to the dataset release it came from.
- "How we know this" is a first-class UI element, not fine print. A reader should be one click from the evidence for anything the dashboard asserts.

The methodology lives in `fundprint-methodology`. The dashboard links to it; it does not restate definitions in its own words, because a paraphrase drifts from the source and creates two conflicting definitions of "PE-backed." Link, do not re-define.

## The "able to defend it" test, applied to copy

Before any claim-bearing copy ships, you must be able to, for a randomly chosen statement on the page:

1. Explain in 30 seconds what it claims.
2. Name the source that backs it.
3. Identify the weakest part of that claim and why it is weak.
4. Answer one follow-up you did not anticipate — "what about the clinic that changed names?", "is this acquisition date exact or circa?"

If you cannot, the copy is overclaiming. Soften it to what you can defend, or cut it. The dashboard's credibility is the project's credibility; a single indefensible sentence under a journalist's reply spends it.

## Corrections are public, not silent

The dashboard is a window onto an immutable, versioned dataset. It does not "fix" a number by editing a page:

- A wrong figure is corrected by the data repo cutting a new release; the dashboard redeploys against it (see `deployment.md`).
- A challenged claim — from an advisor, a journalist, or the chain itself — is routed to the data repo, which may quarantine it; it then drops out of the views and off the dashboard at the next deploy.
- When a visible number changes between releases, the change is acknowledged, not slipped in. A dataset that silently revises looks like a dataset that hides mistakes.

The dashboard never carries a "corrections" claim the dataset does not back. Its honesty is downstream of the dataset's honesty.

## Sensitivity is a review step, not an instinct

Per the project's risk plan, language about autistic children and their families gets a deliberate review, not just a careful author. Headlines, the search result copy, and any narrative framing (especially around the CARD bankruptcy) are reviewed with the disability-community frame in mind before launch. The rules: never speak for autistic people, never frame children as objects of pity, always pair the financial frame with the families-affected frame. This is a gate, not a preference.

## What copy never does

- **Never takes a side on ABA-as-therapy.** The scope is ownership, not modality.
- **Never overclaims past the confidence.** The sentence is as strong as the evidence, never stronger.
- **Never asserts independence.** Absence from the data is a coverage statement, not a clean bill.
- **Never restates the methodology.** It links to the canonical definition; it does not fork it into UI copy.
- **Never corrects silently.** Numbers change by re-release, acknowledged, never by quiet edit.
