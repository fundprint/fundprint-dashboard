import Link from "next/link";
import { notFound } from "next/navigation";
import OwnerTypeBadge from "@/components/OwnerTypeBadge";
import Provenance from "@/components/Provenance";
import Timeline from "@/components/Timeline";
import RedactionReveal from "@/components/dossier/RedactionReveal";
import Stamp from "@/components/dossier/Stamp";
import { brandsForFirm, clinicsForBrand, getAcquirer, snapshot } from "@/lib/data";
import { confidenceLabel, fmtNum } from "@/lib/format";
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
        className="font-mono text-xs text-ink-muted hover:text-pe"
      >
        Index of subjects
      </Link>

      {/* Subject header */}
      <div className="mt-4 border-b border-ink/20 pb-5">
        <div className="label-mono">Subject file</div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="headline text-3xl sm:text-4xl">{firm.name}</h1>
          <OwnerTypeBadge type={firm.firm_type} />
          {firm.former ? <Stamp label="Former owner" rotate={-4} /> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm text-ink-muted">
          <span>{FIRM_TYPE_LABEL[firm.firm_type]}</span>
          {firm.hq_state ? <span>HQ {firm.hq_state}</span> : null}
          <span>{fmtNum(firm.brand_count)} brand{firm.brand_count === 1 ? "" : "s"}</span>
          <span className="text-ink">{fmtNum(firm.clinic_count)} clinics tracked</span>
        </div>
      </div>

      {firm.firm_type !== "private_equity" && (
        <p className="mt-5 max-w-2xl border-l-2 border-ink/25 pl-3 font-sans text-ink/80">
          {firm.name} is a {FIRM_TYPE_LABEL[firm.firm_type].toLowerCase()}, not a
          traditional private-equity firm. We include it and label it honestly rather
          than imply it is PE.
        </p>
      )}

      {firm.former && (
        <p className="mt-5 max-w-2xl border-l-2 border-pe/50 bg-pe/5 p-3 font-sans text-ink/80">
          {firm.name} no longer owns any autism-therapy clinics in our data. It is shown
          here for its ownership history, recorded below with sources. Its current
          tracked-clinic count is zero.
        </p>
      )}

      {brands.length > 0 && (
        <section className="mt-10">
          <h2 className="label-mono mb-4">The ownership chain</h2>
          <div className="space-y-6">
            {brands.map((b) => {
              const clinics = clinicsForBrand(b.owner_id);
              return (
                <div key={b.owner_id} className="folder">
                  <div className="flex items-center justify-between border-b border-rule px-4 py-3">
                    <div>
                      <div className="font-sans text-lg font-semibold">{b.owner_name}</div>
                      <div className="mt-0.5 font-mono text-[0.72rem] text-ink-muted">
                        <RedactionReveal>{b.owner_name}</RedactionReveal>{" "}
                        {firm.name} {fmtNum(b.clinic_count)} clinic
                        {b.clinic_count === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <ul className="divide-y divide-rule">
                    {clinics.map((c) => (
                      <li key={c.id} className="px-4 py-2.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-sans font-medium">{c.name}</span>
                          <span className="shrink-0 font-mono text-xs text-ink-muted">
                            {[c.city, c.state].filter(Boolean).join(", ")}
                          </span>
                        </div>
                        <div className="mt-0.5 font-mono text-[0.7rem] text-ink-muted">
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

      <section className="mt-12">
        <h2 className="label-mono mb-4">
          {firm.former ? "Ownership history" : "Acquisition timeline"}
        </h2>
        <Timeline events={events} />
      </section>
    </div>
  );
}
