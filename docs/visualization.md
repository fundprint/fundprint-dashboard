# Visualization (the views)

**Owns:** the maps, timelines, and tables — what each one shows, what it is allowed to claim, and where its numbers come from.
**Depends on:** the data contract (`data-contract.md`) for every figure, and the editorial rules (`copy-and-claims.md`) for every label.
**Consumed by:** the reader. These are the most screenshotted surfaces in the project; design them to survive being screenshotted out of context.

A chart is an argument. Every visualization on the dashboard asserts something, and a reader will take a photo of it and post it without the caption. The discipline here is to make each view say something true *even when stripped of its surrounding copy* — and to make every number in it traceable to the published dataset.

## The four canonical views

From the project plan's Week 4 cut. Each has one job and one honest reading.

| View                          | What it shows                                              | The one thing it must not imply           |
|-------------------------------|-----------------------------------------------------------|-------------------------------------------|
| **Acquirer table**            | Sortable list of PE firms by tracked clinic count         | That the count is complete (it is coverage, not census) |
| **Geographic heatmap**        | PE-acquired clinics by state                              | That a dark state is "worse" rather than better-covered |
| **Clinic count over time**    | Acquisitions by acquirer across years                     | That a flat recent year means PE stopped (it may be data lag) |
| **Chain timeline**            | A single chain's history — CARD/Blackstone is the example | That every closure was caused by the PE owner |

The CARD → Blackstone → 2023 bankruptcy timeline is the canonical narrative view. It is also the one most likely to be read as accusation rather than record. It shows dated, sourced events; it does not editorialize cause inside the chart (the framing around it can carry the argument — see `copy-and-claims.md`).

## Every figure traces to the dataset

No visualization computes a number the dataset does not publish (see `data-contract.md`). Concretely:

- A bar's height is a value from a view, not a `COUNT()` the chart ran.
- A map's shading bins values the dataset exposes; the bin thresholds are an editorial choice that is documented in copy, not hidden in code.
- A timeline plots `acquisition_event` rows, each carrying its own source link.
- A "total clinics" headline is the dataset's published total, matching the Hugging Face release, not a figure the dashboard summed and rounded.

If a chart needs a number the dataset does not expose, the request goes upstream to `fundprint-data`. The chart waits; it does not improvise.

## Coverage is not census — and the charts must say so

The dataset is the most complete public picture of PE in ABA, and it is still incomplete. Every aggregate view risks being read as a full count when it is a *coverage* count. Three habits keep this honest:

- **Label counts as "tracked," not "total."** "Clinics we have linked," not "all PE-owned clinics."
- **Show the asof date and dataset version** on or beside every aggregate view, so a screenshot carries its own provenance.
- **Make absence visible, not invisible.** A state with few tracked clinics is shown as *low coverage*, never as *low PE presence*. The two are indistinguishable in the data, and the more alarming misread is the false one.

A rising or falling line is especially dangerous: recent years often look quiet because filings and news lag, not because acquisitions stopped. Annotate the lag; do not let the slope tell a story the data cannot support.

## Drill-down ends at a source

Any data point a reader can click should lead toward its evidence. A bar in the acquirer table opens that acquirer's clinics; a clinic opens its ownership chain; a chain hop opens the `source_record` document. The path from "a pixel in a chart" to "the public filing behind it" should be short and always present. A figure with no reachable source is a figure the dashboard should not be drawing.

## Accessibility and honesty are the same discipline

- Color is never the only signal — the heatmap needs labels and a legend a colorblind reader can use, and a screenshot in grayscale must still parse.
- Charts have text alternatives (a table behind every graphic) so the data is reachable without the visualization, and so it is indexable and citable as numbers.
- No chart junk that exaggerates: zero-baselined bars where a baseline matters, no truncated axes that inflate a trend, no area encodings that distort magnitude. An honest dataset deserves honest geometry.

## What visualization never does

- **Never derives a claim.** Every figure is reproducible from the published dataset.
- **Never implies completeness.** Aggregates are labeled as coverage, dated, and version-stamped.
- **Never asserts causation in the geometry.** "PE acquired, then clinic closed" is a sequence the data can show; "PE caused the closure" is an argument that belongs in sourced copy, not in a chart's shape.
- **Never strands a number.** Every displayed figure carries its asof date and version so it survives being screenshotted alone.
- **Never renders an unsourced point.** If a data point has no `source_record`, it is not plotted.
