import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
        ],
        domains: ["firebasestorage.googleapis.com"],
    },
};

export default nextConfig;
