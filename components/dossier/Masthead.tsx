import Link from "next/link";

const NAV = [
  { href: "/findings/", label: "Investigation" },
  { href: "/process/", label: "The Machine" },
  { href: "/map/", label: "Map" },
  { href: "/acquirers/", label: "Owners" },
  { href: "/about/", label: "About" },
];

// The site header. Solid (no backdrop blur, which repaints on every scroll
// frame), a thin case-metadata strip over a Fraunces wordmark and the index.
export default function Masthead() {
  return (
    <header className="relative z-10 border-b border-ink/20 bg-paper">
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-5 py-1">
          <span className="label-mono">
            Case No. FP&middot;2026 / Jurisdiction: United States
          </span>
          <span className="label-mono">
            Status: <span className="text-pe">Ongoing</span>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="leading-none">
          <span className="font-display text-2xl font-semibold tracking-tight">
            Fundprint<span className="text-pe">.</span>
          </span>
          <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Who funds your therapist
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8rem] font-medium uppercase tracking-wide text-ink/75">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b-2 border-transparent pb-0.5 hover:border-pe hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
