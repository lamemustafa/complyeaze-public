# Astro product-gateway route port design

**Status:** approved

**Target routes:** `/products/pack/` and `/products/tools/`

**Phase:** P1 architecture and content parity

**Branch:** `tapish-codex/astro-product-gateway-route-port`

## Outcome

Port the Pack and Tools family gateways from the legacy string renderer into
the canonical typed public-content manifest and the ComplyEaze Astro app. The
gateways help a visitor understand the product job, custody boundary, current
public posture, and product-owned evidence before continuing to the Pack or
Tools host.

The customer-facing gateways must not expose repository migration mechanics,
cleanup instructions, review-gate language, or deployment methodology. Those
details remain available on `/migration/` and the repository evidence pages.

This increment keeps the legacy generator as the independently buildable
rollback baseline until all twenty legacy routes have typed Astro parity. It is
architecture and content work, not the later brand redesign.

## Scope

In scope:

- add `/products/pack/` and `/products/tools/` as canonical typed routes;
- add an explicit gateway route kind and exhaustive Astro rendering branch;
- render customer-safe Pack and Tools gateway pages in Astro;
- derive both legacy gateway pages from the typed manifest;
- route the Pack and Tools entries on `/products/` through their internal
  gateways before visitors continue to the product-owned hosts;
- keep the `Products` primary-navigation item current on nested product routes;
- preserve accurate metadata, preview robots intent, boundary copy, public
  evidence links, zero client JavaScript, and legacy/Astro content parity;
- update status, changelog, checks, and visual inventory for the two-route port.

Out of scope:

- the six Axal marketing route ports;
- Sanchika package consumption, publication, or release work;
- Tailwind, final typography, brand redesign, imagery, or a new token system;
- production deployment, Pages enablement, DNS, CNAME, redirects, indexing,
  sitemap cutover, or private-app route cleanup;
- Pack extension implementation, permissions, distribution, browser runtime,
  release automation, or Chrome Web Store claims;
- Tools utility implementation, accounts, uploads, backend storage, analytics,
  document custody, or tenant data;
- GitHub ruleset changes or review-policy changes.

## Current state

- The legacy generator emits both routes from `src/gateway-data.mjs` through
  `src/render-gateway.mjs` and `src/gateway.css`.
- The legacy pages describe internal migration and cleanup mechanics, including
  an `Evidence before route cleanup` section and a migration-ledger action.
- The typed ComplyEaze manifest contains twelve routes and does not contain a
  gateway route kind.
- The Astro catch-all renderer handles resource, policy, evidence, products,
  and migration routes exhaustively.
- `/products/` links Pack and Tools directly to their product-owned hosts, so
  the internal family gateways are bypassed.
- The visual gate contains twenty legacy pages, two Astro foundation pages,
  and twelve typed ComplyEaze Astro pages, for thirty-four page targets.

## Approaches considered

### Add an explicit gateway kind

Selected. A dedicated kind makes product identity, external continuation,
secondary navigation, and evidence links required. Astro dispatch stays
exhaustive, while Pack and Tools share one truthful presentation contract.

### Reuse the resource kind

This would minimize the schema diff, but gateway-specific fields would be
hidden inside generic proof and action arrays. It would weaken validation and
make future route-kind checks less informative. Rejected.

### Use a CTA-only redirect page

This would be the smallest page, but it would not explain custody, reliance,
or the boundary between a family-level description and product-owned proof.
It would also leave little value for users who need to choose safely. Rejected.

## Typed contract

Add `PublicGatewayRoute` to the existing discriminated union:

- `kind: "gateway"`;
- `product`: non-empty product name;
- `primaryAction`: labelled HTTPS product-host destination;
- `secondaryAction`: labelled internal product-family destination;
- `evidenceLinks`: a non-empty list of labelled public HTTPS evidence links;
- the existing base `sections`: customer-safe job, custody, and reliance
  explanations.

Gateway validation rejects:

- missing product identity, actions, sections, or evidence links;
- unsafe or malformed internal and external URLs;
- duplicate evidence destinations;
- fields belonging only to home, products, resource, policy, or migration
  routes;
- root-path or slug mismatches;
- any robots value other than `noindex, nofollow` before cutover;
- unknown route kinds.

The gateway type should live in a focused route-type module rather than adding
more unrelated declarations to the already large central schema file. The
central schema remains the sole manifest entry point and owns discriminated
dispatch and validation.

## Canonical content posture

Each gateway answers four user questions:

1. What narrow job does this product-owned surface address?
2. Where do inputs, generated artifacts, credentials, and operational context
   live?
3. Which claims belong to the product-owned host rather than ComplyEaze?
4. Which public evidence should a visitor inspect before relying on the claim?

Pack copy may state only the source-backed family role and local evidence-job
boundary already established by Pack-owned public evidence. It must not claim
portal endorsement, filing capability, credential capture, broad permission
behavior, distribution readiness, or release status without Pack-owned proof.

Tools copy may state only the source-backed browser-local utility role and
no-account family boundary already established by Tools-owned public evidence.
It must not imply backend persistence, uploads, analytics, compliance
validation, payment validation, or tenant context.

