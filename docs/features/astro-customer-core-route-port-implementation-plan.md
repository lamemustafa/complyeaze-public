# Astro customer-core route port implementation plan

**Design:** `docs/features/astro-customer-core-route-port-design.md`

**Branch:** `tapish-codex/astro-customer-core-route-port`

**Target routes:** `/` and `/products/`

## Delivery standard

Follow observable red-green-refactor cycles. Do not change production code
before the focused assertion for that behavior fails for the expected reason.
Keep the legacy renderer buildable and keep Astro output preview-only.

## Slice 1 — typed route-contract red phase

Tests first in `scripts/public-checks/astro-core-routes.mjs`:

- valid `home` and `products` fixtures;
- root identity requires `slug: "index"` and `urlPath: "/"`;
- products require a non-empty product list;
- product names and destinations are unique;
- unsafe destinations/evidence links fail and evidence links are required;
- home/products fields fail on other route kinds and vice versa;
- `/` and `/products/` are required manifest routes;
- the typed manifest/Astro inventory is exactly twelve routes;
- customer routes reject repository-boundary branding and internal methodology;
- absolute product destinations are evidence-backed and any relative product
  destination resolves within the Astro build;
- `/status/` and `/changelog/` truthfully record the customer-core port.

Run `node scripts/check-public-repo.mjs --test` and confirm an expected missing
contract/route failure. After the minimal implementation, rerun the identical
command and require it to pass before the next slice.

Minimal green:

- add `PublicHomeRoute`, `PublicProduct`, and `PublicProductsRoute`;
- extend the route union and validator;
- add the two canonical records to `complyeaze.routes.json`;
- update canonical `/status/` migration-posture copy and `/changelog/` history
  so both legacy and Astro outputs report the customer-core port truthfully.

## Slice 2 — legacy canonical adapter red phase

Tests first:

- require a customer-route adapter;
- require legacy `/` and `/products/` to match canonical title, description,
  eyebrow, heading, summary, sections, actions, and product fields;
- require the legacy build inventory to remain exactly twenty outputs;
- reject Sanchika as a peer customer product;
- reject the route migration inventory and internal methodology in the product
  output and primary navigation.

Run the focused test and confirm it fails because customer routes still come
from duplicated legacy data:

```bash
node scripts/check-public-repo.mjs --test
```

Rerun the identical command after the minimal implementation and require it to
pass before the next slice.

Minimal green:

- add `src/customer-route-data.mjs`;
- derive legacy core pages and product data from the typed manifest;
- simplify legacy product rendering to the canonical product comparison and
  route sections;
- narrow primary navigation to customer-facing destinations;
- keep the legacy generator and transitional CSS.

## Slice 3 — Astro rendering red phase

Tests first:

- require `PublicHomePage.astro` and `PublicProductsPage.astro`;
- require the root index to read the canonical manifest rather than emit the
  foundation copy;
- require the catch-all to exclude the home route and reject `/index/` output;
- require explicit exhaustive rendering for every route kind;
- require semantic product definition lists, customer navigation, canonical
  metadata, preview robots, and both route outputs;
- require the production sitemap to exclude `/` and `/products/` while their
  Astro routes remain preview-only;
- require title, description, eyebrow, heading, summary, sections, actions, and
  product fields in both legacy and Astro HTML while keeping preview-only robots
  out of the legacy parity inventory;
- require no script tags or emitted JavaScript.

Run `node scripts/check-public-repo.mjs --test` and confirm it fails for the
missing components, explicit route-kind branches, and customer shell contract.
After the minimal source implementation, rerun the same test, then run:

```bash
pnpm build
node scripts/check-public-repo.mjs --public
```

The build/public pair must pass with both route outputs and canonical values.

Minimal green:

- implement the two focused Astro components;
- wire the root index and dynamic route renderer;
- update `PublicPageLayout` with customer-safe navigation and Sanchika footer
  colophon;
- keep styles component-scoped and transitional.

## Slice 4 — discovery and visual red phase

Tests first:

- remove the ComplyEaze foundation target expectation;
- require the canonical root and product routes in manifest-driven visual
  discovery;
- expect thirty-four pages and 102 route/viewport records when the route
  inventory is unchanged.

Run `node scripts/check-public-repo.mjs --test` and confirm the obsolete
ComplyEaze foundation target is the expected failure. After the minimal visual
discovery change, rerun the same test and `pnpm visual:check`; both must pass.

Minimal green:

- remove only the obsolete ComplyEaze foundation visual target;
- preserve Axal and Pack foundation coverage;
- keep manifest-driven typed-route discovery.

## Slice 5 — focused and full verification

Run the smallest affected commands first, then:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm visual:check
pnpm public:check
pnpm links:check
pnpm metadata:check
git diff --check
```

Inspect rendered `/` and `/products/` evidence at desktop, tablet, and mobile,
including one main and one `h1` with logical heading order, keyboard focus,
44-by-44px targets, reduced motion, long text/URLs, WCAG 4.5:1 normal-text and
3:1 large-text/focus contrast, 200% zoom/320px reflow, overflow, blank sections,
and broken controls. Confirm the homepage first viewport communicates the user
job, custody/reliance boundary, and next action at all three viewports.

Run Impeccable critique and audit evidence on the two route components and live
build. Rectify every valid Critical/High finding and every low-cost Medium/Low
finding. Repeat until no blocking or non-blocking finding remains.

## Slice 6 — commit and PR lifecycle

Before each commit:

- review the complete diff and rendered pages;
- classify architecture/content, accessibility/visual, and QA/public-safety
  findings;
- fix every valid finding, rerun focused checks, then rerun the full public gate
  listed in Slice 5, including for every review-fix commit.

After push:

- open one focused PR;
- request `@codex review` on the exact current head;
- monitor required Actions checks;
- inspect flat comments, reviews, requested changes, and GraphQL review threads;
- rectify valid findings, respond with evidence, resolve addressed threads, and
  repeat on every new head.

On the exact final pushed SHA, rerun the full local gate, confirm required
GitHub checks, and link the `public-site-build` and `public-visual-evidence`
artifacts. Squash-merge only with clean current-head review and zero unresolved
actionable threads or requested changes:

```bash
gh pr merge --squash --admin --match-head-commit <verified-head-sha>
```

## Slice 7 — post-merge closeout

- verify the merge tree equals the reviewed head;
- verify `main` push CI on the merge SHA;
- poll once more for late feedback;
- update local `main`;
- delete only the clean merged task-owned local/remote branch and worktree;
- record the eight remaining P1 routes, destination, and status:
  - `/products/pack/` -> Pack public gateway, next increment;
  - `/products/tools/` -> Tools public gateway, next increment;
  - legacy `/products/axal/` -> `https://axal.complyeaze.com/`, pending
    `apps/axal` implementation;
  - legacy `/products/axal/ca-practice-management-software/` -> same path on
    `axal.complyeaze.com`, pending;
  - legacy `/products/axal/gst-notice-management-software/` -> same path on
    `axal.complyeaze.com`, pending;
  - legacy `/products/axal/compliance-calendar-software-india/` -> same path on
    `axal.complyeaze.com`, pending;
  - legacy `/products/axal/gst-reconciliation-evidence-review/` -> same path on
    `axal.complyeaze.com`, pending;
  - legacy `/products/axal/client-document-collection-portal-access/` -> same
    path on `axal.complyeaze.com`, pending.
