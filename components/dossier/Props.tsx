// Physical case-file props and evidence imagery, drawn inline as SVG (no
// external assets, self-contained for the static export). All decorative, so
// each is aria-hidden.

export function Paperclip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 96" width={22} height={53} className={className} aria-hidden
      fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M28 22 v46 a10 10 0 0 1 -20 0 v-50 a7 7 0 0 1 14 0 v46 a4 4 0 0 1 -8 0 v-42" />
    </svg>
  );
}

export function Pushpin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={24} height={24} className={className} aria-hidden>
      <circle cx="20" cy="16" r="11" fill="#b3241c" />
      <circle cx="16" cy="12" r="3.5" fill="#fff" opacity="0.6" />
      <rect x="18.5" y="24" width="3" height="13" rx="1.5" fill="#1b1c1a" />
    </svg>
  );
}

export function Tape({ className = "", w = 88 }: { className?: string; w?: number }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block ${className}`}
      style={{
        width: w,
        height: 26,
        background: "rgba(226,222,200,0.72)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.14)",
        mixBlendMode: "multiply",
      }}
    />
  );
}

// A folded-over document scrap with redaction bars: reads as a leaked filing.
export function RedactedDoc({ className = "", w = 150 }: { className?: string; w?: number }) {
  return (
    <svg viewBox="0 0 150 190" width={w} height={(w * 190) / 150} className={className} aria-hidden>
      <path d="M6 6 H126 L144 24 V184 H6 Z" fill="#f6f5ef" stroke="#bbbaa8" strokeWidth="1.5" />
      <path d="M126 6 V24 H144 Z" fill="#e4e2d4" stroke="#bbbaa8" strokeWidth="1.5" />
      <rect x="18" y="22" width="70" height="7" fill="#b3241c" opacity="0.85" />
      <g fill="#1b1c1a">
        <rect x="18" y="44" width="108" height="4" opacity="0.18" />
        <rect x="18" y="56" width="60" height="10" opacity="0.9" />
        <rect x="84" y="56" width="42" height="10" opacity="0.18" />
        <rect x="18" y="76" width="108" height="4" opacity="0.18" />
        <rect x="18" y="86" width="90" height="4" opacity="0.18" />
        <rect x="18" y="102" width="30" height="10" opacity="0.9" />
        <rect x="54" y="102" width="72" height="10" opacity="0.18" />
        <rect x="18" y="122" width="108" height="4" opacity="0.18" />
        <rect x="18" y="132" width="70" height="4" opacity="0.18" />
      </g>
      <g transform="translate(96 150) rotate(-8)">
        <rect x="0" y="0" width="44" height="16" rx="1" fill="none" stroke="#b3241c" strokeWidth="1.4" />
        <text x="22" y="11.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1" fill="#b3241c">FILED</text>
      </g>
    </svg>
  );
}

// A pinned instant photo: a duotone office tower (the money's address).
export function PhotoCard({ className = "", w = 150 }: { className?: string; w?: number }) {
  return (
    <svg viewBox="0 0 150 170" width={w} height={(w * 170) / 150} className={className} aria-hidden>
      <rect x="4" y="4" width="142" height="162" fill="#f6f5ef" stroke="#bbbaa8" strokeWidth="1.5" />
      <rect x="14" y="14" width="122" height="112" fill="#dcdbcf" />
      <g fill="#45525a">
        <rect x="34" y="40" width="34" height="86" />
        <rect x="72" y="26" width="40" height="100" />
      </g>
      <g fill="#f6f5ef" opacity="0.55">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 2 }).map((_, c) => (
            <rect key={`a${r}${c}`} x={40 + c * 12} y={48 + r * 14} width="6" height="8" />
          )),
        )}
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 2 }).map((_, c) => (
            <rect key={`b${r}${c}`} x={80 + c * 14} y={34 + r * 14} width="7" height="9" />
          )),
        )}
      </g>
      <text x="75" y="150" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="#565851" letterSpacing="1">CAPITAL, LP</text>
    </svg>
  );
}
