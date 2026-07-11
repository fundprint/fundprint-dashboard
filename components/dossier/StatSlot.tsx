// A single figure in the case, rendered as a typed filing field. `pending` slots
// are ones we have not yet earned the number for (coverage denominator,
// verification rate); shown honestly as in-progress rather than faked.
export default function StatSlot({
  value,
  label,
  note,
  accent = false,
  pending = false,
}: {
  value: string;
  label: string;
  note?: string;
  accent?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="relative border border-manila-edge bg-sheet px-3.5 py-3 shadow-sheet">
      <span className="absolute right-0 top-0 h-0 w-0 border-l-[14px] border-t-[14px] border-l-transparent border-t-manila-edge" aria-hidden />
      <div className="label-mono flex items-center justify-between">
        <span>{label}</span>
        {pending ? <span className="text-[0.58rem] text-pe">Pending</span> : null}
      </div>
      <div
        className={`mt-1 font-mono text-[2rem] font-bold tabular-nums leading-none ${
          pending ? "text-ink/30" : accent ? "text-pe" : "text-ink"
        }`}
      >
        {value}
      </div>
      {note ? (
        <div className="mt-1.5 font-mono text-[0.66rem] leading-snug text-ink-muted">
          {note}
        </div>
      ) : null}
    </div>
  );
}
