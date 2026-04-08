import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/enrichment-demo",
  assetPrefix: "/enrichment-demo",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/enrichment-demo",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
