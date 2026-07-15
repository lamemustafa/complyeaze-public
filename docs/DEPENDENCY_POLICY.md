# Dependency Policy

This repository is public and static-site oriented. Dependencies are part of the
public trust boundary and must stay small, reviewable, pinned, and evidence
backed.

## Allowed Dependency Scope

- Static-site build, rendering, visual review, metadata, link checks, CI, and
  local public-repo governance scripts.
- Development dependencies that support static generation and the public gate:
  Astro 7.0.9, `@astrojs/check` 0.9.9, TypeScript 6.0.3, and Playwright 1.61.1.
- GitHub Actions required for checkout, Node/pnpm setup, Pages readiness,
  artifact retention, and review-gate status sync.
- Current package surface: no runtime `dependencies`, no lifecycle scripts, and
  only the pinned build/test tools above in workspace manifests unless this
  policy and the static dependency check are updated in the same PR.
- Astro commands must set `ASTRO_TELEMETRY_DISABLED=1`; no client analytics or
  telemetry dependency is allowed.
- `packageManager` must stay pinned to `pnpm@10.28.2`, CI must use pnpm
  `10.28.2`, and Node workflow versions must stay aligned with the public
  package engine.

## Not Allowed By Default

- Runtime dependencies that require private app secrets, tenant data, Prisma,
  Redis, BullMQ, portal automation, document storage, browser profile access, or
  authenticated product infrastructure.
- New runtime `dependencies` in `package.json` without a public-site design,
  review evidence, and static check update.
- Package lifecycle scripts such as `preinstall`, `install`, `postinstall`,
  `prepare`, `prepublish`, or `prepack`.
- Unreviewed telemetry, analytics, session replay, remote configuration,
  download execution, or user-data collection packages.
- Floating GitHub Actions. Actions must stay pinned to reviewed SHAs.
- Dependency changes that introduce or depend on real taxpayer data, portal
  artifacts, private screenshots, credentials, or local environment files.

## Update Workflow

Dependabot may open weekly grouped pull requests for:

- `npm` updates in `/`.
- `github-actions` updates in `/`.

Dependency update PRs must not auto-merge. Before merge, reviewers should:

1. Confirm the update is needed for the public repo scope.
2. Review changelog, release notes, or source diff when the dependency affects
   build, browser automation, artifacts, GitHub permissions, or deployment.
3. Confirm GitHub Actions remain pinned to SHAs.
4. Run the full public gate:

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

5. Cite `public-site-build` and `public-visual-evidence` artifacts when the
   update affects rendering, build output, browser automation, or CI behavior.

## Emergency Updates

For a security advisory or broken CI dependency, keep the patch narrow:

- Update only the affected dependency or action.
- Explain impact and rollback.
- Avoid broad lockfile churn unless the package manager requires it.
- Re-run the full public gate and review-rectify loop.
