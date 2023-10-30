import "./src/utils/validate-process-env.mjs";

//matching tailwind sizes:
//                       sm   md    lg    xl    2xl   3xl...
const DEVICE_SIZES = [640, 768, 1024, 1280, 1536, 2048];
//  w-               6   8   12  16  24  32   64   96
const IMAGE_SIZES = [24, 32, 48, 64, 96, 128, 256, 384];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: IMAGE_SIZES,
    deviceSizes: DEVICE_SIZES,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/some-bucket-name-with-images/**",
      },
    ],
  },
  experimental: {
    logging: {
      level: "verbose",
    },
  },
};

export default nextConfig;