The gateway pages use customer language. They do not render migration-ledger
actions, cleanup blockers, parent-route instructions, or repository workflow
terminology. `/migration/`, `/status/`, and `/release-evidence/` remain the
authoritative operational evidence surfaces.

## Navigation and user flow

```text
/products/
  -> /products/pack/
     -> pack.complyeaze.com product-owned evidence
  -> /products/tools/
     -> tools.complyeaze.com product-owned evidence
  -> axal.complyeaze.com until the later Axal route port
```

The product-family page changes only Pack and Tools destinations to internal
trailing-slash routes. The product cards retain their current source evidence
links. Each gateway primary action opens the product-owned host in the current
tab; the secondary action returns to `/products/`.

Primary navigation treats `/products/` and nested `/products/*/` routes as the
same Products section for `aria-current="page"`. Other navigation items keep
exact-match behavior.

## Rendering and legacy parity

```text
complyeaze.routes.json
  -> definePublicRouteManifest
     -> Astro catch-all -> PublicGatewayPage
     -> legacy gateway adapter
        -> site-data pages
        -> render-site -> render-gateway
```

`PublicGatewayPage.astro` owns route-specific composition:

- one introductory section with one `h1`;
- a primary product-host action and secondary product-family action;
- semantic job, custody, and reliance sections;
- a labelled public-evidence section with descriptive links.

The component follows the transitional P1 visual language: line-based sections,
clear typography, no decorative card grid, no gradients, no glass, no broad
shadows, no client script, and no speculative pre-Sanchika brand system.

The legacy adapter maps canonical gateway routes into the existing legacy page
shape. Legacy and Astro output must contain the same canonical title,
description, eyebrow, heading, summary, sections, actions, product identity,
and evidence-link values. Preview-only robots and discovery behavior remain
validated at the manifest and Astro boundaries.

## Accessibility and responsive behavior

- one main landmark and one `h1` per route;
- semantic navigation, sections, headings, and evidence links;
- visible keyboard focus and 44px minimum interactive targets;
- `Products` current-state semantics on nested gateway routes;
- body copy within 65-75 characters where practical;
- no page-level horizontal overflow at desktop, tablet, mobile, 320 CSS pixels,
  or 200% browser zoom;
- long product names, evidence labels, URLs, and boundary copy wrap safely;
- normal text contrast of at least 4.5:1 and focus/non-text contrast of at
  least 3:1;
- reduced-motion behavior remains explicit, with no animation-dependent
  visibility.

## Error handling and public safety

All content is build-time validated. Invalid routes fail typecheck, tests, or
build before static output exists. There is no client-side error state because
the pages contain no runtime data fetch or hydration.

Public checks reject sensitive identifiers, secret-like values, unsafe links,
unsupported government or statutory claims, unproven release or distribution
claims, and private implementation details. Evidence links must point to public
HTTPS sources.

## Test strategy

Use red-green-refactor slices:

1. schema fixtures and the exact route inventory fail until gateway contracts
   and both canonical routes exist;
2. source and parity checks fail until the legacy gateway data derives from the
   typed manifest and internal migration language is absent from customer pages;
3. Astro build checks fail until the gateway component and exhaustive route
   branch render both routes;
4. product-family and navigation checks fail until Pack and Tools route through
   internal gateways and nested Products navigation is current;
5. visual discovery fails until the exact thirty-six-page inventory is present.

Focused and full verification covers:

- gateway validation success and malformed-route rejection;
- exactly fourteen typed ComplyEaze routes;
- exactly twenty legacy rollback routes;
- legacy/Astro content and action parity;
- metadata, canonical URLs, `noindex, nofollow`, and sitemap exclusion;
- zero client JavaScript and no unresolved internal links;
- public-claim and repository-boundary checks;
- thirty-six pages across three viewports, producing 108 screenshots and
  structured records;
- 320px and 200% zoom reflow, keyboard targets, focus, contrast, and reduced
  motion.

## Rollback

Revert this PR. The legacy generator remains present, independently buildable,
and continues to emit all twenty routes. No hosting, redirect, DNS, private-app,
or product-owned implementation change is part of this increment.

## Acceptance criteria

- `/products/pack/` and `/products/tools/` validate as explicit gateway routes;
- the typed ComplyEaze manifest contains exactly fourteen routes;
- Pack and Tools entries on `/products/` link to their internal gateways;
- both gateway pages explain job, custody, reliance, and public evidence without
  exposing migration or cleanup methodology;
- Astro and legacy output match the canonical gateway content and actions;
- Astro emits preview-only, noindex, zero-JavaScript gateway pages with correct
  metadata and no production-sitemap entries;
- nested gateway routes mark Products as the current primary-navigation item;
- the legacy build remains exactly twenty routes;
- the visual gate covers exactly thirty-six page targets and 108 viewport
  records with no findings;
- status and changelog state that Pack and Tools gateways have typed Astro
  parity while Axal marketing remains pending;
- focused checks, the full public gate, local review-rectify, current-head
  GitHub review, and required CI checks are clean before merge;
- no deployment, indexing, redirects, private cleanup, Sanchika adoption,
  product implementation, or GitHub ruleset change is claimed.
