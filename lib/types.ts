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
  acquirers: Acquirer[];
  brands: Brand[];
  states: StateCount[];
  clinics: Clinic[];
  timeline: TimelineEvent[];
}

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
