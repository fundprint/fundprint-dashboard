import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import Exhibit from "@/components/dossier/Exhibit";
import EngineDiagram from "@/components/engine/EngineDiagram";
import { ENGINE_STAGES } from "@/components/engine/engine-stages";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Machine | Fundprint",
  description:
    "How Fundprint turns public records into sourced ownership: a five-stage deterministic pipeline, two registries, confidence floors, and a validation gate.",
};

const METHODOLOGY = "https://github.com/fundprint/fundprint-methodology";

export default function ProcessPage() {
  const { meta } = snapshot;
  return (
    <div className="space-y-16">
      <CaseHeader
        eyebrow="The Machine / How it works"
        title="How the record is built"
        lede="Fundprint is not a hand-kept list. It is a deterministic pipeline: the same public inputs run through the same code produce the same record, and every published claim carries the document that proves it."
      />

      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden bg-sheet px-4 py-3">
            <span className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-ink/40" />
            <span className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-ink/40" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 border-b border-l border-ink/40" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 border-b border-r border-ink/40" />
            <EngineDiagram />
          </div>
        </div>
      </section>

      <Exhibit mark="1" kicker="The five stages" title="One machine, start to finish">
        <ol className="space-y-4">
          {ENGINE_STAGES.map((s) => (
            <li key={s.key} className="grid gap-3 border-b border-rule pb-4 last:border-0 sm:grid-cols-[auto_1fr]">
              <div className="flex items-baseline gap-2 sm:w-40">
                <span className="font-mono text-lg font-bold text-pe">{s.numeral}</span>
                <span className="font-sans text-xl font-semibold">{s.name}</span>
              </div>
              <div>
                <div className="font-mono text-[0.7rem] uppercase tracking-wider text-pe/90">
                  {s.metric}
                </div>
                <p className="mt-1 max-w-2xl font-sans text-ink/85">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Exhibit>

      <Exhibit mark="2" kicker="Why two registries" title="Where the clinics come from">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="max-w-xl space-y-3 font-sans text-ink/85">
            <p>
              One source is NPPES, the federal provider registry. Anyone can download it
              and check us. But it enumerates <em>registrations</em>, not centers: a chain
              that runs forty centers under three identifiers appears as three. And nothing
              obliges a company to withdraw a registration when a center closes, so the
              registry also reports places that are no longer there.
            </p>
            <p>
              The other is the operator&rsquo;s own public list of its centers, read from
              the structured data its site publishes for search engines, never scraped from
              rendered prose. Where that list is complete, it wins. It is what the company
              tells parents today, and it corrects the registry in both directions at once:
              it names centers the registry never saw, and it declines to name the ones that
              closed.
            </p>
            <p className="text-ink-muted">
              Both are de-duplicated on one key, the street address and ZIP within an owner,
              so a center appearing in both is counted once.
            </p>
          </div>
          <div className="folder self-start p-5 font-mono text-sm text-ink/80">
            <div className="label-mono mb-2">Clinic-existence sources</div>
            <div className="flex items-center justify-between border-b border-rule py-1.5">
              <span>Operator&rsquo;s own directory</span>
              <span className="text-pe">
                {fmtNum(snapshot.totals.directory_sourced_clinics)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>NPPES registry alone</span>
              <span className="text-pe">
                {fmtNum(snapshot.totals.registry_only_clinics)}
              </span>
            </div>
            <p className="mt-3 text-[0.72rem] leading-snug text-ink-muted">
              A center matching no tracked owner is left unlinked. A registration an
              operator&rsquo;s own complete directory does not list is quarantined, not
              deleted.
            </p>
          </div>
        </div>
      </Exhibit>

      <Exhibit mark="3" kicker="The integrity bar" title="What we refuse to do">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            ["Never assert without a source", "Every published ownership claim traces to a content-hashed snapshot of a public document. A claim missing its source does not publish, at any confidence."],
            ["Verify the current owner", "Ownership turns over. We cite the owner today, not a stale deal, and drop owners we cannot currently substantiate."],
            ["Reject over-matches", "A brand name is only a string, and two companies can share one. “Hope Bridge” matches Hope Bridge Counseling, which is a different business. Names too generic to tell apart are refused, and an operator’s own directory is what catches the rest."],
            ["Label honestly", "Pension funds and family offices are named as what they are, not folded into private equity."],
          ].map(([h, b]) => (
            <li key={h} className="folder px-4 py-4">
              <div className="font-sans text-lg font-semibold">{h}</div>
              <p className="mt-1.5 font-sans text-[0.95rem] text-ink/80">{b}</p>
            </li>
          ))}
        </ul>
      </Exhibit>

      <Exhibit mark="4" kicker="Reproducible by design" title="Pinned, versioned, open">
        <div className="max-w-2xl space-y-3 font-sans text-ink/85">
          <p>
            The site ships a frozen snapshot, not a live feed: what you read is a
            reproducible state, dated and version-pinned, so a screenshot dates itself. The
            methodology is versioned separately and the whole pipeline is open source.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
            <span className="text-ink-muted">dataset {meta.dataset_version}</span>
            <span className="text-ink-muted">methodology {meta.methodology_version}</span>
            <a href={METHODOLOGY} target="_blank" rel="noopener noreferrer" className="text-pe hover:underline">
              read the full methodology
            </a>
            <Link href="/sources/" className="text-pe hover:underline">
              how provenance works
            </Link>
          </div>
        </div>
      </Exhibit>
    </div>
  );
}
