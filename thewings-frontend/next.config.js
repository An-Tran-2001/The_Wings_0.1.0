/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... rest of the configuration.
      output: 'standalone',
      images: {
        remotePatterns: [{
          protocol: "https",
          hostname: "th.bing.com"
        }]
      }
}

module.exports = nextConfig
