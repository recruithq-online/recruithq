import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match v3: use the compiler API when CLI subprocess output is unavailable.
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
