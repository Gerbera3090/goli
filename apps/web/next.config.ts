import type { NextConfig } from "next";

import { getPublicOrigins } from "./lib/public-origins";

const apiOrigin = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";

getPublicOrigins();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  transpilePackages: ["@gori/contracts"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
