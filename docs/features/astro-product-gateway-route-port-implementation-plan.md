# Astro product-gateway route port implementation plan

**Design:** `docs/features/astro-product-gateway-route-port-design.md`

**Branch:** `tapish-codex/astro-product-gateway-route-port`

**Base:** `origin/main` at `63fb72d8580acee535012577fffa50739a610de0`

## Objective

Port `/products/pack/` and `/products/tools/` into the canonical typed
ComplyEaze manifest and Astro app. Keep the legacy twenty-route generator as
the rollback baseline, route Pack and Tools product cards through their family
gateways, and prove customer-safe content, metadata, accessibility, zero client
JavaScript, and legacy/Astro parity.

## Success criteria

- the typed ComplyEaze manifest contains exactly fourteen routes;
- both new routes use an explicit `gateway` discriminant;
- gateway validation requires product identity, external primary action,
  internal secondary action, and unique HTTPS evidence links;
- Pack and Tools cards on `/products/` link to the internal gateways;
- the legacy gateway data derives from the typed manifest;
- customer pages contain no migration-ledger, cleanup, review-gate, or
  deployment methodology;
- Astro dispatch is exhaustive and renders a dedicated gateway component;
- Products navigation is current on nested product routes;
- the legacy build remains exactly twenty routes;
- typed previews remain `noindex, nofollow`, absent from the sitemap, and emit
  zero client JavaScript;
- the visual inventory contains exactly thirty-six pages and 108 viewport
  records with no findings;
- focused checks, the full public gate, local review, current-head GitHub Codex
  review, required CI, merge-tree verification, post-merge CI, and cleanup are
  complete.

## Explicit non-goals

- Axal route ports;
- Sanchika, Tailwind, final brand craft, imagery, or token work;
- hosting, Pages, DNS, redirects, indexing, or private-app cleanup;
- Pack extension or Tools utility implementation;
- new product claims not backed by current Pack or Tools public evidence;
- GitHub ruleset or governance-policy changes.

## Preflight

1. Confirm the task worktree is clean and based on current `origin/main`.
2. Install the existing lockfile offline with scripts disabled if dependencies
   are not already linked:

   ```bash
   pnpm install --frozen-lockfile --ignore-scripts --offline
   ```

3. Run the current focused baseline:

   ```bash
   node scripts/check-public-repo.mjs --test
   node scripts/check-public-repo.mjs --lint
   ```

4. Verify Pack and Tools customer claims against current product-owned public
   hosts and source repositories. Record only public, non-sensitive evidence.

## Slice 1 — typed gateway contract and route inventory

### RED

Update `scripts/public-checks/astro-core-routes.mjs` with fixtures that require:

- a valid gateway route;
- rejection of missing product, primary action, secondary action, sections, or
  evidence links;
- rejection of internal primary destinations, external secondary destinations,
  unsafe URLs, duplicate evidence URLs, and cross-kind fields;
- required `/products/pack/` and `/products/tools/` routes;
- exactly fourteen typed ComplyEaze routes.

Run:

```bash
node scripts/check-public-repo.mjs --test
```

Confirm the failure names the missing gateway contract and route inventory.

### GREEN

- add `packages/public-content/src/gateway-route-types.ts`;
- extend `packages/public-content/src/schema.ts` with the gateway discriminant,
  validation, and exported type;
- add both canonical gateway records to
  `packages/public-content/src/complyeaze.routes.json`;
- update `/status/` and `/changelog/` to record gateway parity and retain Axal
  as pending.

Run the focused test and package typechecks until green.

## Slice 2 — canonical legacy adapter and customer-safe rendering

### RED

Extend focused source/build checks so they fail unless:

- `src/gateway-data.mjs` imports and validates the canonical manifest;
- no duplicated gateway arrays remain;
- both legacy gateway routes contain canonical route values;
- customer gateway output omits `migration ledger`, `route cleanup`, `cleanup
  blocked`, `review gate`, and deployment methodology;
- primary actions point to the product-owned hosts;
- secondary actions return to `/products/`;
- labelled evidence links render with their descriptions.

Run the focused test and confirm it fails against the legacy source.

### GREEN

- replace `src/gateway-data.mjs` with a narrow manifest adapter;
- update `src/render-gateway.mjs` to render canonical actions, sections, and
  evidence links;
- update `src/gateway.css` only as required for semantic link rows, wrapping,
  focus targets, and responsive behavior;
