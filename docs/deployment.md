# Deployment (the output boundary)

**Owns:** how the dashboard reaches the public, how a release is pinned to a dataset version, and what a deploy does and does not change.
**Depends on:** the data contract (a deploy pins one `dataset_version`) and the cross-repo release order (`cross-repo.md`).
**Consumed by:** the public, the press, and anyone who screenshots the site. After this boundary, what is on screen is on the record.

Publishing the dataset is `fundprint-data`'s output boundary. Deploying the dashboard is *ours*. After a deploy, the dashboard is what the world sees of the project — so a deploy is a deliberate act, pinned to versions, reviewed, and reversible.

## A deploy pins exactly one dataset version

The defining rule of a dashboard release:

> Every deploy reads one `dataset_version`, shows that version everywhere, and links to the matching Hugging Face release.

- No page in a deploy shows data from a different version than any other page.
- The pinned version is visible to the reader (a footer, an "as of" stamp) so any screenshot carries its own provenance.
- The "download the data" link points at the same HF release the views were read from. Dashboard and download never disagree.

A deploy that mixes versions, or links to a release it did not read from, is broken even if every number looks right.

## The deploy reads, it does not transform

Building the dashboard pulls validated rows from the data repo's views (or the pinned HF release), caches them as static assets, and ships them. The build does not clean, re-score, dedupe, or re-derive anything — that work happened upstream and is not re-litigated here. If the build is tempted to "fix" a value, the fix belongs in `fundprint-data`, not in a build step (see `data-contract.md`).

## Cadence: static by default, revalidated deliberately

- **The site is mostly static.** Pages are built once per deploy and served from the edge. This is fast, cheap, and screenshot-stable.
- **Incremental regeneration is bounded.** If ISR is used to refresh against the views, the window is long enough that a reader and a journalist looking at the same page minutes apart see the same numbers. The dashboard is a snapshot, not a ticker.
- **A new dataset release means a new deploy**, not a silent background refresh that shifts numbers under a reader. Fresh data is a deliberate redeploy with a bumped pin.

## Release order across repos (do not shortcut it)

A dashboard deploy is the *last* step of a coordinated release. The order, from `cross-repo.md`:

1. `fundprint-methodology` cuts its release — definitions for this dataset version are frozen.
2. `fundprint-data` runs validation, publishes the HF release, and exposes the matching views.
3. `fundprint-dashboard` pins that version, refreshes copy and citation links, and deploys.

Deploying out of order — pointing the dashboard at data whose methodology document has not shipped — puts numbers on screen that do not match the definitions a reader can pull up. That mismatch is exactly the inconsistency a single screenshot makes permanent.

## Analytics: count traffic, never track people

The dashboard measures reach without surveilling readers (Plausible, per the project plan's stack):

- No cookies that follow people across sites, no per-user profiles, no ad trackers.
- Search queries are **not** logged against individuals. A parent looking up their child's clinic is not recorded as having done so.
- Aggregate counts — page views, unique visitors, which views are used — are fine and are the metrics the project plan tracks (launch-week visitors, etc.).

A dashboard about protecting families that quietly surveils them would be self-refuting. Hold the privacy line as firmly as the framing line.

## Rollback is a first-class path

Because the dashboard is read-only and version-pinned, a bad deploy has a clean undo: redeploy the previous build, which is pinned to the previous (still-valid, immutable) dataset version. There is no data migration to reverse and no user state to reconcile. If a deploy ships a wrong number or a bad line of copy, roll back first, fix forward second.

## Press and screenshot readiness

The dashboard is built to be photographed and cited:

- Every aggregate view carries its asof date and `dataset_version` (see `visualization.md`).
- Every claim is one click from its source (see `copy-and-claims.md`).
- The cited artifact is the Hugging Face release, not the dashboard URL — the dashboard links there prominently so a reporter cites the immutable dataset, not a page that may redeploy.

A reporter should be able to screenshot a chart, trace its number to the dataset, and pin the exact version — without emailing to ask. That self-service traceability is what makes the dashboard usable as a reference rather than just a website.

## What deployment never does

- **Never mixes dataset versions** in one deploy.
- **Never transforms data at build time.** It reads validated rows and ships them.
- **Never refreshes silently** in a way that shifts a reader's numbers mid-view.
- **Never deploys ahead of its data and methodology releases.** Dashboard cuts last.
- **Never logs a search against a person.** Traffic is counted in aggregate, readers are not tracked.
