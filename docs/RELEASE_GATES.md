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
- CI artifact `public-site-build`, containing the generated `dist` build output
  retained for 14 days.
- CI artifact `public-visual-evidence`, containing rendered screenshots and
  visual summaries retained for 30 days.
- Route manifest generated at `dist/route-manifest.json`, matched to
  `src/site-data.mjs`, rendered HTML files, canonical URLs, and `sitemap.xml`.
- Desktop and mobile screenshots.
- Accessibility and link-check results.
- Metadata, robots, sitemap, canonical, and redirect results.
- Public claim evidence.
- Dependency review evidence from `docs/DEPENDENCY_POLICY.md` when npm,
  pnpm lockfile, or GitHub Actions dependencies change.
- Review-gate fixture evidence from `scripts/test-review-gate-fixtures.mjs`
  when governance, review policy, or review-gate scripts change.
- Pages deploy evidence: Actions run URL, skipped/disabled guard status when
  `ENABLE_GITHUB_PAGES_DEPLOY` is not true, Pages environment URL when enabled,
  and confirmation that no `CNAME` or custom-domain cutover changed in the
  release.
- Rollback path.

## Deployment Posture

- Static hosting is preferred unless a reviewed feature requires server runtime.
- `Pages deploy` is readiness-only until `ENABLE_GITHUB_PAGES_DEPLOY=true`,
  GitHub Pages is configured for GitHub Actions, and hosted route, canonical,
  redirect, and rollback evidence is recorded.
- The Pages workflow must run `pnpm verify` before deploying and may upload only
  the generated `dist` artifact.
- No production database, Redis, worker, portal, credential, or document storage
  dependency is allowed by default.
- If containerized, deployments should use immutable image digests.
- Secrets must stay in the deployment platform and never appear in source,
  examples, logs, or screenshots.
