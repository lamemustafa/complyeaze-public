# Astro evidence-route port implementation plan

**Design:** `docs/features/astro-evidence-route-port-design.md`

**Branch:** `tapish-codex/astro-evidence-route-port`

**Target routes:** `/trust/`, `/docs/`, `/migration/`

## Delivery standard

Implement the approved design through observable red-green-refactor cycles.
Production code does not precede the focused failing assertion that defines its
behavior. Keep the legacy renderer deployable, keep Astro output preview-only,
and do not change hosting, redirects, sitemap cutover, private routes, or
migration evidence status.

Before every commit, review the complete intended diff locally and rectify all
valid findings. After every push, obtain a current-head GitHub Codex review,
reply to and resolve every actionable thread, rerun affected gates, and repeat
until clean.

## Slice 1 — route-contract red phase

### Tests first

Extend `scripts/public-checks/astro-core-routes.mjs` fixtures to specify:

- valid `evidence` and `migration` routes;
- evidence routes require non-empty uniquely addressed links;
- migration routes require non-empty uniquely labelled steps;
- unsafe evidence URLs fail;
- wrong-kind fields fail;
- unknown route kinds fail;
- `/trust/`, `/docs/`, and `/migration/` are required manifest routes.

Run:

```bash
node scripts/check-public-repo.mjs --test
```

The focused gate must fail for the missing route contracts and routes, not from
syntax or fixture errors.

### Minimal green implementation

- Add `PublicEvidenceLink`, `PublicEvidenceRoute`, `PublicMigrationStep`, and
  `PublicMigrationRoute` to `packages/public-content/src/schema.ts`.
- Validate discriminated fields, safe URLs, non-empty arrays, and uniqueness.
- Add the three canonical route records to
  `packages/public-content/src/complyeaze.routes.json`.
- Keep `noindex, nofollow` and evidence-safe public copy.

Rerun the focused test and package typecheck. Refactor validation into focused
helpers only after green.

## Slice 2 — canonical migration-ledger red phase

### Tests first

Extend `scripts/public-checks/migration-ledger.mjs` with direct contract fixtures
and canonical-source assertions covering:

- malformed hostnames;
- non-root-relative routes;
- duplicate family names;
- duplicate host-plus-source-route identities;
- missing required fields;
- evidence that is not explicitly pending;
- cleanup that is not explicitly blocked;
- parent cleanup lacking a separate private-app cleanup PR requirement.

Require the canonical package module and both legacy and Astro rendered ledger
outputs. Run the focused test and confirm it fails because the canonical module
and Astro output do not exist.

### Minimal green implementation

- Add `packages/public-content/src/complyeaze.migration-ledger.ts` with typed
  records and `defineMigrationLedger` validation.
- Move the current ledger values unchanged from `src/migration-data.mjs`.
- Reduce `src/migration-data.mjs` to a legacy adapter.
- Export the canonical ledger from the public-content package.
- Point migration checks and public-claim scanning at canonical package data.

Rerun the focused tests and package typecheck, then remove duplicated validation
only where the new boundary makes it objectively redundant.

## Slice 3 — legacy parity red phase

### Tests first

Extend the Astro core-route build checks to require the legacy `/trust/`,
`/docs/`, and `/migration/` outputs to contain:

- all canonical route metadata and section copy;
- every evidence-link label and URL;
- every migration step;
- every family summary and route-row field.

Run the test against the existing legacy build. Confirm it fails because trust
and docs do not render evidence links and route records are not yet adapted from
the manifest.

### Minimal green implementation

- Derive the three legacy page records from the canonical manifest.
- Add `src/render-evidence.mjs`.
- Extract legacy migration rendering to `src/render-migration.mjs`.
- Dispatch by adapted route type in `src/render-site.mjs`, removing the
  migration slug special case.
- Preserve the legacy HTML semantics and CSS behavior needed for rollback.

Build the legacy site and rerun parity checks. Keep new or heavily changed
application modules below the repository's 300-line warning where framework
shape permits.

## Slice 4 — Astro rendering red phase

### Tests first

Require the Astro build to contain:

