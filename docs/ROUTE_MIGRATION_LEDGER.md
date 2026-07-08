# Route Migration Ledger

This ledger tracks public route families before any private-app cleanup. A route
family is not ready for removal or redirect in the private ComplyEaze app until
its destination, evidence, cleanup rule, and rollback path are recorded here and
on the rendered `/migration/` page.

## Root Public Pages

- Source: `src/app/(main)/page.tsx` and `src/app/(main)/resources/{about-us,contact-us,privacy-policy,terms-and-conditions}`
- Destination: `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/status/`, `/changelog/`, and `/release-evidence/` in `complyeaze-public`
- Status: root resource and policy/status/release pages seeded; cleanup blocked
- Cleanup rule: do not remove parent routes until production host routing, canonical URLs, and rollback redirects are recorded.
- Evidence: root story, product-family map, public-safe about/contact routing, and public-repo-specific policy/status/release routes are seeded; parent components were not copied because they include form submission, contact details, profile links, and broad compliance claims.
- Rollback: keep parent routes available until the public static deploy serves matching routes and metadata.

## Axal Marketing

- Source: `src/app/(axal)/(marketing)/axal/page.tsx` and `src/app/(axal)/(marketing)/axal/[slug]/page.tsx`
- Destination: `/products/axal/` plus five `/products/axal/<slug>/` static public pages
- Status: seeded; cleanup blocked
- Cleanup rule: do not move login, signup, reset, callback, or workspace flows into this repository.
- Evidence: five Axal SEO pages are seeded as public-safe static pages with narrowed claims and visual checks required before merge.
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
