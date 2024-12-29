/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "profile.img.sooplive.co.kr",
      },
    ],
  },
};

export default nextConfig;
