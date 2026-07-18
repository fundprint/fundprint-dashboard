"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CONFIDENCE_OVERALL_LABEL,
  CONFIDENCE_OVERALL_TONE,
  confidenceRows,
  ownershipVerb,
} from "@/lib/format";
import type { Clinic } from "@/lib/types";
import OwnerTypeBadge from "./OwnerTypeBadge";
import Provenance from "./Provenance";

// The four tones, mapped to a chip style that reads in both themes. Green is
// reserved for the one case the owner itself vouches for; the registry cases warm
// toward amber as the record ages, so a reader can see at a glance how much of the
// claim rests on the owner and how much on a filing nobody ever revokes.
const TONE_CLASS: Record<string, string> = {
  strong: "bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
  mid: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  weak: "bg-orange-600/15 text-orange-800 dark:text-orange-300",
  neutral: "bg-manila text-ink-muted",
};

// A single matched clinic, phrased at the strength its evidence allows.
export default function ClinicResult({ clinic }: { clinic: Clinic }) {
  const [open, setOpen] = useState(false);
  const verb = ownershipVerb(clinic.confidence_method);
  const conf = clinic.confidence;
  const rows = confidenceRows(conf);
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
        <span
          className={`rounded-sm px-1.5 py-0.5 font-medium ${
            TONE_CLASS[CONFIDENCE_OVERALL_TONE[conf.overall]]
          }`}
        >
          {CONFIDENCE_OVERALL_LABEL[conf.overall]}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="underline decoration-dotted underline-offset-2 hover:text-ink"
        >
          {open ? "hide" : "why?"}
        </button>
        {clinic.npi && <span>NPI {clinic.npi}</span>}
      </div>

      {open && (
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-l-2 border-rule pl-3 font-mono text-xs">
          {rows.map((r) => (
            <div key={r.dim} className="contents">
              <dt className="text-ink-muted">{r.dim}</dt>
              <dd className={r.strong ? "text-ink/85" : "text-ink-muted"}>
                {r.value}
                {!r.strong && (
                  <span aria-hidden className="ml-1 opacity-60">
                    ·
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <Provenance sources={clinic.sources} />
    </li>
  );
}
