/** @type {import('next').NextConfig} */
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
    images: {
        domains: [
            "i0.wp.com",
            "www.shutterstock.com",
            "assets.entrepreneur.com"
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default withPWA({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true,
    },
    headers: [
        {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
        },
    ]
})(nextConfig);