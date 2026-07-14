import Link from "next/link";
import { confidenceLabel, ownershipVerb } from "@/lib/format";
import type { Clinic } from "@/lib/types";
import OwnerTypeBadge from "./OwnerTypeBadge";
import Provenance from "./Provenance";

// A single matched clinic, phrased at the strength its evidence allows.
export default function ClinicResult({ clinic }: { clinic: Clinic }) {
  const verb = ownershipVerb(clinic.confidence_method);
  // Street first: within a chain the name is identical on every card, so the
  // address is the only line that tells a reader which centre this is, and
  // whether it is theirs.
  const place = [clinic.address, clinic.city, clinic.state]
    .filter(Boolean)
    .join(", ");
  return (
    <li className="folder p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-sans text-lg font-semibold">{clinic.name}</h3>
          {place && <p className="font-mono text-xs text-ink-muted">{place}</p>}
        </div>
        <OwnerTypeBadge type={clinic.firm_type} />
      </div>

      <p className="mt-3 font-sans leading-relaxed text-ink/85">
        This clinic {verb}{" "}
        <Link
          href={`/acquirers/${clinic.firm_id}/`}
          className="font-medium text-pe underline decoration-pe/30 underline-offset-2 hover:decoration-pe"
        >
          {clinic.owner_name}
        </Link>
        , which is owned by{" "}
        <Link
          href={`/acquirers/${clinic.firm_id}/`}
          className="font-medium text-pe underline decoration-pe/30 underline-offset-2 hover:decoration-pe"
        >
          {clinic.firm_name}
        </Link>
        .
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-muted">
        <span className="rounded-sm bg-manila px-1.5 py-0.5">
          {confidenceLabel(clinic.confidence_method, clinic.confidence_score)}
        </span>
        {clinic.npi && <span>NPI {clinic.npi}</span>}
      </div>

      <Provenance sources={clinic.sources} />
    </li>
  );
}
