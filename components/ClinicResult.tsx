import Link from "next/link";
import { confidenceLabel, ownershipVerb } from "@/lib/format";
import type { Clinic } from "@/lib/types";
import OwnerTypeBadge from "./OwnerTypeBadge";
import Provenance from "./Provenance";

// A single matched clinic, phrased at the strength its evidence allows.
export default function ClinicResult({ clinic }: { clinic: Clinic }) {
  const verb = ownershipVerb(clinic.confidence_method);
  const place = [clinic.city, clinic.state].filter(Boolean).join(", ");
  return (
    <li className="rounded-lg border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{clinic.name}</h3>
          {place && <p className="text-sm text-black/60">{place}</p>}
        </div>
        <OwnerTypeBadge type={clinic.firm_type} />
      </div>

      <p className="mt-3 text-sm leading-relaxed">
        This clinic {verb}{" "}
        <Link
          href={`/acquirers/${clinic.firm_id}/`}
          className="font-medium underline decoration-black/30 underline-offset-2 hover:decoration-black"
        >
          {clinic.owner_name}
        </Link>
        , which is owned by{" "}
        <Link
          href={`/acquirers/${clinic.firm_id}/`}
          className="font-medium underline decoration-black/30 underline-offset-2 hover:decoration-black"
        >
          {clinic.firm_name}
        </Link>
        .
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/60">
        <span className="rounded bg-black/5 px-1.5 py-0.5 font-mono">
          {confidenceLabel(clinic.confidence_method, clinic.confidence_score)}
        </span>
        {clinic.npi && <span className="font-mono">NPI {clinic.npi}</span>}
      </div>

      <Provenance sources={clinic.sources} />
    </li>
  );
}
