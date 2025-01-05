/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "profile.img.sooplive.co.kr",
      },
      {
        protocol: "https",
        hostname: "liveimg.sooplive.co.kr",
      },
    ],
  },
};

export default nextConfig;
