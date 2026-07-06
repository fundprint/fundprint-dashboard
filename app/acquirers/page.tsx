import type { Metadata } from "next";
import AcquirerTable from "@/components/AcquirerTable";
import { snapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "Acquirers | Fundprint",
  description:
    "Every financial owner tracked in the Fundprint dataset, by number of U.S. ABA / autism clinics.",
};

export default function AcquirersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Acquirers</h1>
      <p className="mt-2 max-w-2xl text-black/70">
        Every financial owner we have linked to at least one clinic, ranked by
        clinics tracked. Click an owner to see its brands, its clinics, and the
        source behind each ownership claim. Counts are coverage in our public
        dataset, not a census of every clinic an owner operates.
      </p>
      <div className="mt-6">
        <AcquirerTable acquirers={snapshot.acquirers} />
      </div>
    </div>
  );
}
