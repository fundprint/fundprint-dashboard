import Link from "next/link";
import Search from "@/components/Search";
import Concentration from "@/components/dossier/Concentration";
import Exhibit from "@/components/dossier/Exhibit";
import { Pushpin, RedactedDoc, Tape } from "@/components/dossier/Props";
import RedactionReveal from "@/components/dossier/RedactionReveal";
import SourceCite from "@/components/dossier/SourceCite";
import StatSlot from "@/components/dossier/StatSlot";
import Stamp from "@/components/dossier/Stamp";
import TheMachine from "@/components/engine/TheMachine";
import { snapshot } from "@/lib/data";
import { fmtNum, oneInPhrase } from "@/lib/format";

export default function Home() {
  const { totals, acquirers, meta, market } = snapshot;
  const asOf = new Date(meta.generated_at).toISOString().slice(0, 10);

  return (
    <div className="space-y-16">
      {/* The finding, as a filed document */}
      <section className="relative pt-10">
        {/* a pinned exhibit peeking above the document's corner (large screens) */}
        <div className="absolute right-3 top-0 z-[2] hidden rotate-[7deg] lg:block">
          <Pushpin className="absolute left-1/2 top-0 z-10 -translate-x-1/2" />
          <RedactedDoc w={120} />
        </div>

        <div className="dogear relative z-[1] rotate-[-0.5deg] rounded-[3px] border border-manila-edge bg-sheet px-6 py-8 shadow-folder sm:px-11 sm:py-11">
          <Tape className="-top-3 left-8 -rotate-3" />
          <Tape className="-top-3 right-10 rotate-6" />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="bg-pe px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sheet">
              The Finding
            </span>
            <span className="label-mono">Opened 2026 / United States</span>
          </div>

          <h1 className="headline mt-4 max-w-4xl text-[2.6rem] leading-[1.0] sm:text-[3.75rem] lg:pr-24">
            {market ? (
              <>
                <RedactionReveal>Financial owners</RedactionReveal> hold{" "}
                {oneInPhrase(market.share.tracked_of_chain_sites)} of America&apos;s
                chain-run autism-therapy clinics.
                <a
                  href="#denominator"
                  aria-label="Read what chain-run means and what the share is measured against"
                  className="align-super text-[0.42em] font-semibold text-pe no-underline hover:underline"
                >
                  *
                </a>
              </>
            ) : (
              <>
                <RedactionReveal>Private equity</RedactionReveal> owns{" "}
                {fmtNum(totals.pe_clinics)} of the {fmtNum(totals.clinics)}{" "}
                autism-therapy clinics we could trace.
              </>
            )}
          </h1>
          {market && (
            <p className="mt-4 max-w-2xl border-l-2 border-pe/40 pl-4 text-[0.92rem] leading-relaxed text-ink-muted">
              <span className="font-semibold text-pe">*</span> A chain is an ABA
              company with {market.meta.chain_min_sites} or more locations, which
              is the only part of this market financial owners buy.{" "}
              {market.share.tracked_of_chain_sites}% of those clinics (
              {fmtNum(market.numerator.tracked_sites_within_chains)} of{" "}
              {fmtNum(market.denominator.chain_sites)}) are held by a firm we can
              name and source; private equity alone holds{" "}
              {market.share.private_equity_of_chain_sites}%. Counted instead
              against every ABA site in the country, including the{" "}
              {fmtNum(market.denominator.independent_sites)} solo and small
              practices, the same holdings are{" "}
              {market.share.tracked_of_all_sites}%. Both numbers are true and both
              are below, because quoting either one alone misleads.
            </p>
          )}
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
            Fundprint follows the money behind U.S. ABA / autism-therapy clinics:
            which are run by an independent practitioner, which by a chain, and
            which by a financial owner that can restructure or close them. Every
            claim here traces to a public document.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-6 sm:grid-cols-4">
            <StatSlot value={fmtNum(totals.clinics)} label="Clinics traced" note="from public records" />
            {market ? (
              <StatSlot
                value={`${market.share.tracked_of_chain_sites}%`}
                label="Of chain-run clinics"
                note={`${fmtNum(market.numerator.tracked_sites_within_chains)} of ${fmtNum(market.denominator.chain_sites)} nationally`}
                accent
              />
            ) : (
              <StatSlot value={fmtNum(totals.pe_clinics)} label="Private-equity owned" note="clinics" accent />
            )}
            <StatSlot value={fmtNum(totals.acquirers)} label="Current owners" note="plus one former owner" />
            <StatSlot value={fmtNum(totals.states)} label="States covered" note={`as of ${asOf}`} />
          </div>

          <div className="pointer-events-none absolute bottom-5 right-6 hidden sm:block">
            <Stamp label="Confidential" rotate={-9} />
          </div>
        </div>
      </section>

      {/* The denominator: what the share is a share OF. */}
      {market && (
        <Exhibit
          id="denominator"
          mark="0"
          kicker="What the number is a share of"
          title="The Denominator"
          aside={<Stamp label="Measured" />}
        >
          <p className="mb-5 max-w-2xl text-ink/80">
            A count on its own invites a fair question: out of how many? So we
            counted the whole market. The federal provider registry lists{" "}
            <strong>{fmtNum(market.denominator.aba_organizations)}</strong>{" "}
            ABA provider organizations operating{" "}
            <strong>{fmtNum(market.denominator.aba_sites)}</strong> locations in
            the United States.
          </p>
          <p className="mb-5 max-w-2xl text-ink/80">
            Most of it is not a market financial owners are in.{" "}
            <strong>{fmtNum(market.denominator.independent_sites)}</strong> of
            those locations belong to independents and very small practices.
            Private equity does not buy those. It buys chains, and there are only{" "}
            <strong>{fmtNum(market.denominator.chains)}</strong> ABA chains in the
            country with {market.meta.chain_min_sites} or more locations, running{" "}
            <strong>{fmtNum(market.denominator.chain_sites)}</strong> clinics
            between them.
          </p>
          <p className="mb-5 max-w-2xl text-ink/80">
            Of those chain-run clinics,{" "}
            <strong>
              {fmtNum(market.numerator.tracked_sites_within_chains)} (
              {market.share.tracked_of_chain_sites}%)
            </strong>{" "}
            are held by a private-equity firm, pension fund or family office we
            can name and source. Private equity on its own holds{" "}
            {market.share.private_equity_of_chain_sites}% of them. Measured
            against every ABA location in the country, including the independents,
            the same holdings are {market.share.tracked_of_all_sites}%. Both
            numbers are true. The second describes a fragmented profession; the
            first describes what has happened to the part of it that consolidated.
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
            Numerator and denominator are computed in a single pass over one
            registry with one address key, so the numerator is a strict subset of
            the denominator and cannot count anything the denominator does not.
            Clinics we read from an owner&apos;s own location directory are
            excluded from both sides, because the registry cannot see them, which
            is why this figure is smaller than the{" "}
            {fmtNum(market.context.published_clinics)} clinics traced above.
          </p>
          <div className="mt-6">
            <SourceCite
              n={1}
              href="https://download.cms.gov/nppes/NPI_Files.html"
              title="NPPES monthly bulk dissemination file, CMS"
            />
          </div>
        </Exhibit>
      )}

      {/* Exhibit A: the engine, full-bleed */}
      <Exhibit mark="A" kicker="How the record is built" title="The Machine" aside={<Stamp label="Deterministic" />}>
        <p className="mb-6 max-w-2xl text-ink/80">
          Fundprint is not a hand-kept list. It is a five-stage pipeline that
          pulls public records, snapshots and embeds them, resolves the ownership
          chain, holds every claim to a validation gate, and publishes only what
          passes. Watch a record travel through it.
        </p>
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <div className="mx-auto max-w-6xl px-5">
            <TheMachine />
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-[0.9rem] leading-relaxed text-ink-muted">
          The same engine runs on a public dataset with an open methodology. See{" "}
          <Link href="/process/" className="text-pe underline decoration-pe/30 underline-offset-2 hover:decoration-pe">
            how the machine works
          </Link>{" "}
          for the confidence floors, the two registries, and the integrity rules.
        </p>
      </Exhibit>

      {/* Exhibit B: concentration */}
      <Exhibit
        mark="B"
        kicker="Who holds the most"
        title="A concentrated market"
        aside={
          <Link href="/acquirers/" className="text-sm text-pe underline decoration-pe/30 underline-offset-2 hover:decoration-pe">
            All owners
          </Link>
        }
      >
        <p className="mb-6 max-w-2xl text-ink/80">
          Ownership is not spread thin. A handful of firms hold most of the
          clinics we have traced. Bar length is clinics tracked; color marks the
          kind of owner.
        </p>
        <Concentration acquirers={acquirers} />
      </Exhibit>

      {/* Exhibit C: the CARD case */}
      <Exhibit mark="C" kicker="Why it matters" title="When the money leaves">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
          <div className="max-w-2xl text-ink/85">
            <p>
              In 2018, Blackstone bought the Center for Autism and Related
              Disorders, then the largest ABA provider in the country at roughly
              250 locations. The company was loaded with debt, training was cut,
              and within five years more than a hundred centers had closed. In
              2023, CARD filed for bankruptcy.
              <SourceCite
                n={1}
                href="https://www.nbcnews.com/health/health-care/card-blackstone-kids-autism-private-equity-bankruptcy-rcna118544"
                title="NBC News: CARD, Blackstone, and the bankruptcy"
              />
            </p>
            <p className="mt-4">
              That is why ownership is worth tracing. When a financial owner
              exits, the families relying on those clinics are the ones left
              without care. CARD appears in this dataset as a former holding,
              recorded for its history.
            </p>
            <Link href="/findings/" className="mt-6 inline-block text-sm font-semibold text-pe underline decoration-pe/30 underline-offset-2 hover:decoration-pe">
              Read the investigation
            </Link>
          </div>
          <div className="self-start border-l-2 border-ink/80 pl-5">
            <div className="label-mono">Case exhibit</div>
            <div className="mt-2 font-display text-5xl font-semibold leading-none tabular-nums">
              ~250
            </div>
            <div className="mt-1 text-xs text-ink-muted">centers at acquisition, 2018</div>
            <div className="mt-5 font-display text-4xl font-semibold leading-none text-pe">
              Bankrupt
            </div>
            <div className="mt-1 text-xs text-ink-muted">five years later, 2023</div>
          </div>
        </div>
      </Exhibit>

      {/* Look up your clinic */}
      <section className="folder px-5 py-7 sm:px-8 sm:py-9">
        <div className="label-mono">For families</div>
        <h2 className="headline mt-1 text-2xl">Look up your clinic</h2>
        <p className="mt-2 max-w-2xl text-ink/75">
          Search by clinic name or city. Every answer links to the public source
          behind it. Searches run in your browser and are never recorded.
        </p>
        <div className="mt-5">
          <Search />
        </div>
      </section>
    </div>
  );
}
