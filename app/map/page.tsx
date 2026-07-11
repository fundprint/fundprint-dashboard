import type { Metadata } from "next";
import ClinicMap from "@/components/ClinicMap";
import StateHeatmap from "@/components/StateHeatmap";
import CaseHeader from "@/components/dossier/CaseHeader";
import Rule from "@/components/dossier/Rule";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Territory | Fundprint",
  description:
    "Every located PE and institution-owned ABA / autism clinic in the U.S., mapped by owner. Coverage, not census.",
};

export default function MapPage() {
  const { clinics, acquirers, states, totals } = snapshot;
  const mapClinics = clinics.map((c) => ({
    id: c.id,
    name: c.name,
    city: c.city,
    state: c.state,
    lat: c.lat,
    lng: c.lng,
    firm_id: c.firm_id,
    firm_name: c.firm_name,
    firm_type: c.firm_type,
    owner_name: c.owner_name,
  }));

  return (
    <div>
      <CaseHeader
        eyebrow="Exhibit / The Territory"
        title="The clinics, on the map"
        lede="Every clinic we have traced to a financial owner, placed at its ZIP. Filter by owner to see one firm's national footprint. Color marks the kind of owner."
      />

      <div className="mt-4 font-mono text-xs text-ink-muted">
        {fmtNum(totals.located_clinics)} of {fmtNum(totals.clinics)} tracked clinics are
        placed here; the rest lack a usable ZIP. This is coverage in our public-records
        dataset, not a census of every clinic each owner runs.
      </div>

      <div className="mt-6">
        <ClinicMap clinics={mapClinics} acquirers={acquirers} />
      </div>

      <Rule label="The same coverage, by state" />

      <p className="mb-4 max-w-2xl font-sans text-ink/75">
        A darker state means we have resolved more clinics there, not necessarily that it
        has more private-equity ownership. States we have not yet ingested look empty:
        that is a gap in our data, not evidence of independence.
      </p>
      <StateHeatmap states={states} />
    </div>
  );
}
