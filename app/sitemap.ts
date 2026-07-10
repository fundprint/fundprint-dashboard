import type { MetadataRoute } from "next";
import { snapshot } from "@/lib/data";

// Required so the route prerenders to a static file under output: "export".
export const dynamic = "force-static";

const SITE_URL = "https://whofundsmytherapist.com";

// Enumerated at build time from the same snapshot the pages render, so the
// sitemap can never drift from what actually ships. Trailing slashes match
// next.config.mjs (trailingSlash: true).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = snapshot.meta?.generated_at
    ? new Date(snapshot.meta.generated_at)
    : new Date();

  const staticRoutes = ["/", "/acquirers/", "/map/", "/methodology/"];

  const acquirerRoutes = snapshot.acquirers.map(
    (a) => `/acquirers/${a.id}/`,
  );

  return [...staticRoutes, ...acquirerRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
