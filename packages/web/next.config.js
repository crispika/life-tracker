const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)?$/,
  options: {
    // providerImportSource: '@life-tracker/web/mdx-component'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
};

module.exports = withMDX(nextConfig);
