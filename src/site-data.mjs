import { axalPages } from "./axal-data.mjs";
import { policyPages } from "./policy-data.mjs";
import { rootResourcePages } from "./root-resource-data.mjs";

export const site = {
  origin: "https://complyeaze.com",
  title: "ComplyEaze Public",
  description:
    "Public website, trust, release, policy, and brand surfaces for the ComplyEaze product family.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Products", href: "/products/" },
    { label: "Migration", href: "/migration/" },
    { label: "Trust", href: "/trust/" },
    { label: "Status", href: "/status/" },
    { label: "Docs", href: "/docs/" }
  ],
  migrationLedgerPath: "/migration/"
};

const corePages = [
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
    primaryCta: { label: "View migration ledger", href: "/migration/" },
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
    slug: "migration",
    outputPath: "migration/index.html",
    urlPath: "/migration/",
    title: "Route Migration Ledger - ComplyEaze Public",
    description:
      "Public route migration ledger for moving ComplyEaze-family pages out of the private app.",
    eyebrow: "Migration ledger",
    heading: "No cleanup before route evidence",
    summary:
      "Every public route family needs a destination, source evidence, cleanup rule, and rollback path before private-app pages are removed or redirected.",
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

export const pages = [...corePages, ...rootResourcePages, ...policyPages, ...axalPages];
