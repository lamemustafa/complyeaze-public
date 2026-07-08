import { readFileSync } from "node:fs";
import path from "node:path";

const contentDataFiles = [
  "src/site-data.mjs",
  "src/gateway-data.mjs",
  "src/root-resource-data.mjs",
  "src/product-data.mjs",
  "src/axal-data.mjs",
  "src/axal-more-data.mjs",
  "src/migration-data.mjs",
  "src/policy-data.mjs"
];

const publicClaimScanFiles = [
  ...contentDataFiles,
  "AGENTS.md",
  "README.md",
  "PRODUCT.md",
  "DESIGN.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "SUPPORT.md",
  "CODE_OF_CONDUCT.md",
  "LICENSE.brand.md",
  "TRADEMARKS.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/content_or_claim.md",
  ".github/ISSUE_TEMPLATE/page_request.md",
  ".github/ISSUE_TEMPLATE/route_cleanup.md",
  "docs/DEPENDENCY_POLICY.md",
  "docs/HOSTING_CUTOVER.md",
  "docs/MIGRATION.md",
  "docs/PUBLIC_CLAIM_POLICY.md",
  "docs/RELEASE_GATES.md",
  "docs/REPOSITORY_SETTINGS.md",
  "docs/REVIEW_RECTIFY.md",
  "docs/ROUTE_MIGRATION_LEDGER.md",
  "docs/VISUAL_TESTING.md"
];

const riskyClaimPatterns = [
  { label: "government approval claim", pattern: /\bgovernment[- ]approved\b/i },
  { label: "portal-operator approval claim", pattern: /\b(?:GSTN|CBIC)[\s-]+(?:approved|certified|endorsed)\b/i },
  { label: "official product claim", pattern: /\bofficial\s+(?:ComplyEaze|Axal|Pack|Tools|Sanchika)[\s-]+(?:product|site|service|app|tool|page|surface)\b/i },
  { label: "brand endorsement claim", pattern: /\b(?:endorsed|certified|approved)\s+by\s+(?:ComplyEaze|Axal|Pack|Tools|Sanchika)\b/i },
  { label: "brand certification claim", pattern: /\b(?:ComplyEaze|Axal|Pack|Tools|Sanchika)[\s-]+(?:certified|approved|endorsed)\b/i },
  { label: "powered-by brand claim", pattern: /\bpowered\s+by\s+(?:ComplyEaze|Axal|Pack|Tools|Sanchika)\b/i },
  { label: "certified GST filing claim", pattern: /\bcertified GST filing\b/i },
  { label: "production-ready claim", pattern: /\bproduction[- ]ready\b/i },
  { label: "DPDP compliance claim", pattern: /\bDPDP compliant\b/i },
  { label: "audit-proof claim", pattern: /\baudit-proof\b/i },
  { label: "CA verification claim", pattern: /\bCA verified\b/i },
  { label: "zero data collection claim", pattern: /\bzero data collection\b/i },
  { label: "absolute local-only claim", pattern: /\bnothing leaves your device\b/i }
];

const policyExampleFiles = new Set([
  "LICENSE.brand.md",
  "TRADEMARKS.md",
  "docs/PUBLIC_CLAIM_POLICY.md"
]);

export function assertNoRiskyClaimsOutsidePolicy(root, findings) {
  for (const filePath of publicClaimScanFiles) {
    const text = readFile(root, filePath);
    const maskedText = maskPolicyExamples(filePath, text);
    for (const { label, pattern } of riskyClaimPatterns) {
      for (const match of maskedText.matchAll(toGlobalPattern(pattern))) {
        findings.push(`${filePath}:${lineForOffset(maskedText, match.index ?? 0)}: unsupported ${label}`);
      }
    }
  }
}

function maskPolicyExamples(filePath, text) {
  if (!policyExampleFiles.has(filePath)) return text;

  const lines = text.split(/(\r?\n)/);
  const state = { inFence: false, inExplicitDenySection: false };
  return lines.map((line) => shouldMaskPolicyLine(filePath, line, state) ? maskLine(line) : line).join("");
}

function shouldMaskPolicyLine(filePath, line, state) {
  if (/^\r?\n$/.test(line)) return false;
  const trimmed = line.trim();
  if (/^```/.test(trimmed)) {
    state.inFence = !state.inFence;
    return true;
  }
  if (state.inFence) return true;

  if (/^##\s+/.test(trimmed)) {
    state.inExplicitDenySection = isExplicitDenyHeading(filePath, trimmed);
    return state.inExplicitDenySection;
  }
  if (/^Not allowed:\s*$/i.test(trimmed)) {
    return true;
  }

  return state.inExplicitDenySection;
}

function isExplicitDenyHeading(filePath, trimmed) {
  if (filePath === "docs/PUBLIC_CLAIM_POLICY.md") {
    return /^##\s+Banned Without Separate Review\b/i.test(trimmed);
  }
  if (filePath === "TRADEMARKS.md") {
    return /^##\s+Not Allowed\b/i.test(trimmed);
  }
  return false;
}

function maskLine(line) {
  return line.replace(/[^\r\n]/g, " ");
}

function toGlobalPattern(pattern) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return new RegExp(pattern.source, flags);
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
