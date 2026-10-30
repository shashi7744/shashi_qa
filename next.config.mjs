/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // The old Vercel address sends visitors and Google to the real domain, so there is only one site to rank
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "shashiqa.vercel.app" }],
        destination: "https://www.shashistudio.online/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
