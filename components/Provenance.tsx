import { hostname } from "@/lib/format";

// "How we know this" is a first-class element, never fine print
// (docs/copy-and-claims.md). A claim with no reachable source is not rendered
// by its caller; this component renders the sources that make it defensible.
export default function Provenance({ sources }: { sources: string[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-2 text-xs text-black/60">
      <span className="font-medium text-black/70">How we know this: </span>
      {sources.map((url, i) => (
        <span key={url}>
          {i > 0 && <span className="text-black/30"> · </span>}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-black/30 underline-offset-2 hover:decoration-black"
          >
            {hostname(url)}
          </a>
        </span>
      ))}
    </div>
  );
}