- semantic evidence-link navigation for trust and docs;
- ordered migration steps;
- family definition lists and a route-level table;
- exhaustive route-kind rendering;
- every canonical ledger value;
- no script tags or emitted client JavaScript;
- valid internal targets and preview metadata.

Run the focused build gate and confirm failure because the new components and
outputs do not exist.

### Minimal green implementation

- Add `PublicEvidencePage.astro`.
- Add `PublicMigrationPage.astro`.
- Add `PublicMigrationLedger.astro`.
- Update `[...slug].astro` with exhaustive route-kind dispatch.
- Keep `PublicPageLayout.astro` responsible only for shared document concerns.
- Use component-scoped transitional styles, clear focus states, 65–75ch prose,
  balanced headings, and a semantic table that becomes labelled stacked rows at
  the existing responsive threshold.
- Preserve zero hydration and reduced-motion behavior.

Build all apps and rerun route, workspace, link, and metadata checks.

## Slice 5 — claim and visual hardening

### Automated verification

Run the smallest affected gates first, then the full sequence:

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
```

Expected visual scope is 33 pages across three viewports, or 99 cases, unless
another reviewed route-count change lands first.

If this machine's pnpm registry-signature guard blocks command dispatch before
a repository script starts, do not disable or weaken the guard. Run the exact
underlying Node scripts and workspace-local Astro/TypeScript binaries for local
evidence, record the dispatch limitation, and treat the pinned-pnpm GitHub CI
run as the authoritative full-gate result.

### Impeccable review

Review the three rendered Astro routes as brand-register evidence pages:

- first viewport communicates page purpose without a generic SaaS hero;
- evidence links read as a curated source index, not identical marketing cards;
- migration order uses numbers only because it is a real sequence;
- desktop table and tablet/mobile stacked rows preserve label/value association;
- long hosts, routes, evidence text, and cleanup language wrap without overflow;
- body contrast meets 4.5:1 and large text meets 3:1;
- keyboard focus is visible and touch targets are at least 44px;
- typography respects the existing transitional system and does not introduce a
  speculative pre-Sanchika identity;
- no decorative gradients, glass, side stripes, oversized rounding, or
  animation-dependent visibility appears.

Rectify every valid finding and rerun the affected automated and visual checks.

## Slice 6 — local review and implementation commit

Review the complete intended diff for:

- canonical-source duplication;
- unsafe or unsupported public claims;
- missing wrong-kind validation;
- incomplete legacy/Astro parity;
- route or ledger fields omitted from rendering or checks;
- inaccessible table/card semantics;
- unresolved internal links or preview-metadata drift;
- files exceeding the modularity warning without justification;
- unrelated governance or hosting changes.

Record each finding with severity and disposition. Fix every Critical and High
finding, fix low-cost Medium and Low findings, and document any accepted
follow-up. Rerun focused gates, the full gate, visual evidence, and
`git diff --check`; then commit only when the review is clean.

## Slice 7 — PR lifecycle

1. Push the branch and open a focused implementation PR against `main`.
2. Include decision record, scope, public-safety checklist, verification,
   visual-evidence summary, rollback, and review-rectify disposition.
3. Watch all required CI checks to completion.
4. Obtain GitHub Codex review on the exact current head.
5. Inspect both top-level review state and GraphQL review threads.
6. Respond to, rectify, and resolve every actionable finding.
7. Push fixes, rerun CI, and obtain a new current-head review when the head
   changes.
8. Squash-merge only after required checks and review state are clean and the
   user authorizes any required maintainer bypass.
9. Verify the merge commit, post-merge `main` CI, and synchronized local `main`
   before beginning the next P1 route family.

## Completion evidence

The increment is complete only when repository and GitHub evidence prove:

- ten ComplyEaze routes are canonical and statically emitted by Astro;
- all twenty routes remain available in the legacy rollback build;
- trust/docs links and the full migration ledger match across renderers;
- preview routes stay `noindex, nofollow` with zero client JavaScript;
- the 99-case visual matrix and all public gates pass;
- the implementation diff has a clean local Codex review;
- the exact pushed head has a clean GitHub Codex review and no unresolved
  actionable threads;
- merged `main` and its post-merge CI are verified.
