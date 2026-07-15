# Astro evidence-route port design

**Status:** Approved design, awaiting written-spec review

**Tranche:** Phase 2, P1 — custom renderer to multi-app Astro workspace

**Routes:** `/trust/`, `/docs/`, `/migration/`

## Outcome

Port the three public trust, documentation, and migration-evidence routes to the
ComplyEaze Astro app without weakening their evidence boundaries or claiming a
production cutover. The typed public-content package becomes canonical for
route identity, metadata, introductory copy, evidence links, and the complete
host-aware migration ledger. The legacy renderer remains the temporary rollback
baseline and consumes adapters over the same canonical data.

After this increment, ten of the twenty legacy public routes are represented in
Astro. The remaining customer, product-family, gateway, and Axal routes stay in
the legacy renderer until their own approved P1 increments.

## Current state

- PR #35 established the three-app Astro workspace and shared package
  boundaries.
- PR #36 ported `/about/` and `/contact/`.
- PR #37 ported `/privacy/`, `/terms/`, `/status/`, `/changelog/`, and
  `/release-evidence/` and made one typed route manifest canonical for those
  seven routes.
- `/trust/` and `/docs/` still live only in `src/site-data.mjs`.
- `/migration/` route metadata lives in `src/site-data.mjs`, while its family
  and route rows live in `src/migration-data.mjs` and are rendered by a special
  branch in `src/render-site.mjs`.
- `docs/ROUTE_MIGRATION_LEDGER.md` mirrors the operational ledger and existing
  checks require both representations to agree.
- Pages deployment remains disabled. Astro output is migration-preview
  evidence, not production-route ownership evidence.

## Scope

### Included

- Typed `evidence` and `migration` route variants in the existing ComplyEaze
  route manifest.
- Canonical `/trust/` and `/docs/` copy plus reviewed evidence links.
- A typed migration-ledger module under `packages/public-content`.
- A legacy migration-data adapter over that canonical module.
- Astro evidence and migration components with semantic static HTML and zero
  client JavaScript.
- Exhaustive route-kind selection in the Astro catch-all route.
- Cross-renderer content, metadata, evidence-link, and migration-row parity.
- Focused truth review of every new public trust, documentation, migration,
  cleanup, redirect, rollback, and hosting claim.
- Desktop, tablet, and mobile rendered review for all three new Astro routes.

### Excluded

- Homepage, `/products/`, product gateways, Axal marketing routes, or their
  legacy data.
- Sanchika packages, final brand styling, or design-system adoption.
- Runtime documentation search, client-side filtering, analytics, telemetry,
  forms, islands, or third-party scripts.
- Pages enablement, DNS, CNAME, redirects, sitemap cutover, production hosting,
  or private-app cleanup.
- Changing any migration row from pending or cleanup-blocked without separate
  hosted, redirect, rollback, and cleanup-PR evidence.
- Deleting the legacy site renderer, `src/render-site.mjs`, legacy CSS, or the
  legacy build pipeline.
- New general-purpose check scripts, recurring workflows, scorecards, or
  governance frameworks.

## Approaches considered

### 1. Typed evidence routes plus a dedicated migration route — selected

Use one reusable evidence-page contract for `/trust/` and `/docs/`, and one
dedicated migration contract for `/migration/`. Keep route metadata in the
manifest and move the large operational ledger into a typed canonical module.

This keeps the route union honest, makes the migration data reusable without
bloating generic page records, and gives both renderers one source for every
meaningful claim.

### 2. Reuse `resource` routes and special-case migration — rejected

This would require proof and action fields that do not express trust or
documentation semantics. The catch-all would still need a migration exception,
and future checks would have to infer intent from slugs rather than types.

### 3. Build three page-specific data and component paths — rejected

This is locally flexible but duplicates metadata, link validation, legacy
adapters, and verification. It also makes the final legacy-renderer deletion
harder because each route would have a different ownership model.

## Route contracts

Extend `PublicRoute` to four discriminated variants:

```ts
type PublicRoute =
  | PublicResourceRoute
  | PublicPolicyRoute
  | PublicEvidenceRoute
  | PublicMigrationRoute;
```

All variants retain `PublicRouteBase`: route identity, canonical metadata,
preview robots, heading copy, sections, and visual signal terms.

### Evidence routes

`PublicEvidenceRoute` is used by `/trust/` and `/docs/`:

```ts
interface PublicEvidenceLink {
  description: string;
  href: string;
  label: string;
}

interface PublicEvidenceRoute extends PublicRouteBase {
  evidenceLinks: PublicEvidenceLink[];
  kind: "evidence";
}
```

Every link must be an internal trailing-slash route or HTTPS URL. Evidence links
must be non-empty, uniquely identified by URL within a route, and have a clear
label and description. Fields that belong to resource, policy, or migration
routes are rejected.

