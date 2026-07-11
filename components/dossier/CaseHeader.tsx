import type { ReactNode } from "react";

// The header block at the top of a section/page: a typewriter eyebrow, a
// condensed report title, and an optional standfirst.
export default function CaseHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <div className="label-mono flex items-center gap-2">
        <span className="inline-block h-2 w-2 bg-pe" aria-hidden />
        {eyebrow}
      </div>
      <h1 className="headline mt-2 text-[2.4rem] leading-[0.98] sm:text-5xl">
        {title}
      </h1>
      {lede ? (
        <p className="mt-3 font-serif text-[1.05rem] leading-relaxed text-ink/85">
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  );
}
