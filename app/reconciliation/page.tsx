import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "Reconciliation | Fundprint",
  description:
    "Fundprint counts 2.8x more private-equity-owned autism clinics than the published peer-reviewed estimate. Reconciled against two published estimates, platform by platform and operator by operator.",
};

// Owners small enough that a ratio is noise rather than evidence are kept out of
// the headline spread but still shown in the table. Same cut as the build script.
const MATERIAL = 10;

export default function ReconciliationPage() {
  const rec = snapshot.reconciliation;

  if (!rec) {
    return (
      <div className="space-y-8">
        <CaseHeader
          eyebrow="The file / Reconciliation"
          title="Reconciliation"
          lede="The reconciliation has not been built for this release."
        />
      </div>
    );
  }

  const { estimate: e, fundprint: f, headline: h, owner_spread: spread } = rec;
  const pc = rec.platform_comparison;
  const material = rec.owners.filter((o) => o.published >= MATERIAL);
  const publishedYear = e.published.slice(0, 4);
  // One decimal everywhere it is spoken. 2.82 reads as false precision on a
  // figure whose inputs are 19 months apart; the exact value stays in the JSON.
  const ratio = h.ratio_all_sources.toFixed(1);

  return (
    <div className="space-y-12">
      <CaseHeader
        eyebrow="The file / Reconciliation"
        title={`Why we find ${ratio}x more PE-owned clinics than the published estimate`}
        lede="Two counts of the same thing disagree by a factor of nearly three. Rather than assert ours is right, this page takes the difference apart against two published estimates. It turns out the censuses sort by what they count, not by how carefully they count it."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatSlot
          value={fmtNum(e.sites)}
          label={`${e.venue}, ${publishedYear}`}
          note={`PE-owned sites as of ${e.as_of}`}
        />
        <StatSlot
          value={fmtNum(f.pe_clinics)}
          label="Fundprint, all sources"
          note={`${ratio}x the published estimate`}
        />
        <StatSlot
          value={fmtNum(f.registry_visible_pe_sites)}
          label="Fundprint, federal registry only"
          note={`${h.registry_visible_gap > 0 ? "+" : ""}${h.registry_visible_gap} against their ${fmtNum(e.sites)}`}
        />
        <StatSlot
          value={fmtNum(h.directory_only_pe_clinics)}
          label="Visible only in owner directories"
          note="the whole of the disagreement"
        />
      </div>

      <section className="space-y-4 border-l-2 border-rule pl-5">
        <h2 className="font-sans text-xl font-semibold">The two counts</h2>
        <p className="max-w-2xl font-sans text-ink/80">
          In January {publishedYear}, {e.venue} published{" "}
          <a className="text-pe hover:underline" href={e.canonical_url}>
            <span className="italic">{e.title}</span>
          </a>{" "}
          by {e.authors}. It identified <strong>{fmtNum(e.sites)}</strong> private-equity-owned{" "}
          {e.unit.replace(/ owned by private equity$/, "")} across {e.states} states, from{" "}
          {e.acquisitions} acquisitions, as of {e.as_of}. Its method: {e.method}
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          Fundprint publishes <strong>{fmtNum(f.pe_clinics)}</strong> private-equity-owned
          clinics across {f.states} states, as of {f.as_of}, built from the federal provider
          registry, owners&apos; own published location directories, and hand-verified
          acquisition records.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          <strong>This is not a correction.</strong> The letter states its own two
          limitations plainly: &ldquo;{e.stated_limitations}&rdquo;. Fundprint exists to
          supply the first and to measure the second. The authors named the gap before
          anyone else did; the work below is an attempt to fill it, and it depends on
          their estimate to have anything to reconcile against.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          First, what the two counts agree on
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          Both find private equity operating in <strong>exactly {e.states} states</strong>,
          reached from entirely different data. The disagreement is about depth, not
          footprint: the two methods find the same map and fill it in to very different
          densities. In the five states the letter reports individually, Fundprint is
          higher in every one, but by wildly different factors, which is the first sign
          that the gap is not a uniform scaling error.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-semibold">State</th>
                <th className="py-2 pr-4 text-right font-semibold">{e.venue}</th>
                <th className="py-2 pr-4 text-right font-semibold">Fundprint (PE only)</th>
                <th className="py-2 text-right font-semibold">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {rec.states.map((s) => (
                <tr key={s.state} className="border-b border-rule/50">
                  <td className="py-2 pr-4 font-semibold">{s.state}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-ink-muted">
                    {fmtNum(s.external)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {fmtNum(s.fundprint_pe)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {s.ratio === null ? "n/a" : `${s.ratio.toFixed(2)}x`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-2xl font-sans text-sm text-ink-muted">
          The letter reports only its five largest states, so a full per-state
          reconciliation is not possible from the published text. Fundprint&apos;s column
          is filtered to private equity alone. The site&apos;s own state map counts every
          institutional financial owner, including a pension fund, a family office and two
          search funds, and therefore reads higher. Comparing that column against a figure
          labelled &ldquo;PE&rdquo; would manufacture a disagreement out of our own broader
          scope.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          The two methods converge to within {Math.abs(h.registry_visible_gap)} sites
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          Fundprint&apos;s clinics can be restricted to the ones the federal provider
          registry can see: sites whose building appears in the monthly NPPES bulk file.
          That subset is <strong>{fmtNum(f.registry_visible_pe_sites)}</strong> PE sites.
          The published estimate, built from a commercial deal database and press
          releases, is <strong>{fmtNum(e.sites)}</strong>.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          Two censuses sharing no data source, no unit definition and no time period land{" "}
          {Math.abs(h.registry_visible_gap)} sites apart nationally. They are not the same{" "}
          {fmtNum(e.sites)} sites, and the overlap cannot be checked, because the
          letter&apos;s site list is not published. But the convergence does one useful
          thing: it bounds how much of the {ratio}x can be method noise.
          Both approaches, run against records that companies file with somebody else,
          arrive at roughly the same number.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          <strong>
            The remaining {fmtNum(h.directory_only_pe_clinics)} clinics come from a source
            neither method uses: the operator&apos;s own public list of its centers.
          </strong>{" "}
          Not a leak, not a purchase, not an inference. A chain that runs 400 centers
          publishes all 400 on its website, because it wants families to find them. It
          does not separately register all 400 with the federal registry, and the
          transaction that created it recorded whatever it owned that day.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          A second estimate, counted a different way, agrees with us
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          One comparison against one estimate is the weakest form of this argument.
          It cannot be told apart from a pipeline that simply inflates. So here is a
          second published estimate, and it counts in a different unit: the{" "}
          <strong>{pc.source}</strong> lists a facility count per{" "}
          <strong>platform</strong>, the operating company a sponsor buys, rather than
          per deal. Unlike an aggregate, that can be diffed line by line.
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          Across the {pc.platforms_measured} platforms both cover, PESP counts{" "}
          <strong>{fmtNum(pc.pesp_total)}</strong> facilities and Fundprint publishes{" "}
          <strong>{fmtNum(pc.fundprint_total)}</strong> clinics, a ratio of{" "}
          <strong>{pc.ratio}x</strong>. <strong>And the differences run both ways:</strong>{" "}
          Fundprint is higher on {pc.higher} platforms, <em>lower</em> on {pc.lower}, and
          exact on {pc.exact.length} ({pc.exact.join(" and ")}), reached from opposite
          directions. A dataset that only ever revised counts upward would deserve no
          trust at all, and these are the receipts that this one does not.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-semibold">Platform</th>
                <th className="py-2 pr-4 text-right font-semibold">PESP</th>
                <th className="py-2 pr-4 text-right font-semibold">Fundprint</th>
                <th className="py-2 text-right font-semibold">Difference</th>
              </tr>
            </thead>
            <tbody>
              {pc.rows.map((r) => (
                <tr key={r.name} className="border-b border-rule/50">
                  <td className="py-2 pr-4 font-semibold">
                    {r.name}
                    {r.definitional && (
                      <span className="ml-2 label-mono text-ink-muted">scope rule</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-ink-muted">
                    {fmtNum(r.pesp)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {fmtNum(r.fundprint)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {r.difference > 0 ? `+${r.difference}` : r.difference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-2xl font-sans text-sm text-ink-muted">
          Independence here is partial, and pretending otherwise would not survive a
          reviewer. The platform <span className="italic">list</span> is shared:
          Fundprint adopted PESP&apos;s appendix as its{" "}
          <Link href="/coverage/" className="text-pe hover:underline">
            coverage denominator
          </Link>
          . The <span className="italic">counts</span> are not: ours come from operator
          directories and the federal registry without reference to PESP&apos;s numbers,
          and PESP&apos;s come from PitchBook and LevinPro. The two are also not
          like-for-like, since PESP counts facilities open{" "}
          <span className="italic">or opening soon</span>.{" "}
          {pc.definitional_only.map((d) => d.name).join(", ")} is excluded from the
          totals: we publish zero centers for it under the in-home rule, which is a
          scope disagreement rather than a counting one, and folding it in would let a
          definition masquerade as measurement error.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          So the estimates sort by unit, not by rigor
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          Put the four numbers side by side and they do not scatter. They fall into two
          groups, and the thing that separates the groups is what each method counts.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-semibold">Method</th>
                <th className="py-2 pr-4 font-semibold">Counts</th>
                <th className="py-2 pr-4 font-semibold">Sees the operator</th>
                <th className="py-2 text-right font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-rule/50">
                <td className="py-2 pr-4">{e.venue}</td>
                <td className="py-2 pr-4 text-ink/80">sites attached to deals</td>
                <td className="py-2 pr-4 text-ink/80">on the day it was bought</td>
                <td className="py-2 text-right tabular-nums">{fmtNum(e.sites)}</td>
              </tr>
              <tr className="border-b border-rule/50">
                <td className="py-2 pr-4">Fundprint, registry only</td>
                <td className="py-2 pr-4 text-ink/80">federal registrations</td>
                <td className="py-2 pr-4 text-ink/80">on the day it registered</td>
                <td className="py-2 text-right tabular-nums">
                  {fmtNum(f.registry_visible_pe_sites)}
                </td>
              </tr>
              <tr className="border-b border-rule/50">
                <td className="py-2 pr-4">PESP</td>
                <td className="py-2 pr-4 text-ink/80">platform facilities</td>
                <td className="py-2 pr-4 text-ink/80">now</td>
                <td className="py-2 text-right tabular-nums">{fmtNum(pc.pesp_total)}</td>
              </tr>
              <tr className="border-b border-rule/50">
                <td className="py-2 pr-4">Fundprint, all sources</td>
                <td className="py-2 pr-4 text-ink/80">operator directories</td>
                <td className="py-2 pr-4 text-ink/80">now</td>
                <td className="py-2 text-right tabular-nums">
                  {fmtNum(pc.fundprint_total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="max-w-2xl font-sans text-ink/80">
          The bottom two rows cover {pc.platforms_measured} platforms rather than the
          whole country, so they are not national totals and the four numbers are not a
          single series. What the grouping shows is the mechanism:{" "}
          <strong>
            a census built on deals or on registrations sees a company frozen at a
            moment, and a census built on platforms or directories sees it today.
          </strong>{" "}
          A chain that was bought with 40 centers and now runs 400 is counted at 40 by
          the first kind and at 400 by the second. That is where {ratio}x comes from,
          and it is a property of the unit, not of anyone&apos;s care.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">
          The registry&apos;s blind spot is not a constant
        </h2>
        <p className="max-w-2xl font-sans text-ink/80">
          This is the part that matters more than the headline. If the federal registry
          undercounted every operator by the same factor, any registry-based or deal-based
          count could be corrected with a multiplier and there would be nothing more to
          do. It does not. Across the {spread.owners} brands with {MATERIAL} or more
          published centers, the ratio between what the operator publishes and what the
          registry can see runs from <strong>{spread.min_ratio?.toFixed(1)}x</strong> to{" "}
          <strong>
            {spread.invisible_owners.length > 0 ? "unbounded" : `${spread.max_ratio?.toFixed(1)}x`}
          </strong>
          {spread.invisible_owners.length > 0 && (
            <>
              : the registry sees essentially every center some operators run, and{" "}
              <strong>none at all</strong> of{" "}
              {spread.invisible_owners.join(", ")}
            </>
          )}
          .
        </p>
        <p className="max-w-2xl font-sans text-ink/80">
          So there is no adjustment factor to apply, and an operator&apos;s visibility
          cannot be predicted from its size. The only way to close the gap is to read each
          operator&apos;s directory, one at a time, which is what Fundprint does and what
          takes the time.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-rule">
                <th className="py-2 pr-4 font-semibold">Brand</th>
                <th className="py-2 pr-4 font-semibold">Owner</th>
                <th className="py-2 pr-4 text-right font-semibold">Published</th>
                <th className="py-2 pr-4 text-right font-semibold">Registry sees</th>
                <th className="py-2 text-right font-semibold">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {material.map((o) => (
                <tr key={o.owner} className="border-b border-rule/50">
                  <td className="py-2 pr-4 font-semibold">{o.brand}</td>
                  <td className="py-2 pr-4 text-ink/80">{o.firm}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">
                    {fmtNum(o.published)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-ink-muted">
                    {fmtNum(o.registry_visible)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {o.ratio === null ? "invisible" : `${o.ratio.toFixed(1)}x`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-2xl font-sans text-sm text-ink-muted">
          &ldquo;Registry sees&rdquo; is a visibility test, not a provenance one: it asks
          whether the building appears anywhere in the federal bulk file, resolved to the
          registry&apos;s own address key. It is the same test that produces the{" "}
          {f.pe_share_of_all_sites}% national share, so the rows here and that share cannot
          drift apart. Brands with fewer than {MATERIAL} published centers are omitted from
          this table, because a ratio over three sites is noise.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-xl font-semibold">What this does not settle</h2>
        <ul className="max-w-2xl list-disc space-y-3 pl-5 font-sans text-ink/80">
          <li>
            <strong>Time is inside the ratio and cannot be removed.</strong> The published
            estimate describes {e.as_of}; this dataset is current. Real centers opened in
            the months between, and some part of the {ratio}x is growth
            rather than method. Separating the two would need the letter&apos;s site list,
            which is not published. We say so instead of claiming the whole factor.
          </li>
          <li>
            <strong>The counts are not of identical objects.</strong> The letter counts
            ASD service delivery sites attached to acquisitions it identified. Fundprint
            counts physical ABA therapy centers currently operating, keyed on owner,
            normalized street and ZIP, excluding head offices, diagnostic-only sites and
            in-home service areas. Where the definitions differ, they are disclosed rather
            than reconciled away.
          </li>
          <li>
            <strong>Our count is a floor too, for a reason of our own.</strong> Fundprint
            has not read every PE-backed platform. The ones it has not are named
            individually, with their facility counts, on the{" "}
            <Link href="/coverage/" className="text-pe hover:underline">
              coverage page
            </Link>
            . Any number here would rise if that work were finished.
          </li>
          <li>
            <strong>The federal registry never marks a closed clinic closed.</strong> Both
            counts inherit that. Fundprint removes centers its owners&apos; own directories
            no longer list, which is why some of its per-operator counts run{" "}
            <span className="italic">below</span> other published figures.
          </li>
        </ul>
      </section>

      <section className="space-y-4 border-l-2 border-rule pl-5">
        <h2 className="font-sans text-xl font-semibold">Check it</h2>
        <p className="max-w-2xl font-sans text-ink/80">
          Every figure on this page is generated from the published dataset, not typed
          into it. The comparison paper is fetched and content-hashed like any other
          source, so the version being reconciled against is fixed and identifiable.
        </p>
        <ul className="max-w-2xl space-y-2 font-mono text-sm text-ink-muted">
          <li>
            paper:{" "}
            <a className="text-pe hover:underline" href={e.source_url}>
              {e.source_url.replace(/^https:\/\//, "")}
            </a>{" "}
            &middot; sha256 {e.content_hash.slice(0, 16)}&hellip;
          </li>
          <li>registry archive &middot; sha256 {f.archive_sha256.slice(0, 16)}&hellip;</li>
          <li>
            code:{" "}
            <a
              className="text-pe hover:underline"
              href="https://github.com/fundprint/fundprint-data"
            >
              github.com/fundprint/fundprint-data
            </a>{" "}
            &middot; scripts/build_reconciliation.py
          </li>
          <li>
            method:{" "}
            <a
              className="text-pe hover:underline"
              href="https://github.com/fundprint/fundprint-methodology"
            >
              METHODOLOGY.md
            </a>{" "}
            &sect;8e, version {snapshot.meta.methodology_version}
          </li>
        </ul>
        <p className="max-w-2xl font-sans text-ink/80">
          If any line here is wrong, it is worth more to us corrected than defended.
          Challenges move the disputed claim to quarantine until they are resolved with
          sources.
        </p>
      </section>
    </div>
  );
}
