import { axalPages } from "./axal-data.mjs";
import { evidenceRoutePages } from "./evidence-route-data.mjs";
import { gatewayPages } from "./gateway-data.mjs";
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
];

export const pages = [
  ...corePages,
  ...evidenceRoutePages,
  ...rootResourcePages,
  ...policyPages,
  ...gatewayPages,
  ...axalPages
];
