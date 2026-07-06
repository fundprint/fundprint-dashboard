import Provenance from "./Provenance";
import type { TimelineEvent } from "@/lib/types";

// Plots only acquisition_event rows the dataset actually asserts, each with its
// own source. The geometry shows a dated sequence; it never editorializes cause
// (docs/visualization.md) - the notes state sourced facts, not blame. If the
// dataset publishes no dated events yet, we say so plainly.

const EVENT_LABEL: Record<string, string> = {
  acquisition: "Acquired",
  divestiture: "Divested",
  bankruptcy: "Bankruptcy",
  recapitalization: "Recapitalized",
  merger: "Merger",
};

function year(date: string | null, circa: boolean): string {
  if (!date) return "";
  const y = date.slice(0, 4);
  return circa ? `~${y}` : y;
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-black/15 bg-white/50 p-5 text-sm text-black/60">
        We don&apos;t yet publish dated acquisition events for this owner. Where
        ownership is current it is sourced per clinic (see the chain above);
        dated deal timelines appear here only once the underlying dates are in
        the dataset with their sources.
      </div>
    );
  }

  const ordered = [...events].sort((a, b) =>
    (a.date ?? "").localeCompare(b.date ?? ""),
  );

  return (
    <ol className="relative ml-1 border-l border-black/15 pl-6">
      {ordered.map((e) => (
        <li key={e.id} className="mb-6">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-pe" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums">
              {year(e.date, e.date_circa)}
            </span>
            {e.event_type && (
              <span className="rounded bg-pe/10 px-1.5 py-0.5 text-xs font-medium text-pe">
                {EVENT_LABEL[e.event_type] ?? e.event_type}
              </span>
            )}
            {e.brand_name && (
              <span className="text-sm text-black/60">{e.brand_name}</span>
            )}
          </div>
          {e.notes && (
            <p className="mt-1 text-sm leading-relaxed text-black/80">
              {e.notes}
            </p>
          )}
          <Provenance sources={e.sources} />
        </li>
      ))}
    </ol>
  );
}
