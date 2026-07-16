# Sanchika v0.1.0 public adoption implementation plan

**Design:** `docs/features/sanchika-v0-1-adoption-design.md`

**Branch:** `tapish-codex/sanchika-v0-1-adoption`

**Base:** `origin/main` at `2f59de69a31615ef0ea77d46c1f73b13aa38681f`

## Objective

Adopt the exact published Sanchika `v0.1.0` GitHub artifact set across all
three Astro apps in one P2 pull request. Prove ComplyEaze first, then Axal and
Pack, while preserving existing compositions and reserving product-pattern
composition for P3.

## Success criteria

- all three apps declare the exact tokens, primitives, and patterns tarballs;
- root pnpm overrides prevent packed internal dependencies from falling through
  to npm;
- the lockfile and installed packages resolve only the reviewed `v0.1.0`
  artifacts;
- one typed adoption manifest records exact source, URLs, checksums, digests,
  app scope, rollback, and non-goals;
- ComplyEaze renders a noindex `/sanchika/` evidence route outside primary nav;
- each app imports tokens, primitives, and patterns CSS in the approved order;
- each app visibly uses Sanchika foundation roles and existing primitive jobs;
- shipped CSS contains `--sk-`, primitive classes, and pattern stylesheet
  classes, while app markup contains no product-pattern composition;
- all 22 manifest routes build and the visual matrix contains 66 clean cells;
- existing noindex, metadata, link, public-safety, zero-JS, and identity
  contracts remain green;
- rollback to the complete `v0.0.2` artifact set is mechanical and verified;
- one PR completes the current-head review, exact-head merge gate, post-merge
  CI/artifact proof, late-review sweep, and task cleanup.

## Non-goals

- P3 craft routes or `sk-pattern-*` composition;
- redesign, copy rewrite, fonts, new product routes, or new runtime behavior;
- deployment, Pages enablement, staging, DNS, redirects, indexing, or private
  route cleanup;
- Sanchika source or release changes, npm publication, Tools adoption, or
  private application changes.

## Slice 1 — release and manifest contract

### RED

Add `scripts/public-checks/sanchika-adoption.mjs` and invoke its source fixtures
from `pnpm test`. Require:

- a typed adoption manifest module and JSON data under
  `packages/public-content/src/`;
- exact `v0.1.0` source commit, release URL, package URLs, `SHA256SUMS` values,
  GitHub asset digests, adopted apps, CSS order, rollback URLs, and non-goals;
- all three app manifests to declare the exact package URLs;
- root overrides for `@sanchika/tokens@0.1.0` and
  `@sanchika/primitives@0.1.0`;
- rejection fixtures for wrong version, checksum, digest, missing app,
  incomplete rollback, or later-phase claims.

Run `pnpm test` and confirm it fails because the adoption contract does not
exist.

### GREEN

Implement the focused types/schema/manifest and package export. Update the
three app manifests and root pnpm overrides, then install with the frozen
package manager version to generate the reviewed lockfile. Inspect that the
installed identities and lockfile use the exact GitHub artifact URLs.

Add a package-entrypoint smoke module that imports public token, primitive, and
pattern APIs. Keep it consumer-owned and free of Sanchika source paths.

Rerun the focused test, package typecheck, and smoke check.

## Slice 2 — ComplyEaze adoption and evidence route

### RED

Extend the adoption check to require:

- ComplyEaze `src/styles/sanchika.css` with exact import order;
- a package-backed shell marker using existing primitive jobs;
- a typed `sanchika` evidence route in the ComplyEaze manifest;
- exhaustive Astro rendering for the route;
- evidence copy derived from the adoption manifest;
- 15 ComplyEaze routes and 22 registry routes;
- no primary-navigation exposure and no pattern composition.

Run `pnpm test` and confirm it fails on the missing ComplyEaze consumer
surface.

### GREEN

Add the stylesheet, import it before current layout styles, map the existing
shell to semantic Sanchika roles, and add primitive classes only to existing
button/card/badge jobs. Add a focused evidence component/route kind only if the
current evidence renderer cannot truthfully consume the adoption manifest.
Prefer the smallest extension of the current typed route schema.

Build only the ComplyEaze app, generate aggregate evidence if necessary, and
run focused source, metadata, public, link, and browser checks before touching
Axal or Pack.

## Slice 3 — Axal and Pack shell adoption

### RED

Extend the same check to require for each remaining app:

- the exact ordered stylesheet imports;
- built Sanchika foundation and primitive markers;
- approved primitive use in existing semantic jobs;
- no product-pattern composition;
- unchanged route count, headings, actions, identity terms, and noindex
  posture.

Run `pnpm test` and confirm it fails separately for Axal and Pack.

### GREEN

Map Axal's current foundation variables to Sanchika semantic roles without
flattening its identity or changing its workbench/layout. Apply the same
bounded baseline to Pack's one foundation without adding capability or release
claims.

Build and typecheck each app independently, then run the focused adoption and
public-output checks.

## Slice 4 — output, visual, rollback, and guard enforcement

### RED

Require:

- exact 22-route aggregate evidence and 66 visual cells;
- built CSS in every app to contain `--sk-`, approved primitive classes, and
  pattern stylesheet classes;
- no `sk-pattern-*` class in application markup;
- no nested Sanchika source/workspace/file imports anywhere active;
- lockfile-only GitHub artifact resolution;
- `/sanchika/` metadata, sitemap, noindex, evidence, and link parity;
- complete `v0.0.2` rollback set in manifest/docs;
- `.superpowers/` ignored so the approved companion cannot enter commits.

Run focused tests and confirm current route/visual/output assumptions fail.

### GREEN

Update route counts, visual targets, active docs, required-file lists, claim
scans, release evidence, and rollback documentation. Add only the smallest
new assertions needed to protect P2; do not create another general gate
framework.

Run focused checks and the full 22-route build/66-cell visual matrix.

## Verification and review

After each slice, run the smallest red/green command. On the complete tree:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm public:check
pnpm links:check
pnpm metadata:check
pnpm visual:check
git diff --check
pnpm verify
```

Additionally prove:

- each app independently builds;
- package smoke uses public package entrypoints;
- the lockfile has no npm/local/workspace Sanchika resolution;
- all three built CSS outputs contain required Sanchika markers;
- route evidence has 22 unique host/path owners;
- the visual summary has 66 unique route/viewport records and zero findings;
- no pattern composition or forbidden source import exists;
- new/heavily edited app and check files stay near the 300-line guardrail.

Run one release-integrity, public-boundary, UI-regression, QA, and simplicity
review over the complete diff. Fix every valid Critical/High and low-cost
Medium finding before commit.

## Commit and PR lifecycle

1. Keep the approved design and this implementation plan as separate planning
   history.
2. Commit implementation only after exact-tree local verification is green.
3. Push and open one ready P2 PR.
4. Request current-head Codex review and monitor required checks and both CI
   artifacts.
5. Inspect flat comments, reviews, inline comments, and GraphQL threads.
6. Address valid findings test-first; reply, resolve, and reverify.
7. Merge only the unchanged reviewed head with `--match-head-commit`; request
   explicit admin-bypass approval if branch protection still requires it.
8. Verify merged-tree equality, post-merge main CI/artifacts, and late feedback.
9. Synchronize main and remove only the clean task-owned branch/worktree.
