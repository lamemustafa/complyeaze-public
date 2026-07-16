# Astro Axal six-route port implementation plan

**Design:** `docs/features/astro-axal-route-port-design.md`

**Branch:** `tapish-codex/astro-axal-route-port`

**Base:** `origin/main` at `0c3500335c4203300a98de31a5a3e90a190f5427`

## Objective

Port the six public Axal marketing routes into `apps/axal` from one validated,
typed manifest. Preserve the established live Axal identity and customer-safe
meaning, substitute a synthetic workbench for the private product screenshot,
and keep the existing twenty-page renderer as the rollback build.

## Success criteria

- `axal.routes.json` contains exactly one `axal-home` and five `axal-detail`
  routes at the final Axal-host paths;
- Axal validation is isolated from the already-large generic schema module and
  rejects unsafe actions, broken relations, cross-kind fields, and duplicate
  evidence;
- the six legacy `/products/axal/*` records derive from the validated manifest;
- `apps/axal` renders the six clean routes from shared layout and page
  components without duplicated page copy;
- signup and login remain absolute links to the current Axal app;
- the homepage workbench is semantic, synthetic, visibly labelled, and free of
  taxpayer, customer, credential, portal, deadline, and financial data;
- all routes use the current Axal purple, warm-neutral, Cormorant, and Outfit
  identity with responsive, accessible, zero-JavaScript rendering;
- all routes remain `noindex, nofollow` and absent from the sitemap;
- the claim-source matrix records retained, qualified, and excluded claims;
- the legacy build remains exactly twenty pages;
- the visual inventory contains exactly forty-one pages and 123 viewport rows;
- focused tests, full gates, rendered review, current-head review, exact-head
  merge, post-merge CI, and task-owned cleanup all pass.

## Explicit non-goals

- authenticated Axal routes, signup/login implementation, lead capture, or
  tenant data;
- private application, portal, document, credential, queue, database, or
  infrastructure changes;
- production screenshots or customer artifacts;
- hosting, DNS, redirects, indexing, canonical cutover, or private cleanup;
- statutory logic, legal advice, or unsupported readiness claims;
- Sanchika, Tailwind, dependency upgrades, or a new Axal visual direction;
- deletion of the legacy renderer or its twenty-route rollback output.

## Preflight

1. Confirm the branch is clean apart from committed planning files and still
   based on current `origin/main`.
2. Read the current manifest/schema, Axal legacy data/renderer, Astro app,
   route tests, migration ledger, and visual inventory.
3. Run the focused baseline:

   ```bash
   node scripts/check-public-repo.mjs --test
   node scripts/check-public-repo.mjs --lint
   ```

4. Use the six verified current Axal pages only as public design/content
   evidence. Do not copy runtime scripts or the production workspace image.

## Slice 1 - typed Axal contract and six-route inventory

### RED

Add focused fixtures and route-manifest assertions requiring:

- valid `axal-home` and `axal-detail` routes;
- rejection of missing audience, boundary, actions, workflow content, FAQs,
  related routes, workbench labels, or evidence;
- rejection of unsafe/external internal links, non-HTTPS external actions,
  internal signup/login actions, duplicate evidence, invalid related routes,
  cross-kind fields, and mismatched slug/path values;
- exactly six Axal routes at the approved clean paths.

Run the focused public tests and confirm they fail because the Axal contract
and manifest do not exist.

### GREEN

- add focused Axal route types and validation under
  `packages/public-content/src/`;
- delegate manifest validation from the shared schema without growing its
  existing route-kind branch ladder;
- add `packages/public-content/src/axal.routes.json` with one home and five
  detail records;
- add `docs/evidence/axal-public-route-claims.md` and reconcile every retained,
  qualified, and excluded claim.

Rerun focused tests and the content package typecheck until green.

## Slice 2 - canonical legacy adapter and rollback parity

### RED

Add source/build assertions requiring:

- legacy Axal data to import and validate `axal.routes.json`;
- all six legacy paths to derive from the canonical records;
- legacy output to contain canonical headings, boundaries, and actions;
- no duplicate page-specific Axal marketing arrays;
- the complete legacy build to remain exactly twenty pages.

Run the focused tests and confirm failure against the current duplicated legacy
records.

### GREEN

- replace `src/axal-data.mjs` and `src/axal-more-data.mjs` with one narrow
  manifest adapter, deleting the obsolete duplicate source;