`/docs/` links to the repository's canonical migration plan, route ledger,
release gates, visual-testing guide, public-claim policy, and review-rectify
guide. `/trust/` links to the public security policy, public-claim policy,
dependency policy, contributor/repository governance evidence, and relevant
review guidance. Links target the public repository on GitHub until a separately
approved increment publishes first-class documentation routes.

### Migration route

`PublicMigrationRoute` is used only by `/migration/`:

```ts
interface PublicMigrationStep {
  body: string;
  label: string;
}

interface PublicMigrationRoute extends PublicRouteBase {
  kind: "migration";
  steps: PublicMigrationStep[];
}
```

The manifest owns the route's metadata, intro, explanatory sections, and ordered
migration steps. The operational family and route rows remain a separate typed
module because they are a shared evidence dataset rather than presentation
fields. The schema requires non-empty steps with unique labels and rejects
evidence, policy, and resource-only fields.

## Canonical migration ledger

Move ledger ownership to
`packages/public-content/src/complyeaze.migration-ledger.ts`. It exports typed,
validated family and route records plus a definition helper that fails fast on
invalid data.

The canonical contract preserves every current field:

- Family: source, destination, status, cleanup, parent cleanup, evidence, and
  rollback.
- Route row: source host and route, destination host and route, cleanup status,
  evidence status and URL, redirect status and plan, cleanup PR, rollback, and
  rollback owner or command path.

Validation preserves existing invariants and brings them to the data boundary:

- Family names and host-plus-source-route identities are unique.
- Hosts are lowercase hostnames without protocols or paths.
- Source and destination routes are root-relative.
- Required fields are non-empty.
- Cleanup remains explicitly blocked and evidence explicitly pending in this
  preview-only increment.
- Parent cleanup requires a separate private-app cleanup PR.
- No production evidence URL or cleanup PR is invented.

`src/migration-data.mjs` becomes a thin re-export or mapping adapter for the
legacy renderer. `scripts/public-checks/migration-ledger.mjs` imports the
canonical package module rather than the adapter, while continuing to compare
the ledger with `docs/ROUTE_MIGRATION_LEDGER.md` and rendered output.

The Markdown ledger remains a reviewed evidence mirror, not a second runtime
data source. Automatic Markdown generation is out of scope because it would add
new workflow and formatting surface during the governance freeze.

## Rendering architecture

Use focused Astro components:

1. `PublicEvidencePage.astro` renders the introduction, explanatory sections,
   and evidence-link list for `/trust/` and `/docs/`.
2. `PublicMigrationPage.astro` renders the introduction, ordered migration
   steps, family summaries, and the route-level ledger.
3. `PublicMigrationLedger.astro` owns only the ledger's semantic definition
   lists and route table/card presentation.
4. `PublicPageLayout.astro` continues to own the document, metadata, canonical
   URL, preview label, skip link, focus behavior, shared width, and policy
   footer links.

The catch-all page switches exhaustively on `route.kind`. An unhandled route
kind is a type error rather than a silent fallback to the resource component.
No route selection depends on a slug string.

Keep the rollback renderer modular as the new contracts land:

1. `src/render-evidence.mjs` renders canonical sections and evidence links for
   legacy `/trust/` and `/docs/` output.
2. `src/render-migration.mjs` owns the legacy migration steps, family summaries,
   and route table currently embedded in `src/render-site.mjs`.
3. `src/render-site.mjs` dispatches by the adapted route type and retains only
   the shared document shell and high-level page selection.

This extraction is part of the route port because otherwise evidence-link
parity would grow an already large shared renderer and preserve slug-based
migration dispatch that the typed route union is intended to remove.

On wide screens, migration rows use a semantic table. At the existing
responsive threshold, each row becomes a labelled stacked record using the
same `data-label` pattern as the legacy page. Long hosts, routes, evidence text,
and cleanup language must wrap without horizontal page overflow.

Styles remain component-scoped and transitional. They may improve legibility,
focus, spacing, and responsive behavior but must not introduce a competing
token system before Sanchika adoption.

## Legacy adapter and rollback

The legacy `pages` export continues to include `/trust/`, `/docs/`, and
`/migration/`, but those records are derived from the canonical manifest.
Legacy migration rendering consumes the canonical ledger through
`src/migration-data.mjs`. Focused evidence and migration renderers consume the
adapted records so the legacy output includes the canonical evidence links and
every migration step and ledger value.

The legacy `dist/` build remains the deployable rollback baseline. Astro emits
parallel preview output under `apps/complyeaze/dist`. Both outputs must contain
the same title, description, eyebrow, heading, summary, section copy, evidence
link labels and URLs, migration steps, family summaries, and route rows.
Renderer-specific wrapper text and styles may differ.

Rollback is a revert of the implementation commit. This increment changes no
hosting, redirects, private routes, or production traffic.

## Content and claim rules

