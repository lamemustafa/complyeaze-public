# Astro customer-core route port design

**Status:** approved by the autonomous continuation handoff

**Target routes:** `/` and `/products/`

**Phase:** P1 architecture and content parity

**Branch:** `tapish-codex/astro-customer-core-route-port`

## Outcome

Port the customer-facing ComplyEaze homepage and product-family index from the
legacy string renderer into the existing typed public-content manifest and
Astro app. Keep the legacy generator as the deployable rollback baseline until
all twenty legacy routes have typed Astro parity.

This increment preserves accurate route identity, metadata, robots intent,
public-safe product facts, boundary copy, and objective checks. It does not
preserve or finalize the legacy visual design; the later P3-P6 craft and
Sanchika phases own final art direction and redesign.

## Scope

In scope:

- make `/` and `/products/` canonical typed routes;
- replace the ComplyEaze Astro foundation root with the typed homepage;
- add a typed Astro product-family page;
- adapt both canonical routes into the legacy build;
- remove repository-boundary branding and migration/review methodology from
  customer navigation and the product-family presentation;
- keep ComplyEaze as the umbrella trust/router layer, with Axal, Pack, and Tools
  as customer product choices;
- move Sanchika to a restrained footer colophon instead of a peer product card;
- verify metadata, legacy/Astro content parity, links, zero client JavaScript,
  and desktop/tablet/mobile rendering.

Out of scope:

- `/products/pack/`, `/products/tools/`, or Axal marketing route ports;
- Sanchika package consumption, publication, or v0.1.0 release work;
- Tailwind, brand redesign, final typography, or a new token system;
- hosting, deployment, DNS, redirects, production cutover, or private-app
  cleanup;
- private application, auth, tenant, portal, document, queue, or infrastructure
  changes.

## Current state

- The legacy build emits twenty routes. `/` and `/products/` are sourced from
  `src/site-data.mjs`; product details and migration inventory are duplicated in
  `src/product-data.mjs`.
- The typed manifest owns ten non-customer routes.
- `apps/complyeaze/src/pages/index.astro` is a noindex foundation rather than
  customer parity.
- The dynamic Astro page exhaustively renders the four existing route kinds
  only by convention; adding new kinds requires an explicit checked branch.
- Customer navigation still exposes Migration, Status, and Docs, and the
  product page still presents Sanchika as a peer product plus an internal route
  migration inventory.

## Approaches considered

### Reuse `resource`

Smallest schema diff, but homepage/product semantics and fields would be hidden
inside generic proof/actions. It would also make future route-kind checks less
useful. Rejected.

### Add one generic `customer` kind

Keeps one new branch, but requires optional home-only and products-only fields.
Validation and rendering would become another discriminator inside the
discriminator. Rejected.

### Add explicit `home` and `products` kinds

Selected. Both remain in the existing manifest and base contract, while their
specialized fields stay required and renderer dispatch remains exhaustive. The
extra schema surface is small and maps directly to two real page jobs.

## Typed contracts

`PublicHomeRoute` adds:

- `kind: "home"`;
- primary and secondary actions.

Its existing `sections` provide the three customer-routing explanations below
the first viewport.

`PublicProductsRoute` adds:

- `kind: "products"`;
- a non-empty `products` list.

Each product requires name, role, job, proof, boundary, status, a safe public
destination, and a labelled public evidence link. Product names and
destinations must be unique. Fields from other route kinds are rejected.

Root paths use the canonical manifest identity `slug: "index"` with
`urlPath: "/"`; all other routes retain the existing clean trailing-slash slug
rule. `index.astro` exclusively owns the home route. The catch-all excludes it,
and build checks reject an accidental `/index/` output.

## Content posture

The homepage first viewport answers:

1. which compliance job this family helps route;
2. which custody or reliance boundary matters;
3. where the visitor should go next.

The products page compares Axal, Pack, and Tools by job, public proof, custody
boundary, and current public posture. It does not display source paths,
migration status, review gates, or cleanup methodology. It does not present
Sanchika as a customer product.

Every product proof and status statement must be traceable to a public source,
release, runtime result, or local evidence file. If that evidence is missing or
stale, the copy must say `planned`, `limited`, or `verification stale` rather
than imply a current capability. Because the three product destinations are not
all ported in this slice, they use evidence-backed absolute public destinations;
any relative product destination must resolve inside the Astro build.

