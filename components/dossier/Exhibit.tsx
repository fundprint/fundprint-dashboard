import type { ReactNode } from "react";
import { Paperclip } from "./Props";

// A numbered evidence panel. Every major block on the site is an "Exhibit",
// tabbed and lettered, so the whole platform reads as one case file. A paperclip
// hangs off the top corner for texture.
export default function Exhibit({
  mark,
  title,
  kicker,
  aside,
  children,
  className = "",
}: {
  mark: string;
  title: string;
  kicker?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative ${className}`}>
      <Paperclip className="absolute -top-4 left-1/2 -translate-x-1/2 text-ink/40" />
      <div className="flex items-end gap-3 border-b-2 border-ink/25 pb-2">
        <span className="inline-flex items-baseline gap-1.5">
          <span className="label-mono">Exhibit</span>
          <span className="font-mono text-lg font-bold leading-none text-pe">
            {mark}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          {kicker ? <div className="label-mono mb-0.5">{kicker}</div> : null}
          <h2 className="headline text-xl leading-tight sm:text-2xl">{title}</h2>
        </div>
        {aside ? <div className="shrink-0 self-start pt-1">{aside}</div> : null}
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}
