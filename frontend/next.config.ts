import type { NextConfig } from "next";
import MillionLint from "@million/lint";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
        ],
        domains: [
            "firebasestorage.googleapis.com",
            "afam-directory.firebasestorage.app",
        ],
    },
};

export default MillionLint.next({ rsc: true })(nextConfig);
