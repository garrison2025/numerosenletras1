import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://numerosenletras.org',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap()
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
