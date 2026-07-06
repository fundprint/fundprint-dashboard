import snapshotJson from "@/data/snapshot.json";
import type { Acquirer, Brand, Clinic, Snapshot } from "./types";

// The snapshot is bundled at build time (static import). There is no runtime
// fetch and no database connection - the whole point of the pinned-snapshot
// architecture (see docs/architecture.md, docs/deployment.md).
export const snapshot = snapshotJson as unknown as Snapshot;

export function getAcquirer(id: string): Acquirer | undefined {
  return snapshot.acquirers.find((a) => a.id === id);
}

export function getAcquirerByName(name: string): Acquirer | undefined {
  return snapshot.acquirers.find(
    (a) => a.name.toLowerCase() === name.toLowerCase(),
  );
}

export function clinicsForFirm(firmId: string): Clinic[] {
  return snapshot.clinics.filter((c) => c.firm_id === firmId);
}

export function brandsForFirm(firmId: string): Brand[] {
  return snapshot.brands.filter((b) => b.firm_id === firmId);
}

export function clinicsForBrand(ownerId: string): Clinic[] {
  return snapshot.clinics.filter((c) => c.owner_id === ownerId);
}
