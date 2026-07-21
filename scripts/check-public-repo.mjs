#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { assertAxalPages } from "./public-checks/axal-pages.mjs";
import {
  assertAstroBuildOutput,
  assertAstroBuildOutputFixtures,
  assertAstroWorkspace
} from "./public-checks/astro-workspace.mjs";
import {
  assertAstroCoreRouteBuild,
  assertAstroCoreRouteFixtures,
  assertAstroCoreRouteSources
} from "./public-checks/astro-core-routes.mjs";
import {
  assertCiArtifactPolicyFixtures,
  assertCiArtifacts
} from "./public-checks/ci-artifacts.mjs";
import { assertContributorIntake } from "./public-checks/contributor-intake.mjs";
import { assertCraftReviewBuild, assertCraftReviewSources } from "./public-checks/craft-review.mjs";
import { assertDependencyPolicy } from "./public-checks/dependency-policy.mjs";
import { assertWorkspaceDependencySurfaceFixtures } from "./public-checks/dependency-workspace.mjs";
import { assertDeployWorkflow } from "./public-checks/deploy-workflow.mjs";
import {
  assertGatewayPageSources,
  assertGatewayPages
} from "./public-checks/gateway-pages.mjs";
import { assertHostedRoutesPolicy } from "./public-checks/hosted-routes.mjs";
import { assertLegalGovernance } from "./public-checks/legal-governance.mjs";
import {
  assertLegacyCleanup,
  assertLegacyCleanupFixtures
} from "./public-checks/legacy-cleanup.mjs";
import { assertPackManifest } from "./public-checks/pack-manifest.mjs";
import {
  assertP4ComplyEazeBuild,
  assertP4ComplyEazeSources,
} from "./public-checks/p4-complyeaze.mjs";
import {
  assertP4StructuredDataBuild,
  assertP4StructuredDataSources,
} from "./public-checks/p4-structured-data.mjs";
import {
  assertMigrationLedger,
  assertMigrationLedgerFixtures,
  assertRenderedMigrationLedger
} from "./public-checks/migration-ledger.mjs";
import {
  assertPolicyPageSources,
  assertPolicyPages
} from "./public-checks/policy-pages.mjs";
import { requiredFiles } from "./public-checks/required-files.mjs";
import { assertRepositorySettings } from "./public-checks/repository-settings.mjs";
import { assertReleaseEvidenceSources } from "./public-checks/release-evidence.mjs";
import {
  assertReviewGateFixturePolicy,
  assertReviewGateFixtures
} from "./public-checks/review-gate-fixtures.mjs";
import { assertRouteCleanupGovernance } from "./public-checks/route-cleanup-governance.mjs";
import { assertCanonicalManifestClaimFixture } from "./public-checks/public-claims.mjs";
import {
  assertRootResourcePageSources,
  assertRootResourcePages
} from "./public-checks/root-resource-pages.mjs";
import { assertRouteManifest } from "./public-checks/route-manifest.mjs";
import {
  assertSanchikaAdoptionBuild,
  assertSanchikaAdoptionSources
} from "./public-checks/sanchika-adoption.mjs";
import {
  assertSensitiveContent,
  assertSensitiveContentFixturePolicy
} from "./public-checks/sensitive-content.mjs";
import { assertVisualGeometryFixtures } from "./public-checks/visual-geometry.mjs";
import { appDistPath, publicRouteRegistry } from "./public-route-registry.mjs";

const root = process.cwd();
const mode = process.argv.find((arg) => arg.startsWith("--")) ?? "--all";

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

