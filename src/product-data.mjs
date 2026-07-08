export const products = [
  {
    name: "ComplyEaze",
    role: "Umbrella trust and learning surface",
    promise:
      "Keeps the public product-family story separate from authenticated app operations.",
    proof:
      "Public pages, migration docs, and review gates live in this open-source repository.",
    boundary:
      "No private app runtime, taxpayer data, credential, document, portal session, or workspace custody.",
    status: "Public content boundary",
    href: "/"
  },
  {
    name: "Axal",
    role: "Practice operating system",
    promise:
      "Turns matters, obligations, evidence, clients, documents, and tasks into a reviewable desk for CA teams.",
    proof: "Workspace-first, permission-aware, source-led compliance work.",
    boundary: "Account, workspace, roles, saved operational context.",
    status: "Firm workbench",
    href: "/products/axal/"
  },
  {
    name: "Pack",
    role: "GST Portal evidence utility",
    promise:
      "Keeps the narrow filed-return collection job local, source-first, and separate from the full practice system.",
    proof: "No-login public posture; no backend upload or telemetry claim.",
    boundary: "Browser extension, local artifact control, no custody claim.",
    status: "GST evidence utility",
    href: "https://pack.complyeaze.com"
  },
  {
    name: "Tools",
    role: "Browser-local compliance utilities",
    promise:
      "Creates quick compliance review artifacts from pasted rows or plain text without needing an account.",
    proof: "Utility surfaces stay browser-local until a deeper product lane exists.",
    boundary: "Browser-local drafts; no account, upload, or tenant state.",
    status: "Public utility bench",
    href: "https://tools.complyeaze.com"
  },
  {
    name: "Sanchika",
    role: "Design harness",
    promise:
      "Defines the trust and design brief loop before visual language spreads across the product family.",
    proof:
      "Live gallery deploys from master, with smoke checks for stale public proof.",
    boundary: "Design contracts and static artifacts; no compliance truth.",
    status: "Evidence loop",
    href: "https://sanchika.complyeaze.com/"
  }
];

export const proofLedger = [
  {
    label: "Authoritative design host",
    value: "sanchika.complyeaze.com",
    detail: "Static gallery deployed from Sanchika master."
  },
  {
    label: "Public story surface",
    value: "complyeaze.com",
    detail: "Routes the family by job, boundary, and proof."
  },
  {
    label: "Adoption rule",
    value: "Pilot first",
    detail: "Contracts follow browser-tested surfaces, not taste alone."
  }
];

export const trustSignals = [
  {
    title: "Source before confidence",
    body:
      "Every product surface should reveal where a state came from before asking a professional to act on it."
  },
  {
    title: "Boundaries stay visible",
    body:
      "Pack remains local-first, Axal remains workspace-scoped, Tools stays browser-local, and Sanchika stays a harness."
  },
  {
    title: "Craft must be proven",
    body:
      "The next design system step is rendered pilots with browser evidence, not a bigger pile of aspirational tokens."
  }
];

export const migrationRoutes = [
  {
    source: "src/app/(main)/page.tsx",
    destination: "/",
    status: "seeded",
    notes: "Root public story and product-family map seeded into complyeaze-public."
  },
  {
    source: "src/app/(axal)/(marketing)/axal/page.tsx and [slug]/page.tsx",
    destination: "/products/axal/ and /products/axal/<slug>/",
    status: "seeded",
    notes: "Axal public SEO pages are seeded as public-safe static pages; parent cleanup remains blocked."
  },
  {
    source: "src/app/(pack)/**",
    destination: "/products/#pack",
    status: "planned",
    notes: "Pack source/status/support pages need release-facts import before route ownership moves."
  },
  {
    source: "src/app/(tools)/**",
    destination: "/products/#tools",
    status: "planned",
    notes: "Tools pages should preserve browser-local utility boundaries."
  }
];
