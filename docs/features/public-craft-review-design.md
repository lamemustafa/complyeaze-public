# P3 public craft review routes design

**Status:** Approved

**Repository:** `complyeaze-public`

**Branch:** `tapish-codex/public-craft-review`

**Base:** `origin/main` at `285bc566e0e331e0f9ccddb47df6b66ee3396e47`

## Outcome

Build one noindex, synthetic-data craft review route for each public Astro app:

- `https://complyeaze.com/review/craft/`
- `https://axal.complyeaze.com/review/craft/`
- `https://pack.complyeaze.com/review/craft/`

The routes are high-fidelity, production-quality excerpts of plausible future
pages. They exist to let the owner judge the visual language and real Sanchika
compositions before the P4-P6 public rebuilds. They are not component galleries,
authenticated product screens, live product claims, or a substitute for the C3
human craft-approval checkpoint.

P3 adds exactly three canonical route records, increasing the route inventory
from 22 to 25 and the desktop/tablet/mobile evidence matrix from 66 to 75 cells.

## Chosen direction

The selected visual probe is **B: Ledger Atelier**. The direction uses the
logic of working documents, evidence registers, custody receipts, and human
annotations without drifting into the saturated editorial-magazine formula of
display serif, tiny mono labels, and decorative rules.

The three apps share Sanchika contracts but keep distinct product identities:

| App | Identity | Palette posture | Composition character |
| --- | --- | --- | --- |
| ComplyEaze | Evidence register | Deep teal, chalk white, redaction black | Calm archival hierarchy, route ownership, and proof-led trust |
| Axal | Human review desk | Aubergine, coral, clear light surfaces | Asymmetric decision workspace with evidence and reviewer checkpoints |
| Pack | Local custody instrument | Moss, near-black, fluorescent lime | Field-tool clarity, ordered custody flow, permissions, and provenance |

Color is committed but controlled. Each route has one dominant product color,
one high-salience accent, and neutral surfaces chosen for legibility. Body text
must meet WCAG 2.2 AA contrast, including muted copy and forced-colors mode.

P3 adds no font files or remote font dependency. Craft routes use deterministic
system stacks so identity comes from composition, density, hierarchy, and color
rather than an unapproved typeface. Pack may use the system monospace stack for
literal receipt and custody data; it is not a generic terminal theme. Font
selection and licensing remain part of later public-page approval.

## Scope boundaries

### In scope

- three static Astro routes with real Sanchika v0.1.0 pattern contracts;
- app-owned synthetic content and route-specific visual identity;
- zero authored client JavaScript;
- responsive desktop, tablet, and mobile compositions;
- a discreet reviewer-evidence panel at the end of each route;
- typed route, discoverability, content-safety, composition, accessibility,
  performance, and visual evidence checks;
- release evidence for all 25 canonical route records.

### Out of scope

- P4-P6 production public-page rebuilds;
- production deployment, DNS, host routing, redirects, or private-app cleanup;
- authenticated behavior, forms, accounts, uploads, databases, APIs, workers,
  portal automation, or taxpayer data;
- Sanchika package changes or a new Sanchika release;
- global navigation redesign or public sitemap expansion;
- a component explorer, design-system documentation site, or generic review
  framework;
- C3 approval. Only the owner can approve the craft direction after reviewing
  the evidence.

## Route and content architecture

The three records remain in their owning typed manifests. P3 does not introduce
a parallel lab manifest or a second route inventory.

Each app adds its own `craft-review` route kind and app-specific content type.
The only shared content contract is a narrow `CraftReviewEvidence` record with:

- `contentMode: "synthetic"`;
- `interactionMode: "zero-js"`;
- the exact Sanchika release;
- the exact composition names used by that route;
- the required accessibility checks;
- CSS, JavaScript, font, and layout-shift budgets.

Each craft record also carries `discoverability: "review-only"`. Existing route
records retain their current shape and use the registry's standard sitemap
posture by default. The canonical registry exposes the normalized
discoverability value.
The ComplyEaze sitemap filters out `review-only` records; Axal and Pack gain no
new sitemap. Tests prove all three craft URLs are absent from sitemap and
primary-navigation sources.

All craft routes retain `robots: "noindex, nofollow"`. They are reached by their
exact URL, not by product navigation; internal release evidence records their
existence without becoming a craft-route directory.

Rendering follows each app's existing Astro architecture:

- ComplyEaze resolves the record through its manifest-backed catch-all route and
  delegates `craft-review` to a focused craft component.
- Axal adds `src/pages/review/craft.astro` because its existing `[slug].astro`
  route deliberately owns only one-segment public paths.
