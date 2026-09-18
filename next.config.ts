import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* One address: www redirects to the bare domain, permanently. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.initconsulting.no" }],
        destination: "https://initconsulting.no/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
