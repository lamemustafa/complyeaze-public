export const site = {
  origin: "https://complyeaze.com",
  title: "ComplyEaze Public",
  description:
    "Public website, trust, release, policy, and brand surfaces for the ComplyEaze product family.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products/" },
    { label: "Trust", href: "/trust/" },
    { label: "Docs", href: "/docs/" }
  ],
  products: [
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
      href: "https://axal.complyeaze.com"
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
  ],
  proofLedger: [
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
  ],
  trustSignals: [
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
  ],
  migrationRoutes: [
    {
      source: "src/app/(main)/page.tsx",
      destination: "/",
      status: "seeded",
      notes: "Root public story and product-family map seeded into complyeaze-public."
    },
    {
      source: "src/app/(axal)/(marketing)/axal/page.tsx",
      destination: "/products/#axal",
      status: "planned",
      notes: "Public Axal story can migrate after auth callbacks and clean host routing stay private."
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
  ]
};

export const pages = [
  {
    slug: "index",
    outputPath: "index.html",
    urlPath: "/",
    title: "ComplyEaze Public",
    description:
      "Public trust, product-family, and open-source surfaces for ComplyEaze.",
    eyebrow: "Public boundary",
    heading: "ComplyEaze Public",
    summary:
      "A standalone public repo for the pages people can inspect, cite, fork, and review without crossing into tenant data, portal automation, or private app infrastructure.",
    primaryCta: { label: "View migration map", href: "/docs/" },
    secondaryCta: { label: "Review trust policy", href: "/trust/" },
    sections: [
      {
        title: "What moves here",
        body:
          "Marketing, docs, trust, policy, status, changelog, release evidence, public SEO assets, product-family maps, and synthetic screenshots belong in this repo."
      },
      {
        title: "What stays private",
        body:
          "Authenticated Axal workflows, tenant data, Prisma, Redis, workers, portal sessions, credentials, and document pipelines stay in the private ComplyEaze app."
      },
      {
        title: "How changes ship",
        body:
          "Every meaningful visual change needs rendered desktop and mobile evidence, public-claim review, link and metadata checks, and a clean review-rectify loop."
      }
    ]
  },
  {
    slug: "products",
    outputPath: "products/index.html",
    urlPath: "/products/",
    title: "Product Family - ComplyEaze Public",
    description: "Public map of ComplyEaze, Axal, Pack, Tools, and Sanchika.",
    eyebrow: "Product family",
    heading: "Route by job, then show the boundary before action",
    summary:
      "A unified story does not mean one visual costume for everything. It means readers can see why Axal, Pack, Tools, and Sanchika exist together without confusing workspace custody, browser-local drafts, extension behavior, or design-system proof.",
    sections: []
  },
  {
    slug: "trust",
    outputPath: "trust/index.html",
    urlPath: "/trust/",
    title: "Trust Policy - ComplyEaze Public",
    description:
      "Public safety rules for claims, trademarks, screenshots, and sensitive data.",
    eyebrow: "Trust and safety",
    heading: "Public claims need evidence",
    summary:
      "This repo is open by design, so it rejects real taxpayer data, private deployment details, unsupported compliance promises, and confusing trademark use.",
    sections: [
      {
        title: "Synthetic evidence only",
        body:
          "Screenshots, fixtures, demos, and issue reports must avoid real taxpayer identifiers, documents, credentials, portal responses, and customer details."
      },
      {
        title: "Source before confidence",
        body:
          "Security, privacy, release, store, browser-local, and statutory claims must point to source, release, runtime, or official evidence before asking a professional to act."
      },
      {
        title: "Reserved marks",
        body:
          "The source license does not grant rights to imply endorsement, affiliation, certification, or official ComplyEaze operation."
      }
    ]
  },
  {
    slug: "docs",
    outputPath: "docs/index.html",
    urlPath: "/docs/",
    title: "Migration Docs - ComplyEaze Public",
    description:
      "Open-source migration order, release gates, visual checks, and review-rectify loop.",
    eyebrow: "Migration docs",
    heading: "Extract one public surface at a time",
    summary:
      "The migration starts with a public-safe shell, then moves pages only after screenshots, metadata, links, and source-backed claims pass review.",
    sections: [
      {
        title: "Before commit",
        body:
          "Run lint, typecheck, test, build, visual, public, link, metadata, and diff checks. Visual evidence must include desktop and mobile states."
      },
      {
        title: "Before cleanup",
        body:
          "Do not remove a private-app public route until this repo owns the production route and rollback evidence is recorded."
      },
      {
        title: "Before public claims",
        body:
          "If the repo cannot prove a claim, narrow it or remove it. Public trust comes from exact language and reviewable evidence."
      }
    ]
  }
];
