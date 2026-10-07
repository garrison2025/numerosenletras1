# Numerosenletras.org — SEO/GEO release evidence

Date: 2026-10-07. Scope: input correctness, selected regional number format, precision guards, accessibility, crawl-output CI and project design/SEO governance.

## Verified in code / GitHub CI
- Branch: main (GitHub Actions).
- Existing canonical origin and static build preserved: https://numerosenletras.org
- Shared strict parser for LA/ES, 15 integer digits, maximum 12 general decimals / 2 currency decimals.
- Regression tests for invalid grouping, precision and scientific notation.
- New post-build deterministic SEO/route audit is included in CI and must be green before claiming release success.
- Existing approved titles, domain, route slugs, main keywords and financial country pages preserved.

## Verification not supplied by CI
- Mobile and desktop visual pass at specific breakpoints: PENDING manual browser QA.
- Clipboard, speech and cheque-print UX: PENDING browser QA.
- Production content sync: VERIFIED on 2026-10-07 for homepage, /como-se-escribe/ and /cantidad-con-letra/; latest functional parser/copy changes were visible on the public site.
- Production HTTP redirects and real 404 behavior beyond sampled routes: PENDING.
- Lighthouse / CrUX LCP, CLS and INP measurements: PENDING.
- GSC impressions/clicks/coverage by URL, query and country: PENDING (no account data asserted).
- Advertising policy status / AdSense approval: NOT EVALUATED. Existing ads.txt is a template and must not be called configured for an actual publisher without that site's account ID.
- Official local banking / law citation recency verification: PENDING editorial check.

## Owner release gate
CI success is necessary, not sufficient. Do not label this as a fully validated production release until the pending browser, live-URL and data checks are recorded. No fabricated SEO numbers or official endorsements.

- Deployment diagnosis: GitHub `main` and CI are healthy; public pages later reflected the submitted changes, confirming the Git-to-production path is active. A build fingerprint mechanism was added in commit `af5549a8` to expose the deployed revision as `/build-version.txt` on subsequent builds.
