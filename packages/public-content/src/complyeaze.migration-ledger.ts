import {
  defineMigrationLedger,
  type MigrationRouteEntry,
} from "./migration-ledger-schema.ts";

export {
  defineMigrationLedger,
  type MigrationLedger,
  type MigrationLedgerEntry,
  type MigrationRouteEntry,
} from "./migration-ledger-schema.ts";

const cleanupBlocked = "cleanup blocked";
const hostedEvidencePending = "hosted 200, canonical, sitemap, and redirect evidence pending";
const rollbackKeepParent = "keep parent route until redirect rollback is tested";
const parentCleanupBlocked =
  "blocked; requires separate private-app cleanup PR after hosted and redirect evidence";
const redirectNotConfigured = "redirect not configured";
const hostedEvidenceNotRecorded = "not recorded";
const parentCleanupPrNotLinked = "not linked";

type MigrationRouteInput = Pick<
  MigrationRouteEntry,
  "destinationHost" | "destinationRoute" | "sourceHost" | "sourceRoute"
> &
  Partial<
    Omit<
      MigrationRouteEntry,
      "cleanupStatus" | "destinationHost" | "destinationRoute" | "sourceHost" | "sourceRoute"
    >
  >;

function route({
  sourceHost,
  sourceRoute,
  destinationHost,
  destinationRoute,
  evidenceStatus = hostedEvidencePending,
  redirectStatus = redirectNotConfigured,
  redirectPlan = redirectNotConfigured,
  rollback = rollbackKeepParent,
  rollbackCommandOrOwner = rollbackKeepParent,
  hostedEvidenceUrl = hostedEvidenceNotRecorded,
  parentCleanupPr = parentCleanupPrNotLinked,
}: MigrationRouteInput): MigrationRouteEntry {
  return {
    sourceHost,
    sourceRoute,
    destinationHost,
    destinationRoute,
    cleanupStatus: cleanupBlocked,
    evidenceStatus,
    redirectStatus,
    redirectPlan,
    rollback,
    rollbackCommandOrOwner,
    hostedEvidenceUrl,
    parentCleanupPr,
  };
}

function axalRoute(routePath: string): MigrationRouteEntry {
  return route({
    sourceHost: "axal.complyeaze.com",
    sourceRoute: routePath,
    destinationHost: "axal.complyeaze.com",
    destinationRoute: routePath,
    evidenceStatus: "Axal-hosted route, canonical, sitemap, and path-routing evidence pending",
    redirectStatus: "redirect not required for same-host same-path cutover",
    redirectPlan: "redirect not required for same-host same-path cutover",
    rollback: "restore private-app path routing if public route cutover fails",
    rollbackCommandOrOwner: "private-app path-routing owner not assigned",
  });
}

