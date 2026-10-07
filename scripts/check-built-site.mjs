/**
 * Deterministic built-HTML check, independent of paid SEO services.
 * Run after "astro build"; does not claim production crawl/index status.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const origin = 'https://numerosenletras.org';
const routes = [
  '/',
  '/cantidad-con-letra/',
  '/cantidad-con-letra/mexico/',
  '/cantidad-con-letra/colombia/',
  '/cantidad-con-letra/peru/',
  '/cantidad-con-letra/argentina/',
  '/cantidad-con-letra/espana/',
  '/numeros/',
  '/como-se-escribe/',
  '/letras-aesthetic/',
  '/letras-burbuja/',
  '/fuentes-y-metodologia/',
  '/blog/',
  '/blog/guia-convertir-numeros-a-letras-rae-finanzas/',
  '/blog/arte-letras-burbuja-tipografia-circular-copiar-pegar/',
  '/blog/letras-aesthetic-fuentes-pequenas-instagram-tiktok/',
  '/sobre-nosotros/',
  '/contacto/',
  '/privacidad/',
  '/terminos/'
];
const issues = [];
const htmlFor = route => join(dist, route.slice(1), 'index.html');
for (const route of routes) {
  const path = htmlFor(route);
  if (!existsSync(path)) {
    issues.push(`Missing route: ${route}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  const canonical = `<link rel="canonical" href="${origin}${route}"`;
  if (!html.includes(canonical)) issues.push(`Wrong/missing canonical: ${route}`);
  if (!/<title>[^<]+<\/title>/.test(html)) issues.push(`Missing title: ${route}`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) issues.push(`Missing description: ${route}`);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) issues.push(`Expected 1 H1, got ${h1Count}: ${route}`);
  if (!html.includes('application/ld+json')) issues.push(`Missing structured-data script: ${route}`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["'](\/[^"'#]*)["']/gi)) {
    const href = match[1].split('?')[0] || '/';
    const linkRoute = href.endsWith('/') ? href : href + '/';
    if (href.includes('..')) { issues.push(`Unsafe local link on ${route}: ${href}`); continue; }
    const target = htmlFor(linkRoute);
    const staticAsset = join(dist, href.slice(1));
    if (!existsSync(target) && !existsSync(staticAsset)) {
      issues.push(`Broken local link on ${route}: ${href}`);
    }
  }
}
if (!existsSync(join(dist, 'robots.txt'))) issues.push('Missing robots.txt');
if (!existsSync(join(dist, 'sitemap-index.xml'))) issues.push('Missing sitemap-index.xml');
if (!existsSync(join(dist, 'llms.txt'))) issues.push('Missing llms.txt');
if (issues.length) {
  console.error(issues.map(line => '- '+line).join('\n'));
  process.exit(1);
}
console.log(`PASS: ${routes.length} canonical HTML routes, metadata, H1, structured data, local links and static crawl files.`);
