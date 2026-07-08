---
name: Route cleanup or cutover request
about: Request private-app public-route cleanup after public-host evidence exists
title: "route-cleanup: "
labels: route-cleanup
---

## Route Inventory

- Source route:
- Public destination:
- Route family:

## Required Evidence

- [ ] Destination route exists in `dist/route-manifest.json`.
- [ ] Hosted destination evidence from `scripts/check-hosted-routes.mjs --base-url <url>`.
- [ ] Canonical URL and sitemap entry verified.
- [ ] Redirect behavior verified for the source route.
- [ ] Rollback action and owner documented.
- [ ] Separate private-app cleanup PR planned or linked.

## Evidence Links

- Public-site PR or commit:
- Hosted route summary:
- Redirect evidence:
- Rollback evidence:
- Private-app cleanup PR:

## Non-Goals

List anything that must remain out of this public repo, including authenticated
routes, tenant data, credentials, portal automation, documents, Prisma, Redis,
BullMQ, and private deployment details.