- update `src/render-axal.mjs` to consume the canonical shape while preserving
  legacy output paths;
- change legacy CSS only where the new semantic content needs safe wrapping,
  focus, or responsive treatment.

Build the legacy site and rerun focused parity checks.

## Slice 3 - shared Axal Astro layout and typed route dispatch

### RED

Add source/build assertions requiring:

- a shared Axal page layout and explicit home/detail components;
- the clean root and five detail outputs with no alternate nested paths;
- canonical/OG/Twitter metadata for the Axal origin;
- exactly one main landmark and H1, a skip link, labelled navigation, visible
  current state, and no script tags;
- external signup/login actions and clean internal Axal exploration links.

Run focused tests and confirm the missing Astro routes/components fail.

### GREEN

- replace the foundation root with validated manifest rendering;
- add shared header, footer, home page, detail page, and synthetic-workbench
  components under `apps/axal/src/`;
- generate five detail pages from the typed manifest;
- keep route dispatch exhaustive and page-specific copy in the manifest only;
- self-host Cormorant and Outfit only after confirming upstream licenses and
  committing the applicable license files.

Run Axal typecheck/build and focused tests until green.

## Slice 4 - faithful visual system, accessibility, and safety

### RED

Add deterministic source/build checks requiring:

- the established Axal purple and typography tokens;
- the exact synthetic-workbench disclosure;
- no private screenshot/image asset or sensitive identifier pattern;
- visible focus, reduced-motion handling, 44px critical targets, and safe long
  text wrapping;
- no client JavaScript in any Axal output.

Confirm the checks fail against the foundation page.

### GREEN

- implement the approved current-page visual hierarchy and density;
- preserve compact radii, restrained shadows, navigation, product storytelling,
  workflows, FAQs, related routes, and footer treatment;
- make the workbench understandable when linearized at mobile widths;
- avoid every experimental design direction rejected during brainstorming.

Run the Impeccable detector and browser-backed critique/audit. Rectify all
Critical/High and low-cost Medium findings.

## Slice 5 - ledger, status, and forty-one-page visual inventory

### RED

Update focused assertions to require:

- all six Axal rows marked as typed preview parity while cleanup remains
  blocked;
- `/status/` and `/changelog/` to describe the six-route preview without
  implying hosting or cutover;
- typed manifest discovery to replace the explicit Axal foundation target;
- exactly forty-one visual pages and 123 viewport records.

Run focused tests and confirm the current thirty-six-page inventory fails.

### GREEN

- update the migration ledger, status, and changelog conservatively;
- remove the explicit Axal foundation visual target;
- let typed manifest discovery provide the six clean Axal targets;
- set the exact expected visual inventory to forty-one.

Run the full visual matrix at desktop, tablet, and mobile, then perform focused
320px, 200% text, keyboard, reduced-motion, and zero-script checks for all six
routes.

## Verification and review

After each slice, run the smallest relevant check. Before the implementation
commit and again on the final pushed head, run:

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

Inspect rendered screenshots and structured visual rows rather than relying on
exit codes alone. Review the full diff for architecture, public boundaries,
claim provenance, accessibility, responsive behavior, test coverage, and
simplicity. Fix every valid blocking finding and low-cost non-blocking finding.

## Commit and PR lifecycle

1. Commit the approved design and this plan as planning history.
2. Commit implementation only after focused and full local gates pass.
3. Push `tapish-codex/astro-axal-route-port` and open one ready PR.
4. Request current-head `@codex review` and monitor all required checks.
5. Inspect flat comments, reviews, inline comments, and GraphQL review threads.
6. Address valid feedback test-first; reply with evidence and resolve threads.
7. Merge only the unchanged reviewed head with squash and
   `--match-head-commit` after all gates are green.
8. Verify reviewed-tree/merged-tree equality, post-merge `main` CI, and both
   expected evidence artifacts.
9. Poll once for late feedback, fast-forward the base clone, and delete only
   the clean merged task branch and worktree locally and remotely.

## Remaining ledger after this increment

All twenty legacy routes will have typed Astro preview parity. The next P1
increment is the final cleanup PR: make typed manifests the sole build/visual
discovery source and delete obsolete custom renderers/adapters only after the
twenty-route rollback, metadata, and migration-ledger contracts are proven.

Production hosting, DNS, redirects, indexing, private cleanup, and Sanchika
adoption remain later separately approved work.
