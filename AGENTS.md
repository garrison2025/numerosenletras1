# Numerosenletras.org implementation guardrails

Base standard: chenmu2024/Website-Starter-Standard (AGENTS.md, DESIGN.md, SEO-GEO-QUALITY-GATE.md, QA-CHECKLIST.md).

1. Keep domain numerosenletras.org, existing approved keywords, slugs, tools and language. No silent keyword replacements.
2. The core parser/financial output is **safety critical**: never silently round, truncate or re-interpret numbers. Add tests for every fix; accept no scientific notation or unsafe digits until engine is extended.
3. Do not inject arbitrary banking legal conclusions or suggest a generated cheque is officially certified.
4. Respect this repo's DESIGN.md and SEO-GEO-PROJECT-BRIEF.md before modifying appearance, canonicals, country routes or structured data.
5. Keep Astro static and React hydrated only for interactive tools; avoid paid backends/APIs.
6. Before merge: run `bun run lint && bun run test && bun run build && bun run verify:site`.
7. A passing CI does not prove production Core Web Vitals, mobile interaction or indexation. Record those separately with real evidence.