- Preserve the explicit exclusion of taxpayer data, credentials, tenant data,
  private deployment details, and production screenshots.
- Do not imply government, GSTN, CBIC, browser-store, statutory, security,
  uptime, hosting, or production-cutover approval.
- Link trust claims to public source evidence; narrow or remove claims that the
  repository cannot support.
- Describe `/docs/` as a curated public runbook index, not comprehensive product
  documentation or authenticated-app support.
- Keep every ledger row pending and cleanup-blocked until a later evidence PR
  supplies hosted-route, redirect, rollback, and private cleanup proof.
- Do not represent Astro preview output, CI artifacts, or visual screenshots as
  hosted-route evidence.

## Error handling and validation

- Manifest parsing fails before build on unknown route kinds, wrong-kind fields,
  empty arrays, unsafe URLs, duplicate paths, or non-preview robots intent.
- Migration-ledger parsing fails before build on malformed hosts or routes,
  duplicate identities, missing evidence fields, or prematurely unblocked
  cleanup.
- The Astro route switch is exhaustive.
- Both build outputs fail verification when canonical values are absent or
  diverge.
- Schema and parity checks report the route, evidence label, and invalid or
  missing URL. Existing link checks continue to verify internal targets and URL
  safety; they do not claim live reachability of external GitHub documentation
  URLs.
- No client-side error state is needed because all data is statically validated
  during build.

## Verification design

Extend existing gates rather than adding a general check script:

- Route-schema fixtures cover valid evidence and migration routes, wrong-kind
  fields, empty or duplicate evidence links, unsafe URLs, empty or duplicate
  migration steps, malformed routes, and unknown kinds.
- Migration-ledger fixtures cover malformed hosts, non-root-relative routes,
  duplicate host-plus-route identities, missing fields, non-pending evidence,
  and non-blocked cleanup.
- `astro-core-routes.mjs` requires all ten migrated routes and verifies metadata,
  content, evidence links, steps, and legacy/Astro parity.
- `migration-ledger.mjs` reads canonical package data and verifies both
  `dist/migration/index.html` and
  `apps/complyeaze/dist/migration/index.html` contain all required evidence.
- Existing public-claim scanning includes the canonical manifest and migration
  module.
- Link and metadata checks cover the three new Astro outputs without adding
  them to the production sitemap while preview `noindex` remains active.
- The workspace gate continues to reject script tags and emitted JavaScript.
- Visual checks cover the three new Astro routes at desktop, tablet, and mobile
  widths, increasing the current matrix from 90 to 99 cases if no other route
  count changes.
- Manual rendered review checks first viewport clarity, keyboard focus, long
  route wrapping, table-to-stacked-record behavior, and reduced motion.
- The full repository verification gate and `git diff --check` pass before the
  implementation commit.

## Governance disposition

`AGENTS.md` and `docs/REVIEW_RECTIFY.md` already require a local Codex review of
the complete intended diff before every commit, rectification of every valid
finding, current-head GitHub Codex review after every push, thread response and
resolution, and repetition until clean.

This increment does not change those files unless implementation exposes a
specific missing invariant. Avoiding a restatement-only edit respects the
governance freeze and keeps governance changes tied to demonstrated need.

The design-document commit and every implementation commit follow the existing
review-rectify rules. Any finding is recorded with severity, disposition, and
evidence in the PR body.

## Acceptance criteria

- `/trust/`, `/docs/`, and `/migration/` are statically emitted by Astro.
- The ComplyEaze route manifest validates ten migrated routes.
- Trust and docs evidence links are typed, public-safe, and rendered in both
  outputs.
- One typed canonical ledger supplies both renderers and the migration checks.
- The full host-aware ledger appears accessibly at desktop, tablet, and mobile
  widths without page overflow.
- Legacy and Astro outputs agree on all canonical content and evidence.
- Preview routes remain `noindex, nofollow`, absent from production sitemap
  claims, and emit zero client JavaScript.
- No cleanup, redirect, hosting, or private-app change is claimed.
- Focused and full verification pass.
- Local pre-commit and current-head GitHub review-rectify loops are clean.

## Implementation sequence

1. Extend and test the route and migration-ledger contracts.
2. Move trust, docs, migration metadata, and ledger data into canonical package
   ownership; add legacy adapters.
3. Add Astro evidence and migration components and exhaustive dispatch.
4. Rewire existing checks for ten-route parity and dual-renderer ledger proof.
5. Run focused checks, full gates, and the 99-case visual matrix.
6. Perform local Codex review, rectify all valid findings, and commit.
7. Push, open the implementation PR, obtain current-head GitHub Codex review,
   handle every review thread, and merge only after all required checks pass.

## Written-spec review gate

Implementation must not begin until this committed specification receives
explicit written-spec approval. Requested changes return to this document and
the spec review loop before an implementation plan is written.
