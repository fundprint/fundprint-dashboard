import type { ReactNode } from "react";

// A numbered evidence panel. Every major block on the site is an "Exhibit",
// tabbed and lettered, so the whole platform reads as one case file.
export default function Exhibit({
  mark,
  title,
  kicker,
  aside,
  children,
  className = "",
}: {
  mark: string; // "A", "B", "C" ...
  title: string;
  kicker?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative ${className}`}>
      <div className="flex items-end gap-3 border-b border-ink/20 pb-2">
        <span className="inline-flex items-baseline gap-2">
          <span className="label-mono text-ink-muted">Exhibit</span>
          <span className="font-mono text-lg font-bold leading-none text-pe">
            {mark}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          {kicker ? (
            <div className="label-mono mb-0.5">{kicker}</div>
          ) : null}
          <h2 className="font-serif text-xl font-semibold leading-tight sm:text-2xl">
            {title}
          </h2>
        </div>
        {aside ? <div className="shrink-0 self-start pt-1">{aside}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
