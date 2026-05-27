import type { NextConfig } from "next";
import {resolve} from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.56.1", "localhost"],
  turbopack: {
    root: resolve(process.cwd(), "../.."),
  },
};

export default nextConfig;