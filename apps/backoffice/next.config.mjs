import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  eslint: {
    dirs: ['app', 'components', 'data', 'lib']
  },
  output: 'standalone',
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react: require.resolve('react'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react-dom': require.resolve('react-dom'),
      'styled-jsx': require.resolve('styled-jsx')
    };
    return config;
  }
};

export default nextConfig;
