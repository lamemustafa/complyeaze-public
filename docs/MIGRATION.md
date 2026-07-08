# Migration Plan

## Goal

Move public ComplyEaze-family pages out of the private ComplyEaze app and into
this standalone public repository, then remove or redirect migrated pages from
the private app after production cutover is verified.

## Candidate Source Surfaces

- Root public pages under the private app's `(main)` route group.
- Public Axal marketing pages under the private app's Axal marketing route
  group.
- Pack public pages for source, status, changelog, support, security, privacy,
  terms, acceptable use, docs, and release posture.
- Tools public docs and browser-local utility pages.
- Sanchika public adoption and design-system pages.
- Public SEO assets, metadata, robots, sitemaps, Open Graph assets, and
  canonical host rules.

## Extraction Rules

- Migrate public-safe content only.
- Replace private imports with public data, static content, or reviewed public
  API calls.
- Remove access to private envs, Prisma, Redis, BullMQ, portal automation,
  credentials, documents, and deployment internals.
- Use synthetic screenshots and fixtures.
- Keep canonical URLs and redirects explicit.
- Do not delete private-app public routes until this repo owns the production
  route and the cutover evidence is reviewed.

## Cutover Evidence

For each migrated surface, record:

- Source route and destination route.
- Changed files in both repositories.
- Rendered desktop and mobile screenshots.
- Accessibility and link-check results.
- Metadata, robots, sitemap, canonical, and redirect results.
- Public claim evidence.
- Rollback path.

The current route-family ledger lives in `docs/ROUTE_MIGRATION_LEDGER.md` and
is rendered at `/migration/`. Keep both aligned through `src/site-data.mjs`.
