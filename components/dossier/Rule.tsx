// A hairline divider. With a label it becomes a ruled section break carrying a
// small mono caption centered on the line.
export default function Rule({ label }: { label?: string }) {
  if (!label) return <hr className="rule my-8" />;
  return (
    <div className="my-8 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-rule" />
      <span className="label-mono">{label}</span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
