import type { Metadata } from "next";
import { snapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "Methodology & limits | Fundprint",
  description:
    "How Fundprint builds its dataset, what counts as owned, and where the data is uncertain.",
};

export default function MethodologyPage() {
  const { meta, totals } = snapshot;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Methodology &amp; limits</h1>

      <p className="mt-4 text-black/75">
        Fundprint links clinics to their operators and, where the records show
        it, to the financial owner above that operator. Every link in the chain
        is backed by a public document. The dashboard displays what the dataset
        publishes; it never computes a number you could not reproduce from the
        public data yourself.
      </p>

      <h2 className="mt-8 text-lg font-semibold">How a clinic gets into the data</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-black/75">
        <li>
          Clinics come from the public NPI registry (NPPES) and other public
          provider records.
        </li>
        <li>
          A clinic is linked to an operating brand when its records match that
          brand.
        </li>
        <li>
          A brand is linked to its owner from the owner&apos;s own portfolio page
          or a public acquisition announcement (the source you can click on
          every claim).
        </li>
        <li>
          Confidence is the weakest link along that chain. Low-confidence links
          are withheld from this dashboard entirely.
        </li>
      </ol>

      <h2 className="mt-8 text-lg font-semibold">What we label, and honestly</h2>
      <p className="mt-2 text-black/75">
        Most owners here are private-equity firms. A few are other institutional
        owners (pension funds, family offices) that run their clinics like PE
        platforms. We tag each owner&apos;s type instead of calling everything
        &ldquo;private equity.&rdquo; If you only want PE, the owner-type label
        lets you filter to it.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What this data is not</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-black/75">
        <li>
          <span className="font-medium">Not a census.</span> It is the clinics we
          have resolved so far. Coverage is uneven by state.
        </li>
        <li>
          <span className="font-medium">Not a clean bill.</span> A clinic not
          shown as owned is a coverage gap, never a finding that it is
          independent.
        </li>
        <li>
          <span className="font-medium">Not a position on ABA.</span> We track
          ownership, not whether the therapy is good or bad.
        </li>
        <li>
          <span className="font-medium">Not clinical or financial detail.</span>{" "}
          No patient data, no non-public financials.
        </li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold">Corrections</h2>
      <p className="mt-2 text-black/75">
        Every number here traces to the published dataset. If you can show a
        specific claim is wrong, it gets corrected in the dataset and this
        dashboard redeploys against the fix; we do not quietly edit a page.
      </p>

      <div className="mt-8 rounded-lg border border-black/10 bg-white p-4 font-mono text-xs text-black/60">
        <div>dataset version: {meta.dataset_version}</div>
        <div>resolver version: {meta.resolver_version}</div>
        <div>methodology version: {meta.methodology_version}</div>
        <div>generated: {meta.generated_at}</div>
        <div>
          coverage: {totals.clinics} clinics · {totals.acquirers} owners ·{" "}
          {totals.states} states
        </div>
      </div>
    </div>
  );
}
