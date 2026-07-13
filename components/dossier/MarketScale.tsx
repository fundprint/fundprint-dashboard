import { fmtNum } from "@/lib/format";
import type { Market } from "@/lib/types";

// The market drawn to scale. The claim this exhibit exists to make is that the
// numerator is a strict SUBSET of the denominator, and prose cannot show a
// subset -- it can only assert one. So: bar 1 is every ABA location in the
// country, with the chain-run part in slate. Bar 2 is that same slate slice,
// unfolded to full width. Its ground is therefore literally the same quantity,
// and the red that eats into it can only ever be a share of it.
//
// Every width here is a ratio of the snapshot's own counts. Nothing is set by
// hand, so a bar cannot drift away from the number printed beside it.

// Diagonal red pinstripe for the non-PE financial owners. It has to survive
// grayscale and colour-blindness, so the sub-band is separated by texture and
// not by hue alone: the difference between 23.2% and 28.1% is the difference
// between a true headline and a false one.
const HATCH =
  "repeating-linear-gradient(45deg, #b3241c 0 3px, rgba(179,36,28,0.26) 3px 7px)";
// The same stripe at swatch scale. The bar's 10px period across a small chip
// renders as one smeared diagonal that reads as a strike-through, not a hatch,
// so the key gets a tighter period over the same pale-red bed.
const HATCH_KEY_BED = "rgba(179,36,28,0.26)";
const HATCH_KEY =
  "repeating-linear-gradient(45deg, #b3241c 0 2px, transparent 2px 5px)";

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

function Key({
  swatch,
  name,
  count,
  pct,
}: {
  swatch: React.CSSProperties;
  name: string;
  count: number;
  pct: string;
}) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span
        className="mt-[0.3rem] h-3 w-5 shrink-0 rounded-[1px] ring-1 ring-inset ring-ink/20"
        style={swatch}
        aria-hidden
      />
      <div className="min-w-0">
        <div className="font-mono text-sm tabular-nums text-ink">
          {fmtNum(count)}{" "}
          <span className="text-ink-muted">({pct}%)</span>
        </div>
        <div className="text-[0.72rem] leading-snug text-ink-muted">{name}</div>
      </div>
    </div>
  );
}

