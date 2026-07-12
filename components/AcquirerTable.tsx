"use client";

import Link from "next/link";
import { useState } from "react";
import { fmtNum } from "@/lib/format";
import { FIRM_TYPE_LABEL, type Acquirer } from "@/lib/types";
import OwnerTypeBadge from "./OwnerTypeBadge";

type SortKey = "clinic_count" | "brand_count" | "name";

// Sorting is a client-side convenience over columns the dataset already
// publishes - allowed by the data contract (reproducible from the download).
export default function AcquirerTable({ acquirers }: { acquirers: Acquirer[] }) {
  const [key, setKey] = useState<SortKey>("clinic_count");
  const [asc, setAsc] = useState(false);

  const sorted = [...acquirers].sort((a, b) => {
    let d: number;
    if (key === "name") d = a.name.localeCompare(b.name);
    else d = a[key] - b[key];
    return asc ? d : -d;
  });

  function toggle(k: SortKey) {
    if (k === key) setAsc(!asc);
    else {
      setKey(k);
      setAsc(k === "name");
    }
  }

  const arrow = (k: SortKey) => (k === key ? (asc ? " ▲" : " ▼") : "");

  return (
    <div className="folder overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left">
            <th className="px-4 py-3">
              <button onClick={() => toggle("name")} className="label-mono hover:text-ink">
                Subject{arrow("name")}
              </button>
            </th>
            <th className="px-4 py-3">
              <span className="label-mono">Owner type</span>
            </th>
            <th className="px-4 py-3 text-right">
              <button onClick={() => toggle("brand_count")} className="label-mono hover:text-ink">
                Brands{arrow("brand_count")}
              </button>
            </th>
            <th className="px-4 py-3 text-right">
              <button onClick={() => toggle("clinic_count")} className="label-mono hover:text-ink">
                Clinics{arrow("clinic_count")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => (
            <tr
              key={a.id}
              className="border-b border-rule last:border-0 hover:bg-manila/40"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/acquirers/${a.id}/`}
                  className="font-sans text-[1.02rem] font-medium hover:text-pe"
                >
                  {a.name}
                </Link>
                {a.former && (
                  <span className="ml-2 rounded-sm border border-ink/20 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                    former owner
                  </span>
                )}
                {a.in_home && (
                  <span
                    className="ml-2 rounded-sm border border-ink/20 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted"
                    title="Delivers therapy in the client's home and operates no centers, so it has no clinics to count."
                  >
                    in-home, no centers
                  </span>
                )}
                {a.hq_state && (
                  <span className="ml-2 font-mono text-xs text-ink-muted">{a.hq_state}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <OwnerTypeBadge type={a.firm_type} size="xs" />
              </td>
              <td className="px-4 py-3 text-right font-mono tabular-nums text-ink/70">
                {fmtNum(a.brand_count)}
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                {fmtNum(a.clinic_count)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-rule px-4 py-2 font-mono text-[0.68rem] text-ink-muted">
        &ldquo;Clinics&rdquo; is coverage in our public-records dataset, not a census of
        every clinic each owner operates.
      </p>
    </div>
  );
}
