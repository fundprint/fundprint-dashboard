import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import Exhibit from "@/components/dossier/Exhibit";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Investigator | Fundprint",
  description:
    "Fundprint is an independent project by Atharva Doke tracing private-equity ownership of U.S. autism therapy clinics.",
};

const REPOS = [
  ["fundprint-data", "The Python pipeline: acquire, store, resolve, validate, publish.", "https://github.com/fundprint/fundprint-data"],
  ["fundprint-dashboard", "This static site, built from a pinned data snapshot.", "https://github.com/fundprint/fundprint-dashboard"],
  ["fundprint-methodology", "The versioned methodology and changelog behind every claim.", "https://github.com/fundprint/fundprint-methodology"],
];

export default function AboutPage() {
  const { totals } = snapshot;
  return (
    <div className="space-y-16">
      <CaseHeader
        eyebrow="The Investigator"
        title="Who built this, and why"
        lede="Fundprint is an independent project by Atharva Doke. It exists because there was no public, sourced answer to a simple question a parent might ask: who actually owns my child's therapy clinic?"
      />

      <Exhibit mark="1" kicker="The motivation" title="A question with no public answer">
        <div className="max-w-2xl space-y-4 font-serif text-ink/85">
          <p>
            Autism therapy in the United States has been quietly rolled up by financial
            owners over the past decade. That ownership is real, it is consequential, and it
            was scattered across provider registries, deal announcements, and company
            directories that no one had assembled in one place. Fundprint assembles it, and
            insists that every claim point back to a document the reader can open.
          </p>
          <p>
            It takes no position on ABA as a therapy. The clinics here serve real families;
            the point is not to judge the care, but to make its ownership legible.
          </p>
        </div>
      </Exhibit>

      <Exhibit mark="2" kicker="The engineering" title="Built as a pipeline, not a spreadsheet">
        <div className="max-w-2xl space-y-4 font-serif text-ink/85">
          <p>
            The work is three open-source repositories. A deterministic Python pipeline
            pulls public records from two registries, snapshots and embeds them, resolves
            each ownership chain, holds every claim to confidence floors and a hand-validation
            gate, and publishes only what passes. The site you are reading is a frozen
            snapshot of that output. No language model writes an ownership claim.
          </p>
          <p className="font-mono text-sm text-ink-muted">
            See{" "}
            <Link href="/process/" className="text-pe hover:underline">
              how the machine works
            </Link>{" "}
            for the full pipeline.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatSlot value={fmtNum(totals.clinics)} label="Clinics traced" />
          <StatSlot value="5" label="Pipeline stages" />
          <StatSlot value="3" label="Open repositories" />
          <StatSlot value="Deterministic" label="No LLM claims" accent />
        </div>
      </Exhibit>

      <Exhibit mark="3" kicker="The standard it holds itself to" title="Honest by construction">
        <div className="max-w-2xl space-y-4 font-serif text-ink/85">
          <p>
            Every owner shown is backed by a public source. Non-PE institutional owners are
            labeled as what they are. A clinic that is not in the record is a gap in
            coverage, never a certification that it is independent. Where the data is not yet
            complete, the site says so rather than implying otherwise.
          </p>
          <p>
            It is a work in progress, maintained in the open, and it welcomes correction.
            The fastest way to improve it is to point out where it is wrong.
          </p>
        </div>
      </Exhibit>

      <Exhibit mark="4" kicker="The code" title="Everything is open">
        <ul className="grid gap-3 sm:grid-cols-3">
          {REPOS.map(([name, desc, href]) => (
            <li key={name} className="folder px-4 py-4">
              <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-semibold text-pe hover:underline">
                {name} &nearr;
              </a>
              <p className="mt-2 font-serif text-[0.92rem] text-ink/80">{desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-sm text-ink-muted">
          Follow the build in the open:{" "}
          <Link href="/progress/" className="text-pe hover:underline">
            the progress log &rarr;
          </Link>
        </p>
      </Exhibit>
    </div>
  );
}