- Pack adds `src/pages/review/craft.astro` beside its existing foundation root.

The Axal and Pack route files load their exact manifest records through the
owning validators; they do not embed a duplicate metadata or content source.

## Sanchika composition contract

Sanchika v0.1.0 provides semantic pattern contracts and CSS, not React/Astro
components or page templates. Each route therefore builds accessible Astro
markup matching the published anatomy and applies classes through the public
`patternClassName` entrypoint. Consumer CSS may style app-owned wrappers and
semantic roles, but must not copy package values, import private source files,
or target undocumented Sanchika internals.

### ComplyEaze craft route

The page reads as a concise evidence-register landing excerpt:

1. `PublicHero` in `with-proof-artifact` state introduces the public boundary,
   the synthetic review status, and one source action.
2. `ProductRouteMap` presents the product-family ownership map. The Sanchika
   colophon remains outside the peer-product list.
3. `ProofStrip` uses a semantic description list with label, value, source, and
   limitation; it must not become a row of vanity metrics.
4. A compact review-desk excerpt combines `ReviewDeskPreview`, `EvidencePanel`,
   and `HumanReviewCheckpoint` to show how evidence reaches human judgement.
5. A restrained colophon states the release contract and limitations.

The visual hierarchy is mostly light and chalk-white, anchored by deep teal and
redaction-black blocks. The first viewport must communicate product-family
ownership, evidence posture, and the review-only boundary without requiring a
scroll.

### Axal craft route

The page is an asymmetric human-review desk rather than a marketing card grid:

1. `ReviewDeskPreview` is the dominant composition, using a three-pane desktop
   anatomy that becomes an ordered single-column flow on small screens.
2. `WorkQueueRow` shows selected, waiting, ready, and overdue synthetic states.
3. `EvidencePanel` exposes available, requested, missing, and disputed evidence
   without implying live client records.
4. `HumanReviewCheckpoint` makes preparation, review-needed, held, approved,
   returned, and blocked outcomes legible.
5. `AuditTrailPreview` shows a short synthetic action history.
6. `PricingBlock` describes one future offer as review copy, not an available
   checkout or binding commercial commitment.
7. `FAQAccordion` uses native `details` and `summary`, with useful collapsed and
   expanded states and no client script.

Aubergine establishes the desk field; coral marks human attention and must not
be the sole carrier of status. Labels, icons, wording, and position preserve
meaning in monochrome and forced-colors modes.

### Pack craft route

The page is a local-custody instrument for evaluating Pack's privacy boundary:

1. `LocalArtifactFlow` is an ordered three-stage custody sequence with source
   and receipt evidence.
2. `CustodyBoundary` states what stays local, what is public metadata, and what
   is not transferred.
3. `PermissionExplainer` uses the `not-requested` posture. P3 must not render a
   fake enabled browser-permission action.
4. `SourceProvenanceStrip` records source, recency, limitation, and verification
   status.
5. `ReleaseStatusBanner` states the exact source-build alpha posture without
   implying Chrome Web Store or production availability.
6. A compact policy shell links to the public privacy, security, support, and
   source evidence already owned by the public repo.

Moss and near-black carry the custody field; fluorescent lime is reserved for
focus, verified local steps, and small status signals. The page must remain
readable in ordinary office light and must not resemble a generic dark developer
dashboard.

## Interaction and responsive behavior

The routes have no application state and no JavaScript hydration. Links,
native disclosure widgets, document order, focus, and CSS are sufficient.

- Navigation and every action are keyboard reachable in source order.
- `details/summary` is the only disclosure mechanism.
- Hover is never required to reveal content or meaning.
- Focus indicators remain visible on colored and neutral surfaces.
- Motion is limited to CSS emphasis that enhances an already-visible state.
  `prefers-reduced-motion: reduce` removes non-essential transitions.
- Desktop may use asymmetric multi-column compositions. Tablet reduces overlap
  and density. Mobile reorders the same semantic content into one readable
  column; it does not merely shrink the desktop canvas.
- Long business names, identifiers, evidence labels, and URLs wrap without
  clipping. No horizontal page overflow is permitted.
- Forced-colors mode preserves landmarks, borders, focus, status distinctions,
  and native disclosure affordances.

## Synthetic content and claim safety

Every operational value is visibly fictional and belongs to a single coherent
synthetic scenario. Content may use invented organisations, case labels,
timestamps, filenames, and receipt identifiers, but it may not use real GSTINs,
PANs, taxpayer names, client/workspace IDs, document excerpts, credentials, or
production screenshots.

Validators and checks reject:

- plausible real GSTIN/PAN patterns or repo-known sensitive identifiers;
- unsupported government approval, statutory advice, production readiness,
  store availability, or guaranteed outcome claims;
