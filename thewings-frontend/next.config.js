/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... rest of the configuration.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
};

module.exports = nextConfig;
