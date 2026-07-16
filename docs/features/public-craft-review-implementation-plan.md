# P3 public craft review routes implementation plan

**Design:** `docs/features/public-craft-review-design.md`

**Branch:** `tapish-codex/public-craft-review`

**Base:** `origin/main` at `285bc566e0e331e0f9ccddb47df6b66ee3396e47`

## Objective

Add one typed, noindex, review-only `/review/craft/` route to ComplyEaze,
Axal, and Pack. Render three distinct Ledger Atelier identities through public
Sanchika v0.1.0 contracts, with synthetic data, zero authored client JavaScript,
and complete 25-route/75-cell verification evidence.

## Success criteria

- exactly three craft records exist in the owning manifests;
- the canonical registry has 25 unique host/path owners;
- craft routes are noindex, review-only, absent from sitemap and primary nav;
- each route renders every composition required by the approved design;
- built craft pages contain synthetic content and no authored client script;
- axe has zero critical or serious findings;
- CSS, font, CLS, keyboard, reduced-motion, and forced-colors checks pass;
- the visual matrix has 75 clean route/viewport records;
- release evidence includes the routes and leaves C3 pending;
- the full public gate and complete-diff review are clean.

## Slice 1 — typed route and safety contract

### RED

Add a focused craft-review check to the existing public test suite. Require the
three exact routes, app-owned kinds/content, the narrow shared reviewer-evidence
record, `review-only` discoverability, required composition inventories,
synthetic/zero-JS status, safe claims, and 25 registry owners. Add rejection
fixtures for missing compositions, sitemap posture, unsafe identifiers, and C3
approval claims. Run the focused test and confirm it fails because the contract
does not exist.

### GREEN

Add the shared evidence type/validator, extend each app's route type and
validator with one craft kind, then add one craft record to each JSON manifest.
Normalize discoverability in the canonical registry without changing existing
records. Keep app content app-owned and avoid a parallel route inventory.

## Slice 2 — three Astro compositions

### RED

Extend the focused check to require the exact route entrypoints, public
`patternClassName` usage, required semantic anatomy, app stylesheet ownership,
visible review-only/synthetic copy, and no client directives/scripts. Confirm
separate failures for ComplyEaze, Axal, and Pack.

### GREEN

Implement focused Astro components and route rendering:

- ComplyEaze through the manifest-backed catch-all;
- Axal and Pack through explicit `src/pages/review/craft.astro` entrypoints
  loading their exact manifest records.

Use only the approved Sanchika v0.1.0 public API. Add one app-owned craft CSS
file per app for the teal/chalk, aubergine/coral, and moss/near-black/lime
identities. Use semantic markup, native `details/summary`, system fonts, visible
focus, responsive reflow, reduced-motion handling, and forced-colors support.

## Slice 3 — discoverability and built-output evidence

### RED

Require craft exclusion from the ComplyEaze sitemap and all primary navigation,
25-route release evidence, built noindex metadata, zero authored JavaScript,
synthetic markers, exact Sanchika composition markers, and `C3 human craft
approval pending`. Confirm current counts/output fail.

### GREEN

Filter `review-only` records from sitemap output, update exact route-count
assertions, and extend existing release/public/output checks narrowly. Update
legacy P2 assertions to the post-P3 inventory; do not add a general gate
framework.

## Slice 4 — browser accessibility and performance proof

### RED

Extend the browser evidence contract to require 25 pages across three
viewports, focused craft accessibility records, keyboard/native disclosure
proof, reduced-motion and forced-colors passes, and the approved performance
budgets. Confirm the existing 22-route runner fails.

### GREEN

Pin `@axe-core/playwright` as a root dev dependency. Extend the existing visual
runner so all routes retain current geometry checks while craft routes also
collect axe, keyboard, forced-colors, request, gzip CSS, font, and CLS evidence.
Fail critical/serious axe findings, authored JS, CSS over 60 KiB gzip, more than
two critical fonts, remote fonts, CLS above 0.05, missing assets, or incomplete
75-cell output.

## Verification and review

After each RED/GREEN slice, run the smallest relevant test. On the complete
tree run:

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

Additionally inspect all 9 craft screenshots, keyboard order, native
disclosure, reduced-motion, and forced-colors captures. Check edited file sizes
and split application files that grow beyond the repository guardrail.

Review the complete intended implementation diff through product/scope,
public-safety, Sanchika-contract, UI/accessibility, QA, and simplicity lenses.
Fix every Critical/High and low-cost Medium finding, rerun affected gates, and
repeat until clean before committing.

## Commit boundary

Keep the approved design and this plan as planning history. Commit the verified
implementation as one logical P3 change. Do not push, open a PR, deploy, grant
C3, or begin P4-P6 without the next explicit lifecycle instruction.
