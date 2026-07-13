import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import Stamp from "@/components/dossier/Stamp";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "Progress | Fundprint",
  description: "The Fundprint build log: what has shipped, what is being measured, and what is next.",
};

type Milestone = { label: string; title: string; body: string; done: boolean };

const LOG: Milestone[] = [
  {
    label: "Foundation",
    title: "The five-stage pipeline",
    body: "A deterministic Acquire, Store, Resolve, Validate, Publish architecture on PostgreSQL with pgvector. The contract between layers: shape, trust, and provenance.",
    done: true,
  },
  {
    label: "First registry",
    title: "NPPES ingest and brand matching",
    body: "The federal provider registry, read into a staging table, with deterministic brand-prefix matching of clinics to owner entities and owners to parent firms.",
    done: true,
  },
  {
    label: "Taxonomy",
    title: "Honest owner types",
    body: "Private equity, pension fund, family office, and other institutional owners labeled distinctly rather than lumped together as PE.",
    done: true,
  },
  {
    label: "Second registry",
    title: "Owner location directories",
    body: "A supplement to NPPES: reading each owner's own public directory from machine-readable structured data (schema.org and semantic address fields), de-duplicated against the registry.",
    done: true,
  },
  {
    label: "Validation",
    title: "Confidence floors and a hand-validation gate",
    body: "A 95% hand-validation gate, confidence floors per link type, quarantine for contradicted claims, and a versioned methodology behind every figure.",
    done: true,
  },
  {
    label: "Launch",
    title: "The public record goes live",
    body: "whofundsmytherapist.com ships as a pinned static snapshot: no runtime database, every claim traced to a content-hashed source.",
    done: true,
  },
  {
    label: "Platform",
    title: "The Dossier: redesign, map, and the engine",
    body: "A full investigative platform: an interactive national clinic map, the pipeline rendered as a live diagram, and the story told end to end.",
    done: true,
  },
  {
    label: "The market",
    title: "A denominator, and one clinic per address",
    body: "The whole national ABA market measured from the registry: 17,567 providers, 21,172 locations, and the size of every operator in it. Along the way, 23 addresses where one owner had registered two of its brands were found to be one clinic each, not two, and were merged.",
    done: true,
  },
  {
    label: "Correction",
    title: "A published share, withdrawn",
    body: "Fundprint used to headline private equity's share of clinics run by operators with five or more locations. It was withdrawn: the cutoff was arbitrary, and the group it measured against is one private equity itself builds, so its own buying inflated both halves of the ratio. The headline is now a count, and the shares that remain need no cutoff at all. Recorded in the changelog rather than quietly dropped.",
    done: true,
  },
  {
    label: "Next",
    title: "Coverage denominator and a verification rate",
    body: "Enumerating the full set of known PE-backed ABA platforms to state coverage as a fraction, and publishing a hand-verification accuracy rate with its confidence interval. Both stated as numbers, not implied.",
    done: false,
  },
];

export default function ProgressPage() {
  const { totals } = snapshot;
  return (
    <div className="space-y-12">
      <CaseHeader
        eyebrow="The file / Build log"
        title="Built in the open"
        lede="Fundprint is a work in progress, maintained transparently. This is what has shipped, what is being measured, and what is next."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatSlot value={fmtNum(totals.clinics)} label="Clinics traced" note={`${fmtNum(totals.pe_clinics)} private-equity owned`} />
        <StatSlot value="294" label="Tests passing" note="deterministic pipeline" />
        <StatSlot value={`${totals.acquirers} of ~30`} label="Platforms covered" note="denominator being finalized" pending />
        <StatSlot value="Measuring" label="Verification rate" note="hand-check sample under way" pending />
      </div>

      <ol className="relative space-y-6 border-l-2 border-rule pl-6">
        {LOG.map((m) => (
          <li key={m.title} className="relative">
            <span
              className={`absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full border-2 ${
                m.done ? "border-pe bg-pe" : "border-pe bg-paper"
              }`}
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="label-mono">{m.label}</span>
              {m.done ? <Stamp label="Shipped" rotate={-3} /> : <Stamp label="In progress" rotate={2} />}
            </div>
            <h2 className="mt-1 font-sans text-xl font-semibold">{m.title}</h2>
            <p className="mt-1 max-w-2xl font-sans text-ink/80">{m.body}</p>
          </li>
        ))}
      </ol>

      <p className="border-t border-rule pt-5 font-mono text-sm text-ink-muted">
        The commit history is public across all three repositories, linked from{" "}
        <Link href="/about/" className="text-pe hover:underline">
          the investigator
        </Link>
        .
      </p>
    </div>
  );
}
