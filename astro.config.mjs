import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://numerosenletras.org',
  integrations: [react()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
