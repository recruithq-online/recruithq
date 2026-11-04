import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the compiler API: this environment drops captured CLI child output.
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
