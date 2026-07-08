# Repository Settings

Status: active
Last verified: 2026-07-08

## Repository

- GitHub repository: `lamemustafa/complyeaze-public`
- Visibility: public
- Default branch: `main`
- Homepage: `https://complyeaze.com`
- Issues: enabled
- Projects: disabled
- Wiki: disabled
- Topics: `complyeaze`, `public-site`, `compliance`, `open-source`, `trust`

## Main Branch Ruleset

Ruleset: `Protect main`

Required for `refs/heads/main`:

- No branch deletion.
- No non-fast-forward updates.
- Pull request required.
- Stale reviews dismissed on push.
- Review thread resolution required.
- Squash merge only.
- Strict required status checks.
- Required checks:
  - `Public site gates`
  - `Review gate`

`Review gate` enforces unresolved review-thread and requested-changes blockers.
It is not a substitute for the PR template's review-rectify evidence or a
maintainer review of the current diff.

The maintainer bypass path is limited to pull requests, matching the repo-family
pattern used by Sanchika.

## Maintenance Notes

- Keep `Public site gates` aligned with `pnpm verify`.
- Keep `Review gate` pinned to the GitHub Actions integration when rulesets are
  edited.
- Keep `Pages deploy` non-required until GitHub Pages is intentionally enabled
  and a hosted route/canonical/redirect/rollback review is complete.
- Keep pull-request review-gate sync at zero wait so it reports blocker-thread
  state quickly. Do not describe it as current-head Codex review enforcement
  unless a guaranteed reviewer integration is installed and required.
- Do not enable Projects or Wiki unless the public contribution model changes.
- Do not make `main` directly pushable after the initial bootstrap commit.

## GitHub Pages Deploy Guard

Workflow: `.github/workflows/pages-deploy.yml`

Status: readiness-only. GitHub Pages currently is not treated as hosted cutover
evidence.

The deploy job is disabled unless all of these are true:

- The workflow is running on `refs/heads/main`.
- Repository variable `ENABLE_GITHUB_PAGES_DEPLOY` is exactly `true`.
- GitHub Pages is configured to use GitHub Actions.
- The `github-pages` environment has been reviewed for the intended deployment
  approval policy.

When enabled, the workflow runs `pnpm verify`, uploads only `dist`, and deploys
with the GitHub Pages token permissions `contents: read`, `pages: write`, and
`id-token: write`. It must not use deployment secrets, private app variables,
Prisma, Redis, BullMQ, portal automation, document storage, custom-domain
changes, or authenticated app infrastructure.

Do not use a successful Pages deployment alone as parent-route cleanup evidence.
Cleanup still requires hosted route, canonical, redirect, and rollback evidence
recorded in the migration ledger.
