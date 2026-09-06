import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Emits chapter/index.html rather than chapter.html, so the route resolves on
  // any static host, not just ones that guess the .html extension.
  trailingSlash: true,
};

export default nextConfig;
