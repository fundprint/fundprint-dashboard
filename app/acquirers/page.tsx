import type { Metadata } from "next";
import AcquirerTable from "@/components/AcquirerTable";
import CaseHeader from "@/components/dossier/CaseHeader";
import { snapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "Index of Subjects | Fundprint",
  description:
    "Every financial owner tracked in the Fundprint dataset, by number of U.S. ABA / autism clinics.",
};

export default function AcquirersPage() {
  return (
    <div>
      <CaseHeader
        eyebrow="The file / Index of Subjects"
        title="The owners"
        lede="Every financial owner we have linked to at least one clinic, ranked by clinics tracked. Open a subject to see its brands, its clinics, and the source behind each ownership claim. Counts are coverage in our public dataset, not a census."
      />
      <div className="mt-8">
        <AcquirerTable acquirers={snapshot.acquirers} />
      </div>
    </div>
  );
}
