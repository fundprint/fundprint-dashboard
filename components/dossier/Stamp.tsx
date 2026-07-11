// A pressed rubber-stamp mark, e.g. VERIFIED / SOURCED. Slight rotation makes
// it feel hand-applied. Purely decorative, so it is aria-hidden.
export default function Stamp({
  label,
  rotate = -6,
  className = "",
}: {
  label: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`stamp ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <span className="inline-block h-1 w-1 rounded-full bg-stamp/80" />
      {label}
    </span>
  );
}
