import Link from "next/link";
import AcquirerTable from "@/components/AcquirerTable";
import Search from "@/components/Search";
import { snapshot } from "@/lib/data";
import { fmtNum } from "@/lib/format";

export default function Home() {
  const { totals, acquirers } = snapshot;
  return (
    <div>
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Is your child&apos;s autism therapy clinic owned by private equity?
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-black/70">
          Fundprint is a free, public record of who owns U.S. ABA / autism
          therapy clinics. Look up a clinic below. Every answer links to the
          public documents behind it.
        </p>

        <div className="mt-7 text-left">
          <Search />
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Clinics tracked" value={fmtNum(totals.clinics)} />
        <Stat label="Owners" value={fmtNum(totals.acquirers)} />
        <Stat label="States covered" value={fmtNum(totals.states)} />
        <Stat
          label="PE-owned clinics"
          value={fmtNum(totals.pe_clinics)}
        />
      </section>

      <section className="mt-14">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Who owns the most clinics</h2>
          <Link
            href="/acquirers/"
            className="text-sm underline decoration-black/30 underline-offset-2 hover:decoration-black"
          >
            All acquirers →
          </Link>
        </div>
        <AcquirerTable acquirers={acquirers} />
      </section>

      <section className="mt-10 rounded-lg border border-black/10 bg-white p-5 text-sm text-black/70">
        <p>
          <span className="font-medium text-black">A note on scope. </span>
          ABA therapy is debated within the autism community. Fundprint takes no
          position on it. We track <em>who owns the clinics</em> that serve
          autistic children, so families can know whether their clinic is run by
          an independent practitioner, a chain, or a financial owner that may
          restructure or close it. Most owners here are private-equity firms; a
          few are pension funds or family offices, which we label as such rather
          than call them PE.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white px-4 py-3 text-center">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-black/55">{label}</div>
    </div>
  );
}
