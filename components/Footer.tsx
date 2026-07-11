import Link from "next/link";
import { snapshot } from "@/lib/data";

const REPOS = [
  { label: "pipeline", href: "https://github.com/fundprint/fundprint-data" },
  { label: "dashboard", href: "https://github.com/fundprint/fundprint-dashboard" },
  { label: "methodology", href: "https://github.com/fundprint/fundprint-methodology" },
];

const SECTIONS = [
  { label: "Investigation", href: "/findings/" },
  { label: "The Machine", href: "/process/" },
  { label: "Map", href: "/map/" },
  { label: "Owners", href: "/acquirers/" },
  { label: "Sources", href: "/sources/" },
  { label: "Progress", href: "/progress/" },
  { label: "About", href: "/about/" },
];

// The colophon: a self-provenancing footer carrying the pinned dataset version
// and as-of date so any screenshot dates itself, plus the section index and the
// open-source repositories behind the work.
export default function Footer() {
  const { dataset_version, generated_at, methodology_version } = snapshot.meta;
  const asOf = new Date(generated_at).toISOString().slice(0, 10);
  return (
    <footer className="mt-24 border-t border-ink/15 bg-manila/40">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="font-serif text-lg font-semibold">
              Fundprint<span className="text-pe">.</span>
            </div>
            <p className="mt-2 max-w-md font-serif text-sm leading-relaxed text-ink/70">
              A public record of who owns the clinics that serve autistic
              children. It takes no position on ABA as a therapy. Every ownership
              claim links to a public source; a clinic not shown as owned is a
              gap in our coverage, not a certification that it is independent.
            </p>
            <p className="mt-3 font-mono text-xs text-ink-muted">
              Built and maintained by Atharva Doke.
            </p>
          </div>

          <nav aria-label="Sections">
            <div className="label-mono mb-2">The file</div>
            <ul className="space-y-1.5 font-mono text-sm text-ink/75">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-pe">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Source code">
            <div className="label-mono mb-2">Open source</div>
            <ul className="space-y-1.5 font-mono text-sm text-ink/75">
              {REPOS.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pe"
                  >
                    {r.label} &nearr;
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="rule my-6" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-ink-muted">
          <span>dataset {dataset_version}</span>
          <span>as of {asOf}</span>
          <span>methodology {methodology_version}</span>
          <Link className="text-pe hover:underline" href="/process/">
            methodology &amp; limits
          </Link>
        </div>
      </div>
    </footer>
  );
}
