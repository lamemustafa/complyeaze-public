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
  { label: "portal-operator approval claim", pattern: /\b(?:GSTN|CBIC)\s+(?:approved|certified|endorsed)\b/i },
  { label: "official product claim", pattern: /\bofficial\s+(?:ComplyEaze|Axal|Pack|Tools|Sanchika)\s+(?:product|site|service|app|tool|page|surface)\b/i },
  { label: "brand endorsement claim", pattern: /\b(?:endorsed|certified|approved)\s+by\s+(?:ComplyEaze|Axal|Pack|Tools|Sanchika)\b/i },
  { label: "brand certification claim", pattern: /\b(?:ComplyEaze|Axal|Pack|Tools|Sanchika)\s+(?:certified|approved|endorsed)\b/i },
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
    const lines = text.split(/\r?\n/);
    const state = { inFence: false, inExplicitDenySection: false };
    for (const [index, line] of lines.entries()) {
      if (isPolicyExampleLine(filePath, line, state)) continue;
      for (const { label, pattern } of riskyClaimPatterns) {
        if (pattern.test(line)) {
          findings.push(`${filePath}:${index + 1}: unsupported ${label}`);
        }
      }
    }
  }
}

function isPolicyExampleLine(filePath, line, state) {
  if (!policyExampleFiles.has(filePath)) return false;

  const trimmed = line.trim();
  if (/^```/.test(trimmed)) {
    state.inFence = !state.inFence;
    return true;
  }
  if (state.inFence) return true;

  if (/^##\s+/.test(trimmed)) {
    state.inExplicitDenySection = /^##\s+(Banned Without Separate Review|Not Allowed)\b/i.test(trimmed);
    return false;
  }
  if (/^Not allowed:\s*$/i.test(trimmed)) {
    state.inExplicitDenySection = true;
    return false;
  }

  return state.inExplicitDenySection;
}

function readFile(root, filePath) {
  return readFileSync(path.join(root, filePath), "utf8");
}
