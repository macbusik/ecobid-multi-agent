import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // Creates /items/item-001/index.html instead of /items/item-001.html
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
