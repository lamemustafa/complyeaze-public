# Astro policy-route port design

**Status:** Approved design, awaiting written-spec review

**Tranche:** Phase 2, P1 — custom renderer to multi-app Astro workspace

**Routes:** `/privacy/`, `/terms/`, `/status/`, `/changelog/`, `/release-evidence/`

## Outcome

Port the five public policy, status, changelog, and release-evidence routes to
the ComplyEaze Astro app without creating another content source or claiming a
production cutover. The typed manifest becomes canonical for these routes and
the already-ported `/about/` and `/contact/` routes. The legacy renderer remains
the temporary rollback baseline and adapts the same manifest.

This increment improves visible Astro coverage and removes duplicated policy
content from `src/policy-data.mjs`. It does not redesign customer pages, adopt
Sanchika, enable deployment, or delete the legacy renderer.

## Current state

- PR #35 established the three-app Astro workspace and shared package
  boundaries.
- PR #36 ported `/about/` and `/contact/` using
  `packages/public-content/src/complyeaze.routes.json` and proved legacy/Astro
  content parity.
- The five policy routes still get their content from `src/policy-data.mjs` and
  render only through the legacy string renderer.
- Some policy copy describes the pre-Astro build and dependency surface, so a
  literal copy would preserve claims that are no longer current.
- Pages deployment remains disabled. The Astro routes are migration previews,
  not production ownership evidence.

## Scope

### Included

- One canonical typed manifest for all seven currently ported ComplyEaze routes.
- A discriminated route contract for resource and policy routes.
- Astro policy pages with semantic static HTML and zero client JavaScript.
- A shared document shell with route-type-specific content components.
- A legacy policy-data adapter over the canonical manifest.
- A legacy policy renderer that consumes the canonical policy summary instead
  of hardcoded strip copy.
- A focused truth audit of policy/status/release copy affected by the Astro
  migration and dependency changes.
- Cross-renderer content parity, metadata, route, sensitive-content, link,
  accessibility, responsive, reduced-motion, and zero-JavaScript verification.
- Desktop, tablet, and mobile evidence for all five added Astro routes.

### Excluded

- Sanchika packages, app-source imports, or final brand styling.
- Customer homepage, product-family, Axal, Pack, or Tools redesign.
- Runtime forms, analytics, telemetry, islands, or third-party scripts.
- Production DNS, Pages enablement, redirects, canonical-host cutover, or
  private-app cleanup.
- Sitemap inclusion for preview-only Astro routes.
- Deletion of `src/render-policy.mjs`, the legacy site renderer, or legacy CSS.
- New check scripts, workflows, recurring automation, or governance documents.

## Route model

Extend the existing public-content schema into a discriminated union:

```ts
interface PublicRouteBase {
  description: string;
  eyebrow: string;
  heading: string;
  kind: "resource" | "policy";
  robots: "noindex, nofollow";
  sections: PublicSection[];
  signalTerms: string[];
  slug: string;
  summary: string;
  title: string;
  urlPath: string;
}

interface PublicResourceRoute extends PublicRouteBase {
  kind: "resource";
  primaryAction: PublicAction;
  proof: string[];
  secondaryAction: PublicAction;
}

interface PublicPolicyRoute extends PublicRouteBase {
  kind: "policy";
  policySummary: {
    evidence: string;
    excluded: string;
    scope: string;
  };
}
```

Validation remains strict by route kind. Resource routes must retain two safe
actions and proof items. Policy routes must retain a three-part summary and may
not acquire resource-route actions or proof merely to satisfy a generic shape.
All routes keep clean trailing-slash paths, matching slugs, unique paths,
non-empty sections, HTTPS or safe internal links, and preview `noindex` intent.

The existing `complyeaze.routes.json` remains the only manifest. A second
policy manifest is intentionally rejected because it would make route ordering,
uniqueness, visual discovery, and future legacy deletion harder to reason about.

## Rendering architecture

Use three focused Astro components:

1. `PublicPageLayout.astro` owns the HTML document, metadata, canonical URL,
   shared header/footer, skip link, base focus behavior, shared width/type rules,
   and a content slot. Its footer retains the current explicit `/privacy/` and
   `/terms/` links on every rendered policy route.
2. `PublicResourcePage.astro` owns actions, resource sections, and the proof
   panel for `/about/` and `/contact/`.
3. `PublicPolicyPage.astro` owns the policy summary strip and policy section
   stack for the five new routes.

The catch-all page validates the manifest during `getStaticPaths`, selects the
content component by `route.kind`, and passes the route through the shared
layout. No client directive, hydration instruction, or runtime script is added.

Styles remain component-scoped and deliberately transitional. They must be
responsive, keyboard-visible, reduced-motion-safe, and visually reviewable, but
they must not create a competing token system before Sanchika v0.1 adoption.

## Legacy adapter and rollback

`src/root-resource-data.mjs` filters canonical routes with `kind: "resource"`
and maps them to the legacy root-resource shape. `src/policy-data.mjs` is reduced
from a second content source to an adapter that filters `kind: "policy"` and
maps those routes to the legacy policy shape, including `policySummary`.
`src/render-policy.mjs` renders the three summary values from that adapted page
instead of hardcoding scope, evidence, and excluded copy. This keeps the
rollback renderer on the same user-visible content contract as Astro.

