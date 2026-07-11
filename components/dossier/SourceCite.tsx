// A footnote-style citation marker linking to a public source. Renders as a
// small superscript in mono, e.g. text[3]. External links open in a new tab.
export default function SourceCite({
  n,
  href,
  title,
}: {
  n: number;
  href: string;
  title?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title ?? "View the public source"}
      className="ml-0.5 align-super font-mono text-[0.62rem] font-semibold text-pe hover:underline"
    >
      [{n}]
    </a>
  );
}
