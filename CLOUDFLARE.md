# Cloudflare Pages deployment — numerosenletras.org

This site is a static Astro build. The intended production source is GitHub repository `garrison2025/numerosenletras1`, branch `main`.

## Required Pages settings

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `bun run build` |
| Build output directory | `dist` |
| Root directory | repository root |
| Node.js | 22 |
| Runtime secrets | none required for the converter |

Do not configure the old AI Studio / Gemini environment variables. This repository does not use them.

## Deployment verification

Every build writes the source commit SHA to:

`https://numerosenletras.org/build-version.txt`

Cloudflare Pages supplies `CF_PAGES_COMMIT_SHA`; GitHub Actions supplies `GITHUB_SHA`. The build script records whichever is available. This lets us distinguish a stale production deployment from browser/search cache.

After a production deployment:
1. Open `/build-version.txt`.
2. Compare it with the current `main` commit SHA.
3. Open `/` and `/como-se-escribe/` and verify the new copy/behavior.
4. Confirm `/robots.txt`, `/sitemap-index.xml`, and the compatibility URL `/sitemap.xml` return XML successfully.
5. Only then mark the release as deployed.

## If production stays on an old revision

In Cloudflare Dashboard → Workers & Pages → the Pages project:
- confirm Git integration points to `garrison2025/numerosenletras1`;
- confirm Production branch is `main`;
- inspect the latest deployment and its commit SHA;
- confirm the build command/output values above;
- retry the failed deployment or reconnect Git integration if commits are not triggering builds.

A green GitHub Actions run proves the repository builds; it does not prove Cloudflare published that commit.


## Sitemap compatibility

Astro's canonical sitemap URL is `/sitemap-index.xml`. Google Search Console previously had `/sitemap.xml` submitted, and that URL could resolve to an HTML fallback on the deployed site. The post-build finalizer now copies the generated sitemap index to `/sitemap.xml` as well.

- Canonical advertised sitemap: `https://numerosenletras.org/sitemap-index.xml`
- Legacy GSC-compatible alias: `https://numerosenletras.org/sitemap.xml`

Both URLs must return XML. The CI release gate rejects the build if either sitemap is missing or contains HTML.
