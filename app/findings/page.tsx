import type { Metadata } from "next";
import Link from "next/link";
import CaseHeader from "@/components/dossier/CaseHeader";
import Exhibit from "@/components/dossier/Exhibit";
import SourceCite from "@/components/dossier/SourceCite";
import StatSlot from "@/components/dossier/StatSlot";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Investigation | Fundprint",
  description:
    "Why private-equity ownership of autism therapy clinics is worth tracing: concentration, the CARD collapse, and what the record can and cannot say.",
};

export default function FindingsPage() {
  const { totals } = snapshot;
  const pePct = Math.round((totals.pe_clinics / totals.clinics) * 100);

  return (
    <div className="space-y-16">
      <CaseHeader
        eyebrow="The Investigation"
        title="Why ownership is worth tracing"
        lede="Autism therapy is one of the most private-equity-concentrated corners of American health care. When the owner is a fund with a five-year horizon, the clinic your child attends is an asset on a balance sheet. Here is what the record shows, and what it does not."
      />

      <Exhibit mark="1" kicker="A market bought in a decade" title="Concentration, not competition">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl space-y-4 font-sans text-ink/85">
            <p>
              Researchers at the Center for Economic and Policy Research found that
              between 2017 and 2022 private-equity firms completed roughly 85% of all
              mergers and acquisitions in autism services, a concentration they found in
              no other segment of health care.
              <SourceCite n={1} href="https://cepr.net/publications/pocketing-money-meant-for-kids-private-equity-in-autism-services/" title="CEPR: Private Equity in Autism Services" />
            </p>
            <p>
              Our own record, built from the ground up out of public data, shows the same
              shape. Of the {fmtNum(totals.clinics)} clinics we have traced to an owner,
              {" "}{pePct}% are held by private equity, and a handful of firms hold most of
              them. This is a market that was assembled, quickly, by financial buyers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <StatSlot value="~85%" label="of autism M&A" note="private equity, 2017-2022 (CEPR)" accent />
            <StatSlot value={`${pePct}%`} label="of traced clinics" note="PE-owned in our data" />
          </div>
        </div>
      </Exhibit>

      <Exhibit mark="2" kicker="The warning already on the record" title="What happened to CARD">
        <div className="max-w-2xl space-y-4 font-sans text-ink/85">
          <p>
            In 2018 Blackstone bought the Center for Autism and Related Disorders, then the
            largest ABA provider in the country at roughly 250 locations. The company took
            on debt it had not carried before. New-hire training was cut and moved online.
            Within five years more than a hundred centers had closed, and in 2023 CARD
            filed for bankruptcy.
            <SourceCite n={2} href="https://www.nbcnews.com/health/health-care/card-blackstone-kids-autism-private-equity-bankruptcy-rcna118544" title="NBC News: CARD, Blackstone, bankruptcy" />
          </p>
          <p>
            CARD is the reason a map like this matters. When a financial owner exits, the
            families relying on those clinics are the ones left without care. It appears in
            our dataset as a former holding, recorded for its history rather than shown as a
            live owner.
          </p>
          <p className="font-mono text-sm text-ink-muted">
            See it in the record:{" "}
            <Link href="/acquirers/" className="text-pe hover:underline">
              the owners index
            </Link>{" "}
            lists Blackstone as a former owner with a sourced timeline.
          </p>
        </div>
      </Exhibit>

      <Exhibit mark="3" kicker="The honesty of the record" title="What we can and cannot say">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="folder px-4 py-4">
            <div className="label-mono text-pe">We can say</div>
            <p className="mt-2 font-sans text-[0.95rem] text-ink/85">
              For every clinic shown, the named owner is backed by a public document you can
              open. Non-PE institutional owners are labeled as what they are, not folded
              into &ldquo;private equity.&rdquo;
            </p>
          </div>
          <div className="folder px-4 py-4">
            <div className="label-mono text-pe">We cannot say</div>
            <p className="mt-2 font-sans text-[0.95rem] text-ink/85">
              That a clinic not in this record is independent. Absence is a gap in our
              coverage, not a finding. We track ownership; we do not certify independence.
            </p>
          </div>
          <div className="folder px-4 py-4">
            <div className="label-mono text-pe">Still measuring</div>
            <p className="mt-2 font-sans text-[0.95rem] text-ink/85">
              How complete the record is against the full set of PE-backed ABA platforms,
              and a published hand-verification rate. Both are in progress and will be
              stated as numbers, not implied.
            </p>
          </div>
        </div>
      </Exhibit>

      <Exhibit mark="4" kicker="Not a fringe worry" title="Washington is asking the same question">
        <p className="max-w-2xl font-sans text-ink/85">
          A bipartisan Senate Budget Committee investigation into private-equity ownership
          of hospitals found patient care deteriorated as owners took payouts.
          <SourceCite n={3} href="https://www.budget.senate.gov/ranking-member/newsroom/press/private-equity-in-health-care-shown-to-harm-patients-degrade-care-and-drive-hospital-closures" title="Senate Budget Committee report" />{" "}
          The concern that drives this project is the same one now on the Senate floor: when
          finance owns care, whose interest wins.
        </p>
      </Exhibit>

      <div className="border-t border-rule pt-5">
        <div className="label-mono mb-3">Sources</div>
        <ol className="space-y-1.5 font-mono text-[0.72rem] text-ink-muted">
          <li>[1] CEPR, &ldquo;Pocketing Money Meant for Kids: Private Equity in Autism Services.&rdquo;</li>
          <li>[2] NBC News, on CARD, Blackstone, and the 2023 bankruptcy.</li>
          <li>[3] U.S. Senate Budget Committee, private equity in health care.</li>
        </ol>
      </div>
    </div>
  );
}
