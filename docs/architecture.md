# Architecture

**Owns:** the high-level shape of the dashboard: five layers, the boundaries between them, and the direction data flows from the dataset to the screen.
**Depends on:** the read-only views and dataset published by `fundprint-data` (see `data-contract.md`), and the definitions in `fundprint-methodology` for the copy that explains them.
**Consumed by:** every other doc in this folder.

## The five layers

The dashboard is a sequence of five layers. Each has one job, one input shape, one output shape, and one guarantee it makes to the layer above it.

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. Consume   data-repo views / HF dataset → typed, fetched rows    │
├────────────────────────────────────────────────────────────────────┤
│ 2. Cache     fetched rows → version-pinned snapshot for the deploy │
├────────────────────────────────────────────────────────────────────┤
│ 3. Query     cached rows → search hits, table sorts, aggregations  │
├────────────────────────────────────────────────────────────────────┤
│ 4. Render    query results → components, charts, maps              │
├────────────────────────────────────────────────────────────────────┤
│ 5. Frame     rendered data → copy, labels, tooltips, citations     │
└────────────────────────────────────────────────────────────────────┘
```

Each layer is documented in its own file or section. This doc is about the *gaps between* them.

## Why five layers, not "a Next.js app"

The naive design is "fetch in the page, render the chart." That collapses three distinctions that matter:

- **Consume vs. Cache.** Consumption is where the outside world's instability lives: a view changes shape, the data repo cuts a new release, the database is briefly unreachable. Caching is where we promise a *stable* picture for the life of a deploy. Mixing them means a mid-day data change can silently shift a number a journalist is looking at.
- **Query vs. Render.** Querying is "which rows, in what order, grouped how." Rendering is "what the user sees." Mixing them is how a chart ends up computing a number that the dataset never published, the single worst bug this dashboard can ship (see `copy-and-claims.md`).
- **Render vs. Frame.** A bar is data. The label under the bar, the tooltip, and the "how we know this" link are a *claim*. Keeping framing as its own layer is what forces every number on screen to carry its provenance and its caveats.

Hold these distinctions even when a feature feels like a one-liner. The data is messier than the charts imply (see Risk #40 in the project plan), and the layered design is what keeps the dashboard honest about that.

## Boundary contracts

Each arrow between layers has three properties: **shape**, **trust**, **provenance**.

| Boundary          | Shape (what crosses)            | Trust (what's promised)             | Provenance (what's carried)              |
|-------------------|---------------------------------|-------------------------------------|------------------------------------------|
| Consume → Cache   | view rows / parquet records     | validated, above-floor rows only    | `dataset_version`, `fetched_at`          |
| Cache → Query     | typed snapshot                  | stable for the whole deploy         | snapshot build id                        |
| Query → Render    | result sets + aggregates        | no claim absent from the dataset    | `source_record` links travel with rows   |
| Render → Frame    | component props                 | only methodology-approved fields    | a citation link per displayed claim      |

If you cannot fill out a row in this table for a change you are making, the change is not ready.

## What is build-time, what is request-time

- **Consumption is build-time (or revalidation-time).** Data is fetched when a deploy builds or when an Incremental Static Regeneration (ISR) window elapses, never on every user request hitting the database directly. The database is `fundprint-data`'s, not ours to hammer.
- **Caching is per-deploy.** A deploy pins one `dataset_version`. Every page in that deploy shows the same version. We do not mix versions across pages.
- **Query is mostly static.** Tables, maps, and timelines are computed against the cached snapshot at build time and served as static assets. Sorting and filtering happen client-side over already-shipped data.
- **Search is request-time but read-only.** The "Is your clinic PE-owned?" lookup may hit a read-only view or a prebuilt index, but it never writes, and it degrades gracefully (see `search.md`).
- **Framing is static.** Copy is committed to the repo, reviewed, and shipped with the deploy. No copy is fetched from a remote source at runtime.

## What lives where

- **Vercel**: hosting, the edge cache, ISR. Stateless.
- **`fundprint-data` read-only views**: the live data source, accessed through dedicated views, never the entity tables directly.
- **Hugging Face dataset**: the citable, pinned artifact. The dashboard links to it for download and version-trace; it is the thing a reader cites, not the dashboard URL.
- **Plausible Analytics**: privacy-respecting traffic stats. No per-user tracking, no cookies that follow people.
- **The repo itself**: all copy, labels, tooltips, and the methodology links.

The dashboard has **no database of its own, no user accounts, no server-side user state.** If you find yourself adding any of those, stop and update this doc first: it is a change to what the dashboard *is*.

## What this architecture is *not* designed to do

- **Derive numbers.** The dashboard displays what the dataset publishes. It never computes a statistic the published dataset does not contain (even a correct one) because an outsider cannot reproduce it (see `copy-and-claims.md` and `cross-repo.md`).
- **Real-time updates.** The dashboard shows a pinned snapshot. A fresher number means cutting a new data release and redeploying, not a live feed.
- **Per-user customization.** Everyone sees the same canonical view. Filters are client-side over the same data; they do not change what the data *is*.
- **Opinions on ABA.** The dashboard reports who owns clinics. It takes no position on ABA as a therapy. That line is held in copy, not left to chance (see `copy-and-claims.md`).
- **Authentication or accounts.** The data is public. There is nothing to log into.

Holding these limits keeps the dashboard small, fast, and defensible, which is the whole point of a public reference.
