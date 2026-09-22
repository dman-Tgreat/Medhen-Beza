import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use standalone output for Docker containers; let Vercel handle serverless functions natively
  ...(process.env.BUILD_STANDALONE === "true" || (!process.env.VERCEL && process.env.NODE_ENV === "production" && process.env.DOCKER_BUILD === "true")
    ? { output: "standalone" }
    : {}),
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