- a claim that P3 or automated checks satisfy C3;
- private repository imports or source-path imports from Sanchika;
- live form actions, account links presented as functional review behavior, or
  permission requests.

Each route identifies itself as synthetic, noindex, and review-only in visible
copy as well as metadata.

## Reviewer-evidence panel

The final section is a compact evidence receipt, not an internal debug console.
It reports only verifiable facts:

- app and exact `/review/craft/` path;
- Sanchika `v0.1.0` and composition names used;
- `synthetic` content and `zero-js` interaction posture;
- noindex, nofollow, review-only discoverability, and sitemap exclusion;
- keyboard, reduced-motion, forced-colors, and axe checks;
- measured JavaScript, CSS, critical-font, and CLS results;
- the explicit statement: `C3 human craft approval pending`.

The panel must not expose build paths, machine usernames, tokens, private repo
locations, or test-only implementation detail.

## Verification design

P3 extends existing checks instead of creating a generic governance system.

### Static and typed checks

Focused checks prove:

- each manifest has exactly one craft route at `/review/craft/`;
- all three routes use `noindex, nofollow` and `review-only` discoverability;
- the registry count is 25 with unique host/path ownership;
- craft routes are absent from sitemap and primary navigation;
- the exact required Sanchika compositions appear in each app's record and
  rendered output;
- all content is marked synthetic and passes sensitive-pattern and forbidden-
  claim checks;
- no private Sanchika paths or private application imports exist;
- built craft HTML contains no authored client scripts or hydrated islands;
- release evidence includes all 25 routes without describing C3 as passed.

The existing Sanchika adoption and legacy-cleanup assertions are updated to the
25-route post-P3 inventory rather than bypassed.

### Browser and accessibility checks

The existing Playwright visual runner covers all 25 routes at:

- desktop: 1440 x 1100;
- tablet: 834 x 1112;
- mobile: 390 x 844.

This produces 75 required route/viewport records and screenshots. Craft routes
also receive a focused audit using one exact-pinned `@axe-core/playwright` root
dev dependency. The audit fails on any critical or serious axe violation.

Additional deterministic checks cover:

- landmark and heading structure;
- keyboard traversal, visible focus, and native disclosure operation;
- horizontal overflow, clipping, overlap, and hit targets;
- reduced-motion rendering;
- forced-colors rendering and focus/status visibility;
- first-viewport communication for each product;
- comparison against the approved Ledger Atelier direction and the existing
  product North Star intent, with a human screenshot review before commit.

### Performance budgets

Each built craft route must meet:

- authored client JavaScript: `0 bytes`;
- total route CSS transfer: at most `60 KiB` gzip;
- critical font requests: at most `2` and no new remote font requests;
- measured cumulative layout shift: at most `0.05` in the deterministic local
  capture;
- no missing font, stylesheet, or asset responses.

Budget values are written into the shared evidence record and independently
measured by the browser check. The visible receipt may display only measured
results, not optimistic configured limits.

### Full repository gate

Before P3 is ready for review, run the focused craft checks followed by the
existing full verification sequence: lint, typecheck, tests, all app builds,
public claims, links, metadata, the 75-cell visual run, release evidence, and
`git diff --check`.

## Failure and rollback behavior

Schema mismatch, missing composition coverage, sensitive-looking data,
unsupported claims, sitemap/navigation exposure, authored JavaScript, private
imports, accessibility violations, budget failures, or incomplete visual
evidence fail the branch checks. They are implementation defects, not waivable
warnings.

The routes are static and unshipped, so rollback is a single P3 revert to the P2
tree. No database, data migration, deployment rollback, or compatibility layer
is required. If the owner rejects the direction at C3, keep P2 intact and revise
or replace only the craft-route tranche before P4 begins.

## Acceptance criteria

P3 is implementation-complete when:

1. all three typed craft routes build at the exact review paths;
2. each route visibly and structurally uses its required Sanchika compositions;
3. the three identities are distinct while sharing the Sanchika contract;
4. all content is synthetic, cautious, and free of private data;
5. the routes are noindex, nofollow, review-only, absent from sitemap and nav,
   and contain zero authored client JavaScript;
6. the 25-route, 75-cell evidence run and focused accessibility/performance
   checks pass;
7. the full repository verification gate is clean;
8. the reviewer receipts truthfully say `C3 human craft approval pending`;
9. no P4-P6, deployment, routing, private-app, or Sanchika-release work is in
   the diff.

Passing these criteria makes the P3 artifact ready for owner review. It does
not itself grant C3 or authorize the next public rebuild phase.
