import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    // @ts-ignore
    middlewareClientMaxBodySize: '50mb',
  },
};

export default nextConfig;
