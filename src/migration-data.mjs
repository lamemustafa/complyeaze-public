export const migrationLedger = [
  {
    family: "Root public pages",
    source:
      "src/app/(main)/page.tsx and src/app/(main)/resources/{about-us,contact-us,privacy-policy,terms-and-conditions}",
    destination:
      "/, /about/, /contact/, /privacy/, /terms/, /status/, /changelog/, and /release-evidence/ in complyeaze-public",
    status: "root resource and policy/status/release pages seeded; cleanup blocked",
    cleanup:
      "Do not remove parent routes until production host routing, canonical URLs, and rollback redirects are recorded.",
    evidence:
      "Root story, product-family map, public-safe about/contact routing, and public-repo-specific policy/status/release routes are seeded; parent components were not copied because they include form submission, contact details, profile links, and broad compliance claims.",
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
      "/products/pack/ for family-level context, then pack.complyeaze.com for product-owned source, install, release, privacy, security, and support facts",
    status: "gateway seeded; cleanup blocked",
    cleanup:
      "Do not copy extension permissions, release claims, or store-readiness language without Pack release evidence.",
    evidence:
      "Family-level Pack gateway is seeded without copying parent Pack pages; Pack remains a separate public extension repository and host for runtime/release facts.",
    rollback:
      "Keep parent Pack pages or redirects until Pack-hosted pages and release-facts checks are green."
  },
  {
    family: "Tools public utilities",
    source:
      "src/app/(tools)/evidence-packet/page.tsx and src/app/(tools)/sanchika/page.tsx",
    destination:
      "/products/tools/ for family-level context, then tools.complyeaze.com for utility-owned runtime and release evidence",
    status: "gateway seeded; cleanup blocked",
    cleanup:
      "Do not add account, upload, backend, or document-custody behavior to this repository.",
    evidence:
      "Family-level Tools gateway is seeded without copying parent utility implementation; Tools surfaces should stay browser-local and source-backed before any parent cleanup.",
    rollback:
      "Keep parent Tools routes until the static utility host serves equivalent public pages."
  }
];
