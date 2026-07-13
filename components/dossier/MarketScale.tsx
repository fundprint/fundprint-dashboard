import { fmtNum } from "@/lib/format";
import type { Market } from "@/lib/types";

// The national market, from the registry.
//
// Two things this must get right, both learned by getting them wrong:
//
// 1. The reader arrives from a headline that says 1,398 and immediately meets a
//    754. If the page does not reconcile that IN THE OPEN, before any chart, the
//    honest thing (a registry-basis share whose numerator and denominator share
//    one universe) reads as a broken number. So the bridge is prose, up front.
// 2. The page is not a changelog. A visitor has never seen the measure we used to
//    publish and does not care that it is gone; explaining the withdrawal here
//    just teaches them a bad number and makes the site sound defensive. The
//    reasoning lives in the methodology and the changelog, where a reader who
//    wants it will go looking. Here, we simply state what is true.
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

export default function MarketScale({
  market,
  peClinics,
}: {
  market: Market;
  // The published PE clinic total (all sources). Passed in rather than hardcoded,
  // because this component's whole job is to reconcile it against the registry
  // figure, and a bridge between two numbers is worthless if one of them can go
  // stale.
  peClinics: number;
}) {
  const { denominator: d, numerator: n, share: s, size_distribution: dist, states } = market;

  const singleSite = dist[0];
  const maxDistSites = Math.max(...dist.map((b) => b.sites));
  const topStates = states.slice(0, 8);
  const maxStateShare = Math.max(...topStates.map((r) => r.private_equity_share));

  return (
    <figure className="folder m-0 px-5 py-6 sm:px-7 sm:py-7">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <Field value={fmtNum(d.aba_organizations)} label="ABA providers in the U.S." />
        <Field value={fmtNum(d.aba_sites)} label="Locations they run" />
        <Field value={fmtNum(singleSite.operators)} label="Providers running one location" />
        <Field
          value={`${s.private_equity_of_all_sites}%`}
          label="Of all locations, private-equity held"
        />
      </div>

      {/* The bridge. The reader has just been told 1,398; they are about to see
          754. Say why, plainly, before showing them anything else. */}
      <p className="mt-6 max-w-3xl border-l-2 border-pen/30 pl-4 text-[0.85rem] leading-relaxed text-ink-muted">
        <strong className="font-semibold text-ink/85">
          Why {fmtNum(n.private_equity_sites)} here, and {fmtNum(peClinics)} on the
          front page.
        </strong>{" "}
        The registry lists {fmtNum(n.private_equity_sites)} of the{" "}
        {fmtNum(peClinics)} private-equity clinics we trace. The other{" "}
        {fmtNum(peClinics - n.private_equity_sites)} come from owners&apos; own
        published directories, which the registry does not carry. A percentage is
        only honest if both of its halves are drawn from the same place, so every
        figure on this page counts what the registry can see and nothing else.
      </p>

      {/* The shape of the market. */}
      <div className="mt-8">
        <div className="label-mono mb-1">The shape of the market</div>
        <p className="mb-4 max-w-2xl text-[0.85rem] leading-relaxed text-ink-muted">
          American autism therapy is not a corporate industry with a few
          independents left over. It is the reverse.
        </p>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-rule">
              <th className="label-mono pb-1.5 font-normal">Locations per provider</th>
              <th className="label-mono pb-1.5 text-right font-normal">Providers</th>
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
          {fmtNum(singleSite.operators)} of the country&apos;s{" "}
          {fmtNum(d.aba_organizations)} ABA providers run exactly one location.
          Fourteen run twenty-five or more. A very long tail, and a very short
          head.
        </p>
      </div>

      {/* Where private equity actually is. A state is a market; the country is not. */}
      <div className="mt-9 border-t border-rule pt-6">
        <div className="label-mono mb-1">Where private equity is concentrated</div>
        <p className="mb-4 max-w-2xl text-[0.85rem] leading-relaxed text-ink-muted">
          A national average hides what a family actually faces, because nobody
          chooses between a clinic in Denver and one in Tampa. Care is bought
          locally, so this is the number that matters: private equity&apos;s share
          of every ABA location in the state.
        </p>
        <ol className="space-y-2.5">
          {topStates.map((r) => (
            <li key={r.state} className="grid grid-cols-[2rem_1fr] items-center gap-3">
              <span className="font-mono text-sm font-semibold tabular-nums">
                {r.state}
              </span>
              <div className="flex items-center gap-3">
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
        Source: the federal provider registry, the same one the clinics come from.
        The numerator and the denominator are counted in a single pass with one
        address key, so a location can never be counted on one side of a share and
        missed on the other.
      </figcaption>
    </figure>
  );
}