function assertVisualPolicy() {
  const text = readFileSync(path.join(root, "docs/VISUAL_TESTING.md"), "utf8");
  const visualCheck = readFileSync(path.join(root, "scripts/visual-check.mjs"), "utf8");
  const requiredTerms = [
    "desktop",
    "tablet",
    "mobile",
    "first viewport",
    "keyboard focus",
    "reduced-motion",
    "horizontal overflow",
    "broken images",
    "blank sections",
    "overlapping",
    "clipped controls",
    "accessibility",
    "screenshots",
    "synthetic data"
  ];
  const missing = requiredTerms.filter((term) => !text.toLowerCase().includes(term));
  if (missing.length > 0) {
    throw new Error(`Visual policy is missing terms: ${missing.join(", ")}`);
  }
  const requiredExecutableTerms = [
    "reducedMotion",
    "prefers-reduced-motion",
    "focusTargets",
    "visible focus indicator",
    "broken images",
    "blank content blocks",
    "clipped controls",
    "overlapped first-viewport controls",
    "overlapped first-viewport content blocks",
    "active motion styles under reduced-motion",
    "assertVisualArtifacts",
    "visual screenshots",
    "expected one main landmark",
    "unnamed buttons",
    "assertVisualSummarySchema",
    "markdownCell",
    "writeIncompleteSummary",
    "Disposition",
    "Failures"
  ];
  const missingExecutableTerms = requiredExecutableTerms.filter((term) => !visualCheck.includes(term));
  if (missingExecutableTerms.length > 0) {
    throw new Error(`Visual check is missing executable coverage: ${missingExecutableTerms.join(", ")}`);
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
  const missing = publicRouteRegistry
    .map((page) => appDistPath(page))
    .filter((file) => !existsSync(path.join(root, file)));
  if (missing.length > 0) {
    throw new Error(`Missing built pages. Run pnpm build first:\n${missing.join("\n")}`);
  }
}

function assertMetadata() {
  assertBuiltPages();
  const findings = [];
  for (const page of publicRouteRegistry) {
    const html = readFileSync(path.join(root, appDistPath(page)), "utf8");
    if (!html.includes(`<title>${page.title}</title>`)) {
      findings.push(`${appDistPath(page)}: missing expected title`);
    }
    if (!html.includes(`name="description" content="${page.description}"`)) {
      findings.push(`${appDistPath(page)}: missing expected description`);
    }
    if (!html.includes(`rel="canonical" href="${page.origin}${page.urlPath}"`)) {
      findings.push(`${appDistPath(page)}: missing expected canonical`);
    }
    if (!html.includes('property="og:title"')) {
      findings.push(`${appDistPath(page)}: missing Open Graph title`);
    }
    if (!html.includes(`name="robots" content="${page.robots}"`)) {
      findings.push(`${appDistPath(page)}: missing expected robots posture`);
    }
  }
  if (!existsSync(path.join(root, "test-results/public-build/route-manifest.json"))) {
    findings.push("test-results/public-build/route-manifest.json: missing");
  }
  if (findings.length > 0) {
    throw new Error(`Metadata findings:\n${findings.join("\n")}`);
  }
}

function assertLinks() {
  assertBuiltPages();
  const findings = [];
  for (const page of publicRouteRegistry) {
    const knownPaths = new Set(
      publicRouteRegistry.filter((route) => route.app === page.app).map((route) => route.urlPath),
    );
    const html = readFileSync(path.join(root, appDistPath(page)), "utf8");
    const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
        continue;
      }
      if (href.startsWith("/_astro/") || href.startsWith("/fonts/") || href === "/favicon.svg") {
        if (!existsSync(path.join(root, `apps/${page.app}/dist`, href))) {
          findings.push(`${appDistPath(page)}: missing asset ${href}`);
        }
        continue;
      }
      if (!knownPaths.has(href)) {
        findings.push(`${appDistPath(page)}: unknown internal link ${href}`);
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
  const privateBoundaryCopyAllowed = new Set(["/privacy/", "/status/"]);
  for (const page of publicRouteRegistry) {
    const html = readFileSync(path.join(root, appDistPath(page)), "utf8");
    if (!html.includes("<main")) findings.push(`${appDistPath(page)}: missing main landmark`);
    if (!html.includes(page.heading)) findings.push(`${appDistPath(page)}: missing page heading`);
    if (
      /Prisma|Redis|BullMQ|portal automation/.test(html) &&
      !privateBoundaryCopyAllowed.has(page.urlPath)
    ) {
      findings.push(`${appDistPath(page)}: private-app implementation terms outside status boundary`);
    }
  }
  assertRenderedMigrationLedger(root, findings);
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

async function run() {
  assertRequiredFiles();

  if (["--all", "--lint", "--test", "--public"].includes(mode)) {
    assertSensitiveContent(root);
  }
  if (["--all", "--test"].includes(mode)) {
    assertAstroWorkspace(root);
    assertAstroCoreRouteSources(root);
    assertAstroCoreRouteFixtures();
    await assertMigrationLedgerFixtures(root);
    assertCanonicalManifestClaimFixture();
    assertGatewayPageSources(root);
    await assertPackManifest(root);
    assertAxalPages(root);
    assertPolicyPageSources(root);
    assertRootResourcePageSources();
    assertAstroBuildOutputFixtures();
    assertWorkspaceDependencySurfaceFixtures();
    assertSensitiveContentFixturePolicy();
    assertCiArtifactPolicyFixtures();
    assertReviewGateFixtures(root);
    await assertReleaseEvidenceSources(root);
    await assertSanchikaAdoptionSources(root);
    await assertCraftReviewSources(root);
    assertP4ComplyEazeSources(root);
    assertP4StructuredDataSources(root);
    assertVisualGeometryFixtures();
    assertLegacyCleanupFixtures();
    assertLegacyCleanup(root);
  }
  if (["--all", "--test", "--public"].includes(mode)) {
    assertReviewGateFixturePolicy(root);
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
    assertAstroBuildOutput(root);
    assertAstroCoreRouteBuild(root);
    assertPublicPages();
    assertMigrationLedger(root);
    assertGatewayPages(root);
    assertPolicyPages(root);
    assertRootResourcePages(root);
    assertAxalPages(root);
    assertCiArtifacts(root);
    assertContributorIntake(root);
    assertCraftReviewBuild(root);
    assertP4ComplyEazeBuild(root);
    assertDependencyPolicy(root);
    assertSanchikaAdoptionBuild(root);
    assertDeployWorkflow(root);
    assertHostedRoutesPolicy(root);
    assertLegalGovernance(root);
    assertRepositorySettings(root);
    assertRouteCleanupGovernance(root);
  }
  if (["--all", "--links"].includes(mode)) {
    assertLinks();
  }
  if (["--all", "--metadata"].includes(mode)) {
    assertMetadata();
    assertP4StructuredDataBuild(root);
    assertRouteManifest(root);
  }

  console.log(`complyeaze-public ${mode.slice(2)} check passed`);
}

await run();
