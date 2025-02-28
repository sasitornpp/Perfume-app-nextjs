/** @type {import('next').NextConfig} */

export default {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lalzmarjvjsqavjsuiux.supabase.co",
                pathname: "/storage/v1/object/public/IMAGES/**",
            },
            {
                protocol: "https",
                hostname: "fimgs.net",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                pathname: "/**",
            }
        ],
    },
};
