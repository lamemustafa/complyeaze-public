# Astro legacy-renderer cleanup design

Date: 2026-07-16
Status: Approved design; awaiting written-spec review
Phase: P1 final cleanup

## Outcome

Complete P1 by making validated typed manifests and Astro outputs the only
route, build, metadata, link, safety, visual, and release-evidence sources in
`complyeaze-public`. Delete the custom legacy string renderer and its adapters,
data modules, CSS, and root HTML build only after the replacement contracts are
proved. Keep hosting, DNS, redirects, indexing, Sanchika adoption, customer
redesign, and private-app cleanup outside this tranche.

## Current evidence

Merged `main` at `039b994ff3a72d2913c2ab072d8511ffb65599e6`
contains:

- fourteen typed ComplyEaze Astro routes;
- six typed Axal Astro routes;
- one explicit Pack Astro foundation route;
- a separate twenty-page legacy renderer and root `dist/` output;
- a forty-one-page visual inventory, where twenty legacy pages duplicate
  customer/content coverage already owned by Astro;
- a guarded Pages workflow that still uploads root `dist/`;
- CI evidence that uploads root `dist/` plus all three Astro app outputs.

The authoritative programme plan requires route-manifest discovery and deletion
of `render-*.mjs`, `build-site.mjs`, and old CSS after parity. PR #42 established
the required parity and left this cleanup as the next isolated tranche.

## Fixed scope

### In scope

- a minimal typed Pack foundation manifest and focused validation;
- validated manifest discovery for ComplyEaze, Axal, and Pack;
- independent Astro builds for all three apps;
- a non-deployable aggregate release-evidence manifest generated from validated
  typed manifests and actual built HTML;
- migration of visual, metadata, link, public-safety, artifact, and required-file
  checks away from legacy modules and root `dist/`;
- removal of the custom legacy renderer, legacy adapters/data, and legacy-only
  CSS after replacement checks fail correctly and then pass;
- root build-script, CI artifact, guarded Pages, documentation, CODEOWNERS, and
  rollback updates required by the deletion;
- complete local/GitHub review, exact-head merge, post-merge CI, and task-owned
  cleanup.

### Out of scope

- production deployment, Pages enablement, DNS, CNAME, proxy, or path routing;
- redirects, canonicals in production, indexing, or sitemap cutover;
- private-app route removal or source cleanup;
- Pack marketing/policy route implementation beyond the existing foundation;
- Sanchika package release or adoption;
- customer-facing redesign, new claims, or new product functionality;
- dependency upgrades, governance-framework expansion, or unrelated refactors.

## Chosen architecture

### Canonical route sources

Use exactly three checked-in route manifests:

- `packages/public-content/src/complyeaze.routes.json` — fourteen routes;
- `packages/public-content/src/axal.routes.json` — six routes;
- `packages/public-content/src/pack.routes.json` — one noindex foundation route.

Each manifest has a focused validator. ComplyEaze continues to use the shared
public-route contract, Axal continues to use its product-specific contract, and
Pack receives the smallest contract needed for its current foundation. The Pack
record must not imply marketing parity, release readiness, store availability,
or hosted ownership.

### Build flow

```text
validated route manifests
          |
          +--> apps/complyeaze Astro build (14)
          +--> apps/axal Astro build (6)
          +--> apps/pack Astro build (1)
          |
          v
aggregate release-evidence manifest
```

Root `pnpm build` builds only the three Astro apps and then generates aggregate
evidence. It does not create a compatibility HTML bundle or root deploy tree.

### Aggregate release evidence

Add a focused generator that:

1. imports and validates all three canonical manifests;
2. resolves the expected file for each route in the correct `apps/*/dist`;
3. verifies that the built file exists;
4. reads the built HTML and verifies title, description, canonical, robots, and
   expected H1 evidence against the canonical record;
5. rejects duplicate host/path ownership and unexpected alternate outputs;
6. writes one deterministic JSON file under a clearly non-deployable evidence
   directory.

Each row contains only:

- app and origin;
- route slug and URL path;
- app-relative output path;
- title and description;
- canonical URL;
- robots posture;
- build-evidence location.

It contains no copied HTML, secrets, private data, runtime configuration, or
claim source beyond the manifest. The aggregate file is release evidence, not a
fourth routing source and not a deployable site.

### Check migration

Refactor public checks around two reusable inputs:

- validated canonical route records;
- parsed built Astro HTML for those records.

Checks may retain route-kind-specific assertions, but may not import `src/*`
legacy adapters or depend on root `dist/`. Exact tests must cover:

- 14 + 6 + 1 route counts and unique host/path ownership;
- each expected Astro output and no unintended route output;
- canonical/title/description/robots/H1 parity;
- internal-link resolution within each host/app and explicit external links;
- sensitive-content and unsupported-claim scans over manifests, Astro source,
  built output, and relevant docs;
- sitemap exclusion for all current preview routes;
- public/private and cleanup blockers;
- independent application builds.

No new generic gate framework is added. Existing checks are narrowed or deleted
when their only purpose was proving the legacy renderer.

## Deletion boundary

Delete the following only after failing replacement assertions exist:

