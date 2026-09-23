// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkReadingTime } from './remark-reading-time.mjs';

export default defineConfig({
  site: 'https://tiennguyentt.github.io',
  base: '/',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-light',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
