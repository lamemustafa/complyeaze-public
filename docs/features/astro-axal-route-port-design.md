# Astro Axal six-route port design

Date: 2026-07-16
Status: Approved

## Outcome

Port the six current public Axal marketing routes into the standalone `complyeaze-public` Astro workspace as one typed, noindex preview tranche. Match the established live Axal design rather than creating a new visual language. Keep signup, login, authenticated workflows, tenant data, credentials, portal operations, hosting cutover, and indexing outside this repository and outside this tranche.

## Current source evidence

The current public Axal pages are the customer-facing content and design baseline. All six returned HTTP `200` on 2026-07-16:

| Route | Current official source |
| --- | --- |
| Axal homepage | [axal.complyeaze.com](https://axal.complyeaze.com/) |
| CA practice management | [axal.complyeaze.com/ca-practice-management-software](https://axal.complyeaze.com/ca-practice-management-software) |
| GST notice management | [axal.complyeaze.com/gst-notice-management-software](https://axal.complyeaze.com/gst-notice-management-software) |
| Compliance calendar | [axal.complyeaze.com/compliance-calendar-software-india](https://axal.complyeaze.com/compliance-calendar-software-india) |
| GST reconciliation evidence | [axal.complyeaze.com/gst-reconciliation-evidence-review](https://axal.complyeaze.com/gst-reconciliation-evidence-review) |
| Client documents and portal access | [axal.complyeaze.com/client-document-collection-portal-access](https://axal.complyeaze.com/client-document-collection-portal-access) |

These pages are evidence to reconcile, not source files to copy wholesale. They mix public marketing, private-app actions, structured metadata, runtime scripts, and implementation-specific UI. The port retains public-safe customer meaning and established visual identity while removing or qualifying claims that are not supported by current public evidence.

## Fixed scope

### In scope

- exactly six Axal-host routes;
- a typed Axal home route and five typed Axal detail routes;
- a canonical Axal route manifest under `packages/public-content/src/`;
- one shared Axal layout and shared home/detail Astro components;
- established live Axal palette, typography, navigation, density, section rhythm, workflow sequences, FAQs, and related-route treatment;
- a synthetic, clearly labelled Axal workbench illustration with no private or taxpayer data;
- absolute HTTPS signup and login links owned by the current Axal app;
- a checked-in claim-source matrix for retained, qualified, and excluded claims;
- a canonical-to-legacy adapter so the existing twenty-page generator remains the rollback build;
- noindex preview metadata, sitemap exclusion, zero client JavaScript, visual evidence, and review closure.

### Out of scope

- authenticated Axal app code or route ownership;
- signup, login, demo-form, lead-capture, or session implementation;
- tenant, workspace, client, matter, obligation, document, credential, or portal data;
- real app screenshots, production screenshots, portal screenshots, or customer artifacts;
- hosting, Pages, DNS, proxy, middleware, redirect, canonical cutover, or indexing changes;
- private-app route deletion or cleanup;
- statutory due-date logic or legal/tax advice;
- Sanchika adoption, Tailwind migration, or a new Axal brand direction;
- GitHub ruleset or governance changes.

## Route inventory and rollback mapping

The Astro app owns clean Axal-host paths. The legacy renderer retains its existing nested ComplyEaze output paths only as rollback artifacts.

| Typed Axal path | Legacy rollback path |
| --- | --- |
| `/` | `/products/axal/` |
| `/ca-practice-management-software/` | `/products/axal/ca-practice-management-software/` |
| `/gst-notice-management-software/` | `/products/axal/gst-notice-management-software/` |
| `/compliance-calendar-software-india/` | `/products/axal/compliance-calendar-software-india/` |
| `/gst-reconciliation-evidence-review/` | `/products/axal/gst-reconciliation-evidence-review/` |
| `/client-document-collection-portal-access/` | `/products/axal/client-document-collection-portal-access/` |

The legacy site remains exactly twenty pages. The Axal Astro app moves from one foundation page to six typed routes.

## Typed content model

Use explicit `axal-home` and `axal-detail` route kinds. They are distinct because flattening Axal into generic `home` or `resource` records would move product assumptions into components and weaken validation.

### Shared Axal fields

- base metadata: slug, clean path, title, description, eyebrow, heading, summary, signal terms, preview robots;
- product name and navigation label;
- audience statement;
- professional-review or custody boundary;
- external primary action;
- internal secondary action;
- product-owned evidence links;
- related Axal routes.

### Axal home fields

- customer promise and three conservative proof statements;
- five route-directory entries;
- public/private ownership boundary;
- synthetic workbench state labels;
- customer problem sections grounded in source, owner, evidence, review, and decision trail.

### Axal detail fields

- three structured workflow sections with heading, body, and short points;
- ordered workflow steps where the current page contains a real sequence;
- FAQ entries;
- route-specific limitation copy;
- related workflow links.

Validation must reject missing actions, empty audiences or boundaries, duplicate evidence URLs, invalid related routes, unsafe URL schemes, cross-kind fields, unqualified internal signup/login paths, and any route path that does not match its slug.

The existing generic schema file is already above the repository's preferred size. Axal-specific types and validation should live in focused modules, with the shared manifest entrypoint delegating to them rather than adding another large branch ladder.

## Claim-source matrix

Add `docs/evidence/axal-public-route-claims.md` during implementation. For every route, record:

- official source URL and verification date;
- retained customer-job statements;
- retained professional-review and privacy boundaries;
- private-app actions that remain external;
- claims qualified because exact capability depends on configuration or current release state;
- claims excluded because they imply unsupported readiness, automation, accuracy, statutory correctness, credential custody, or production behavior.

The matrix is the durable source for public product-status and compliance wording. Local screenshots and manual observations are diagnostic evidence only, not release evidence.

## Data flow

```text
current official Axal pages
        |
        v
checked-in claim-source matrix
        |
        v
typed axal.routes.json
       / \
      v   v
Astro Axal app      legacy rollback adapter
clean host paths    /products/axal/* artifacts
```

Astro pages and legacy pages must render customer content from the same validated manifest. No route component may contain duplicated page-specific marketing copy. The legacy adapter may translate path and legacy renderer shape, but it must not become a second content source.

## External and internal actions

The public preview describes and routes; the current Axal app owns authentication and lead capture.

- Primary demo/signup actions use `https://axal.complyeaze.com/signup`.
- Login uses `https://axal.complyeaze.com/login`.
- Route-directory, related-route, breadcrumb, and secondary exploration links use clean internal Axal paths.
- The public ComplyEaze family link uses `https://complyeaze.com/`.

No `/signup` or `/login` implementation is added to the Astro app.

## Visual direction

Match the current live Axal page rather than introducing a new concept.

### Preserve

- Axal purple `#5B21B6` as the primary identity color;
- the established warm-neutral, white, dark-ink, muted-text, pale-purple, and restrained gold roles;
- Cormorant display typography and Outfit body typography;
- compact square-to-six-pixel radii rather than soft oversized cards;
- live-page header hierarchy, product navigation, CTA treatment, dense section rhythm, route cross-linking, workflow sequences, FAQ blocks, and footer treatment;
- strong desktop product storytelling and clean single-column mobile reflow.

Self-host Cormorant and Outfit only after verifying their upstream licenses and committing the applicable license files beside the font assets. Do not add a runtime Google Fonts dependency. JetBrains Mono is not required for this tranche.

### Synthetic workbench substitution

The current live homepage uses a workspace image. The public repo must not copy a production screenshot. Replace it with a semantic HTML/CSS Axal workbench containing only generic synthetic labels such as:

- GST notice matter;
- reconciliation variance;
- compliance obligation;
- evidence requested;
- professional review needed;
- owner assigned;
- client input pending.

The workbench must display a visible `Synthetic Axal workbench — no client or taxpayer data` label. It must not include GSTINs, PANs, taxpayer names, amounts, notices, real deadlines, portal screenshots, or production UI captures.

### Interaction and motion

The pages remain fully useful without JavaScript. Links are semantic anchors, navigation has visible current state, focus is visible, and all controls meet target-size requirements. Any decorative CSS motion must enhance already-visible content and have a reduced-motion alternative. Zero client-side script is the acceptance criterion.

## Page composition

### Homepage

1. Live-compatible header and external demo action.
2. Hero with current customer promise, actions, proof statements, and synthetic workbench.
3. Customer failure/context section.
4. Workflow/product capability sections supported by the claim matrix.
5. Five-route product map.
6. Professional-review and public/private boundary.
7. Questions, current evidence, and live-app actions.
8. Existing-style footer with ComplyEaze, privacy, terms, and contact links.

### Detail routes

1. Shared header and breadcrumb.
2. Customer job, audience, primary external action, and internal exploration action.
3. Prominent route-specific professional boundary.
4. Three workflow sections.
5. Ordered workflow only where order carries real information.
6. FAQs.
7. Related Axal workflows.
8. Product-owned evidence and live-app action.
9. Shared footer.

## Metadata and preview posture

- Axal manifest origin is `https://axal.complyeaze.com`.
- Every typed route emits canonical, Open Graph, and Twitter metadata for its clean Axal-host URL.
- Every route remains `noindex, nofollow` until a separate cutover decision.
- Typed Axal routes remain excluded from the sitemap during preview.
- No structured-data readiness claim is added in this tranche.
- `/status/`, `/changelog/`, and the migration ledger record typed preview parity without claiming hosting or cleanup completion.

## Accessibility and responsive behavior

- exactly one main landmark and one H1 per route;
- logical H2/H3 hierarchy;
- labelled primary, breadcrumb, related-route, and footer navigation;
- visible current route state;
- skip link and visible focus;
- minimum 44px critical targets;
- body line lengths capped near 70ch;
- long CA/CS/GST headings wrap at 320px and 200% text size;
- no horizontal overflow at desktop, tablet, mobile, or 320px;
- synthetic workbench remains understandable when linearized on mobile;
- color contrast meets WCAG AA;
- reduced-motion support;
- no content hidden behind animation or JavaScript.

## Testing and acceptance

### Contract tests

- valid Axal home and detail fixtures;
- required fields and cross-kind rejection;
- HTTPS-only external actions;
- clean internal route links;
- related-route integrity;
- unique evidence links;
- exactly six Axal routes.

### Source and parity tests

- canonical Axal manifest is the only route-content source;
- legacy adapter derives all six routes from it;
- legacy build stays exactly twenty pages;
- Astro and legacy outputs contain canonical customer values;
- no private-app implementation, sensitive data, unsupported claims, or internal migration methodology appears in public pages;
- all clean Axal paths build and no unintended alternate paths exist.

### Browser and visual tests

- desktop, tablet, mobile, and focused 320px checks;
- keyboard order, focus visibility, current navigation, target size, overflow, overlap, clipped content, reduced motion, and zero scripts;
- 200% text-size reflow for all six headings;
- rendered review of the homepage and all five detail templates;
- Impeccable detector, critique, and audit against the Axal app and synthetic workbench.

The visual inventory changes from thirty-six pages to forty-one:

- twenty legacy pages;
- fourteen typed ComplyEaze pages;
- six typed Axal pages;
- one Pack foundation page.

At three viewports, the required visual matrix contains 123 screenshots and 123 passing summary rows.

### Full gate and review lifecycle

- lint, typecheck, tests, builds, public safety, links, metadata, whitespace, and visual checks;
- complete local diff review and rectify pass;
- current-head GitHub Codex review;
- authoritative GraphQL review-thread sweep;
- exact-head merge-tree verification;
- post-merge `main` CI and both evidence artifacts;
- clean worktree and branch cleanup.

## Rollback

The existing twenty-page legacy output remains the rollback baseline throughout this tranche. Reverting the implementation restores the one-page Axal Astro foundation and legacy-only Axal routes. No database, private-app, hosting, DNS, redirect, or indexing rollback is required because none changes here.

## Completion boundary

Completion means typed local preview parity and green evidence. It does not mean the new Astro pages are hosted at the Axal domain, indexed, canonical in production, or safe for private-app route deletion. Those decisions require a later deployment and cleanup tranche with separate evidence.
