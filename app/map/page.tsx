import type { Metadata } from "next";
import StateHeatmap from "@/components/StateHeatmap";
import { snapshot } from "@/lib/data";

export const metadata: Metadata = {
  title: "Map | Fundprint",
  description:
    "PE and institution-owned ABA / autism clinics by U.S. state. Coverage, not census.",
};

export default function MapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Clinics by state
      </h1>
      <p className="mt-2 max-w-2xl text-black/70">
        Financial-owner-linked ABA / autism clinics we have tracked, by state.
        This is <span className="font-medium">coverage</span>, not a census: a
        darker state means we have resolved more clinics there, not necessarily
        that it has more PE ownership. States we have not yet ingested look
        empty; that is a gap in our data, not evidence of independence.
      </p>
      <div className="mt-6">
        <StateHeatmap states={snapshot.states} />
      </div>
    </div>
  );
}
