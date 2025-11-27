/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Three.js
  transpilePackages: ["three"],
  
  // Webpack configuration for Three.js
  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
