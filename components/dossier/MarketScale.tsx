import { fmtNum } from "@/lib/format";
import type { Market } from "@/lib/types";

// The market, reported as facts rather than as a constructed ratio.
//
// This exhibit used to draw a "share of chain-run clinics", where a chain was an
// operator with five or more sites. That number is gone and is not coming back.
// The cut was arbitrary (five, not three, not ten), and worse, the denominator
// was endogenous: an operator is a chain BECAUSE it has many sites, and it has
// many sites BECAUSE private equity rolled it up, so PE's own buying inflated the
// numerator and the denominator together. The measure was partly blind to the
// thing it existed to measure.
//
// What is here instead needs no threshold and no editorial choice:
//   1. the operator-size distribution, so the reader sees the market's shape and
//      draws their own cut, out loud, instead of inheriting ours in silence;
//   2. private equity's share of EVERY ABA site in the country;
//   3. private equity's share of the sites in each state, which is the closest
//      this data gets to market power, because no family chooses between a clinic
//      in Denver and one in Tampa.
//
// Every width is a ratio of the snapshot's own counts. Nothing is set by hand.

const PE = "#b3241c";
const SLATE = "#45525a";

function Field({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-ink/25 pt-2">
      <div className="font-display text-[1.6rem] font-semibold leading-none tabular-nums">
        {value}
      </div>
      <div className="mt-1 text-[0.72rem] leading-snug text-ink-muted">{label}</div>
    </div>
  );
}

export default function MarketScale({ market }: { market: Market }) {
  const { denominator: d, numerator: n, share: s, size_distribution: dist, states } = market;

  const maxDistSites = Math.max(...dist.map((b) => b.sites));
  const topStates = states.slice(0, 8);
  const maxStateShare = Math.max(...topStates.map((r) => r.private_equity_share));

  return (
    <figure className="folder m-0 px-5 py-6 sm:px-7 sm:py-7">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <Field value={fmtNum(d.aba_organizations)} label="ABA provider organizations" />
        <Field value={fmtNum(d.aba_sites)} label="Locations they run" />
        <Field value={fmtNum(n.private_equity_sites)} label="Of those, private-equity owned" />
        <Field value={`${s.private_equity_of_all_sites}%`} label="Private equity's national share" />
      </div>

      {/* 1. The shape of the market. No threshold: the whole distribution. */}
      <div className="mt-9">
        <div className="label-mono mb-1">The shape of the market</div>
        <p className="mb-4 max-w-2xl text-[0.85rem] leading-relaxed text-ink-muted">
          We do not publish a &ldquo;chain&rdquo; cutoff, because any cutoff we
          picked would decide the answer. Here is the whole distribution instead.
          Draw your own line, and say where you drew it.
        </p>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-rule">
              <th className="label-mono pb-1.5 font-normal">Locations per operator</th>
              <th className="label-mono pb-1.5 text-right font-normal">Operators</th>
              <th className="label-mono w-1/2 pb-1.5 pl-4 font-normal">Locations</th>
            </tr>
          </thead>
          <tbody>
            {dist.map((b) => (
              <tr key={b.sites_per_operator} className="border-b border-rule/60">
                <td className="py-2 font-mono text-sm tabular-nums">
                  {b.sites_per_operator}
                </td>
                <td className="py-2 text-right font-mono text-sm tabular-nums text-ink/80">
                  {fmtNum(b.operators)}
                </td>
                <td className="py-2 pl-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2.5 rounded-sm"
                      style={{
                        width: `${(b.sites / maxDistSites) * 100}%`,
                        backgroundColor: SLATE,
                        minWidth: "2px",
                      }}
                      aria-hidden
                    />
                    <span className="shrink-0 font-mono text-sm tabular-nums text-ink/80">
                      {fmtNum(b.sites)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 max-w-2xl text-[0.78rem] leading-relaxed text-ink-muted">
          {fmtNum(dist[0].operators)} of the country&apos;s{" "}
          {fmtNum(d.aba_organizations)} ABA operators run exactly one location.
          Fourteen run twenty-five or more. That is the market: a very long tail,
          and a very short head.
        </p>
      </div>

      {/* 2. Where private equity actually is. A state is a market; the nation is not. */}
      <div className="mt-9 border-t border-rule pt-6">
        <div className="label-mono mb-1">Where private equity is concentrated</div>
        <p className="mb-4 max-w-2xl text-[0.85rem] leading-relaxed text-ink-muted">
          Nationally, private equity holds {s.private_equity_of_all_sites}% of ABA
          locations, which sounds small and is the wrong frame: nobody chooses
          between a clinic in Denver and one in Tampa. Care is bought locally, so
          the honest measure is local. Share of every ABA location in the state,
          registry basis.
        </p>
        <ol className="space-y-2.5">
          {topStates.map((r) => (
            <li key={r.state} className="grid grid-cols-[2rem_1fr] items-center gap-3">
              <span className="font-mono text-sm font-semibold tabular-nums">
                {r.state}
              </span>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="h-2.5 flex-1 rounded-sm bg-manila/70">
                    <div
                      className="h-2.5 rounded-sm"
                      style={{
                        width: `${(r.private_equity_share / maxStateShare) * 100}%`,
                        backgroundColor: PE,
                      }}
                      aria-hidden
                    />
                  </div>
                  <span className="w-40 shrink-0 text-right font-mono text-sm tabular-nums text-ink/80">
                    {r.private_equity_share}%{" "}
                    <span className="text-ink-muted">
                      ({fmtNum(r.private_equity_sites)} of {fmtNum(r.aba_sites)})
                    </span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 max-w-2xl text-[0.78rem] leading-relaxed text-ink-muted">
          States with fewer than {market.meta.min_state_sites} ABA locations are
          not ranked, because a percentage of a handful of clinics is noise. They
          are still counted in every national figure above.
        </p>
      </div>

      <figcaption className="mt-6 border-t border-rule pt-4 text-[0.78rem] leading-relaxed text-ink-muted">
        Registry basis. The numerator and the denominator are computed in one pass
        over one universe with one address key, so the numerator cannot count
        anything the denominator does not. The{" "}
        {fmtNum(n.private_equity_sites)} private-equity locations here are the ones
        the federal registry can see; the{" "}
        {fmtNum(market.context.published_clinics)} clinics traced above also
        include centers read from owners&apos; own directories, which the registry
        does not list. The two are not interchangeable.
      </figcaption>
    </figure>
  );
}
