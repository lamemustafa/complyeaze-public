# Route Migration Ledger

This ledger tracks public route families before any private-app cleanup. A route
family is not ready for removal or redirect in the private ComplyEaze app until
its destination, evidence, cleanup rule, and rollback path are recorded here and
on the rendered `/migration/` page.

Family-level entries do not authorize cleanup by themselves. Each source route
being removed or redirected needs its own hosted route 200, canonical, sitemap,
redirect, and rollback evidence.

## Root Public Pages

- Source: root public URLs `/`, `/about-us`, `/contact-us`, `/privacy-policy`, and `/terms-and-conditions`
- Destination: `/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/status/`, `/changelog/`, and `/release-evidence/` in `complyeaze-public`
- Status: root resource and policy/status/release pages seeded; cleanup blocked
- Cleanup rule: do not remove parent routes until production host routing, canonical URLs, rollback redirects, and `scripts/check-hosted-routes.mjs` evidence are recorded.
- Parent cleanup: blocked; requires separate private-app cleanup PR after hosted and redirect evidence.
- Evidence: seed intent recorded. Hosted route, visual artifact, redirect, and private-app cleanup PR evidence are pending.
- Rollback: keep parent routes available until the public static deploy serves matching routes and metadata, with hosted route evidence attached.

| Source route | Destination | Cleanup | Evidence | Redirect | Rollback |
| --- | --- | --- | --- | --- | --- |
| `/` | `/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | no redirect planned until production host cutover | keep parent route until redirect rollback is tested |
| `/about-us` | `/about/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/contact-us` | `/contact/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/privacy-policy` | `/privacy/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/terms-and-conditions` | `/terms/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |

## Axal Marketing

- Source: Axal public marketing URLs `/axal` and `/axal/<slug>`
- Destination: `/products/axal/` plus five `/products/axal/<slug>/` static public pages
- Status: seeded; cleanup blocked
- Cleanup rule: do not move login, signup, reset, callback, or workspace flows into this repository.
- Parent cleanup: blocked; requires separate private-app cleanup PR after hosted and redirect evidence.
- Evidence: seed intent recorded. Hosted route, visual artifact, redirect, and private-app cleanup PR evidence are pending.
- Rollback: preserve parent rewrites until Axal clean-route redirects and crawler metadata pass hosted route checks.

| Source route | Destination | Cleanup | Evidence | Redirect | Rollback |
| --- | --- | --- | --- | --- | --- |
| `/axal` | `/products/axal/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/axal/ca-practice-management-software` | `/products/axal/ca-practice-management-software/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/axal/gst-notice-management-software` | `/products/axal/gst-notice-management-software/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/axal/compliance-calendar-software-india` | `/products/axal/compliance-calendar-software-india/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/axal/gst-reconciliation-evidence-review` | `/products/axal/gst-reconciliation-evidence-review/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/axal/client-document-collection-portal-access` | `/products/axal/client-document-collection-portal-access/` | cleanup blocked | hosted 200, canonical, sitemap, and redirect evidence pending | redirect not configured | keep parent route until redirect rollback is tested |

## Pack Public Pages

- Source: Pack public URLs under `/pack/*`
- Destination: `/products/pack/` for family-level context, then `pack.complyeaze.com` for product-owned source, install, release, privacy, security, and support facts
- Status: gateway seeded; cleanup blocked
- Cleanup rule: do not copy extension permissions, release claims, or store-readiness language without Pack release evidence.
- Parent cleanup: blocked; requires separate private-app cleanup PR after hosted and redirect evidence.
- Evidence: seed intent recorded. Pack-hosted route, release-facts, redirect, and private-app cleanup PR evidence are pending.
- Rollback: keep parent Pack pages or redirects until Pack-hosted pages, release-facts checks, and hosted route evidence are green.

| Source route | Destination | Cleanup | Evidence | Redirect | Rollback |
| --- | --- | --- | --- | --- | --- |
| `/pack/source` | `https://pack.complyeaze.com/source` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/status` | `https://pack.complyeaze.com/status` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/changelog` | `https://pack.complyeaze.com/changelog` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/support` | `https://pack.complyeaze.com/support` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/security` | `https://pack.complyeaze.com/security` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/privacy` | `https://pack.complyeaze.com/privacy` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/terms` | `https://pack.complyeaze.com/terms` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/acceptable-use` | `https://pack.complyeaze.com/acceptable-use` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/docs` | `https://pack.complyeaze.com/docs` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/release-automation` | `https://pack.complyeaze.com/release-automation` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/pack/gst` | `https://pack.complyeaze.com/gst` | cleanup blocked | Pack-hosted route and release-facts evidence pending | redirect not configured | keep parent route until redirect rollback is tested |

## Tools Public Utilities

- Source: Tools public URLs `/tools/evidence-packet` and `/tools/sanchika`
- Destination: `/products/tools/` for family-level context, then `tools.complyeaze.com` for utility-owned runtime and release evidence
- Status: gateway seeded; cleanup blocked
- Cleanup rule: do not add account, upload, backend, or document-custody behavior to this repository.
- Parent cleanup: blocked; requires separate private-app cleanup PR after hosted and redirect evidence.
- Evidence: seed intent recorded. Tools-hosted route, local-only runtime, redirect, and private-app cleanup PR evidence are pending.
- Rollback: keep parent Tools routes until the static utility host serves equivalent public pages and hosted route evidence is recorded.

| Source route | Destination | Cleanup | Evidence | Redirect | Rollback |
| --- | --- | --- | --- | --- | --- |
| `/tools/evidence-packet` | `https://tools.complyeaze.com/evidence-packet` | cleanup blocked | Tools-hosted route and local-only evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
| `/tools/sanchika` | `https://tools.complyeaze.com/sanchika` | cleanup blocked | Tools-hosted route and Sanchika adoption evidence pending | redirect not configured | keep parent route until redirect rollback is tested |
