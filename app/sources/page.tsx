import type { Metadata } from "next";
import Link from "next/link";
import Provenance from "@/components/Provenance";
import CaseHeader from "@/components/dossier/CaseHeader";
import Exhibit from "@/components/dossier/Exhibit";
import Stamp from "@/components/dossier/Stamp";
import { snapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sources & Provenance | Fundprint",
  description:
    "How every Fundprint claim traces to a content-hashed snapshot of a public document.",
};

const SOURCE_TYPES = [
  ["NPPES provider registry", "The federal NPI registry. The primary evidence that a clinic exists as a provider organization."],
  ["Owner location directories", "An owner's own public directory of centers, read from machine-readable structured data. The supplement that fills NPPES's undercount."],
  ["Acquisition announcements", "Private-equity firm and company statements that assert an ownership or a deal, captured at the source."],
  ["Reputable trade press", "Named reporting used to corroborate an ownership link where a primary statement is thin."],
];

export default function SourcesPage() {
  // A real example: the first clinic that carries at least one public source.
  const example = snapshot.clinics.find((c) => c.sources.length > 0);

  return (
    <div className="space-y-16">
      <CaseHeader
        eyebrow="The file / Provenance"
        title="How we know what we claim"
        lede="Provenance is not fine print here; it is the point. Every published claim traces to a content-hashed snapshot of a public document, stored when the claim was made, so the evidence cannot quietly change under the reader."
      />

      <Exhibit mark="1" kicker="The rule" title="No source, no claim">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl space-y-3 font-serif text-ink/85">
            <p>
              When a source is ingested, Fundprint fetches and stores the exact document as
              a content-hashed snapshot, then links that snapshot to the claim it supports.
              A row missing its source records does not publish, regardless of how confident
              the match is.
            </p>
            <p>
              Historical ownership that has ended is not shown as current. It is recorded as
              a dated event with its own source and placed on a timeline, not rendered as a
              live ownership link.
            </p>
          </div>
          <div className="folder self-start px-5 py-5">
            <Stamp label="Content-hashed" rotate={-4} />
            <p className="mt-3 font-serif text-[0.95rem] text-ink/80">
              Each snapshot is fingerprinted. The same URL captured twice with the same
              content is stored once; a change produces a new record.
            </p>
          </div>
        </div>
      </Exhibit>

      <Exhibit mark="2" kicker="What we cite" title="The four kinds of source">
        <ul className="grid gap-3 sm:grid-cols-2">
          {SOURCE_TYPES.map(([h, b]) => (
            <li key={h} className="folder px-4 py-4">
              <div className="font-serif text-lg font-semibold">{h}</div>
              <p className="mt-1.5 font-serif text-[0.95rem] text-ink/80">{b}</p>
            </li>
          ))}
        </ul>
      </Exhibit>

      {example ? (
        <Exhibit mark="3" kicker="A worked example" title="One claim, its evidence">
          <div className="folder px-4 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-serif text-lg font-semibold">{example.name}</span>
              <span className="font-mono text-xs text-ink-muted">
                {[example.city, example.state].filter(Boolean).join(", ")}
              </span>
            </div>
            <div className="mt-1 font-serif text-ink/80">
              Linked to {example.owner_name}, held by {example.firm_name}.
            </div>
            <Provenance sources={example.sources} />
          </div>
        </Exhibit>
      ) : null}

      <p className="border-t border-rule pt-5 font-mono text-sm text-ink-muted">
        The full rules live in the versioned methodology.{" "}
        <Link href="/process/" className="text-pe hover:underline">
          How the machine works &rarr;
        </Link>
      </p>
    </div>
  );
}
