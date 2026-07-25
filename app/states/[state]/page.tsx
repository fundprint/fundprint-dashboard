import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseHeader from "@/components/dossier/CaseHeader";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum, fmtDollarsM } from "@/lib/format";

// One static page per audited state, so a reporter or a legislative staffer has a
// URL to link rather than an anchor into a national page.
export function generateStaticParams() {
  return (snapshot.state_files?.states ?? [])
    .filter((s) => s.status === "published")
    .map((s) => ({ state: s.state.toLowerCase() }));
}

function fileFor(code: string) {
  return (snapshot.state_files?.states ?? []).find(
    (s) => s.state.toLowerCase() === code.toLowerCase() && s.status === "published",
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const f = fileFor(state);
  if (!f) return { title: "State file | Fundprint" };
  return {
    title: `${f.state_name} | Fundprint`,
    description: `${f.state_name} Medicaid autism therapy: ${fmtDollarsM(
      f.audit.improper ?? 0,
    )} in improper payments found by ${
      f.audit.issuer.startsWith("U.S.") ? "federal auditors" : "the state inspector general"
    }, and the ${fmtNum(
      f.footprint.pe_clinics,
    )} private-equity-owned clinics Fundprint traces there.`,
  };
}

export default async function StateFilePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const f = fileFor(state);
  if (!f) notFound();

  const a = f.audit;
  const fp = f.footprint;
  const noPe = fp.pe_clinics === 0;
  const growth = a.spend_growth ?? null;

  return (
    <div className="space-y-12">
      <CaseHeader
        eyebrow={`The file / States / ${f.state}`}
        title={f.state_name}
        lede={
          noPe
            ? "A large audit finding, and no private-equity-owned clinics at all. This page is published because it is the clearest evidence that these audits are not measuring ownership."
            : "What the auditors found in this state's Medicaid autism-therapy spending, and who owns the clinics here. The two are shown side by side and are not joined."
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatSlot
          value={fmtDollarsM(a.improper ?? 0)}
          label="Improper payments"
          note={`found by ${a.issuer.startsWith("U.S.") ? "the federal OIG" : "the state IG"}`}
        />
        {a.potentially_improper ? (
          <StatSlot
            value={fmtDollarsM(a.potentially_improper)}
            label="Potentially improper"
            note="requiring further state review"
          />
        ) : (
          <StatSlot
            value={a.federal_refund ? fmtDollarsM(a.federal_refund) : "n/a"}
            label="Federal share to refund"
            note="recommended by auditors"
          />
        )}
        <StatSlot
          value={fmtNum(fp.pe_clinics)}
          label="PE-owned clinics tracked"
          note={noPe ? "none found in this state" : `${fp.owners.length} brands`}
        />
        <StatSlot
          value={
            fp.registry_visible_pe_sites === null
              ? "n/a"
              : fmtNum(fp.registry_visible_pe_sites)
          }
          label="Visible to the federal registry"
          note="of the clinics above"
        />
      </div>

      <section className="space-y-4 border-l-2 border-pe/40 bg-pe/[0.03] p-5">
        <h2 className="font-sans text-lg font-semibold">
          This audit blames no owner, and neither does this page
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          The report audits {f.state_name}&apos;s Medicaid program, not any company. It
          names no provider and no ownership type, and the findings apply across every
          ABA provider billing the state. Nothing below should be read as saying private
          equity caused any part of it.{" "}
          {noPe ? (
            <>
              <strong>
                In {f.state_name} that is not even arguable: Fundprint tracks no
                private-equity-owned clinics here at all.
              </strong>
            </>
          ) : (
            <>
              The two facts are published together because they describe the same
              market, not because one explains the other.
            </>
          )}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">The audit</h2>
        <p className="max-w-2xl font-sans text-ink/80">
          <a className="text-pe hover:underline" href={a.source_url}>
            <span className="italic">{a.title}</span>
          </a>
          <br />
          {a.issuer}
          {a.report_number && <> &middot; report {a.report_number}</>} &middot; issued{" "}
          {a.issued} &middot; payments examined: {a.period}
        </p>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 font-sans text-ink/80">
          {a.findings.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {growth && growth.length === 2 && (
          <p className="max-w-2xl font-sans text-ink/80">
            The report also records how fast this spending grew:{" "}
            <strong>{fmtDollarsM(growth[0].dollars)}</strong> in {growth[0].year} to{" "}
            <strong>{fmtDollarsM(growth[1].dollars)}</strong> in {growth[1].year}. That
            growth is the reason the programme is being audited at all, and it is the
            same growth that made the sector attractive to buyers.
          </p>
        )}
        {a.content_hash && (
          <p className="max-w-2xl font-mono text-sm text-ink-muted">
            fetched and content-hashed &middot; sha256 {a.content_hash.slice(0, 16)}
            &hellip;
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          Who owns the clinics in {f.state_name}
        </h2>
        {noPe ? (
          <p className="max-w-2xl font-sans text-ink/80">
            <strong>None that Fundprint can trace to a private-equity owner.</strong>{" "}
            {f.state_name} has {fp.aba_sites === null ? "an" : fmtNum(fp.aba_sites)} ABA
            locations in the federal provider registry and this project attributes none
            of them to a private-equity firm. That may change if a platform we have{" "}
            <Link href="/coverage/" className="text-pe hover:underline">
              not yet covered
            </Link>{" "}
            operates here. As published, it is a state with a major audit finding and no
            private-equity footprint, and it is the reason this series cannot be read as
            a story about ownership.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left font-sans text-sm">
                <thead>
                  <tr className="border-b border-rule">
                    <th className="py-2 pr-4 font-semibold">Brand</th>
                    <th className="py-2 pr-4 font-semibold">Owner</th>
                    <th className="py-2 text-right font-semibold">Clinics</th>
                  </tr>
                </thead>
                <tbody>
                  {fp.owners.map((o) => (
                    <tr key={o.brand} className="border-b border-rule/50">
                      <td className="py-2 pr-4 font-semibold">{o.brand}</td>
                      <td className="py-2 pr-4 text-ink/80">{o.firm}</td>
                      <td className="py-2 text-right tabular-nums">{fmtNum(o.clinics)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fp.pe_share !== null && (
              <p className="max-w-2xl font-sans text-ink/80">
                Measured against the federal registry, private equity holds{" "}
                <strong>{fp.pe_share}%</strong> of {f.state_name}&apos;s{" "}
                {fmtNum(fp.aba_sites ?? 0)} ABA locations. That share is a floor, for the
                reasons in the{" "}
                <Link href="/methodology/" className="text-pe hover:underline">
                  methodology
                </Link>
                .
              </p>
            )}
            {fp.registry_visible_pe_sites !== null && (
              <p className="max-w-2xl font-sans text-ink/80">
                <strong>
                  Of the {fmtNum(fp.pe_clinics)} clinics above, the federal provider
                  registry can see {fmtNum(fp.registry_visible_pe_sites)}.
                </strong>{" "}
                The rest appear only in the operators&apos; own published directories. An
                auditor or a regulator working from federal data alone would not know
                the others exist, which is the practical case for ownership transparency
                and is documented in full on the{" "}
                <Link href="/reconciliation/" className="text-pe hover:underline">
                  reconciliation page
                </Link>
                .
              </p>
            )}
          </>
        )}
        {f.note && (
          <p className="max-w-2xl border-t border-rule pt-4 font-sans text-sm text-ink-muted">
            {f.note}
          </p>
        )}
      </section>

      <p className="border-t border-rule pt-5">
        <Link href="/states/" className="text-pe hover:underline">
          All state files
        </Link>
      </p>
    </div>
  );
}
