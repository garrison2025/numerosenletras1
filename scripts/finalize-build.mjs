import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const canonicalIndex = resolve(dist, 'sitemap-index.xml');
const legacySitemap = resolve(dist, 'sitemap.xml');

if (!existsSync(canonicalIndex)) {
  throw new Error('Astro did not generate dist/sitemap-index.xml');
}

const xml = readFileSync(canonicalIndex, 'utf8').trim();
if (!xml.startsWith('<?xml') || !xml.includes('<sitemapindex')) {
  throw new Error('dist/sitemap-index.xml is not a valid sitemap index');
}

// Keep the historical GSC URL valid while robots.txt continues to advertise
// the canonical Astro sitemap index.
copyFileSync(canonicalIndex, legacySitemap);
console.log('Created legacy sitemap alias: dist/sitemap.xml -> sitemap-index.xml');
