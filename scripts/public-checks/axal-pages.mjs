import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { axalDetails, axalPages } from "../../src/axal-data.mjs";
import { defineAxalRouteManifest } from "../../packages/public-content/src/axal-route-schema.ts";

const typedFiles = [
  "packages/public-content/src/axal-route-types.ts",
  "packages/public-content/src/axal-route-schema.ts",
  "packages/public-content/src/axal.routes.json",
  "apps/axal/src/components/AxalDetailPage.astro",
  "apps/axal/src/components/AxalHomePage.astro",
  "apps/axal/src/components/SyntheticWorkbench.astro",
  "apps/axal/src/layouts/AxalPageLayout.astro",
  "apps/axal/src/pages/[slug].astro",
  "docs/evidence/axal-public-route-claims.md",
];

const cleanRoutes = [
  "/",
  "/ca-practice-management-software/",
  "/gst-notice-management-software/",
  "/compliance-calendar-software-india/",
  "/gst-reconciliation-evidence-review/",
  "/client-document-collection-portal-access/",
];

export function assertAxalPages(root = process.cwd()) {
  const detailRoutes = axalPages.filter((page) => page.type === "axalDetail");
  const riskyPatterns = [
    { label: "government approval claim", pattern: /government approved|government approval/i },
    { label: "automatic filing claim", pattern: /automatic filing|file[s]? .* automatically/i },
    { label: "unsafe credential storage wording", pattern: /credential capture|store[s]? portal password/i },
    { label: "hard production capability wording", pattern: /\bAxal gives\b|\bCreate or sync\b/i }
  ];
  const findings = [];

  for (const filePath of typedFiles) {
    if (!existsSync(path.join(root, filePath))) findings.push(`${filePath}: missing`);
  }
  const manifestPath = path.join(root, "packages/public-content/src/axal.routes.json");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    defineAxalRouteManifest(manifest);
    const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
    if (manifest.app !== "axal") findings.push("Axal manifest app must be axal");
    if (manifest.origin !== "https://axal.complyeaze.com") {
      findings.push("Axal manifest must use the canonical Axal origin");
    }
    if (routes.length !== 6) findings.push(`expected 6 typed Axal routes, found ${routes.length}`);
    const paths = routes.map((route) => route.urlPath);
    for (const routePath of cleanRoutes) {
      if (!paths.includes(routePath)) findings.push(`missing typed Axal route ${routePath}`);
    }
    if (routes.filter((route) => route.kind === "axal-home").length !== 1) {
      findings.push("Axal manifest must contain exactly one axal-home route");
    }
    if (routes.filter((route) => route.kind === "axal-detail").length !== 5) {
      findings.push("Axal manifest must contain exactly five axal-detail routes");
    }
    const duplicateRelated = structuredClone(manifest);
    duplicateRelated.routes[1].relatedRoutes.push(duplicateRelated.routes[1].relatedRoutes[0]);
    assertRejectedManifest(duplicateRelated, "Axal manifest accepted a duplicate related route", findings);
    const internalSignup = structuredClone(manifest);
    internalSignup.routes[1].secondaryAction.href = "/signup/";
    assertRejectedManifest(internalSignup, "Axal manifest accepted an internal signup action", findings);
  }

  const legacySource = readFileSync(path.join(root, "src/axal-data.mjs"), "utf8");
  if (!legacySource.includes("defineAxalRouteManifest")) {
    findings.push("src/axal-data.mjs: legacy Axal pages must adapt the typed manifest");
  }
  if (legacySource.includes("const axalPrimaryDetails = [")) {
    findings.push("src/axal-data.mjs: duplicated primary Axal detail data remains");
  }
  const indexPath = path.join(root, "apps/axal/src/pages/index.astro");
  const indexSource = readFileSync(indexPath, "utf8");
  if (!indexSource.includes("defineAxalRouteManifest") || !indexSource.includes("AxalHomePage")) {
    findings.push("apps/axal/src/pages/index.astro: root must render the canonical Axal home route");
  }
  if (/workspace foundation|does not serve customer routes/i.test(indexSource)) {
    findings.push("apps/axal/src/pages/index.astro: obsolete foundation copy remains");
  }
  const visualSource = readFileSync(path.join(root, "scripts/visual-check.mjs"), "utf8");
  if (visualSource.includes("astro-axal-foundation")) {
    findings.push("scripts/visual-check.mjs: obsolete Axal foundation target remains");
  }
  if (!visualSource.includes("const expectedVisualTargetCount = 41")) {
    findings.push("scripts/visual-check.mjs: expected 41-page visual inventory is not enforced");
  }
  const contentPackage = JSON.parse(
    readFileSync(path.join(root, "packages/public-content/package.json"), "utf8"),
  );
  if (contentPackage.exports?.["./axal-routes"] !== "./src/axal.routes.json") {
    findings.push("packages/public-content/package.json: missing canonical Axal route export");
  }

  if (axalDetails.length !== 5) {
    findings.push(`expected 5 Axal detail data pages, found ${axalDetails.length}`);
  }
  if (detailRoutes.length !== 5) {
    findings.push(`expected 5 Axal detail routes, found ${detailRoutes.length}`);
  }
  if (axalPages.some((page) => page.type === "axalIndex" && page.slug === "index")) {
    findings.push("legacy Axal root needs a namespaced visual artifact slug");
  }
  for (const page of detailRoutes) {
    if (!page.urlPath.startsWith("/products/axal/")) {
      findings.push(`${page.slug}: unexpected Axal URL path ${page.urlPath}`);
    }
    if (!page.carefulBoundary) {
      findings.push(`${page.slug}: missing professional-review boundary`);
    }
  }
  for (const page of axalDetails) {
    const text = JSON.stringify(page);
    for (const { label, pattern } of riskyPatterns) {
      if (pattern.test(text)) findings.push(`${page.slug}: ${label}`);
    }
  }

  if (findings.length > 0) {
    throw new Error(`Axal page findings:\n${findings.join("\n")}`);
  }
}

function assertRejectedManifest(value, label, findings) {
  try {
    defineAxalRouteManifest(value);
    findings.push(label);
  } catch {
    // Expected invalid fixture.
  }
}