- preserve legacy route identity and output paths.

Build the legacy site and rerun the focused parity check.

## Slice 3 — Astro gateway component and exhaustive dispatch

### RED

Add source/build assertions that require:

- `PublicGatewayPage.astro`;
- an explicit `route.kind === "gateway"` branch in the catch-all;
- semantic gateway actions and evidence links;
- exactly one `h1`, a main landmark, skip link, canonical metadata, preview
  robots, and no script tags;
- both nested route outputs and no accidental alternate paths.

Run the focused test and confirm the missing component/branch failure.

### GREEN

- add `apps/complyeaze/src/components/PublicGatewayPage.astro`;
- extend `apps/complyeaze/src/pages/[...slug].astro` exhaustively;
- reuse the transitional P1 layout and line-based visual language;
- keep all content server-rendered and static.

Run Astro typecheck/build plus the focused public test.

## Slice 4 — product-family navigation and link semantics

### RED

Add assertions that require:

- Pack and Tools product hrefs to be `/products/pack/` and
  `/products/tools/`;
- Axal to retain its current external destination;
- nested product routes to mark Products as current;
- every internal link to resolve in the Astro build;
- no internal migration methodology in gateway data or HTML.

Run the focused test and confirm the external-link/exact-match navigation
failure.

### GREEN

- update the canonical product-family records;
- add one small primary-navigation current-state helper in
  `PublicPageLayout.astro`;
- update legacy adapters automatically through canonical data;
- avoid unrelated footer or navigation redesign.

Run focused tests, legacy build, Astro build, link check, and metadata check.

## Slice 5 — visual inventory and responsive evidence

### RED

Update the visual inventory assertion to expect thirty-six page targets. Run
the focused test before adding the new expectation and confirm the count
failure identifies the two missing typed gateway targets.

### GREEN

- let typed manifest discovery add the two Astro targets;
- set the exact expected visual target count to thirty-six;
- run the complete visual matrix for desktop, tablet, and mobile;
- verify 108 PNG files and 108 structured summary records;
- run focused Chromium checks at 320 CSS pixels and 200% zoom for both gateway
  routes;
- inspect headings, landmarks, focus, 44px targets, contrast, reduced motion,
  long-copy wrapping, external links, and zero client JavaScript.

## Review and verification

Run the smallest relevant check after every slice. Before each commit, run the
complete intended diff through local review and then run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm public:check
pnpm links:check
pnpm metadata:check
git diff --check
pnpm visual:check
```

If the package-manager wrapper cannot verify its online signature, run the
exact underlying project scripts and workspace-local binaries offline, then
require GitHub CI to prove the normal pnpm wrapper commands.

Run the Impeccable detector and a brand-register critique/audit over the changed
Astro component and layout. Fix all Critical and High findings and low-cost
Medium findings. Record any accepted lower-severity follow-up with evidence.

## Commit and PR lifecycle

1. Commit the approved design and implementation plan as the planning commit.
2. Commit implementation only after final local review and full gates pass.
3. Push `tapish-codex/astro-product-gateway-route-port`.
4. Open one focused ready PR with scope, public-safety, rollback, review
   dispositions, verification, and visual evidence.
5. Request `@codex review` after the latest push.
6. Monitor `Public site gates`, `Review gate`, GitGuardian, flat comments,
   reviews, inline comments, and GraphQL review threads.
7. Address valid feedback test-first, rerun focused/full gates, push, and
   request a new current-head review.
8. Merge only the exact reviewed head using squash and `--match-head-commit`.
   Do not change the GitHub ruleset in this task.
9. Verify the merge tree equals the reviewed head tree.
10. Verify the `main` push CI and both expected artifacts.
11. Poll once more for late feedback.
12. Fast-forward the base clone and delete only the clean merged task branch
    and task worktree locally and remotely.

## Remaining ledger after this increment

Record the six remaining P1 routes:

- `https://axal.complyeaze.com/`;
- `/ca-practice-management-software/` on the Axal host;
- `/gst-notice-management-software/` on the Axal host;
- `/compliance-calendar-software-india/` on the Axal host;
- `/gst-reconciliation-evidence-review/` on the Axal host;
- `/client-document-collection-portal-access/` on the Axal host.

The recommended following increment is the six-route Axal marketing port,
split into root/detail PRs only if the current review surface cannot be proved
cleanly as one bounded change.