- `scripts/build-site.mjs`;
- `src/render-*.mjs`;
- `src/*-data.mjs` legacy adapters;
- `src/site-data.mjs`, `src/product-data.mjs`, and other legacy-only data joins;
- legacy-only CSS under `src/`;
- legacy assertions, fixtures, required-file entries, CODEOWNERS patterns, and
  documentation that require those files or root `dist/`.

Before deletion, trace every reference with exact-text search. If a file has a
non-legacy consumer, migrate that consumer first or leave the file with an
explicit reason. Do not delete migration-ledger canonical data, typed schemas,
public-claim sources, hosted-route governance, or review gates.

## Pack foundation contract

The Pack manifest contains exactly one `/` record and retains:

- origin `https://pack.complyeaze.com`;
- current noindex foundation title, description, heading, and signal terms;
- explicit wording that customer/public route parity is not yet claimed;
- no product capability, release, install, security, privacy, or store claim.

`apps/pack/src/pages/index.astro` renders that validated record. The route is
then discovered identically to ComplyEaze and Axal by build, visual, and release
evidence code.

## Visual and accessibility evidence

After legacy removal, the canonical visual inventory is twenty-one pages:

- fourteen ComplyEaze routes;
- six Axal routes;
- one Pack foundation route.

At desktop, tablet, and mobile, the authoritative matrix contains sixty-three
unique route/viewport records and screenshot files. Existing geometry, focus,
reduced-motion, touch-target, broken-image, blank-section, clipping, overlap,
landmark, and naming checks remain. The cleanup must not weaken them merely to
reduce the target count.

The Pack foundation keeps its limited foundation profile until a later approved
Pack route tranche. ComplyEaze and Axal retain their current stricter profiles.

## CI, artifacts, and Pages readiness

### Root scripts

- remove `build:legacy` and legacy typecheck terminology;
- keep fast/UI/full verification separation;
- `build` runs the three Astro builds and aggregate-evidence generation;
- public, link, and metadata checks require fresh app builds and aggregate
  evidence where appropriate.

### CI artifact

`public-site-build` uploads only:

- `apps/complyeaze/dist`;
- `apps/axal/dist`;
- `apps/pack/dist`;
- the aggregate evidence directory.

It must not upload root `dist`, legacy CSS, source data, dependencies, secrets,
or private configuration. `public-visual-evidence` remains unchanged except for
the new sixty-three-cell content.

### Guarded Pages workflow

Retarget the existing readiness-only Pages artifact to
`apps/complyeaze/dist`. Preserve every existing guard:

- disabled unless `ENABLE_GITHUB_PAGES_DEPLOY=true`;
- full verify before upload;
- no CNAME or DNS change;
- no claim that Axal or Pack is hosted;
- no parent-route cleanup authorization.

This is a workflow-readiness correction, not a deployment or cutover.

## Rollback

Rollback is not a checked-in frozen HTML snapshot. It is:

1. revert the cleanup merge to the pre-cleanup baseline
   `039b994ff3a72d2913c2ab072d8511ffb65599e6`;
2. rerun the full repository gate;
3. use the retained seven-day `public-site-build` and
   `public-visual-evidence` artifacts from the last known-good pre-cleanup run
   when immediate inspection is required.

The design and implementation plan must record the exact baseline and current
known-good CI run. The deletion does not authorize production rollback actions,
because no production routing changes in this tranche.

## Test-first implementation order

1. Add Pack manifest/schema fixtures and watch them fail on the explicit page.
2. Add manifest-only route discovery and aggregate-evidence fixtures; confirm
   failures on legacy imports and missing aggregate output.
3. Add artifact/build/Pages assertions for Astro-only paths and confirm the old
   root `dist` rules fail.
4. Add deletion assertions for legacy files/imports and confirm they fail.
5. Implement Pack manifest rendering and aggregate evidence.
6. Migrate each check family from legacy sources to manifests/built Astro HTML.
7. Change scripts/workflows/docs, then delete traced legacy files.
8. Run focused checks after each slice and the complete gate on the final tree.

Tests must demonstrate that removed legacy sources are no longer read; deleting
them without replacement coverage is not success.

## Acceptance criteria

- exactly three validated manifests own all twenty-one current preview routes;
- no route/build/visual/public check imports or reads legacy `src/*` modules;
- no root HTML `dist` is generated or required;
- each Astro app builds independently;
- aggregate evidence has exactly twenty-one unique host/path rows matching
  actual outputs and metadata;
- custom renderers, adapters, and legacy-only CSS are deleted with no stale
  references;
- guarded Pages readiness points only to the ComplyEaze Astro output and remains
  disabled by default;
- CI artifacts contain only three app outputs, aggregate evidence, and visual
  evidence;
- the visual gate produces sixty-three unique rows and zero findings;
- lint, typecheck, tests, build, public, links, metadata, whitespace, and full
  verify pass;
- current-head Codex review, required GitHub checks, GraphQL thread state,
  exact-head merge, post-merge CI/artifacts, and cleanup are complete;
- migration ledger continues to block hosting, redirects, indexing, and
  private-app cleanup.

## Completion boundary

Completion closes the P1 architecture migration only. It proves local and CI
Astro ownership of current public preview routes. It does not prove that any
Astro app is deployed, receives production traffic, is indexed, or is ready for
private-app route deletion. Those remain later human-approved tranches.
