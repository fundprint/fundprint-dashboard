/** @type {import('next').NextConfig} */
const nextConfig = {
  // The dashboard is a pinned static snapshot: no server, no database at
  // runtime. `export` emits a fully static site deployable to Vercel (or any
  // static host) with zero server-side code. See docs/deployment.md.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
