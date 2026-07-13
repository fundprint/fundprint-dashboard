import type { ReactNode } from "react";
import { Paperclip } from "./Props";

// A lettered evidence panel. Exhibits are a real sequence in a case file, so the
// lettering carries meaning. Fraunces title, small-caps kicker, a ruled header,
// a paperclip on the corner for the physical file feel.
export default function Exhibit({
  mark,
  title,
  kicker,
  aside,
  children,
  className = "",
  id,
}: {
  mark: string;
  title: string;
  kicker?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    // scroll-mt keeps the exhibit header clear of the sticky nav when linked to.
    <section id={id} className={`relative scroll-mt-24 ${className}`}>
      <Paperclip className="absolute -top-6 left-2 z-10 text-ink/35" />
      <div className="flex items-end gap-4 border-b border-ink/25 pb-2.5">
        <span className="font-display text-3xl font-semibold leading-none text-pe">
          {mark}
        </span>
        <div className="min-w-0 flex-1">
          <div className="label-mono">Exhibit{kicker ? ` / ${kicker}` : ""}</div>
          <h2 className="headline mt-0.5 text-2xl leading-tight sm:text-[1.7rem]">
            {title}
          </h2>
        </div>
        {aside ? <div className="shrink-0 self-end pb-1">{aside}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
