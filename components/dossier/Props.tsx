// Small investigative props drawn inline (no external assets). Decorative, so
// each is aria-hidden.

export function Magnifier({
  className = "",
  size = 96,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
    >
      <circle cx="42" cy="42" r="28" strokeWidth="3" />
      <circle cx="42" cy="42" r="28" strokeWidth="1" opacity="0.4" fill="rgba(138,31,28,0.05)" />
      <line x1="62" y1="62" x2="90" y2="90" strokeWidth="6" strokeLinecap="round" />
      <line x1="42" y1="26" x2="42" y2="34" strokeWidth="2" opacity="0.5" />
      <line x1="26" y1="42" x2="34" y2="42" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

export function Paperclip({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 90"
      width={26}
      height={58}
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M28 20 v42 a10 10 0 0 1 -20 0 v-46 a7 7 0 0 1 14 0 v42 a4 4 0 0 1 -8 0 v-38" />
    </svg>
  );
}
