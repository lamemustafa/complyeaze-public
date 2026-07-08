# Route Migration Ledger

This ledger tracks public route families before any private-app cleanup. A route
family is not ready for removal or redirect in the private ComplyEaze app until
its destination, evidence, cleanup rule, and rollback path are recorded here and
on the rendered `/migration/` page.

## Root Public Pages

- Source: `src/app/(main)/page.tsx` and `src/app/(main)/resources/{about-us,contact-us,privacy-policy,terms-and-conditions}`
- Destination: `/`, `/about/`, `/contact/`, `/privacy/`, and `/terms/` in `complyeaze-public`
- Status: partially seeded
- Cleanup rule: do not remove parent routes until production host routing, canonical URLs, and rollback redirects are recorded.
- Evidence: root story and product-family map are seeded; resource pages still need public-safe copy review.
- Rollback: keep parent routes available until the public static deploy serves matching routes and metadata.

## Axal Marketing

- Source: `src/app/(axal)/(marketing)/axal/page.tsx` and `src/app/(axal)/(marketing)/axal/[slug]/page.tsx`
- Destination: Axal public host plus `complyeaze-public` product-family and migration context
- Status: inventory only
- Cleanup rule: do not move login, signup, reset, callback, or workspace flows into this repository.
- Evidence: parent route registry lists five clean Axal marketing paths for later public-host verification.
- Rollback: preserve parent rewrites until Axal clean-route redirects and crawler metadata pass hosted checks.

## Pack Public Pages

- Source: `src/app/(pack)/{source,status,changelog,support,security,privacy,terms,acceptable-use,docs,release-automation,gst}/page.tsx`
- Destination: `pack.complyeaze.com` for product pages, with `complyeaze-public` carrying only family-level context
- Status: planned
- Cleanup rule: do not copy extension permissions, release claims, or store-readiness language without Pack release evidence.
- Evidence: Pack remains a separate public extension repository with local-first safety rules.
- Rollback: keep parent Pack pages or redirects until Pack-hosted pages and release-facts checks are green.

## Tools Public Utilities

- Source: `src/app/(tools)/evidence-packet/page.tsx` and `src/app/(tools)/sanchika/page.tsx`
- Destination: `tools.complyeaze.com` for utility pages, with `complyeaze-public` carrying family-level context
- Status: planned
- Cleanup rule: do not add account, upload, backend, or document-custody behavior to this repository.
- Evidence: Tools surfaces should stay browser-local and source-backed before any parent cleanup.
- Rollback: keep parent Tools routes until the static utility host serves equivalent public pages.
