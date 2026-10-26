import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // exceljs + archiver must stay outside the bundle (node runtime API routes)
  serverExternalPackages: ["exceljs", "archiver"],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
