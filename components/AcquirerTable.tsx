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
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-black/60">
            <th className="px-4 py-3">
              <button onClick={() => toggle("name")} className="font-semibold">
                Acquirer{arrow("name")}
              </button>
            </th>
            <th className="px-4 py-3">Owner type</th>
            <th className="px-4 py-3 text-right">
              <button
                onClick={() => toggle("brand_count")}
                className="font-semibold"
              >
                Brands{arrow("brand_count")}
              </button>
            </th>
            <th className="px-4 py-3 text-right">
              <button
                onClick={() => toggle("clinic_count")}
                className="font-semibold"
              >
                Clinics tracked{arrow("clinic_count")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => (
            <tr
              key={a.id}
              className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/acquirers/${a.id}/`}
                  className="font-medium underline decoration-black/20 underline-offset-2 hover:decoration-black"
                >
                  {a.name}
                </Link>
                {a.former && (
                  <span className="ml-2 rounded-full border border-black/20 px-1.5 py-0.5 text-[10px] font-medium text-black/50">
                    former owner
                  </span>
                )}
                {a.hq_state && (
                  <span className="ml-2 text-xs text-black/40">{a.hq_state}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <OwnerTypeBadge type={a.firm_type} size="xs" />
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {fmtNum(a.brand_count)}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">
                {fmtNum(a.clinic_count)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-black/10 px-4 py-2 text-xs text-black/50">
        “Clinics tracked” is coverage in our public-records dataset, not a census
        of every clinic each owner operates.
      </p>
    </div>
  );
}
