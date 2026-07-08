const cleanupBlocked = "cleanup blocked";
const hostedEvidencePending = "hosted 200, canonical, sitemap, and redirect evidence pending";
const rollbackKeepParent = "keep parent route until redirect rollback is tested";
const parentCleanupBlocked = "blocked; requires separate private-app cleanup PR after hosted and redirect evidence";

export const migrationLedger = [
  {
    family: "Root public pages",
    source: "Root public URLs: /, /about-us, /contact-us, /privacy-policy, and /terms-and-conditions",
    destination:
      "/, /about/, /contact/, /privacy/, /terms/, /status/, /changelog/, and /release-evidence/ in complyeaze-public",
    status: "root resource and policy/status/release pages seeded; cleanup blocked",
    cleanup:
      "Do not remove parent routes until production host routing, canonical URLs, rollback redirects, and scripts/check-hosted-routes.mjs evidence are recorded.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Hosted route, visual artifact, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Keep parent routes available until the public static deploy serves matching routes and metadata, with hosted route evidence attached.",
    routes: [
      {
        sourceRoute: "/",
        destinationRoute: "/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "no redirect planned until production host cutover",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/about-us",
        destinationRoute: "/about/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/contact-us",
        destinationRoute: "/contact/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/privacy-policy",
        destinationRoute: "/privacy/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/terms-and-conditions",
        destinationRoute: "/terms/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      }
    ]
  },
  {
    family: "Axal marketing",
    source: "Axal public marketing URLs: /axal and /axal/<slug>",
    destination:
      "/products/axal/ plus five /products/axal/<slug>/ static public pages",
    status: "seeded; cleanup blocked",
    cleanup:
      "Do not move login, signup, reset, callback, or workspace flows into this repository.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Hosted route, visual artifact, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Preserve parent rewrites until Axal clean-route redirects and crawler metadata pass hosted route checks.",
    routes: [
      {
        sourceRoute: "/axal",
        destinationRoute: "/products/axal/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/axal/ca-practice-management-software",
        destinationRoute: "/products/axal/ca-practice-management-software/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/axal/gst-notice-management-software",
        destinationRoute: "/products/axal/gst-notice-management-software/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/axal/compliance-calendar-software-india",
        destinationRoute: "/products/axal/compliance-calendar-software-india/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/axal/gst-reconciliation-evidence-review",
        destinationRoute: "/products/axal/gst-reconciliation-evidence-review/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/axal/client-document-collection-portal-access",
        destinationRoute: "/products/axal/client-document-collection-portal-access/",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: hostedEvidencePending,
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      }
    ]
  },
  {
    family: "Pack public pages",
    source: "Pack public URLs under /pack/*",
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
      "/gst"
    ].map((path) => ({
      sourceRoute: `/pack${path}`,
      destinationRoute: `https://pack.complyeaze.com${path}`,
      cleanupStatus: cleanupBlocked,
      evidenceStatus: "Pack-hosted route and release-facts evidence pending",
      redirectStatus: "redirect not configured",
      rollback: rollbackKeepParent
    }))
  },
  {
    family: "Tools public utilities",
    source: "Tools public URLs: /tools/evidence-packet and /tools/sanchika",
    destination:
      "/products/tools/ for family-level context, then tools.complyeaze.com for utility-owned runtime and release evidence",
    status: "gateway seeded; cleanup blocked",
    cleanup:
      "Do not add account, upload, backend, or document-custody behavior to this repository.",
    parentCleanup: parentCleanupBlocked,
    evidence:
      "Seed intent recorded. Tools-hosted route, local-only runtime, redirect, and private-app cleanup PR evidence are pending.",
    rollback:
      "Keep parent Tools routes until the static utility host serves equivalent public pages and hosted route evidence is recorded.",
    routes: [
      {
        sourceRoute: "/tools/evidence-packet",
        destinationRoute: "https://tools.complyeaze.com/evidence-packet",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: "Tools-hosted route and local-only evidence pending",
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      },
      {
        sourceRoute: "/tools/sanchika",
        destinationRoute: "https://tools.complyeaze.com/sanchika",
        cleanupStatus: cleanupBlocked,
        evidenceStatus: "Tools-hosted route and Sanchika adoption evidence pending",
        redirectStatus: "redirect not configured",
        rollback: rollbackKeepParent
      }
    ]
  }
];
