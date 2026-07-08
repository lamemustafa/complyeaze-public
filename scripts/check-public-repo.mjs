#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pages } from "../src/site-data.mjs";

const root = process.cwd();
const mode = process.argv.find((arg) => arg.startsWith("--")) ?? "--all";

const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "SUPPORT.md",
  "LICENSE",
  "LICENSE.brand.md",
  "TRADEMARKS.md",
  "PRODUCT.md",
  "DESIGN.md",
  "docs/MIGRATION.md",
  "docs/REVIEW_RECTIFY.md",
  "docs/PUBLIC_CLAIM_POLICY.md",
  "docs/RELEASE_GATES.md",
  "docs/REPOSITORY_SETTINGS.md",
  "docs/VISUAL_TESTING.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/content_or_claim.md",
  ".github/ISSUE_TEMPLATE/page_request.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/review-gate.yml",
  "scripts/check-pr-review-gate.mjs",
  "scripts/sync-review-gate-status.mjs",
  "scripts/build-site.mjs",
  "scripts/visual-check.mjs",
  "src/site-data.mjs",
  "src/render-site.mjs",
  "src/styles.css"
];

const forbiddenPatterns = [
  { label: "secret-like env assignment", pattern: /\b[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE_KEY|COOKIE)[A-Z0-9_]*\s*=\s*["']?[^"'\s]+/i },
  { label: "Indian PAN-like identifier", pattern: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g },
  { label: "Indian GSTIN-like identifier", pattern: /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/g }
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules", "dist", "out", ".next"].includes(name)) {
      continue;
    }
    const filePath = path.join(dir, name);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      entries.push(...walk(filePath));
    } else if (textExtensions.has(path.extname(name))) {
      entries.push(filePath);
    }
  }
  return entries;
}

function assertRequiredFiles() {
  const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
  if (missing.length > 0) {
    throw new Error(`Missing required public-repo files:\n${missing.join("\n")}`);
  }
}

function assertNoForbiddenContent() {
  const findings = [];
  for (const filePath of walk(root)) {
    const relative = path.relative(root, filePath);
    const text = readFileSync(filePath, "utf8");
    for (const { label, pattern } of forbiddenPatterns) {
      if (pattern.test(text)) {
        findings.push(`${relative}: ${label}`);
      }
      pattern.lastIndex = 0;
    }
  }
  if (findings.length > 0) {
    throw new Error(`Forbidden public-repo content found:\n${findings.join("\n")}`);
  }
}

function assertVisualPolicy() {
  const text = readFileSync(path.join(root, "docs/VISUAL_TESTING.md"), "utf8");
  const requiredTerms = ["desktop", "mobile", "accessibility", "screenshots", "synthetic data"];
  const missing = requiredTerms.filter((term) => !text.toLowerCase().includes(term));
  if (missing.length > 0) {
    throw new Error(`Visual policy is missing terms: ${missing.join(", ")}`);
  }
}

function assertPublicClaimsPolicy() {
  const text = readFileSync(path.join(root, "docs/PUBLIC_CLAIM_POLICY.md"), "utf8");
  const requiredTerms = ["source", "evidence", "government approval", "synthetic"];
  const missing = requiredTerms.filter((term) => !text.toLowerCase().includes(term));
  if (missing.length > 0) {
    throw new Error(`Public claim policy is missing terms: ${missing.join(", ")}`);
  }
}

function assertReleaseGates() {
  const text = readFileSync(path.join(root, "docs/RELEASE_GATES.md"), "utf8");
  const requiredTerms = ["lint", "typecheck", "test", "build", "visual:check", "links:check"];
  const missing = requiredTerms.filter((term) => !text.includes(term));
  if (missing.length > 0) {
    throw new Error(`Release gates are missing terms: ${missing.join(", ")}`);
  }
}

function assertBuiltPages() {
  const missing = pages
    .map((page) => path.join("dist", page.outputPath))
    .filter((file) => !existsSync(path.join(root, file)));
  if (missing.length > 0) {
    throw new Error(`Missing built pages. Run pnpm build first:\n${missing.join("\n")}`);
  }
}

