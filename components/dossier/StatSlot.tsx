// A single figure in the case, rendered as a filing field. `pending` slots are
// ones we have not yet earned the number for (coverage denominator,
// verification rate); we show them honestly as in-progress rather than faking.
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
    <div className="folder px-4 py-3.5">
      <div className="label-mono flex items-center justify-between">
        <span>{label}</span>
        {pending ? (
          <span className="text-[0.6rem] text-pe/80">In progress</span>
        ) : null}
      </div>
      <div
        className={`mt-1.5 font-serif text-3xl font-semibold tabular-nums leading-none ${
          pending ? "text-ink/35" : accent ? "text-pe" : "text-ink"
        }`}
      >
        {value}
      </div>
      {note ? (
        <div className="mt-1.5 font-mono text-[0.68rem] leading-snug text-ink-muted">
          {note}
        </div>
      ) : null}
    </div>
  );
}
