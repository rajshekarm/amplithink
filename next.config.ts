import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://192.168.5.66:3000",
    "http://localhost:3000",
  ],
  
  /* config options here */
};

export default nextConfig;
