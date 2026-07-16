# Astro legacy-renderer cleanup implementation plan

**Design:** `docs/features/astro-legacy-renderer-cleanup-design.md`

**Branch:** `tapish-codex/astro-legacy-cleanup`

**Base:** `origin/main` at `039b994ff3a72d2913c2ab072d8511ffb65599e6`

## Objective

Complete P1 by making the three typed app manifests and their Astro outputs the
only route/build/visual/release-evidence sources. Delete the legacy string
renderer and its adapters/CSS after replacement tests prove the 21-route
contract, then complete the verified PR lifecycle.

## Success criteria

- exactly three validated manifests own 14 ComplyEaze, 6 Axal, and 1 Pack route;
- Pack `/` is a typed noindex foundation and makes no readiness claim;
- root build produces only three Astro outputs and aggregate release evidence;
- aggregate evidence contains 21 unique host/path rows backed by actual HTML;
- public/link/metadata/safety checks read manifests and Astro output only;
- legacy build, renderers, adapters, data joins, and CSS are deleted;
- no stale source, CODEOWNERS, workflow, artifact, or documentation reference
  requires root `dist` or legacy `src/*` files;
- guarded Pages readiness uploads only `apps/complyeaze/dist` and stays disabled;
- CI build evidence contains three app outputs plus aggregate evidence;
- visual evidence contains 21 pages / 63 unique viewport rows and zero findings;
- rollback to `039b994` plus retained CI artifacts is documented;
- all local/GitHub gates, current-head review, exact-head merge, post-merge CI,
  artifacts, late-review sweep, and task cleanup are complete.

## Non-goals

- deployment, Pages enablement, DNS, CNAME, proxy, redirects, or path routing;
- production canonicals, indexing, or sitemap cutover;
- private-app changes or cleanup;
- Pack marketing/policy routes beyond the current foundation;
- Sanchika release/adoption or customer redesign;
- dependency upgrades or unrelated governance refactors.

## Slice 1 - Pack manifest contract

### RED

Add fixtures and source checks requiring:

- `pack.routes.json`, focused types/schema, and one valid foundation route;
- canonical Pack origin, `/` path, noindex robots, and conservative foundation
  fields;
- rejection of extra routes, alternate paths, indexing, unsafe fields, and
  product/release/store claims;
- Pack Astro root to validate and render that record.

Run `pnpm test` and confirm failure names the missing Pack contract/files.

### GREEN

Implement the focused Pack contract, one-record manifest, package export, and
typed Pack root rendering. Rerun focused tests and package/app typechecks.

## Slice 2 - manifest registry and aggregate evidence

### RED

Add fixtures requiring a registry/generator to:

- validate all three manifests;
- expose 21 unique host/path records;
- map every record to its owning app and expected built HTML;
- reject duplicate ownership, missing output, metadata mismatch, robots
  mismatch, missing H1, and unexpected alternate HTML;
- write deterministic non-deployable JSON evidence.

Run focused tests and confirm failure because the registry/generator and
aggregate evidence do not exist.

### GREEN

Add small manifest-registry and aggregate-evidence modules/scripts. Run all
three Astro builds, generate evidence, and make fixtures pass against real
output.

## Slice 3 - checks migrate to manifests and Astro output

### RED

Change focused check expectations so they fail while any check imports
`src/site-data.mjs`, a legacy adapter, renderer, or root `dist`. Require:

- source/schema fixtures from canonical manifests;
- build checks against `apps/*/dist` and aggregate evidence;
- per-host internal-link resolution;
- metadata/canonical/robots/H1 parity;
- sensitive/claim scans over canonical content, Astro source/output, and docs.

Run `pnpm test`, `pnpm public:check`, `pnpm links:check`, and
`pnpm metadata:check` to capture the expected legacy-dependency failures.

### GREEN

Refactor existing checks around the manifest registry and built-output helper.
Delete legacy-only branches/fixtures instead of preserving compatibility
abstractions. Keep route-kind and governance checks that still protect public
behavior.

## Slice 4 - build, visual, artifact, and Pages cutover

### RED

Add exact assertions requiring:

- no `build:legacy` or root HTML `dist`;
- `pnpm build` = Astro apps + aggregate evidence;
- 21 visual targets / 63 unique records from manifests only;
- `public-site-build` paths = three app outputs + aggregate evidence;
- Pages upload path = `apps/complyeaze/dist` only;
- docs and workflow copy to deny Axal/Pack hosting evidence.

Confirm current scripts/workflows fail these assertions.

### GREEN

Update root scripts, visual discovery, CI artifact rules, Pages workflow, and
release/visual/migration documentation. Preserve the disabled deployment guard
and all existing evidence/cleanup caveats.

## Slice 5 - delete legacy implementation

### RED

Add a focused deletion contract that rejects:

- `scripts/build-site.mjs`;
- `src/render-*.mjs`, legacy data/adapters, and legacy CSS;
- imports/references to those paths;
- root `dist` in code, workflow artifact paths, or active documentation;
- obsolete required-file and CODEOWNERS entries.

Run the focused test and confirm it lists the remaining legacy surface.

### GREEN

Trace references, migrate any real remaining consumer, then delete only the
proved legacy files and stale assertions. Update status/changelog and rollback
docs without claiming hosting or private cleanup.

## Verification and review

After each slice run the smallest failing/passing check. On the complete tree:

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

- each app builds independently;
- aggregate evidence has 21 rows and exact output/metadata parity;
- visual summary has 63 rows, 63 unique artifact keys, and zero findings;
- no legacy path/import remains through exact-text search;
- generated/output directories are not accidentally staged;
- modified application/check files stay within the repository size guardrail or
  have a documented framework/table reason.

Run one architecture/public-boundary/simplicity/QA review-rectify pass over the
complete diff. Fix every valid Critical/High and low-cost Medium finding.

## Commit and PR lifecycle

1. Commit approved design and plan as planning history.
2. Commit implementation only after exact-tree local verification is green.
3. Push and open one ready PR.
4. Request current-head Codex review and monitor all required checks.
5. Inspect flat comments, reviews, inline comments, and GraphQL threads.
6. Address valid findings test-first and rerun focused/full gates.
7. Merge only the unchanged reviewed head with squash and
   `--match-head-commit`; request explicit admin-bypass approval if the platform
   requires it.
8. Prove reviewed-tree/merged-tree equality, post-merge main CI, and both
   expected artifacts.
9. Poll late feedback, synchronize the base clone, and remove only the clean
   task-owned remote/local branch and worktree.

## Remaining programme ledger

After merge, P1 is complete. Remaining programme work begins with Sanchika S9
and C2, then P2 adoption, P3 craft routes/C3, P4-P8 redesign/hardening/staging,
and later separately approved production routing/private cleanup. No later
phase is pulled into this PR.
