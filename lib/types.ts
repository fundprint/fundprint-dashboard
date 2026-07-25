// The shape of the version-pinned snapshot the dashboard ships as a static
// asset. Mirrors scripts/export_dashboard_snapshot.py in fundprint-data.
// Every claim-bearing row carries its provenance (`sources`) and its
// confidence; the UI is not allowed to render a claim without them.

export type FirmType =
  | "private_equity"
  | "pension_fund"
  | "family_office"
  | "other";

export interface SnapshotMeta {
  dataset_version: string;
  resolver_version: string;
  methodology_version: string;
  generated_at: string;
  source: string;
}

export interface Totals {
  clinics: number;
  acquirers: number;
  states: number;
  pe_clinics: number;
  non_pe_clinics: number;
  // Clinics carrying a map coordinate (ZIP centroid). May be < clinics.
  located_clinics: number;
  directory_sourced_clinics: number;
  registry_only_clinics: number;
  // Every clinic bucketed by its overall confidence. Keys are ConfidenceOverall
  // values; absent keys are zero.
  confidence: Partial<Record<ConfidenceOverall, number>>;
}

// The four dimensions the old single label conflated: is the clinic open, is it at
// this address, is it a centre or in-home, and who owns it. Each is derived from
// the published dataset, never asserted.
export type ConfidenceOverall =
  | "owner_verified" // the owner's own directory lists this exact site
  | "registry_current" // registry-only, re-certified within three years
  | "registry_aging" // registry-only, three to six years cold
  | "registry_undated" // registry-only, no certification date
  | "registry_stale" // registry-only, six-plus years untouched
  | "in_home"; // owner delivers in-home therapy, runs no centre

export interface Confidence {
  overall: ConfidenceOverall;
  open:
    | "owner_listed"
    | "registry_current"
    | "registry_aging"
    | "registry_undated"
    | "registry_stale"
    | "in_home";
  address: "owner_stated" | "registry_filed";
  site_type: "center" | "in_home" | "unverified";
  ownership: { firm_type: FirmType | null; basis: "curated" | "portfolio" };
  registry_last_updated: string | null;
}

export interface Acquirer {
  id: string;
  name: string;
  firm_type: FirmType;
  hq_state: string | null;
  clinic_count: number;
  brand_count: number;
  // True when the owner holds no clinics now but is shown for its history
  // (e.g. Blackstone, which lost CARD in the 2023 bankruptcy).
  former?: boolean;
  // True when the owner's ABA holding delivers therapy in the client's home and
  // operates no centers (Moran/Butterfly Effects, Cane/Key Autism). Its clinic
  // count is zero because it has no clinics, not because we found none.
  in_home?: boolean;
}

// The national ABA market, measured from the same federal provider registry the
// clinics come from. Numerator and denominator are computed in one pass over one
// universe, so the numerator is a strict subset. Registry basis: clinics we read
// from owners' own directories are excluded from BOTH sides.
//
// There is deliberately NO chain threshold here. A "share of chain-run clinics"
// was published until 2026-07 and withdrawn: the five-site cut was arbitrary, and
// the denominator was endogenous (an operator is a chain because it has many
// sites, and it has many sites because private equity rolled it up, so PE's own
// buying inflated both sides). What replaces it is the operator-size distribution
// (the reader picks their own cut, out loud) and the per-state shares.
export interface Market {
  meta: { basis: string; source: string; min_state_sites: number; note: string };
  denominator: {
    aba_organizations: number;
    aba_sites: number;
  };
  numerator: {
    tracked_sites: number;
    private_equity_sites: number;
  };
  share: {
    // Of every ABA site in the country. No threshold, nothing chosen.
    tracked_of_all_sites: number;
    private_equity_of_all_sites: number;
  };
  size_distribution: {
    sites_per_operator: string;
    operators: number;
    sites: number;
  }[];
  // Sorted by private_equity_share, descending. Only states at or above
  // meta.min_state_sites are here: a percentage of six sites means nothing.
  states: {
    state: string;
    aba_sites: number;
    tracked_sites: number;
    private_equity_sites: number;
    private_equity_share: number;
    tracked_share: number;
  }[];
  context: { published_clinics: number; why_larger: string };
}

export interface Brand {
  owner_id: string;
  owner_name: string;
  firm_id: string;
  firm_name: string;
  firm_type: FirmType;
  clinic_count: number;
}

export interface StateCount {
  state: string;
  clinic_count: number;
}

export interface Clinic {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  npi: string | null;
  lat: number | null;
  lng: number | null;
  owner_id: string;
  owner_name: string;
  firm_id: string;
  firm_name: string;
  firm_type: FirmType;
  confidence_score: number | null;
  confidence_method: string | null;
  confidence: Confidence;
  sources: string[];
}

export interface TimelineEvent {
  id: string;
  firm_name: string | null;
  brand_name: string | null;
  date: string | null;
  date_circa: boolean;
  event_type: string | null;
  notes: string | null;
  sources: string[];
}

