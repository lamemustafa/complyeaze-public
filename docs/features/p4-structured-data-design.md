# P4.1 ComplyEaze structured-data closure

**Status:** Proposed

**Repository:** `complyeaze-public`

**Branch:** `tapish-codex/p4-structured-data`

**Base:** `master` at `180cea2cd04eb618ebff867e508c37b0d3f241c6`

## Outcome

Close P4's remaining metadata omission by emitting source-backed Organization
and WebSite JSON-LD from the shared ComplyEaze public layout.

## Scope

- add one static JSON-LD graph to `PublicPageLayout.astro`;
- derive its canonical URLs from the typed manifest origin already passed to the
  layout;
- include only `Organization` and `WebSite` entities and their stable identity
  relationship;
- add a focused public metadata contract that verifies the rendered graph.

## Contract

The layout emits one `application/ld+json` script with an `@graph` containing:

1. an `Organization` with the ComplyEaze name and a canonical `@id` anchored to
   the manifest origin; and
2. a `WebSite` with an origin-root `url`, a canonical `@id`, and a `publisher`
   reference to that Organization.

The graph must be valid JSON, be rendered on canonical ComplyEaze pages, and
never contain unverified contact details, social profiles, product capabilities,
security claims, prices, search actions, or runtime data.

## Non-goals

- No route, copy, visual, navigation, Sanchika, or CSS change.
- No Axal, Pack, product, FAQ, Breadcrumb, social-card, or deployment schema.
- No new dependency, JavaScript runtime, form, API, or hosted-domain change.

## Verification

Write the contract first and observe it fail because the layout currently emits
no JSON-LD. Then add the minimal shared graph, rerun the focused metadata
contract, and broaden through lint, type checking, tests, build, public,
links, metadata, visual, and diff checks before review.

## Rollback

Revert the focused P4.1 commit. The change has no data, deployment, routing, or
private-application effect.