export default function MarketScale({ market }: { market: Market }) {
  const { denominator: d, numerator: n, share: s, meta } = market;

  const chainPct = (d.chain_sites / d.aba_sites) * 100;
  const pePct = (n.private_equity_sites_within_chains / d.chain_sites) * 100;
  const otherFinancial =
    n.tracked_sites_within_chains - n.private_equity_sites_within_chains;
  const otherFinPct = (otherFinancial / d.chain_sites) * 100;
  const unheld = d.chain_sites - n.tracked_sites_within_chains;
  const unheldPct = (unheld / d.chain_sites) * 100;

  return (
    // On a filed sheet, not on the putty ground: manila (#d0cfbf) and the ground
    // (#d7d6c8) are four steps apart, so the independents band all but vanishes
    // against the desk. On sheet it reads.
    <figure className="folder m-0 px-5 py-6 sm:px-7 sm:py-7">
      {/* The measured fields, before any share is taken of them. */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <Field value={fmtNum(d.aba_organizations)} label="ABA provider organizations" />
        <Field value={fmtNum(d.aba_sites)} label="Locations they run" />
        <Field value={fmtNum(d.chains)} label={`Chains with ${meta.chain_min_sites}+ locations`} />
        <Field value={fmtNum(d.chain_sites)} label="Clinics those chains run" />
      </div>

      {/* Bar 1: the whole country, to scale. */}
      <div className="mt-9">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <span className="label-mono">Every ABA location in the U.S.</span>
          <span className="font-mono text-sm tabular-nums text-ink-muted">
            {fmtNum(d.aba_sites)}
          </span>
        </div>
        <div
          className="flex h-9 w-full overflow-hidden rounded-[2px] ring-1 ring-inset ring-ink/15"
          role="img"
          aria-label={`Of ${d.aba_sites} ABA locations in the United States, ${d.chain_sites} are run by chains and ${d.independent_sites} by independents and practices under ${meta.chain_min_sites} sites.`}
        >
          <div
            className="h-full bg-pen"
            style={{ width: `${chainPct}%` }}
          />
          <div className="h-full flex-1 bg-manila" />
        </div>
        <div className="mt-2 flex items-start justify-between gap-6">
          <div className="text-[0.78rem] leading-snug text-ink-muted">
            <span className="font-mono tabular-nums text-ink">
              {fmtNum(d.chain_sites)} ({chainPct.toFixed(1)}%)
            </span>{" "}
            chain-run
          </div>
          <div className="text-right text-[0.78rem] leading-snug text-ink-muted">
            <span className="font-mono tabular-nums text-ink">
              {fmtNum(d.independent_sites)} ({(100 - chainPct).toFixed(1)}%)
            </span>{" "}
            independents and practices under {meta.chain_min_sites} sites
          </div>
        </div>
      </div>

      {/* The unfold: the slate slice above widens into the whole bar below. This
          is the load-bearing bit of the graphic, so it is drawn, not implied. */}
      <div className="relative mt-1.5">
        <svg
          className="block h-16 w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon
            points={`0,0 ${chainPct},0 100,100 0,100`}
            fill="#45525a"
            fillOpacity="0.13"
          />
          {/* Both fold edges, dashed. Inset by a hair so the left one is not
              clipped in half by the viewBox edge. */}
          <line
            x1={chainPct}
            y1="0"
            x2="99.7"
            y2="100"
            stroke="#45525a"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="0.3"
            y1="0"
            x2="0.3"
            y2="100"
            stroke="#45525a"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="bg-sheet px-2 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-pen/70">
            that slice, unfolded
          </span>
        </span>
      </div>

      {/* Bar 2: that slice, unfolded. Its slate ground is the same quantity. */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <span className="label-mono text-ink">
            The chain-run clinics, up close
          </span>
          <span className="font-mono text-sm tabular-nums text-ink-muted">
            {fmtNum(d.chain_sites)}
          </span>
        </div>
        <div
          className="flex h-14 w-full overflow-hidden rounded-[2px] ring-1 ring-inset ring-ink/15"
          role="img"
          aria-label={`Of ${d.chain_sites} chain-run ABA clinics, ${n.private_equity_sites_within_chains} (${s.private_equity_of_chain_sites} percent) are held by private equity, a further ${otherFinancial} by a pension fund, family office or search fund, and ${unheld} have no financial owner we can name.`}
        >
          <div
            className="h-full border-r border-sheet/70 bg-pe"
            style={{ width: `${pePct}%` }}
          />
          <div
            className="h-full border-r border-sheet/70"
            style={{ width: `${otherFinPct}%`, backgroundImage: HATCH }}
          />
          <div className="h-full flex-1 bg-pen" />
        </div>

        {/* The brace: what the two red bands add up to, and what it is called. */}
        <div className="mt-1.5 flex" aria-hidden>
          <div
            className="shrink-0 border-l border-r border-t border-pe/50"
            style={{ width: `${pePct + otherFinPct}%`, height: "0.4rem" }}
          />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-4">
          <div className="text-[0.82rem] leading-snug">
            <span className="font-semibold text-pe">
              {s.tracked_of_chain_sites}% held by a financial owner
            </span>{" "}
            <span className="text-ink-muted">
              ({fmtNum(n.tracked_sites_within_chains)} clinics we can name and
              source)
            </span>
          </div>
        </div>
      </div>

      {/* The key. Read once, it disambiguates the two headline numbers. */}
      <div className="mt-6 grid gap-4 border-t border-rule pt-4 sm:grid-cols-3">
        <Key
          swatch={{ backgroundColor: "#b3241c" }}
          name="Private equity"
          count={n.private_equity_sites_within_chains}
          pct={s.private_equity_of_chain_sites.toFixed(1)}
        />
        <Key
          swatch={{ backgroundColor: HATCH_KEY_BED, backgroundImage: HATCH_KEY }}
          name="Pension fund, family office, search fund"
          count={otherFinancial}
          pct={otherFinPct.toFixed(1)}
        />
        <Key
          swatch={{ backgroundColor: "#45525a" }}
          name="Chain-run, no financial owner we can name"
          count={unheld}
          pct={unheldPct.toFixed(1)}
        />
      </div>

      <figcaption className="mt-4 text-[0.78rem] leading-relaxed text-ink-muted">
        Drawn to scale from the federal provider registry. The two red bands
        together are the {s.tracked_of_chain_sites}% figure; the solid red band
        alone is the {s.private_equity_of_chain_sites}% that private equity holds
        on its own. Measured instead against all{" "}
        {fmtNum(d.aba_sites)} ABA locations, including the independents, the same
        holdings are {s.tracked_of_all_sites}%.
      </figcaption>
    </figure>
  );
}
