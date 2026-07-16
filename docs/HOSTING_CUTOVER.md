# Hosting Cutover Runbook

Status: blocked until a hosted environment serves the current static artifact
and the evidence below is attached to the release or cleanup PR.

This repository owns public pages only. A deployment, preview, or custom-domain
change does not by itself authorize removal of the private ComplyEaze app's
public routes. Parent-route cleanup starts only after hosted route, canonical,
redirect, and rollback evidence is recorded in this repo and reviewed.

## Current Posture

- GitHub Pages is readiness-only.
- `.github/workflows/pages-deploy.yml` deploys only when the workflow is running
  on `main` and `ENABLE_GITHUB_PAGES_DEPLOY` is exactly `true`.
- GitHub Pages must be configured to use GitHub Actions before the workflow can
  produce hosted evidence.
- No `CNAME` or custom-domain cutover should be added without a separate
  reviewed DNS, redirect, and rollback plan.
- The public repo must not receive private app secrets, Prisma, Redis, BullMQ,
  portal automation, document storage, or authenticated app infrastructure.

## Required Evidence

For each hosted release or cleanup proposal, attach:

- Commit SHA and PR URL.
- CI run URL for `Public site gates`.
- CI artifacts `public-site-build` and `public-visual-evidence`.
- Pages run URL or preview/deployment URL.
- Hosted route evidence from:

```bash
node scripts/check-hosted-routes.mjs --base-url https://example.com
```

- Local smoke evidence, when useful, from:

```bash
node scripts/check-hosted-routes.mjs --base-url http://127.0.0.1:8000 --allow-localhost
```

- `test-results/hosted-routes/summary.json` and
  `test-results/hosted-routes/summary.md`.
- Hosted destination evidence only; redirect evidence is not checked by
  `scripts/check-hosted-routes.mjs`.
- Preview or GitHub Pages URLs do not prove production custom-domain cutover
  unless the `--base-url` origin matches the manifest origin.
- Confirmation that `/robots.txt`, `/sitemap.xml`, page titles, descriptions,
  canonical tags, Open Graph titles, and main landmarks match the local
  `test-results/public-build/route-manifest.json` release evidence. The
  aggregate evidence file is a CI artifact, not a hosted route.
- Redirect behavior for every private-app source route being removed or
  redirected.
- Rollback owner, command, or revert path.

## Cutover Steps

1. Build the public artifact with `pnpm build`.
2. Run `pnpm verify` and `git diff --check`.
3. Deploy only from reviewed `main` or an explicitly reviewed preview.
4. Run `pnpm hosted:check -- --base-url <hosted URL>` against the hosted URL.
5. Record the evidence in the PR, release note, or migration ledger update.
6. Review redirect behavior from the private app to the public destination.
7. Keep the private-app route available until hosted checks, redirects, and
   rollback evidence are clean.

## Parent-Route Cleanup Rule

Do not remove or redirect a private ComplyEaze public route unless all of these
are true:

- The destination route exists in
  `test-results/public-build/route-manifest.json`.
- The hosted destination route returns HTTP 200.
- Canonical URLs and sitemap entries point to the intended production origin.
- The old route redirect is tested and reversible.
- `docs/ROUTE_MIGRATION_LEDGER.md` and the rendered `/migration/` page identify
  the source host, source route, destination host, destination route, cleanup
  rule, evidence, and rollback.
- The latest review-rectify pass is clean for Critical and High findings.

If any item is missing, keep cleanup blocked and narrow the release to static
site readiness only.
