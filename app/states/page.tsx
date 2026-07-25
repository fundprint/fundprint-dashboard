import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum, fmtDollarsM } from "@/lib/format";

export const metadata: Metadata = {
  title: "State files | Fundprint",
  description:
    "Government audits of state Medicaid spending on autism therapy, published beside the private-equity ownership footprint Fundprint tracks in the same state.",
};

export default function StatesPage() {
  const sf = snapshot.state_files;

  if (!sf) {
    return (
      <div className="space-y-8">
        <CaseHeader
          eyebrow="The file / States"
          title="State files"
          lede="The state files have not been built for this release."
        />
      </div>
    );
  }

  const t = sf.totals;
  const published = sf.states.filter((s) => s.status === "published");
  const blocked = sf.states.filter((s) => s.status === "blocked");

  return (
    <div className="space-y-12">
      <CaseHeader
        eyebrow="The file / States"
        title="What the auditors found, and who owns the clinics"
        lede="Care is bought locally, and so is oversight. These pages put a state's government audit of its Medicaid autism-therapy spending next to the ownership Fundprint can trace in that same state. The two are published side by side, and deliberately not joined."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatSlot
          value={String(t.audits)}
          label="Audited states"
          note={`${t.federal_audits} by the federal OIG`}
        />
        <StatSlot
          value={fmtDollarsM(t.improper)}
          label="Improper payments found"
          note={`plus ${fmtDollarsM(t.potentially_improper)} potentially improper`}
        />
        <StatSlot
          value={fmtNum(t.pe_clinics_in_audited_states)}
          label="PE clinics in those states"
          note="tracked by Fundprint"
        />
        <StatSlot
          value={String(t.attributing_to_ownership)}
          label="Audits blaming an owner"
          note="none of them names a provider"
        />
      </div>

      <section className="space-y-4 border-l-2 border-pe/40 bg-pe/[0.03] p-5">
        <h2 className="font-sans text-xl font-semibold">
          Read this before reading the numbers
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          <strong>
            Not one of these audits attributes a single dollar to private equity.
          </strong>{" "}
          Each audits a state Medicaid program. They find missing session notes,
          uncredentialed technicians, supervision ratios out of compliance, and billing
          for naps, meals and holidays, across every provider in the state. They name no
          company and no ownership type. Putting a dollar figure beside an ownership
          count and inviting the reader to draw a line between them would be
          indefensible, so this page does not do it.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          <strong>
            {sf.states.find((s) => s.state === "ME")?.state_name ?? "Maine"} is published
            here for exactly that reason.
          </strong>{" "}
          It carries a finding larger than two of the other audited states and, in this
          dataset, <strong>zero private-equity-owned clinics</strong>. Anyone inclined to read a
          big audit finding as evidence about private equity has to get past that first.
          A version of this page that quietly dropped the state that cuts against the
          story would be advocacy, not evidence.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          What the pairing does support is narrower and better documented: this is a
          large, fast-growing Medicaid spend under weak oversight, and{" "}
          <strong>the people auditing it cannot see who owns the providers.</strong>{" "}
          Wisconsin makes that concrete. The federal provider registry shows 2 of the 48
          private-equity-owned centres tracked there, so an auditor working from federal
          data is working close to blind. That is an argument for ownership transparency,
          and it needs no causal claim at all.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">The files</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {published.map((s) => (
            <Link
              key={s.state}
              href={`/states/${s.state.toLowerCase()}/`}
              className="block border border-rule p-5 transition-colors hover:border-pe"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-sans text-lg font-semibold">{s.state_name}</h3>
                <span className="label-mono">{s.state}</span>
              </div>
              <p className="mt-3 font-sans text-sm text-ink/80">
                <strong>{fmtDollarsM(s.audit.improper ?? 0)}</strong> improper &middot;{" "}
                <strong>{fmtNum(s.footprint.pe_clinics)}</strong> PE clinics tracked
                {s.footprint.pe_clinics === 0 && (
                  <span className="ml-2 label-mono text-pe">control case</span>
                )}
              </p>
              <p className="mt-2 font-mono text-xs text-ink-muted">
                {s.audit.issuer.startsWith("U.S.") ? "Federal OIG" : "State IG"} &middot;{" "}
                {s.audit.issued}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {blocked.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-sans text-xl font-semibold">Blocked</h2>
          <p className="max-w-2xl font-sans text-ink/80">
            The finding is real and well documented. Its primary source cannot be
            fetched or content-hashed, so its figures do not ship. Plausible is not the
            bar; snapshottable is, and the same rule keeps other claims off this site.
          </p>
          {blocked.map((s) => (
            <div key={s.state} className="border-l-2 border-rule pl-5">
              <h3 className="font-sans text-lg font-semibold">
                {s.state_name}{" "}
                <span className="label-mono text-ink-muted">figures withheld</span>
              </h3>
              <p className="mt-2 max-w-2xl font-sans text-ink/80">{s.blocked_reason}</p>
              <p className="mt-2 max-w-2xl font-sans text-sm text-ink-muted">
                Fundprint still tracks{" "}
                <strong>{fmtNum(s.footprint.pe_clinics)}</strong> private-equity-owned
                clinics in {s.state_name}; our own data is not what is blocked.
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
