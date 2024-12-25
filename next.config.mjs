/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trekn-miniapp.s3.ap-southeast-1.amazonaws.com",
        pathname: "/be/trekn-miniapp/**",
      },
      {
        protocol: "https",
        hostname: "amaranth-patient-caribou-396.mypinata.cloud",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/icons/**",
      }
    ],
  },
};

export default nextConfig;
