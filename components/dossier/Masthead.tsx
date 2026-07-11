import Link from "next/link";

const NAV = [
  { href: "/findings/", label: "Investigation" },
  { href: "/process/", label: "The Machine" },
  { href: "/map/", label: "Map" },
  { href: "/acquirers/", label: "Owners" },
  { href: "/about/", label: "About" },
];

// The site header, dressed as the cover of a case file: a mono metadata strip
// over a serif wordmark and the section index.
export default function Masthead() {
  return (
    <header className="border-b border-ink/15 bg-paper/85 backdrop-blur">
      <div className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-1.5">
          <span className="label-mono">
            Case No. FP&middot;2026 &nbsp;/&nbsp; Jurisdiction: United States
          </span>
          <span className="label-mono">
            Status: <span className="text-stamp">Ongoing</span>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-6 gap-y-3 px-5 py-3">
        <Link href="/" className="group leading-none">
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Fundprint<span className="text-pe">.</span>
          </span>
          <span className="mt-1 block font-mono text-[0.66rem] uppercase tracking-[0.22em] text-ink-muted">
            Who funds your therapist
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[0.82rem] text-ink/75">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-transparent pb-0.5 hover:border-pe hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
