import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ooscabbnrjxuqlzixpqa.supabase.co",
      },
    ],
  },
};

export default nextConfig;
