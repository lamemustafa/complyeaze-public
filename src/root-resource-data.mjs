const aboutHighlights = [
  {
    title: "Why this public repo exists",
    body:
      "ComplyEaze Public keeps inspectable website, trust, migration, release, and product-family pages outside the private application that handles authenticated work."
  },
  {
    title: "What the family is for",
    body:
      "Axal, Pack, Tools, and Sanchika each solve a different public-facing job: practice operations, browser-local evidence collection, utility drafts, and design-system proof."
  },
  {
    title: "What we will not blur",
    body:
      "Public storytelling must not blur into tenant custody, portal sessions, filing certainty, credential handling, or private production operations."
  }
];

const contactLanes = [
  {
    label: "Public page issue",
    route: "GitHub issue",
    detail:
      "Use public issues for broken links, typos, accessibility problems, route migration gaps, or source-backed claim corrections that contain only synthetic data."
  },
  {
    label: "Sensitive report",
    route: "Security policy",
    detail:
      "Use the private vulnerability reporting path for suspected secrets, sensitive-data exposure, misleading collection behavior, or security issues."
  },
  {
    label: "Product or customer inquiry",
    route: "Private product channel",
    detail:
      "Do not put client, taxpayer, credential, document, phone, or portal details into this public repository. Use the established private ComplyEaze channel instead."
  }
];

export const rootResourcePages = [
  {
    slug: "about",
    type: "rootResource",
    outputPath: "about/index.html",
    urlPath: "/about/",
    title: "About ComplyEaze Public",
    description:
      "Public-safe about page for the ComplyEaze product family and open-source website migration.",
    eyebrow: "About the public boundary",
    heading: "A public surface for proof, not private operations",
    summary:
      "This site explains the ComplyEaze product family, the migration from private-app public pages, and the evidence required before claims or cleanup move forward.",
    primaryCta: { label: "See product family", href: "/products/" },
    secondaryCta: { label: "Read migration ledger", href: "/migration/" },
    highlights: aboutHighlights,
    proof: [
      "Open-source governance files define contribution, security, support, trademark, and review expectations.",
      "Rendered public pages are checked for metadata, links, public claims, and desktop/tablet/mobile visual behavior.",
      "Parent-app route cleanup is blocked until hosted route, canonical, redirect, and rollback evidence exists."
    ]
  },
  {
    slug: "contact",
    type: "rootResource",
    outputPath: "contact/index.html",
    urlPath: "/contact/",
    title: "Contact Routing - ComplyEaze Public",
    description:
      "Public-safe contact routing for ComplyEaze Public issues, security reports, and private product inquiries.",
    eyebrow: "Contact routing",
    heading: "Pick the channel before sharing details",
    summary:
      "The public repository can receive website and documentation feedback, but sensitive customer, taxpayer, credential, document, and portal details must stay out of public issues.",
    primaryCta: {
      label: "Read support policy",
      href: "https://github.com/lamemustafa/complyeaze-public/blob/main/SUPPORT.md"
    },
    secondaryCta: {
      label: "Read security policy",
      href: "https://github.com/lamemustafa/complyeaze-public/blob/main/SECURITY.md"
    },
    lanes: contactLanes,
    proof: [
      "The parent contact form depends on authenticated app code and an API submission path, so it is not copied into this static public site.",
      "Phone numbers, office addresses, and named individual profile links are not embedded in this open-source page by default.",
      "Public issues should contain synthetic reproduction steps and redacted evidence only."
    ]
  }
];
