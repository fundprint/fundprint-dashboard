import { hostname } from "@/lib/format";

// "How we know this" is a first-class element, never fine print
// (docs/copy-and-claims.md). A claim with no reachable source is not rendered
// by its caller; this component renders the sources that make it defensible.
export default function Provenance({ sources }: { sources: string[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-2 font-mono text-[0.7rem] text-ink-muted">
      <span className="text-pe">How we know this: </span>
      {sources.map((url, i) => (
        <span key={url}>
          {i > 0 && <span className="text-ink/25"> · </span>}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-ink/25 underline-offset-2 hover:decoration-pe hover:text-pe"
          >
            {hostname(url)}
          </a>
        </span>
      ))}
    </div>
  );
}
