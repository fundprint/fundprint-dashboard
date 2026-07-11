import type { ReactNode } from "react";

// The header block at the top of a section/page: a small-caps eyebrow set off by
// a short rule (not a colored square), a Fraunces title, and an optional lede.
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
      <div className="label-mono flex items-center gap-2.5">
        <span className="h-px w-6 bg-pe" aria-hidden />
        {eyebrow}
      </div>
      <h1 className="headline mt-3 text-[2.6rem] leading-[1.02] sm:text-[3.4rem]">
        {title}
      </h1>
      {lede ? (
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink/80">
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  );
}
