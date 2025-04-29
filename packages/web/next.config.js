import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import nextMDX from '@next/mdx';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { remarkTableOfContents } from 'remark-table-of-contents';

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: 'ayu-dark'
};

/** @type {import('remark-table-of-contents').IRemarkTableOfContentsOptions} */
const remarkTableOfContentsOptions = {
  containerAttributes: {
    id: 'articleToc'
  },
  navAttributes: {
    'aria-label': 'table of contents'
  },
  maxDepth: 3
};

const withMDX = nextMDX({
  extension: /\.(md|mdx)?$/,
  options: {
    rehypePlugins: [
      rehypeMdxImportMedia,
      rehypeSlug,
      [rehypePrettyCode, rehypePrettyCodeOptions]
    ],
    remarkPlugins: [[remarkTableOfContents, remarkTableOfContentsOptions]]
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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // file formats for next/image
    formats: ['image/avif', 'image/webp']
  }
};

export default withMDX(nextConfig);