The legacy `dist/` build continues to be the deployable rollback baseline for
this increment. The Astro app produces parallel preview output under
`apps/complyeaze/dist`. Both outputs must contain the same canonical title,
description, eyebrow, heading, summary, section titles, and section bodies.
Policy summary values must also match. Renderer-specific wrapper labels and
styles may differ.

Rollback is a revert of the implementation commit. Because this PR does not
change deployment, DNS, redirects, or private-app routes, reverting restores the
previous dual-source local build without a production traffic change.

## Content truth audit

Preserve the legal and safety meaning of privacy and terms content. Change only
claims made stale or misleading by the merged Astro workspace:

- Replace product-facing `ComplyEaze Public` metadata with `ComplyEaze` while
  retaining precise references to the public repository where relevant.
- Update status copy so it describes the actual multi-app Astro preview and the
  still-active legacy rollback build.
- Add concise changelog entries for the workflow retuning, Astro workspace, and
  first route port while preserving historical entries as history.
- Replace release-evidence claims that say only `scripts/build-site.mjs` and
  `src/site-data.mjs` own output.
- Replace dependency claims that say Playwright is the only reviewed development
  surface; the current catalog also includes Astro, Astro Check, and TypeScript.
- Keep explicit statements that artifacts and previews do not prove hosted
  cutover, redirects, production ownership, private-app health, or statutory
  correctness.
- Keep sensitive-data, trademark, government non-affiliation, and professional
  reliance boundaries intact.

No broad marketing rewrite is part of P1. Historical changelog entries remain
dated records rather than being rewritten to sound current.

## Verification design

Extend existing checks rather than adding a new check script:

- `schema.ts` fixtures cover both route kinds, wrong-kind fields, malformed
  entries, nested slugs, unsafe URLs, duplicate paths, and preview robots intent.
- `astro-core-routes.mjs` discovers all seven manifest routes and checks Astro
  output, legacy output, canonical metadata, expected content, policy summary,
  and safe links.
- `astro-workspace.mjs` continues to own the existing all-app assertion that
  built HTML has no script tags and no JavaScript files are emitted.
- `policy-pages.mjs` reads canonical policy data, validates required safety and
  evidence terms in both renderers, and rejects unsupported claims.
- `public-claims.mjs` adds the canonical JSON manifest to its scanned sources so
  risky-claim patterns continue to cover content after it leaves
  `src/policy-data.mjs`.
- `ci-artifacts.mjs` reads the canonical policy records rather than raw adapter
  source text, preserving its required `public-site-build` and
  `public-visual-evidence` reference checks after the content move.
- `root-resource-pages.mjs` continues to prove the resource adapter maps only
  resource routes.
- `visual-check.mjs` discovers the five additional routes through the existing
  manifest path and produces 30 page targets across three viewports: 90 cases.
- Existing sensitive-content, metadata, links, dependency, route-manifest, and
  CI artifact checks remain active.

Focused red-to-green order:

1. Add policy-route expectations and fixtures so missing Astro outputs and the
   duplicate legacy data source fail.
2. Add the discriminated schema and canonical policy records.
3. Refactor the shared layout and add policy/resource content components.
4. Convert both legacy data modules to manifest adapters and make the legacy
   policy renderer consume canonical summary values.
5. Update stale policy copy, risky-claim and CI-artifact scan inputs, required
   footer policy-link checks, and required-term assertions together.
6. Build, run focused checks, inspect rendered desktop/mobile evidence, then run
   the complete gate.

Required completion gate:

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

Before each commit, run a local Codex review over the complete intended diff,
rectify every valid finding, and rerun affected and full checks. After push,
obtain a current-head GitHub Codex review, reply to and resolve every actionable
thread, and rerun CI before requesting merge approval.

## Error handling

- Invalid manifest input fails the build with a route-indexed validation error.
- Missing legacy or Astro output fails the parity check with the affected URL.
- Unsupported or stale high-risk claim patterns fail the existing policy check.
- Unknown Astro slugs remain build-time 404s because only validated manifest
  entries are emitted by `getStaticPaths`.
- Preview links must resolve within the built app or be explicit HTTPS URLs.
- A failed visual, metadata, link, content, or parity check blocks the commit and
  PR rather than falling back silently to one renderer.

## Acceptance criteria

- All five policy/status routes build in `apps/complyeaze/dist`.
- `/about/` and `/contact/` continue to build without contract weakening.
- One manifest owns all seven ported routes.
- `src/policy-data.mjs` contains adapter logic but no duplicated policy copy.
- Legacy and Astro renderers match canonical metadata, policy summaries, and
  route content.
- Every rendered policy route retains footer links to `/privacy/` and `/terms/`.
- Risky-claim scanning covers the canonical JSON manifest.
- CI artifact checks resolve their required artifact references from canonical
  policy records rather than adapter source text.
- Stale build/dependency evidence statements are corrected against merged repo
  truth.
- Every Astro route remains `noindex,nofollow` and emits zero client JavaScript.
- Policy routes remain outside customer primary navigation.
- Ninety visual cases pass with no critical accessibility or responsive finding.
- The full public gate and `git diff --check` pass.
- The final local Codex review has no unresolved valid findings.
- The PR explicitly states that no cutover, redirect, deployment, or private-app
  cleanup is claimed.
