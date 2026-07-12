# Data contract (the input boundary)

**Owns:** what the dashboard is allowed to read, the shapes that flow in, and the rule that the dashboard never invents data the dataset does not contain.
**Depends on:** the read-only views and Hugging Face releases published by `fundprint-data` (see that repo's `publication.md`).
**Consumed by:** every layer above Consume: Cache, Query, Render, Frame.

This is the boundary where the dashboard meets the dataset. Everything downstream of here assumes the data is already validated, above-floor, and source-traceable. The dashboard's job is not to re-check that work; it is to display it without distorting it.

## The two sources, and which is canonical

| Source                         | What it is                                  | The dashboard uses it for           |
|--------------------------------|---------------------------------------------|-------------------------------------|
| `fundprint-data` read-only views | The latest validated snapshot, live, in Postgres | Powering the live UI: search, tables, maps |
| Hugging Face dataset release   | An immutable, versioned, citable artifact   | The "download the data" link and the version a reader cites |

The HF release is the **citable** source of truth. The views are the **operational** source the UI reads. They must agree: a deploy pins the `dataset_version` whose views it reads, and links to the matching HF release. If the views and the linked HF release disagree, the deploy is wrong: fix the pin, not the chart.

## Read from views, never from entity tables

The dashboard reads dedicated read-only views in `fundprint-data`, never the underlying entity tables. This is deliberate and non-negotiable:

- **The view is the contract.** The data repo can rename a column or restructure a table without breaking the dashboard, as long as the view stays stable.
- **The view is already filtered.** It exposes only validated, above-floor rows. Quarantined and unverified claims do not cross this boundary. The dashboard does not filter for trust itself; it trusts the view to have done it.
- **The view exposes only public fields.** Internal scoring intermediates, candidate sets, and raw resolver output stay behind the boundary. If the dashboard cannot see a field, it is not allowed to render it.

The dashboard never connects with write credentials. It has no reason to write, and a write path is a bug.

## What the dashboard is allowed to read

Each row from a view carries the meaning *and* its provenance. The dashboard must surface the provenance, not just the meaning. Expect, on every claim-bearing row:

- The entity fields it is allowed to show: clinic name, locality, owner entity, parent PE firm, acquisition date.
- `confidence_score`: so the UI can show how sure the dataset is, and never present a low-confidence claim as a certainty.
- `confidence_method`: whether a link was exactly matched, fuzzy-matched, inferred, or human-verified. This shapes how strongly the UI may phrase a claim.
- `source_record` links: the public document(s) behind the claim. **A claim with no source link is not rendered.** No exceptions.
- `dataset_version`: so any screenshot can be traced to an exact release.

If a view stops providing any of these, the dashboard files a request to the data repo (see `cross-repo.md`); it does not paper over the gap.

## The cardinal rule: display, never derive

The dashboard displays numbers the dataset publishes. It does **not** compute new ones.

- A total ("4,812 clinics tracked") comes from the dataset or a view, not from a `COUNT()` the dashboard runs and then presents as a finding.
- A breakdown by acquirer comes from a view designed to expose it. If the breakdown the dashboard wants does not exist, the request goes upstream; the dashboard does not derive it in TypeScript.
- A number that appears on the dashboard but not in the published dataset is a **bug, even if it is correct**, because an outsider downloading the dataset cannot reproduce it. A number that cannot be reproduced cannot be cited, and citability is the entire point.

The line is bright on purpose: *if a journalist asks "where does this number come from," the answer must be a row or a view in the published dataset, never "the dashboard calculated it."*

## Trivial vs. meaningful aggregation

Client-side conveniences are fine; new claims are not. The test is whether the result is reproducible from the published dataset.

- **Allowed:** sorting the acquirer table, filtering the map to one state, paginating a list, formatting a date, summing a column the view already exposes as the canonical figure.
- **Not allowed:** ranking acquirers by a metric the dataset does not publish, joining two views to manufacture a relationship, inferring an acquisition the dataset did not assert, or "estimating" a count where the dataset is silent.

When unsure, ask: *could a reader recreate this exact number from the Hugging Face download alone?* If no, it does not belong on the dashboard until the data repo publishes it.

## What the dashboard never does at this boundary

- **Never writes.** Read-only views, read-only credentials, full stop.
- **Never reaches around the view** to the entity tables, the staging tables, or the snapshots. Those are internal to `fundprint-data`.
- **Never mixes dataset versions** within a deploy. One deploy, one pinned version, one HF release linked.
- **Never renders a claim without its source.** Missing `source_record` links means the row does not appear, however confident it looks.
- **Never re-implements methodology.** "What counts as PE-backed" is a flag the dataset sets, not logic the dashboard encodes.
