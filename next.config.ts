import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows parallel dev servers (e.g. `dev` and `dev:test`) by isolating lock/log files.
  // Default remains `.next` unless overridden.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
