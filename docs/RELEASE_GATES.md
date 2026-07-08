# Release Gates

This repository should release as a public static/site artifact. It must not
require private app secrets, Prisma, Redis, BullMQ, portal automation, document
uploads, or authenticated app infrastructure.

## Required Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm visual:check
pnpm public:check
pnpm links:check
pnpm metadata:check
git diff --check
```

## Release Evidence

Each release should record:

- Commit SHA.
- Build command and artifact path.
- Route manifest generated at `dist/route-manifest.json`, matched to
  `src/site-data.mjs`, rendered HTML files, canonical URLs, and `sitemap.xml`.
- Desktop and mobile screenshots.
- Accessibility and link-check results.
- Metadata, robots, sitemap, canonical, and redirect results.
- Public claim evidence.
- Rollback path.

## Deployment Posture

- Static hosting is preferred unless a reviewed feature requires server runtime.
- No production database, Redis, worker, portal, credential, or document storage
  dependency is allowed by default.
- If containerized, deployments should use immutable image digests.
- Secrets must stay in the deployment platform and never appear in source,
  examples, logs, or screenshots.
