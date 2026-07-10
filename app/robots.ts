import type { MetadataRoute } from "next";

// Required so the route prerenders to a static file under output: "export".
export const dynamic = "force-static";

// This is a public-records resource meant to be found. Allow everything and
// point crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://whofundsmytherapist.com/sitemap.xml",
  };
}