export interface Snapshot {
  meta: SnapshotMeta;
  totals: Totals;
  // Null when the market denominator has not been computed for this release.
  market: Market | null;
  // Null when the platform denominator has not been built for this release.
  coverage: Coverage | null;
  // Null when the reconciliation has not been built for this release.
  reconciliation: Reconciliation | null;
  acquirers: Acquirer[];
  brands: Brand[];
  states: StateCount[];
  clinics: Clinic[];
  timeline: TimelineEvent[];
}

// How many of the known private-equity-backed ABA platforms Fundprint covers.
//
// The denominator is deliberately NOT ours. Its spine is the appendix of PESP's
// April 2026 report, "Private equity-backed ABA providers", content-hashed like
// any other source, so the finish line is one somebody else drew. The unit is the
// platform (the operating company a sponsor buys), not the deal (one platform
// absorbs many) and not the clinic (that is the thing being measured).
//
// The list is wrong in both directions and both are recorded: PESP omits four
// platforms we publish, and lists eight we have not started.
export type PlatformStatus =
  | "covered"
  | "not_started"
  | "blocked"
  | "mixed_scope"
  | "out_of_scope";

export interface Platform {
  name: string;
  investors: string[];
  status: PlatformStatus;
  note: string;
  in_pesp: boolean;
  // PESP's facility count, never ours, kept unedited so the two can be diffed.
  pesp_facilities: number | null;
  other_brands: string[];
  fundprint_owners: string[];
  fundprint_clinics: number | null;
  source_url: string | null;
}

export interface Coverage {
  generated_at: string;
  provenance: {
    source_url: string;
    source_record_id: string;
    content_hash: string;
    bytes: number;
    as_of: string;
    appendix: string;
  };
  coverage: {
    covered: number;
    // covered + not_started + blocked. mixed_scope and out_of_scope are listed
    // with reasons but excluded: a denominator you can shrink by redefinition
    // is not a denominator.
    in_scope: number;
    not_started: number;
    blocked: number;
    excluded: number;
    total_listed: number;
    in_pesp_appendix: number;
    covered_absent_from_pesp: number;
    // PESP's own facility count for the platforms we do not cover. The honest
    // size of what is still missing, and the reason our clinic count is a floor
    // at the platform level too.
    unpublished_facilities: number;
    published_clinics_at_covered_platforms: number;
  };
  platforms: Platform[];
}

// The reconciliation against the published peer-reviewed estimate.
//
// Two counts of the same thing disagree by 2.8x. The point of this block is to
// decompose that number rather than assert it: restricted to what the federal
// registry can see, the two counts land 6 sites apart, and the remainder comes
// from a third source neither method uses (the operator's own directory).
//
// `external` figures are stored exactly as published. They are never rescaled to
// our basis; where the two are not like-for-like, the page says so.
export interface ExternalEstimate {
  key: string;
  title: string;
  authors: string;
  venue: string;
  published: string;
  canonical_url: string;
  source_url: string;
  unit: string;
  // The date their count describes, which is not the date it was published.
  as_of: string;
  sites: number;
  acquisitions: number;
  states: number;
  method: string;
  // Their own stated limitations, quoted. They named the gap before we did.
  stated_limitations: string;
  notes: string[];
  source_record_id: string;
  content_hash: string;
}

export interface ReconciliationOwner {
  owner: string;
  brand: string;
  firm: string;
  firm_type: FirmType;
  published: number;
  registry_visible: number;
  // Null when the registry sees none of this brand's centers. Not Infinity: a
  // ratio would invent a finite blind spot where the real answer is total.
  ratio: number | null;
}

export interface ReconciliationState {
  state: string;
  external: number;
  fundprint_pe: number;
  ratio: number | null;
}

export interface Reconciliation {
  generated_at: string;
  estimate: ExternalEstimate;
  fundprint: {
    pe_clinics: number;
    states: number;
    registry_visible_pe_sites: number;
    aba_sites: number;
    pe_share_of_all_sites: number;
    archive_sha256: string;
    as_of: string;
  };
  headline: {
    ratio_all_sources: number;
    ratio_registry_visible: number;
    registry_visible_gap: number;
    directory_only_pe_clinics: number;
    states_agree: boolean;
  };
  states: ReconciliationState[];
  owner_spread: {
    owners: number;
    min_ratio: number | null;
    max_ratio: number | null;
    invisible_owners: string[];
  };
  owners: ReconciliationOwner[];
}

export const PLATFORM_STATUS_LABEL: Record<PlatformStatus, string> = {
  covered: "Covered",
  not_started: "Not started",
  blocked: "Blocked",
  mixed_scope: "Mixed scope",
  out_of_scope: "Out of scope",
};

export const FIRM_TYPE_LABEL: Record<FirmType, string> = {
  private_equity: "Private equity",
  pension_fund: "Pension fund",
  family_office: "Family office",
  other: "Other institutional",
};

export const FIRM_TYPE_COLOR: Record<FirmType, string> = {
  private_equity: "#b3241c", // red
  pension_fund: "#45525a", // slate
  family_office: "#6d6a3c", // olive
  other: "#83837a", // grey
};
