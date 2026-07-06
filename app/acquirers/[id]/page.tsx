import Link from "next/link";
import { notFound } from "next/navigation";
import OwnerTypeBadge from "@/components/OwnerTypeBadge";
import Provenance from "@/components/Provenance";
import Timeline from "@/components/Timeline";
import { brandsForFirm, clinicsForBrand, getAcquirer, snapshot } from "@/lib/data";
import { confidenceLabel } from "@/lib/format";
import { fmtNum } from "@/lib/format";
import { FIRM_TYPE_LABEL } from "@/lib/types";

// Static export needs every dynamic path enumerated at build time.
export function generateStaticParams() {
  return snapshot.acquirers.map((a) => ({ id: a.id }));
}

export default async function AcquirerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const firm = getAcquirer(id);
  if (!firm) notFound();

  const brands = brandsForFirm(firm.id);
  const events = snapshot.timeline.filter((e) => e.firm_name === firm.name);

  return (
    <div>
      <Link
        href="/acquirers/"
        className="text-sm text-black/50 underline underline-offset-2"
      >
        ← All acquirers
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{firm.name}</h1>
        <OwnerTypeBadge type={firm.firm_type} />
      </div>
      <p className="mt-2 text-black/70">
        {FIRM_TYPE_LABEL[firm.firm_type]}
        {firm.hq_state ? ` · HQ ${firm.hq_state}` : ""} · {fmtNum(firm.brand_count)}{" "}
        brand{firm.brand_count === 1 ? "" : "s"} · {fmtNum(firm.clinic_count)}{" "}
        clinics tracked
      </p>

      {firm.firm_type !== "private_equity" && (
        <p className="mt-3 max-w-2xl rounded-lg border border-black/10 bg-white p-3 text-sm text-black/70">
          {firm.name} is a {FIRM_TYPE_LABEL[firm.firm_type].toLowerCase()}, not a
          traditional private-equity firm. We include it and label it honestly
          rather than imply it is PE.
        </p>
      )}

      {firm.former && (
        <p className="mt-3 max-w-2xl rounded-lg border border-pe/30 bg-pe/5 p-3 text-sm text-black/75">
          {firm.name} no longer owns any autism-therapy clinics in our data. It
          is shown here for its ownership history, recorded below with sources.
          Its current tracked-clinic count is zero.
        </p>
      )}

      {brands.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Ownership chain</h2>
          <div className="space-y-6">
            {brands.map((b) => {
            const clinics = clinicsForBrand(b.owner_id);
            return (
              <div
                key={b.owner_id}
                className="rounded-lg border border-black/10 bg-white"
              >
                <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                  <div>
                    <div className="font-semibold">{b.owner_name}</div>
                    <div className="text-xs text-black/55">
                      {firm.name} → {b.owner_name} → {fmtNum(b.clinic_count)}{" "}
                      clinic{b.clinic_count === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-black/5">
                  {clinics.map((c) => (
                    <li key={c.id} className="px-4 py-2.5 text-sm">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{c.name}</span>
                        <span className="shrink-0 text-xs text-black/50">
                          {[c.city, c.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-black/50">
                        {confidenceLabel(c.confidence_method, c.confidence_score)}
                        {c.npi ? ` · NPI ${c.npi}` : ""}
                      </div>
                      <Provenance sources={c.sources} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">
          {firm.former ? "Ownership history" : "Acquisition timeline"}
        </h2>
        <Timeline events={events} />
      </section>
    </div>
  );
}
