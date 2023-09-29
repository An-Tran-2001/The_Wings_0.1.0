/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... rest of the configuration.
      output: 'standalone',
      images: {
        remotePatterns: [{
          protocol: "https",
          hostname: "https://tbi.sb-cd.com/"
        }]
      }
}

module.exports = nextConfig
