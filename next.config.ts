import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/mcp": ["./vendor/agency-agents/**/*"],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: false },
      { source: "/home/pricing", destination: "/pricing", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
