import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for development with dynamic routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
