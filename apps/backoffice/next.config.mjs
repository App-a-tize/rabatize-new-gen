/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  eslint: {
    dirs: ['app', 'components', 'data', 'lib']
  },
  output: 'standalone'
};

export default nextConfig;
