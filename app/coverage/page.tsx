import type { Metadata } from "next";
import CaseHeader from "@/components/dossier/CaseHeader";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";
import { PLATFORM_STATUS_LABEL, type PlatformStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Coverage | Fundprint",
  description:
    "How many of the known private-equity-backed ABA platforms Fundprint covers, and the ones it does not, named individually.",
};

const ORDER: PlatformStatus[] = [
  "covered",
  "not_started",
  "blocked",
  "mixed_scope",
  "out_of_scope",
];

const SECTION_LEDE: Record<PlatformStatus, string> = {
  covered:
    "Published on this site, with a clinic count traced to a content-hashed source.",
  not_started:
    "In scope and publishable. We have not done the work yet. This is the honest gap, and it is the reason our clinic count is a floor at the platform level as well as at the clinic level.",
  blocked:
    "In scope, with a specific obstacle recorded. A claim we cannot content-hash does not ship, however plausible it is.",
  mixed_scope:
    "Not primarily operators of ABA therapy centres. Staffing agencies, school operators, and diversified rehab groups that own ABA brands. Only the named ABA sub-brands would ever be in scope, so counting the whole platform against us would be misleading.",
  out_of_scope:
    "Excluded by a methodology rule rather than by effort: an in-home provider operates no clinics, and a minority investment is not ownership.",
};

export default function CoveragePage() {
  const cov = snapshot.coverage;

  if (!cov) {
    return (
      <div className="space-y-8">
        <CaseHeader
          eyebrow="The file / Coverage"
          title="Platform coverage"
          lede="The coverage denominator has not been built for this release."
        />
      </div>
    );
  }

  const c = cov.coverage;
  const pct = Math.round((c.covered / c.in_scope) * 100);

  return (
    <div className="space-y-12">
      <CaseHeader
        eyebrow="The file / Coverage"
        title={`${c.covered} of ${c.in_scope} known platforms`}
        lede="A clinic count with no denominator invites the question 'out of how many?' and has no answer. This is the answer, and the list it is measured against is not ours."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatSlot
          value={`${c.covered} of ${c.in_scope}`}
          label="Platforms covered"
          note={`${pct}% of known in-scope platforms`}
        />
        <StatSlot
          value={fmtNum(c.unpublished_facilities)}
          label="Facilities we do not publish"
          note="at the platforms we have not covered"
        />
        <StatSlot
          value={String(c.not_started)}
          label="Not started"
          note="in scope, simply not done"
        />
        <StatSlot
          value={String(c.blocked)}
          label="Blocked"
          note="obstacle recorded per platform"
        />
      </div>

      <section className="space-y-4 border-l-2 border-rule pl-5">
        <h2 className="font-sans text-xl font-semibold">Where the denominator comes from</h2>
        <p className="max-w-2xl font-sans text-ink/80">
          The spine of this list is the appendix of the Private Equity Stakeholder
          Project&apos;s April 2026 report,{" "}
          <span className="italic">{cov.provenance.appendix}</span>. Using someone
          else&apos;s published list is the point: we do not get to draw our own finish
          line. The report is fetched and content-hashed exactly like every other
          source, so the denominator can be audited rather than taken on trust.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          The unit is the <strong>platform</strong>, the operating company a financial
          sponsor actually buys. Not the deal, because one platform absorbs many: LEARN
          Behavioral is eleven brands from at least six transactions. And not the
          clinic, because that is the thing being measured.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          <strong>The list is wrong in both directions, and both halves are recorded
          here.</strong> PESP omits {c.covered_absent_from_pesp} platforms we publish,
          including Caravel Autism Health and its 79 clinics, absent from a table of
          the largest PE-backed ABA providers. And it names {c.not_started} platforms
          we have not started, holding {fmtNum(c.unpublished_facilities)} facilities
          between them by PESP&apos;s own count.
        </p>
        <p className="max-w-2xl font-mono text-sm text-ink-muted">
          Source: <a className="text-pe hover:underline" href={cov.provenance.source_url}>
            PESP, {cov.provenance.as_of}
          </a>{" "}
          &middot; sha256 {cov.provenance.content_hash.slice(0, 16)}&hellip;
        </p>
      </section>

      {ORDER.map((status) => {
        const rows = cov.platforms
          .filter((p) => p.status === status)
          .sort(
            (a, b) =>
              (b.fundprint_clinics ?? b.pesp_facilities ?? 0) -
              (a.fundprint_clinics ?? a.pesp_facilities ?? 0),
          );
        if (rows.length === 0) return null;
        return (
          <section key={status} className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-sans text-xl font-semibold">
                {PLATFORM_STATUS_LABEL[status]}
              </h2>
              <span className="label-mono">{rows.length}</span>
            </div>
            <p className="max-w-2xl font-sans text-ink/80">{SECTION_LEDE[status]}</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="py-2 pr-4 font-semibold">Platform</th>
                    <th className="py-2 pr-4 font-semibold">Investors</th>
                    <th className="py-2 pr-4 text-right font-semibold">Fundprint</th>
                    <th className="py-2 pr-4 text-right font-semibold">PESP</th>
                    <th className="py-2 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.name} className="border-b border-rule/50 align-top">
                      <td className="py-2 pr-4 font-semibold">
                        {p.name}
                        {!p.in_pesp && (
                          <span className="ml-2 label-mono text-pe">not in PESP</span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-ink/80">{p.investors.join(", ")}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {p.fundprint_clinics === null ? "n/a" : fmtNum(p.fundprint_clinics)}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums text-ink-muted">
                        {p.pesp_facilities === null ? "n/a" : fmtNum(p.pesp_facilities)}
                      </td>
                      <td className="py-2 text-ink/80">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <p className="border-t border-rule pt-5 max-w-2xl font-sans text-ink-muted">
        The two count columns are not directly comparable and are shown side by side
        anyway. PESP counts facilities a company lists as open{" "}
        <span className="italic">or opening soon</span>, from PitchBook and LevinPro;
        Fundprint counts physical sites currently operating, keyed on owner, street and
        ZIP. PESP states its own table is likely an undercount. Where the two disagree
        sharply, the disagreement is the finding, not an error to be smoothed away.
      </p>
    </div>
  );
}
