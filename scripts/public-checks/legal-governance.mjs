import { readFileSync } from "node:fs";
import path from "node:path";
import { assertNoRiskyClaimsOutsidePolicy } from "./public-claims.mjs";

const requiredFiles = {
  sourceLicense: "LICENSE",
  brandLicense: "LICENSE.brand.md",
  trademarks: "TRADEMARKS.md",
  readme: "README.md",
  contributing: "CONTRIBUTING.md",
  security: "SECURITY.md",
  support: "SUPPORT.md",
  publicClaimPolicy: "docs/PUBLIC_CLAIM_POLICY.md",
  reviewRectify: "docs/REVIEW_RECTIFY.md",
  pullRequestTemplate: ".github/PULL_REQUEST_TEMPLATE.md",
  bugReportTemplate: ".github/ISSUE_TEMPLATE/bug_report.md",
  contentIssueTemplate: ".github/ISSUE_TEMPLATE/content_or_claim.md",
  pageRequestTemplate: ".github/ISSUE_TEMPLATE/page_request.md"
};

const requiredTerms = [
  {
    file: requiredFiles.sourceLicense,
    terms: [
      "Apache License",
      "Version 2.0",
      "This License does not grant permission to use the trade names, trademarks, service marks, or product names"
    ]
  },
  {
    file: requiredFiles.brandLicense,
    terms: [
      "Apache-2.0 license covers source code",
      "does not grant",
      "ComplyEaze",
      "Axal",
      "Pack",
      "Tools",
      "Sanchika",
      "endorsement",
      "official affiliation",
      "ownership",
      "certification",
      "government approval",
      "Official ComplyEaze product",
      "Endorsed by ComplyEaze",
      "Government approved",
      "Certified GST filing solution",
      "Public forks",
      "downstream deployments",
      "clearly identify themselves"
    ]
  },
  {
    file: requiredFiles.trademarks,
    terms: [
      "reserved marks",
      "does not grant trademark rights",
      "Compatibility statements",
      "endorsement",
      "certification",
      "partnership",
      "ownership",
      "government approval",
      "statutory certification",
      "Fork attribution",
      "fork owner",
      "support, privacy, security",
      "visibly distinguish themselves"
    ]
  },
  {
    file: requiredFiles.readme,
    terms: [
      "Apache License 2.0",
      "Brand and trademark notice",
      "Trademark policy",
      "Security",
      "Support",
      "private ComplyEaze application repository",
      "tenant data",
      "credentials",
      "portal automation",
      "Prisma",
      "Redis/BullMQ"
    ]
  },
  {
    file: requiredFiles.contributing,
    terms: [
      "synthetic examples only",
      "trademark boundaries",
      "statutory correctness",
      "government approval",
      "release status",
      "store availability",
      "evidence",
      "Inbound Contribution Terms",
      "right to submit",
      "Apache License 2.0 section 5 inbound contribution terms",
      "section 5",
      "unless you explicitly state otherwise",
      "proprietary, confidential, copied",
      "third-party content",
      "license, source, attribution",
      "source license grant does not grant trademark",
      "Security Reports",
      "LICENSE.brand.md",
      "TRADEMARKS.md"
    ]
  },
  {
    file: requiredFiles.security,
    terms: [
      "Do not open a public issue",
      "GitHub private vulnerability reporting",
      "synthetic data",
      "No secrets",
      "PAN",
      "GSTIN",
      "portal HTML",
      "credentials"
    ]
  },
  {
    file: requiredFiles.support,
    terms: [
      "Use public issues for public-site bugs",
      "Do not post",
      "PAN",
      "GSTIN",
      "portal HTML",
      "credentials",
      "private deployment",
      "SECURITY.md"
    ]
  },
  {
    file: requiredFiles.publicClaimPolicy,
    terms: [
      "source-backed",
      "Government approval",
      "GSTN",
      "CBIC",
      "statutory coverage",
      "production readiness",
      "DPDP compliance",
      "Certified GST filing behavior",
      "synthetic data only",
      "trademark",
      "endorsement"
    ]
  },
  {
    file: requiredFiles.reviewRectify,
    terms: [
      "Critical",
      "High",
      "Fix all Critical and High",
      "Repeat until",
      "public-site-build",
      "public-visual-evidence"
    ]
  },
  {
    file: requiredFiles.pullRequestTemplate,
    terms: [
      "Public Safety",
      "synthetic data only",
      "PAN",
      "GSTIN",
      "Aadhaar",
      "Public claims",
      "source, release, or runtime evidence",
      "Trademark and affiliation boundaries",
      "right to submit",
      "Apache License",
      "section 5",
      "explicitly state otherwise",
      "proprietary, confidential, copied",
      "license, source, attribution",
      "Third-Party Or Proprietary Content Disclosure",
      "Inclusion rationale",
      "Review-Rectify",
      "Finding",
      "Severity",
      "Disposition",
      "Evidence"
    ]
  },
  {
    file: requiredFiles.bugReportTemplate,
    terms: ["synthetic data", "taxpayer data", "portal screenshots", "credentials"]
  },
  {
    file: requiredFiles.contentIssueTemplate,
    terms: ["private taxpayer data", "credentials", "portal screenshots"]
  },
  {
    file: requiredFiles.pageRequestTemplate,
    terms: ["Source Evidence", "private app", "taxpayer-data", "authenticated workflow"]
  }
];

export function assertLegalGovernance(root) {
  const findings = [];

  for (const { file, terms } of requiredTerms) {
    assertTerms(file, readFile(root, file), terms, findings);
  }

  const brandLicense = readFile(root, requiredFiles.brandLicense);
  const trademarks = readFile(root, requiredFiles.trademarks);
  const publicClaimPolicy = readFile(root, requiredFiles.publicClaimPolicy);

  if (!/Apache-?2\.0 license covers source code/i.test(brandLicense)) {
    findings.push(`${requiredFiles.brandLicense}: must separate source license from brand rights`);
  }
  if (!/source license does not grant trademark rights/i.test(trademarks)) {
    findings.push(`${requiredFiles.trademarks}: must reserve trademark rights outside the source license`);
  }
  if (!/government approval|GSTN approved|CBIC approved/i.test(publicClaimPolicy)) {
    findings.push(`${requiredFiles.publicClaimPolicy}: must block unsupported government or portal endorsement claims`);
  }
  assertNoRiskyClaimsOutsidePolicy(root, findings);

  if (findings.length > 0) {
    throw new Error(`Legal governance findings:\n${findings.join("\n")}`);
  }
}

function assertTerms(filePath, text, terms, findings) {
  const normalized = normalize(text);
  for (const term of terms) {
    if (!normalized.includes(normalize(term))) {
      findings.push(`${filePath}: missing ${term}`);
    }
  }
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
