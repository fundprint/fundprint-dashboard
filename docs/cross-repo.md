# Cross-repo coordination

**Owns:** how `fundprint-dashboard` stays coherent with `fundprint-data` and `fundprint-methodology` as all three evolve, from the dashboard's point of view as the downstream repo.
**Depends on:** the data repo's publication contracts and the methodology repo's definitions.
**Consumed by:** anyone making a dashboard change that touches data it does not produce or definitions it does not own, which is most consequential changes.

Three repos, one product. The dashboard is the furthest downstream: it produces no data and owns no definitions. Almost everything it shows originates elsewhere. That makes coordination discipline more important here than anywhere, because the dashboard is where an upstream inconsistency becomes publicly visible.

## The three repos and their jobs

| Repo                    | Owns                                              | Changes when…                          |
|-------------------------|---------------------------------------------------|----------------------------------------|
| `fundprint-methodology` | Definitions, white paper, sensitivity-reader notes| The world's understanding shifts.      |
| `fundprint-data`        | Pipelines, schema, resolution, exports, views     | Sources change or quality improves.    |
| `fundprint-dashboard`   | Public UI, search, visualizations                 | The presentation needs to evolve.      |

Roughly: methodology changes once a quarter, data changes weekly, the dashboard changes daily. The dashboard changes most often and matters most for perception, and owns the least truth.

## Direction of truth

**Methodology defines. Data implements. Dashboard displays.**

The dashboard is the bottom of that chain. When the three disagree:

- If methodology says X but the dataset shows Y, that is the data repo's problem to fix; the dashboard waits for the corrected release.
- If the dataset publishes Y but the dashboard shows Z, **the dashboard is wrong.** It must show Y.
- If the dashboard wants to display W and the dataset does not expose it, the dashboard **files a request** to the data repo. It never derives W itself.

A dashboard change that computes a number the published dataset does not contain is a bug, even when the number is correct, because no outsider can reproduce it, which means it cannot be cited. This is the single rule that most often gets bent under deadline pressure. Do not bend it.

## What flows in, what flows out

```
fundprint-methodology ──→ fundprint-dashboard   (definitions to link to, copy guidance)

fundprint-data ───────────→ fundprint-dashboard   (read-only views, pinned HF release)

fundprint-dashboard ──────→ fundprint-data        (view-change requests, never code)
fundprint-dashboard ──────→ fundprint-methodology (copy questions, never new definitions)
```

The dashboard is downstream of two repos and upstream of none. Everything it sends upstream is a *request*, never a write and never a derivation it made on its own.

## Requesting a new field or view

When the dashboard needs data it cannot currently show, the path is fixed:

1. Open an issue in `fundprint-data` describing the field or view the dashboard needs and why.
2. The data repo adds (or declines) the view, exposing only validated, above-floor, public fields.
3. The dashboard consumes the new view in a coordinated release.

Never the other way around. The dashboard does not reach past the views to the entity tables to get a field faster, and it does not synthesize the field client-side. Either path produces a number nobody can reproduce from the published dataset.

## Coordinated releases: the dashboard cuts last

A release is one event touching all three repos, in order (see `deployment.md`):

1. **Methodology cuts first.** Definitions for this version freeze.
2. **Data cuts second.** Validation runs, the HF dataset publishes, the views update, all tagged with `(schema_version, resolver_version, methodology_version, dataset_version)`.
3. **Dashboard cuts last.** It pins the new `dataset_version`, refreshes copy and citation links, and deploys.

Out-of-order release is the most common way to publish an inconsistent product. A dashboard deployed ahead of its data or methodology shows numbers that do not match the document a reader can pull up. Do not work around the order to ship a chart faster.

## The credibility chain, from the dashboard down

A reader on the dashboard can trace: dashboard deploy → pinned `dataset_version` → Hugging Face release → `fundprint-data` release → `fundprint-methodology` version → the document defining what they are looking at. The dashboard's job is to keep that chain unbroken and one click deep. Every pin, every citation link, every "how we know this" exists to keep that trace intact.

## Change patterns the dashboard must handle

**Pattern A: pure data change.** New source, new state, more clinics resolved.
- Methodology: usually no change.
- Data: new release, new views.
- Dashboard: re-pin and redeploy against the new `dataset_version`. Most common case.

**Pattern B: definitional change.** "What counts as PE-backed" tightens or loosens.
- Methodology: new release with a dated changelog.
- Data: mandatory re-resolution; some rows change status.
- Dashboard: copy may need updating ("includes minority-stake acquisitions: yes/no"), and visible numbers may shift between releases: **acknowledge the shift, never slip it in** (see `copy-and-claims.md`). A definitional change is a story; coordinate it, do not let it look like silent revision.

**Pattern C: UI-only change.** New chart, refined copy, a layout fix.
- Methodology: no change.
- Data: no change.
- Dashboard: new deploy against the existing pinned version.

Pattern A is routine. Pattern B is the dangerous one: it is where a visible number changes and credibility is most at risk, and where the coordination discipline pays for itself.

## Cross-repo review

Any dashboard PR that depends on a view it does not yet have, or that changes how a methodology-defined term is presented:

- Tagged `cross-repo` in the title.
- Linked to the sibling-repo issue or PR it depends on.
- Merged only after the sibling change is shipped or queued, never a dashboard deploy that assumes a view or definition that does not exist yet.

A `cross-repo` dashboard change merged without coordination is a broken page, a 404 citation link, or a chart reading a view that was never created, discovered live, on the most public surface of the project.

## What does not cross repos into the dashboard

- **Code.** The dashboard does not import the data repo's models or SQL. It reads views.
- **Definitions.** The dashboard does not encode "PE-backed" in TypeScript. It reads a flag and links to the methodology.
- **Trust logic.** The dashboard does not re-implement confidence floors or validation. The views hand it only what already passed.

Every time these lines blur, the project gets harder to defend. The dashboard is where the blurring would be most visible, so hold the lines hardest here.
