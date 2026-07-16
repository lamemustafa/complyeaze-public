import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { appDistPath, publicRouteRegistry } from "../public-route-registry.mjs";

const requiredFiles = [
  "packages/public-content/src/craft-review-schema.ts",
  "packages/public-content/src/craft-review-types.ts",
  "apps/complyeaze/src/components/PublicCraftReviewPage.astro",
  "apps/axal/src/components/AxalCraftReviewPage.astro",
  "apps/axal/src/pages/review/craft.astro",
  "apps/pack/src/components/PackCraftReviewPage.astro",
  "apps/pack/src/pages/review/craft.astro",
];

const requiredCompositions = {
  complyeaze: ["PublicHero", "ProductRouteMap", "ProofStrip", "ReviewDeskPreview", "EvidencePanel", "HumanReviewCheckpoint"],
  axal: ["ReviewDeskPreview", "WorkQueueRow", "EvidencePanel", "HumanReviewCheckpoint", "AuditTrailPreview", "PricingBlock", "FAQAccordion"],
  pack: ["LocalArtifactFlow", "CustodyBoundary", "PermissionExplainer", "SourceProvenanceStrip", "ReleaseStatusBanner"],
};

export async function assertCraftReviewSources(root) {
  const findings = requiredFiles
    .filter((filePath) => !existsSync(path.join(root, filePath)))
    .map((filePath) => `${filePath}: missing`);
  if (publicRouteRegistry.length !== 25) {
    findings.push(`canonical registry must contain 25 routes, found ${publicRouteRegistry.length}`);
  }
  for (const app of Object.keys(requiredCompositions)) {
    const routes = publicRouteRegistry.filter((route) => route.app === app && route.urlPath === "/review/craft/");
    if (routes.length !== 1) {
      findings.push(`${app}: expected exactly one /review/craft/ route`);
      continue;
    }
    const [route] = routes;
    if (route.robots !== "noindex, nofollow" || route.discoverability !== "review-only") {
      findings.push(`${app}: craft route must be noindex and review-only`);
    }
  }
  if (findings.length > 0) throw new Error(`Craft review findings:\n${findings.join("\n")}`);

  const { defineCraftReviewEvidence } = await import("../../packages/public-content/src/craft-review-schema.ts");
  for (const app of Object.keys(requiredCompositions)) {
    const manifest = JSON.parse(readFileSync(path.join(root, `packages/public-content/src/${app}.routes.json`), "utf8"));
    const craft = manifest.routes.find((route) => route.urlPath === "/review/craft/");
    defineCraftReviewEvidence(craft.reviewEvidence, requiredCompositions[app]);
    const kindPrefix = app === "complyeaze" ? "public" : app;
    if (craft.kind !== `${kindPrefix}-craft-review`) throw new Error(`${app}: unexpected craft route kind ${craft.kind}`);
    const componentPath = path.join(root, `apps/${app}/src/components/${app === "complyeaze" ? "Public" : app === "axal" ? "Axal" : "Pack"}CraftReviewPage.astro`);
    const component = readFileSync(componentPath, "utf8");
    if (!component.includes("patternClassName")) throw new Error(`${app}: craft page must use the public Sanchika API`);
    for (const composition of requiredCompositions[app]) {
      if (!component.includes(`"${composition}"`)) throw new Error(`${app}: craft page is missing ${composition}`);
    }
  }

  const sitemap = readFileSync(path.join(root, "apps/complyeaze/src/pages/sitemap.xml.ts"), "utf8");
  if (!sitemap.includes('route.kind !== "public-craft-review"')) throw new Error("ComplyEaze sitemap must exclude craft review routes");
  for (const layoutPath of ["apps/complyeaze/src/layouts/PublicPageLayout.astro", "apps/axal/src/layouts/AxalPageLayout.astro"]) {
    if (readFileSync(path.join(root, layoutPath), "utf8").includes('/review/craft/')) throw new Error(`${layoutPath}: primary navigation exposes craft review`);
  }

  const fixture = {
    accessibility: ["axe", "keyboard", "reduced-motion", "forced-colors"],
    budgets: { authoredJavaScriptBytes: 0, criticalFonts: 2, cssGzipBytes: 61440, maxCls: 0.05 },
    compositions: ["PublicHero"], contentMode: "synthetic", interactionMode: "zero-js",
    reviewStatus: "C3 human craft approval pending", sanchikaRelease: "v0.1.0",
  };
  for (const mutate of [
    (value) => value.compositions.pop(),
    (value) => { value.contentMode = "live"; },
    (value) => { value.reviewStatus = "C3 approved"; },
    (value) => { value.budgets.authoredJavaScriptBytes = 1; },
  ]) {
    const invalid = structuredClone(fixture);
    mutate(invalid);
    assertRejected(() => defineCraftReviewEvidence(invalid, ["PublicHero"]));
  }
}

export function assertCraftReviewBuild(root) {
  const findings = [];
  for (const route of publicRouteRegistry.filter(({ discoverability }) => discoverability === "review-only")) {
    const html = readFileSync(path.join(root, appDistPath(route)), "utf8");
    for (const marker of ['data-craft-review="synthetic"', "C3 human craft approval pending", 'name="robots" content="noindex, nofollow"']) {
      if (!html.includes(marker)) findings.push(`${route.app}: built craft route is missing ${marker}`);
    }
    if (/<script(?:\s|>)/i.test(html)) findings.push(`${route.app}: built craft route contains authored client JavaScript`);
  }
  const sitemap = readFileSync(path.join(root, "apps/complyeaze/dist/sitemap.xml"), "utf8");
  if (sitemap.includes("/review/craft/")) findings.push("built sitemap exposes /review/craft/");
  if (findings.length > 0) throw new Error(`Craft review build findings:\n${findings.join("\n")}`);
}

function assertRejected(callback) {
  try { callback(); } catch { return; }
  throw new Error("Craft review schema accepted an invalid fixture");
}
