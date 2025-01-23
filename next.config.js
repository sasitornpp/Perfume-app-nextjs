/** @type {import('next').NextConfig} */

export default {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lalzmarjvjsqavjsuiux.supabase.co",
        pathname: "/storage/v1/object/public/IMAGES/**",
      }
    ],
  },
};
