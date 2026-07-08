export const migrationLedger = [
  {
    family: "Root public pages",
    source:
      "src/app/(main)/page.tsx and src/app/(main)/resources/{about-us,contact-us,privacy-policy,terms-and-conditions}",
    destination:
      "/, /about/, /contact/, /privacy/, and /terms/ in complyeaze-public",
    status: "partially seeded",
    cleanup:
      "Do not remove parent routes until production host routing, canonical URLs, and rollback redirects are recorded.",
    evidence:
      "Root story and product-family map are seeded; resource pages still need public-safe copy review.",
    rollback:
      "Keep parent routes available until the public static deploy serves matching routes and metadata."
  },
  {
    family: "Axal marketing",
    source:
      "src/app/(axal)/(marketing)/axal/page.tsx and src/app/(axal)/(marketing)/axal/[slug]/page.tsx",
    destination:
      "Axal public host plus complyeaze-public product-family and migration context",
    status: "inventory only",
    cleanup:
      "Do not move login, signup, reset, callback, or workspace flows into this repository.",
    evidence:
      "Parent route registry lists five clean Axal marketing paths for later public-host verification.",
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
