const packSections = [
  {
    title: "What this page can say",
    body:
      "Pack is the ComplyEaze-family browser-extension lane for narrow GST Portal evidence collection. This public repo records the family boundary and points readers to the Pack host for source, install, release, privacy, security, and support facts."
  },
  {
    title: "What Pack owns elsewhere",
    body:
      "The Pack site and Pack repository own extension evidence, release artifacts, distribution state, runtime behavior, supported portal pages, and local-download acceptance criteria."
  },
  {
    title: "What not to infer",
    body:
      "This gateway does not claim portal-operator endorsement, return submission capability, credential handling, file custody, analytics posture, or distribution readiness. Those claims need Pack-owned evidence."
  }
];

const toolsSections = [
  {
    title: "What this page can say",
    body:
      "Tools is the ComplyEaze-family lane for browser-local utilities and source-backed proof surfaces. This public repo records where Tools belongs in the family and links out to the utility host."
  },
  {
    title: "What Tools owns elsewhere",
    body:
      "The Tools host owns each utility's runtime behavior, user inputs, generated outputs, local-only boundaries, accessibility state, and release/deploy evidence."
  },
  {
    title: "What not to infer",
    body:
      "This gateway does not add accounts, uploads, server storage, databases, analytics, file custody, compliance validation, return submission, payment checks, or tenant records to Tools."
  }
];

export const gatewayPages = [
  {
    slug: "pack-gateway",
    type: "productGateway",
    product: "Pack",
    outputPath: "products/pack/index.html",
    urlPath: "/products/pack/",
    title: "Pack Gateway - ComplyEaze Public",
    description:
      "Public family-level gateway for Pack by ComplyEaze without importing extension runtime or release claims.",
    eyebrow: "Pack boundary",
    heading: "A gateway, not the extension source of truth",
    summary:
      "ComplyEaze Public can explain why Pack exists in the product family. Pack-owned pages must prove install, release, permission, and browser-runtime claims before anyone relies on them.",
    externalHref: "https://pack.complyeaze.com",
    externalLabel: "Open Pack host",
    secondaryCta: { label: "Review migration ledger", href: "/migration/" },
    sections: packSections,
    evidence: [
      "Parent Pack pages remain cleanup-blocked until Pack-hosted pages and release-facts checks are green.",
      "Release artifacts, distribution state, and extension implementation details stay out of this gateway.",
      "The product-family map can route readers without making operational Pack claims."
    ]
  },
  {
    slug: "tools-gateway",
    type: "productGateway",
    product: "Tools",
    outputPath: "products/tools/index.html",
    urlPath: "/products/tools/",
    title: "Tools Gateway - ComplyEaze Public",
    description:
      "Public family-level gateway for ComplyEaze Tools without importing utility runtime or backend claims.",
    eyebrow: "Tools boundary",
    heading: "Browser-local utilities stay externally proven",
    summary:
      "ComplyEaze Public can explain where Tools fits. The Tools host must prove each utility's local-only runtime, accessibility, release, and no-custody boundaries.",
    externalHref: "https://tools.complyeaze.com",
    externalLabel: "Open Tools host",
    secondaryCta: { label: "Review migration ledger", href: "/migration/" },
    sections: toolsSections,
    evidence: [
      "Parent Tools routes remain cleanup-blocked until the static utility host serves equivalent public pages.",
      "Utility implementation, browser state, generated outputs, and Sanchika adoption proof stay on the Tools host.",
      "This gateway is a family map, not a claim that every Tools surface is ready for production use."
    ]
  }
];
