export const migrationLedger = [
  {
    family: "Root public pages",
    source:
      "src/app/(main)/page.tsx and src/app/(main)/resources/{about-us,contact-us,privacy-policy,terms-and-conditions}",
    destination:
      "/, /privacy/, /terms/, /status/, /changelog/, and /release-evidence/ in complyeaze-public; /about/ and /contact/ still pending review",
    status: "policy/status/release pages seeded; cleanup blocked",
    cleanup:
      "Do not remove parent routes until production host routing, canonical URLs, and rollback redirects are recorded.",
    evidence:
      "Root story, product-family map, and public-repo-specific policy/status/release routes are seeded; parent about/contact/legal pages still need public-safe copy review before any direct migration.",
    rollback:
      "Keep parent routes available until the public static deploy serves matching routes and metadata."
  },
  {
    family: "Axal marketing",
    source:
      "src/app/(axal)/(marketing)/axal/page.tsx and src/app/(axal)/(marketing)/axal/[slug]/page.tsx",
    destination:
      "/products/axal/ plus five /products/axal/<slug>/ static public pages",
    status: "seeded; cleanup blocked",
    cleanup:
      "Do not move login, signup, reset, callback, or workspace flows into this repository.",
    evidence:
      "Five Axal SEO pages are seeded as public-safe static pages with narrowed claims and visual checks required before merge.",
    rollback:
      "Preserve parent rewrites until Axal clean-route redirects and crawler metadata pass hosted checks."
  },
  {
    family: "Pack public pages",
    source:
      "src/app/(pack)/{source,status,changelog,support,security,privacy,terms,acceptable-use,docs,release-automation,gst}/page.tsx",
    destination:
      "pack.complyeaze.com for product pages, with complyeaze-public carrying only family-level context",
    status: "planned",
    cleanup:
      "Do not copy extension permissions, release claims, or store-readiness language without Pack release evidence.",
    evidence:
      "Pack remains a separate public extension repository with local-first safety rules.",
    rollback:
      "Keep parent Pack pages or redirects until Pack-hosted pages and release-facts checks are green."
  },
  {
    family: "Tools public utilities",
    source:
      "src/app/(tools)/evidence-packet/page.tsx and src/app/(tools)/sanchika/page.tsx",
    destination:
      "tools.complyeaze.com for utility pages, with complyeaze-public carrying family-level context",
    status: "planned",
    cleanup:
      "Do not add account, upload, backend, or document-custody behavior to this repository.",
    evidence:
      "Tools surfaces should stay browser-local and source-backed before any parent cleanup.",
    rollback:
      "Keep parent Tools routes until the static utility host serves equivalent public pages."
  }
];
