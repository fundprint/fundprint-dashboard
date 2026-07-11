import Link from "next/link";
import Search from "@/components/Search";
import Concentration from "@/components/dossier/Concentration";
import Exhibit from "@/components/dossier/Exhibit";
import RedactionReveal from "@/components/dossier/RedactionReveal";
import SourceCite from "@/components/dossier/SourceCite";
import StatSlot from "@/components/dossier/StatSlot";
import Stamp from "@/components/dossier/Stamp";
import { Magnifier } from "@/components/dossier/Props";
import TheMachine from "@/components/engine/TheMachine";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export default function Home() {
  const { totals, acquirers, meta } = snapshot;
  const pePct = Math.round((totals.pe_clinics / totals.clinics) * 100);
  const asOf = new Date(meta.generated_at).toISOString().slice(0, 10);

  return (
    <div className="space-y-12">
      {/* The finding */}
      <section className="relative">
        <Magnifier className="pointer-events-none absolute -right-2 -top-4 text-pe/25 sm:right-4" size={120} />
        <div className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-block h-2 w-2 bg-pe" aria-hidden />
          Opened 2026 &middot; United States &middot; The Finding
        </div>
        <h1 className="mt-3 max-w-4xl font-display text-[2.35rem] font-semibold leading-[1.02] sm:text-[3.4rem]">
          <RedactionReveal>Private equity</RedactionReveal> owns {fmtNum(totals.pe_clinics)} of
          the {fmtNum(totals.clinics)} autism-therapy clinics we could trace.
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-ink/85">
          Fundprint follows the money behind U.S. ABA / autism-therapy clinics:
          which are run by an independent practitioner, which by a chain, and
          which by a financial owner that can restructure or close them. Every
          claim on this page traces to a public document.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatSlot value={fmtNum(totals.clinics)} label="Clinics traced" note="from public records" />
          <StatSlot value={`${pePct}%`} label="Private-equity owned" note={`${fmtNum(totals.pe_clinics)} clinics`} accent />
          <StatSlot value={fmtNum(totals.acquirers)} label="Current owners" note="plus one former owner" />
          <StatSlot value={fmtNum(totals.states)} label="States covered" note={`as of ${asOf}`} />
        </div>
      </section>

      {/* Exhibit A: the engine */}
      <Exhibit
        mark="A"
        kicker="How the record is built"
        title="The Machine"
        aside={<Stamp label="Deterministic" />}
      >
        <p className="mb-6 max-w-2xl font-serif text-ink/80">
          Fundprint is not a hand-kept list. It is a five-stage pipeline that
          pulls public records, snapshots and embeds them, resolves the ownership
          chain, holds every claim to a validation gate, and publishes only what
          passes. Watch a record travel through it.
        </p>
        <TheMachine />
        <p className="mt-5 max-w-2xl font-mono text-[0.72rem] leading-relaxed text-ink-muted">
          The same engine runs on a public dataset with an open methodology. See{" "}
          <Link href="/process/" className="text-pe hover:underline">
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
          <Link href="/acquirers/" className="font-mono text-sm text-pe hover:underline">
            All owners &rarr;
          </Link>
        }
      >
        <p className="mb-6 max-w-2xl font-serif text-ink/80">
          Ownership is not spread thin. A handful of firms hold most of the
          clinics we have traced. Bar length is clinics tracked; color marks the
          kind of owner.
        </p>
        <Concentration acquirers={acquirers} />
      </Exhibit>

      {/* Exhibit C: the CARD case */}
      <Exhibit mark="C" kicker="Why it matters" title="When the money leaves">
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div className="max-w-2xl font-serif text-ink/85">
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
            <Link
              href="/findings/"
              className="mt-5 inline-block font-mono text-sm text-pe hover:underline"
            >
              Read the investigation &rarr;
            </Link>
          </div>
          <div className="folder self-start px-5 py-5">
            <div className="label-mono">Case exhibit</div>
            <div className="mt-2 font-mono text-4xl font-bold leading-none tabular-nums">
              ~250 <span className="text-sm font-normal text-ink-muted">centers</span>
            </div>
            <div className="mt-1 font-mono text-xs text-ink-muted">at acquisition, 2018</div>
            <div className="mt-4 headline text-3xl text-pe">Bankrupt</div>
            <div className="mt-1 font-mono text-xs text-ink-muted">five years later, 2023</div>
          </div>
        </div>
      </Exhibit>

      {/* Look up your clinic */}
      <section className="folder px-5 py-6 sm:px-8 sm:py-8">
        <div className="label-mono">For families</div>
        <h2 className="headline mt-1 text-2xl">Look up your clinic</h2>
        <p className="mt-2 max-w-2xl font-serif text-ink/75">
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