No copy claims government approval, statutory correctness, filing certainty,
production readiness, security guarantees, uptime, or integration behavior.
All examples remain synthetic and no private identifiers or operations enter
the public repository.

## Rendering and data flow

```text
complyeaze.routes.json
  -> definePublicRouteManifest
     -> Astro index page -> PublicHomePage
     -> Astro dynamic page -> PublicProductsPage
     -> legacy customer-route adapter
        -> site-data pages
        -> product-data adapter
        -> legacy render-site
```

`PublicPageLayout` remains responsible for document metadata, skip link,
customer-safe navigation, footer links, focus treatment, and reduced-motion
behavior. Page components own route-specific composition.

The legacy output retains its renderer and CSS for rollback. Its canonical
content is adapted from the typed manifest so legacy and Astro output cannot
silently diverge.

## Accessibility and visual behavior

- one main landmark and one `h1` per page;
- semantic navigation and definition lists for product attributes;
- visible keyboard focus and 44px minimum interactive targets;
- customer navigation wraps without clipping;
- long names, roles, links, boundary copy, and status text wrap at desktop,
  tablet, mobile, and browser zoom;
- body copy stays within 65-75 characters where practical;
- normal text meets at least 4.5:1 contrast; large text, focus indicators, and
  meaningful non-text boundaries meet at least 3:1;
- the page reflows at 200% zoom and at a 320 CSS-pixel viewport without
  page-level horizontal scrolling, overlap, or clipped controls;
- reduced motion remains explicit even though the pages require no motion;
- no script tags, hydration runtime, gradients, glass, decorative side stripes,
  oversized rounding, hero-metric templates, repeated tiny uppercase eyebrows,
  identical icon-card grids, border-plus-wide-shadow ghost cards, or
  animation-dependent visibility.

## Validation and error handling

Build-time validation rejects:

- missing or duplicate route paths;
- invalid root slug/path identity;
- empty product lists;
- duplicate product names or destinations;
- unsafe product/action URLs;
- fields belonging to another route kind;
- unknown route kinds;
- non-preview robots intent.

Build and parity checks fail with the affected route and field. There is no
client-side error state because content is validated before static rendering.

## Test strategy

Use red-green-refactor slices:

1. route-schema fixtures and required route inventory fail for missing
   `home`/`products` contracts;
2. legacy adapter/parity checks fail until both routes derive from canonical
   data and the internal migration inventory is absent;
3. Astro build checks fail until the typed root and product components render;
4. visual discovery fails until the ComplyEaze foundation target is replaced by
   the canonical homepage route.

The final visual matrix should contain thirty-four pages across three
viewports, or 102 route/viewport records, if no unrelated route count changes.

## Rollback

Revert this PR. The legacy generator remains present, independently buildable,
and covers all twenty routes. No hosting, redirect, private cleanup, or traffic
change is part of this increment.

## Acceptance criteria

- `/` and `/products/` validate in the existing manifest as explicit route
  kinds;
- the manifest contains twelve ComplyEaze routes;
- Astro emits customer-safe previews for both routes with `noindex, nofollow`,
  canonical metadata, production-sitemap exclusion, and zero client JavaScript;
- the legacy build remains twenty routes and matches canonical title,
  description, eyebrow, heading, summary, sections, actions, and product
  fields; preview-only robots and identity/discovery fields remain separately
  validated at the Astro/schema boundary;
- the customer product page contains Axal, Pack, and Tools, omits Sanchika as a
  peer product, and contains no route migration inventory;
- primary customer navigation contains no Migration, Status, Docs, review, or
  cleanup methodology;
- at desktop, tablet, and mobile widths, the homepage first viewport makes the
  user job, custody/reliance boundary, and next action understandable without
  prescribing the later P4 typography, palette, or art direction;
- rendered checks prove one main landmark, one `h1` with logical heading order,
  visible focus, 44-by-44px targets, WCAG contrast, and 200% zoom/320px reflow;
- focused checks, the full public gate, and rendered inspection pass;
- current-head local and GitHub review state is clean before merge.
