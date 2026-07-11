import type { ReactNode } from "react";

// The header block at the top of a section/page: a mono eyebrow, a serif
// title, and an optional standfirst. Keeps every page opening consistent.
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
      <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">
        {title}
      </h1>
      {lede ? (
        <p className="mt-4 font-serif text-lg leading-relaxed text-ink/80">
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  );
}
