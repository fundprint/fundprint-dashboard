import Link from "next/link";
import { fmtNum } from "@/lib/format";
import { FIRM_TYPE_COLOR, FIRM_TYPE_LABEL, type Acquirer } from "@/lib/types";

// The ownership concentration as a ruled ledger of bars, not a spreadsheet.
// Bar length is clinics tracked; color is owner type (the legend learned once).
export default function Concentration({
  acquirers,
  limit = 8,
}: {
  acquirers: Acquirer[];
  limit?: number;
}) {
  const rows = [...acquirers]
    .filter((a) => a.clinic_count > 0)
    .sort((a, b) => b.clinic_count - a.clinic_count)
    .slice(0, limit);
  const max = Math.max(1, ...rows.map((a) => a.clinic_count));

  return (
    <div>
      <ol className="space-y-3">
        {rows.map((a, i) => {
          const color = FIRM_TYPE_COLOR[a.firm_type];
          const pct = (a.clinic_count / max) * 100;
          return (
            <li key={a.id} className="grid grid-cols-[1.6rem_1fr] items-center gap-3">
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/acquirers/${a.id}/`}
                    className="font-serif text-[1.05rem] font-medium hover:text-pe"
                  >
                    {a.name}
                  </Link>
                  <span className="font-mono text-sm tabular-nums text-ink/80">
                    {fmtNum(a.clinic_count)}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-sm bg-manila/70">
                  <div
                    className="h-2 rounded-sm"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                    aria-hidden
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Legend: the owner-type key, stated once. */}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-3">
        {(Object.keys(FIRM_TYPE_LABEL) as (keyof typeof FIRM_TYPE_LABEL)[]).map(
          (t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-ink-muted"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: FIRM_TYPE_COLOR[t] }}
              />
              {FIRM_TYPE_LABEL[t]}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
