/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|fbx)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;