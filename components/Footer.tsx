import { snapshot } from "@/lib/data";

// Every page carries the pinned dataset version and as-of date so any
// screenshot is self-provenancing (see docs/deployment.md).
export default function Footer() {
  const { dataset_version, generated_at, methodology_version } = snapshot.meta;
  const asOf = new Date(generated_at).toISOString().slice(0, 10);
  return (
    <footer className="mt-20 border-t border-black/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-black/60">
        <p className="max-w-3xl">
          Fundprint tracks who owns the clinics that serve autistic children. It
          takes no position on ABA as a therapy. Every ownership claim links to a
          public source; a clinic not shown as owned is a gap in our coverage,
          not a certification that it is independent.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
          <span>dataset {dataset_version}</span>
          <span>as of {asOf}</span>
          <span>methodology {methodology_version}</span>
          <a className="underline" href="/methodology/">
            methodology &amp; limits
          </a>
        </div>
      </div>
    </footer>
  );
}
