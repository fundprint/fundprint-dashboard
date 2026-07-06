"use client";

import { useMemo, useState } from "react";
import { snapshot } from "@/lib/data";
import { search } from "@/lib/search";
import ClinicResult from "./ClinicResult";

// The product. See docs/search.md: three outcomes, never a bare no, absence is
// never proof of independence. The query is never logged or sent anywhere -
// all matching happens client-side over the shipped snapshot.
export default function Search() {
  const [q, setQ] = useState("");
  const clinics = snapshot.clinics;

  const result = useMemo(() => {
    if (q.trim().length < 2) return null;
    return search(clinics, q);
  }, [q, clinics]);

  return (
    <div>
      <label htmlFor="clinic-search" className="sr-only">
        Search for a clinic by name or city
      </label>
      <input
        id="clinic-search"
        type="search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type a clinic name or city…"
        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-lg shadow-sm placeholder:text-black/35 focus:border-pe"
      />

      {result && result.outcome === "pe_linked" && (
        <div className="mt-5">
          <p className="mb-3 text-sm text-black/60">
            {result.matches.length} match
            {result.matches.length === 1 ? "" : "es"} in our records. Each links
            to the public source behind the ownership claim.
          </p>
          <ul className="space-y-3">
            {result.matches.map((c) => (
              <ClinicResult key={c.id} clinic={c} />
            ))}
          </ul>
        </div>
      )}

      {result && result.outcome === "no_match" && (
        <div className="mt-5 rounded-lg border border-black/10 bg-white p-5">
          <p className="font-medium">
            We don&apos;t have a clinic matching “{result.query}” in our data
            yet.
          </p>
          <p className="mt-2 text-sm text-black/70">
            That is <span className="font-medium">not</span> a finding that the
            clinic is independent. It may be owned by a chain we haven&apos;t
            resolved, in a state we haven&apos;t ingested, or listed under a
            different legal name. We track private-equity ownership; we do not
            certify independence.
          </p>
        </div>
      )}

      {!result && (
        <p className="mt-3 text-sm text-black/50">
          Searches happen in your browser and are never recorded.
        </p>
      )}
    </div>
  );
}
