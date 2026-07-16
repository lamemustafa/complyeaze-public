import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const contentDataFiles = [
  "packages/public-content/src/complyeaze.migration-ledger.ts",
  "packages/public-content/src/complyeaze.routes.json",
  "packages/public-content/src/axal.routes.json",
  "packages/public-content/src/pack.routes.json",
  "packages/public-content/src/sanchika.adoption.json"
];

const publicClaimScanFiles = [
  ...contentDataFiles,
  "apps/axal/src/components/AxalDetailPage.astro",
  "apps/axal/src/components/AxalCraftReviewPage.astro",
  "apps/axal/src/components/AxalHomePage.astro",
  "apps/axal/src/components/SyntheticWorkbench.astro",
  "apps/axal/src/layouts/AxalPageLayout.astro",
  "apps/axal/src/pages/[slug].astro",
  "apps/axal/src/pages/index.astro",
  "apps/complyeaze/src/components/PublicEvidencePage.astro",
  "apps/complyeaze/src/components/PublicCraftReviewPage.astro",
  "apps/complyeaze/src/components/PublicGatewayPage.astro",
  "apps/complyeaze/src/components/PublicHomePage.astro",
  "apps/complyeaze/src/components/PublicMigrationLedger.astro",
  "apps/complyeaze/src/components/PublicMigrationPage.astro",
  "apps/complyeaze/src/components/PublicPolicyPage.astro",
  "apps/complyeaze/src/components/PublicProductsPage.astro",
  "apps/complyeaze/src/components/PublicResourcePage.astro",
  "apps/complyeaze/src/components/PublicSanchikaAdoptionPage.astro",
  "apps/complyeaze/src/layouts/PublicPageLayout.astro",
  "apps/complyeaze/src/pages/[...slug].astro",
  "apps/complyeaze/src/pages/index.astro",
  "apps/complyeaze/src/pages/robots.txt.ts",
  "apps/complyeaze/src/pages/sitemap.xml.ts",
  "apps/pack/src/pages/index.astro",
  "apps/pack/src/components/PackCraftReviewPage.astro",
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

export function assertCanonicalManifestClaimFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "public-claim-manifest-"));
  try {
    for (const filePath of publicClaimScanFiles) {
      const absolutePath = path.join(root, filePath);
      mkdirSync(path.dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, "", "utf8");
    }
    const manifestPath = "packages/public-content/src/complyeaze.routes.json";
    const absoluteManifestPath = path.join(root, manifestPath);
    mkdirSync(path.dirname(absoluteManifestPath), { recursive: true });
    writeFileSync(absoluteManifestPath, '{"summary":"production ready"}\n', "utf8");
    const findings = [];
    assertNoRiskyClaimsOutsidePolicy(root, findings);
    if (!findings.some((finding) => finding.startsWith(`${manifestPath}:`))) {
      throw new Error("Canonical route manifest risky-claim fixture was not detected");
    }
    const ledgerPath = "packages/public-content/src/complyeaze.migration-ledger.ts";
    const absoluteLedgerPath = path.join(root, ledgerPath);
    mkdirSync(path.dirname(absoluteLedgerPath), { recursive: true });
    writeFileSync(absoluteLedgerPath, 'const status = "production ready";\n', "utf8");
    const ledgerFindings = [];
    assertNoRiskyClaimsOutsidePolicy(root, ledgerFindings);
    if (!ledgerFindings.some((finding) => finding.startsWith(`${ledgerPath}:`))) {
      throw new Error("Canonical migration ledger risky-claim fixture was not detected");
    }
    for (const sanchikaPath of [
      "apps/complyeaze/src/components/PublicSanchikaAdoptionPage.astro",
      "packages/public-content/src/sanchika.adoption.json",
    ]) {
      const absoluteSanchikaPath = path.join(root, sanchikaPath);
      mkdirSync(path.dirname(absoluteSanchikaPath), { recursive: true });
      writeFileSync(absoluteSanchikaPath, 'const claim = "production ready";\n', "utf8");
      const sanchikaFindings = [];
      assertNoRiskyClaimsOutsidePolicy(root, sanchikaFindings);
      if (!sanchikaFindings.some((finding) => finding.startsWith(`${sanchikaPath}:`))) {
        throw new Error(`${sanchikaPath} risky-claim fixture was not detected`);
      }
      writeFileSync(absoluteSanchikaPath, "", "utf8");
    }
    for (const craftComponentPath of [
      "apps/complyeaze/src/components/PublicCraftReviewPage.astro",
      "apps/axal/src/components/AxalCraftReviewPage.astro",
      "apps/pack/src/components/PackCraftReviewPage.astro",
    ]) {
      const absoluteCraftPath = path.join(root, craftComponentPath);
      mkdirSync(path.dirname(absoluteCraftPath), { recursive: true });
      writeFileSync(absoluteCraftPath, 'const claim = "production ready";\n', "utf8");
      const craftFindings = [];
      assertNoRiskyClaimsOutsidePolicy(root, craftFindings);
      if (!craftFindings.some((finding) => finding.startsWith(`${craftComponentPath}:`))) {
        throw new Error(`${craftComponentPath} risky-claim fixture was not detected`);
      }
      writeFileSync(absoluteCraftPath, "", "utf8");
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
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
