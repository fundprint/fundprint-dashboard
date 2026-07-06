# fundprint-dashboard

The public dashboard for Fundprint — a free, citable view onto the dataset tracking private-equity ownership of U.S. ABA / autism therapy clinics. Its core feature is a clinic lookup ("Is your clinic PE-owned?"); around it sit a sortable acquirer table, a geographic heatmap, acquisition timelines, and ownership-chain views. The dashboard **displays** the dataset; it never derives a number the published dataset does not contain, and every claim on screen is one click from its public source. See `docs/architecture.md` for the five-layer design and `docs/data-contract.md` for what it is allowed to read.

The dashboard takes no position on ABA as a therapy. It tracks who owns the clinics that serve autistic children — full stop. See `docs/copy-and-claims.md`.

## Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/<org>/fundprint-dashboard.git
cd fundprint-dashboard

# 2. Install dependencies (requires Node 20+)
npm install

# 3. Set environment variables
cp .env.example .env.local
# Edit .env.local with the read-only data source and the pinned dataset version:
#   FUNDPRINT_DATA_VIEW_URL=...        (read-only Postgres views from fundprint-data)
#   FUNDPRINT_DATASET_VERSION=...      (the Hugging Face release this deploy pins)
#   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=...   (privacy-respecting analytics)

# 4. Run the dev server
npm run dev

# 5. Build the production bundle
npm run build
```

A deploy pins exactly one `dataset_version` and links to the matching Hugging Face release. The dashboard reads validated, above-floor rows through read-only views only — it has no database of its own, no user accounts, and never writes anywhere. See `docs/deployment.md`.

The dataset this dashboard reads lives in `fundprint-data`. The methodology governing what counts as "PE-backed" lives in `fundprint-methodology`. See `docs/cross-repo.md` for how the three repos coordinate — the dashboard cuts last in every release.