function assertMetadata() {
  assertBuiltPages();
  const findings = [];
  for (const page of pages) {
    const html = readFileSync(path.join(root, "dist", page.outputPath), "utf8");
    if (!html.includes(`<title>${page.title}</title>`)) {
      findings.push(`${page.outputPath}: missing expected title`);
    }
    if (!html.includes(`name="description" content="${page.description}"`)) {
      findings.push(`${page.outputPath}: missing expected description`);
    }
    if (!html.includes(`rel="canonical" href="https://complyeaze.com${page.urlPath}"`)) {
      findings.push(`${page.outputPath}: missing expected canonical`);
    }
    if (!html.includes('property="og:title"')) {
      findings.push(`${page.outputPath}: missing Open Graph title`);
    }
  }
  if (!existsSync(path.join(root, "dist", "robots.txt"))) {
    findings.push("dist/robots.txt: missing");
  }
  if (!existsSync(path.join(root, "dist", "sitemap.xml"))) {
    findings.push("dist/sitemap.xml: missing");
  }
  if (findings.length > 0) {
    throw new Error(`Metadata findings:\n${findings.join("\n")}`);
  }
}

function assertLinks() {
  assertBuiltPages();
  const knownPaths = new Set(pages.map((page) => page.urlPath));
  const findings = [];
  for (const page of pages) {
    const html = readFileSync(path.join(root, "dist", page.outputPath), "utf8");
    const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
        continue;
      }
      if (href.startsWith("/assets/")) {
        if (!existsSync(path.join(root, "dist", href))) {
          findings.push(`${page.outputPath}: missing asset ${href}`);
        }
        continue;
      }
      if (!knownPaths.has(href)) {
        findings.push(`${page.outputPath}: unknown internal link ${href}`);
      }
    }
  }
  if (findings.length > 0) {
    throw new Error(`Link findings:\n${findings.join("\n")}`);
  }
}

function assertPublicPages() {
  assertBuiltPages();
  const findings = [];
  for (const page of pages) {
    const html = readFileSync(path.join(root, "dist", page.outputPath), "utf8");
    if (!html.includes("<main")) findings.push(`${page.outputPath}: missing main landmark`);
    if (!html.includes(page.heading)) findings.push(`${page.outputPath}: missing page heading`);
    if (/Prisma|Redis|BullMQ|portal automation/.test(html) && page.slug !== "index") {
      findings.push(`${page.outputPath}: private-app boundary terms outside overview page`);
    }
  }
  if (findings.length > 0) {
    throw new Error(`Public page findings:\n${findings.join("\n")}`);
  }
}

function assertScriptSyntax() {
  const scriptFiles = walk(root).filter((filePath) => filePath.endsWith(".mjs"));
  const findings = [];
  for (const filePath of scriptFiles) {
    try {
      execFileSync(process.execPath, ["--check", filePath], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
      });
    } catch (error) {
      findings.push(`${path.relative(root, filePath)}:\n${error.stderr ?? error.message}`);
    }
  }
  if (findings.length > 0) {
    throw new Error(`Script syntax findings:\n${findings.join("\n")}`);
  }
}

function run() {
  assertRequiredFiles();

  if (["--all", "--lint", "--test", "--public"].includes(mode)) {
    assertNoForbiddenContent();
  }
  if (["--all", "--typecheck"].includes(mode)) {
    assertScriptSyntax();
  }
  if (["--all", "--visual"].includes(mode)) {
    assertVisualPolicy();
  }
  if (["--all", "--public", "--metadata"].includes(mode)) {
    assertPublicClaimsPolicy();
  }
  if (["--all", "--build", "--links", "--metadata"].includes(mode)) {
    assertReleaseGates();
  }
  if (["--all", "--public"].includes(mode)) {
    assertPublicPages();
  }
  if (["--all", "--links"].includes(mode)) {
    assertLinks();
  }
  if (["--all", "--metadata"].includes(mode)) {
    assertMetadata();
  }

  console.log(`complyeaze-public ${mode.slice(2)} check passed`);
}

run();
