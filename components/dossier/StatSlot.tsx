// A single figure in the case, set as a filing field with a Fraunces numeral.
// `pending` slots are ones we have not yet earned the number for (coverage
// denominator, verification rate); shown honestly as in-progress, not faked.
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
    <div className="border-t-2 border-ink/80 pt-2.5">
      <div className="label-mono flex items-center justify-between">
        <span>{label}</span>
        {pending ? <span className="text-[0.58rem] text-pe">Pending</span> : null}
      </div>
      <div
        className={`mt-1 font-display text-[2.4rem] font-semibold leading-none tabular-nums ${
          pending ? "text-ink/30" : accent ? "text-pe" : "text-ink"
        }`}
      >
        {value}
      </div>
      {note ? (
        <div className="mt-1.5 text-[0.72rem] leading-snug text-ink-muted">{note}</div>
      ) : null}
    </div>
  );
}