export const migrationLedger = defineMigrationLedger([
  {
    family: "Root public pages",
    source:
      "Root public URLs on complyeaze.com: /, /resources/about-us, /resources/contact-us, /resources/privacy-policy, and /resources/terms-and-conditions",
    destination:
      "complyeaze-public routes on complyeaze.com: /, /about/, /contact/, /trust/, /docs/, /migration/, /privacy/, /terms/, /status/, /changelog/, and /release-evidence/",
    status: "root resource, trust/docs/migration, and policy/status/release pages seeded; cleanup blocked",
    cleanup:
      "Do not remove parent routes until production host routing, canonical URLs, rollback redirects, and scripts/check-hosted-routes.mjs evidence are recorded.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Hosted route, visual artifact, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Keep parent routes available until the public static deploy serves matching routes and metadata, with hosted route evidence attached.",
    routes: [
      route({
        sourceHost: "complyeaze.com",
        sourceRoute: "/",
        destinationHost: "complyeaze.com",
        destinationRoute: "/",
        redirectStatus: "no redirect planned until production host cutover",
        redirectPlan: "no redirect planned until production host cutover",
      }),
      route({
        sourceHost: "complyeaze.com",
        sourceRoute: "/resources/about-us",
        destinationHost: "complyeaze.com",
        destinationRoute: "/about/",
      }),
      route({
        sourceHost: "complyeaze.com",
        sourceRoute: "/resources/contact-us",
        destinationHost: "complyeaze.com",
        destinationRoute: "/contact/",
      }),
      route({
        sourceHost: "complyeaze.com",
        sourceRoute: "/resources/privacy-policy",
        destinationHost: "complyeaze.com",
        destinationRoute: "/privacy/",
      }),
      route({
        sourceHost: "complyeaze.com",
        sourceRoute: "/resources/terms-and-conditions",
        destinationHost: "complyeaze.com",
        destinationRoute: "/terms/",
      }),
    ],
  },
  {
    family: "Axal marketing",
    source: "Axal public marketing URLs on axal.complyeaze.com: / and /<slug>",
    destination:
      "complyeaze-public routes on axal.complyeaze.com: / plus five /<slug> static public pages",
    status: "seeded; cleanup blocked",
    cleanup: "Do not move login, signup, reset, callback, or workspace flows into this repository.",
    parentCleanup:
      "blocked; requires separate private-app cleanup PR after hosted and path-routing evidence",
    evidence:
      "Seed intent recorded. Axal path-routing, hosted route, visual artifact, and private-app cleanup PR evidence are pending.",
    rollback:
      "Preserve private-app path routing until Axal-hosted marketing routes and crawler metadata pass hosted route checks; restore private-app routing if cutover fails.",
    routes: [
      "/",
      "/ca-practice-management-software",
      "/gst-notice-management-software",
      "/compliance-calendar-software-india",
      "/gst-reconciliation-evidence-review",
      "/client-document-collection-portal-access",
    ].map(axalRoute),
  },
  {
    family: "Pack public pages",
    source:
      "Pack public URLs on pack.complyeaze.com: /, /source, /status, /changelog, /support, /security, /privacy, /terms, /acceptable-use, /docs, /release-automation, and /gst",
    destination:
      "/products/pack/ for family-level context, then pack.complyeaze.com for product-owned source, install, release, privacy, security, and support facts",
    status: "gateway seeded; cleanup blocked",
    cleanup:
      "Do not copy extension permissions, release claims, or store-readiness language without Pack release evidence.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Pack-hosted route, release-facts, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Keep parent Pack pages or redirects until Pack-hosted pages, release-facts checks, and hosted route evidence are green.",
    routes: [
      "/",
      "/source",
      "/status",
      "/changelog",
      "/support",
      "/security",
      "/privacy",
      "/terms",
      "/acceptable-use",
      "/docs",
      "/release-automation",
      "/gst",
    ].map((routePath) =>
      route({
        sourceHost: "pack.complyeaze.com",
        sourceRoute: routePath,
        destinationHost: "pack.complyeaze.com",
        destinationRoute: routePath,
        evidenceStatus: "Pack-hosted route and release-facts evidence pending",
      }),
    ),
  },
  {
    family: "Tools public utilities",
    source: "Tools public URLs on tools.complyeaze.com: /evidence-packet and /sanchika",
    destination:
      "/products/tools/ for family-level context, then tools.complyeaze.com for utility-owned runtime and release evidence",
    status: "gateway seeded; cleanup blocked",
    cleanup: "Do not add account, upload, backend, or document-custody behavior to this repository.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Tools-hosted route, local-only runtime, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Keep parent Tools routes until the static utility host serves equivalent public pages and hosted route evidence is recorded.",
    routes: [
      route({
        sourceHost: "tools.complyeaze.com",
        sourceRoute: "/evidence-packet",
        destinationHost: "tools.complyeaze.com",
        destinationRoute: "/evidence-packet",
        evidenceStatus: "Tools-hosted route and local-only evidence pending",
      }),
      route({
        sourceHost: "tools.complyeaze.com",
        sourceRoute: "/sanchika",
        destinationHost: "tools.complyeaze.com",
        destinationRoute: "/sanchika",
        evidenceStatus: "Tools-hosted route and Sanchika adoption evidence pending",
      }),
    ],
  },
]);
