import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";
import { canonicalUrl } from "../../packages/public-shell/src/metadata.ts";
import { createReleaseEvidenceFromBuild } from "../release-evidence.mjs";
import { publicRouteRegistry } from "../public-route-registry.mjs";

const requiredFiles = [
  "packages/public-content/src/complyeaze.routes.json",
  "packages/public-content/src/schema.ts",
  "packages/public-shell/src/metadata.ts",
  "apps/complyeaze/src/components/PublicEvidencePage.astro",
  "apps/complyeaze/src/components/PublicGatewayPage.astro",
  "apps/complyeaze/src/components/PublicHomePage.astro",
  "apps/complyeaze/src/components/PublicMigrationLedger.astro",
  "apps/complyeaze/src/components/PublicMigrationPage.astro",
  "apps/complyeaze/src/components/PublicPolicyPage.astro",
  "apps/complyeaze/src/components/PublicProductsPage.astro",
  "apps/complyeaze/src/components/PublicResourcePage.astro",
  "apps/complyeaze/src/layouts/PublicPageLayout.astro",
  "apps/complyeaze/src/pages/[...slug].astro",
  "apps/complyeaze/src/pages/index.astro",
];

const requiredRoutes = [
  "/", "/products/", "/products/pack/", "/products/tools/", "/trust/", "/docs/",
  "/migration/", "/about/", "/contact/", "/privacy/", "/terms/", "/status/",
  "/changelog/", "/release-evidence/",
];

export function assertAstroCoreRouteSources(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);
  const routes = publicRouteRegistry.filter((route) => route.app === "complyeaze");
  if (routes.length !== 14) findings.push(`expected 14 ComplyEaze routes, found ${routes.length}`);
  for (const routePath of requiredRoutes) {
    if (!routes.some((route) => route.urlPath === routePath)) findings.push(`missing ${routePath}`);
  }
  if (findings.length === 0) {
    const index = readFileSync(path.join(root, "apps/complyeaze/src/pages/index.astro"), "utf8");
    const catchAll = readFileSync(path.join(root, "apps/complyeaze/src/pages/[...slug].astro"), "utf8");
    const layout = readFileSync(path.join(root, "apps/complyeaze/src/layouts/PublicPageLayout.astro"), "utf8");
    if (!index.includes("definePublicRouteManifest") || !index.includes("PublicHomePage")) {
      findings.push("ComplyEaze root must render the canonical home route");
    }
    for (const kind of ["resource", "policy", "evidence", "gateway", "products", "migration"]) {
      if (!catchAll.includes(`route.kind === "${kind}"`)) findings.push(`catch-all missing ${kind} branch`);
    }
    if (!catchAll.includes("assertNever(route)")) findings.push("catch-all rendering is not exhaustive");
    if (!layout.includes('aria-label="Primary navigation"')) findings.push("customer navigation missing");
    if (/href="\/(?:migration|status|docs)\/"/.test(layout)) findings.push("customer nav exposes methodology");
  }
  if (findings.length > 0) throw new Error(`Astro core-route source findings:\n${findings.join("\n")}`);
}

export function assertAstroCoreRouteFixtures() {
  if (canonicalUrl("https://complyeaze.com", "/products/") !== "https://complyeaze.com/products/") {
    throw new Error("canonical helper did not preserve the clean route");
  }
  const fixture = {
    app: "fixture",
    origin: "https://fixture.example",
    routes: [{
      description: "Fixture description", eyebrow: "Fixture", heading: "Fixture heading",
      kind: "resource", primaryAction: { href: "/", label: "Home" },
      proof: ["Evidence"], robots: "noindex, nofollow",
      sections: [{ body: "Fixture body", title: "Fixture" }],
      secondaryAction: { href: "https://example.com", label: "Evidence" },
      signalTerms: ["fixture"], slug: "fixture", summary: "Fixture summary",
      title: "Fixture title", urlPath: "/fixture/",
    }],
    schemaVersion: 1,
  };
  definePublicRouteManifest(fixture);
  const invalid = structuredClone(fixture);
  invalid.routes[0].robots = "index, follow";
  let rejected = false;
  try { definePublicRouteManifest(invalid); } catch { rejected = true; }
  if (!rejected) throw new Error("public route fixture accepted indexing before cutover");
}

export function assertAstroCoreRouteBuild(root) {
  const evidence = createReleaseEvidenceFromBuild(root, publicRouteRegistry);
  if (evidence.pageCount !== 21) throw new Error(`expected 21 Astro outputs, found ${evidence.pageCount}`);
}
