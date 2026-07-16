import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineAxalRouteManifest } from "../../packages/public-content/src/axal-route-schema.ts";

const requiredFiles = [
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

export function assertAxalPages(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);
  const manifest = defineAxalRouteManifest(
    JSON.parse(readFileSync(path.join(root, "packages/public-content/src/axal.routes.json"), "utf8")),
  );
  if (manifest.routes.length !== 7) findings.push(`expected 7 Axal routes, found ${manifest.routes.length}`);
  const index = readFileSync(path.join(root, "apps/axal/src/pages/index.astro"), "utf8");
  if (!index.includes("defineAxalRouteManifest") || !index.includes("AxalHomePage")) {
    findings.push("Axal root must render the canonical home route");
  }
  const contentPackage = JSON.parse(readFileSync(path.join(root, "packages/public-content/package.json"), "utf8"));
  if (contentPackage.exports?.["./axal-routes"] !== "./src/axal.routes.json") {
    findings.push("content package is missing the Axal manifest export");
  }
  for (const route of manifest.routes) {
    if (/government approved|automatic filing|store portal password/i.test(JSON.stringify(route))) {
      findings.push(`${route.slug}: unsafe public capability wording`);
    }
  }
  if (findings.length > 0) throw new Error(`Axal page findings:\n${findings.join("\n")}`);
}
