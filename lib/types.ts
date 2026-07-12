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
