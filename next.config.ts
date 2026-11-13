import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "yottabuilder.ai", pathname: "/wp-content/uploads/**" }],
  },
  experimental: { optimizePackageImports: ["lucide-react", "motion"] },
  async redirects() {
    return [
      // Legacy WordPress URLs
      { source: "/careers-2", destination: "/careers", permanent: true },
      { source: "/careers-2/page/:n", destination: "/careers", permanent: true },
      { source: "/blog/page/:n", destination: "/blog", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
