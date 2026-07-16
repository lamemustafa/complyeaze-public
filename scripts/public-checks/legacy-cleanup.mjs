import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const forbiddenFiles = [
  "scripts/build-site.mjs",
  "src/axal-data.mjs",
  "src/axal-more-data.mjs",
  "src/axal.css",
  "src/customer-route-data.mjs",
  "src/evidence-route-data.mjs",
  "src/gateway-data.mjs",
  "src/gateway.css",
  "src/migration-data.mjs",
  "src/migration.css",
  "src/policy-data.mjs",
  "src/policy.css",
  "src/product-data.mjs",
  "src/products.css",
  "src/render-axal.mjs",
  "src/render-evidence.mjs",
  "src/render-gateway.mjs",
  "src/render-migration.mjs",
  "src/render-policy.mjs",
  "src/render-root-resource.mjs",
  "src/render-site.mjs",
  "src/root-resource-data.mjs",
  "src/root-resource.css",
  "src/site-data.mjs",
  "src/styles.css",
];

const activeFiles = [
  "package.json",
  "README.md",
  ".github/CODEOWNERS",
  ".github/ISSUE_TEMPLATE/route_cleanup.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/workflows/ci.yml",
  ".github/workflows/pages-deploy.yml",
  "docs/HOSTING_CUTOVER.md",
  "docs/MIGRATION.md",
  "docs/RELEASE_GATES.md",
  "docs/REPOSITORY_SETTINGS.md",
  "docs/ROUTE_MIGRATION_LEDGER.md",
  "docs/VISUAL_TESTING.md",
  "packages/public-content/README.md",
  "packages/public-content/src/complyeaze.routes.json",
  "scripts/check-public-repo.mjs",
  "scripts/check-hosted-routes.mjs",
  "scripts/visual-check.mjs",
  "scripts/public-checks/required-files.mjs",
];

export function assertLegacyCleanup(root) {
  const findings = [];
  for (const filePath of forbiddenFiles) {
    if (existsSync(path.join(root, filePath))) findings.push(`${filePath}: obsolete legacy file remains`);
  }
  for (const filePath of activeFiles) {
    const absolutePath = path.join(root, filePath);
    if (!existsSync(absolutePath)) continue;
    const text = readFileSync(absolutePath, "utf8");
    for (const pattern of [
      ["legacy build script", /build:legacy|scripts\/build-site\.mjs/],
      ["legacy source path", /(?:^|["'`])src\/(?:render-|site-data|.*-data|.*\.css)/m],
      ["root dist route manifest", /dist\/route-manifest\.json/],
      ["stale legacy-renderer claim", /legacy (?:build|dist|renderer|rollback)/i],
    ]) {
      if (pattern[1].test(text)) findings.push(`${filePath}: contains ${pattern[0]}`);
    }
  }
  const visual = readFileSync(path.join(root, "scripts/visual-check.mjs"), "utf8");
  if (!visual.includes("const expectedVisualTargetCount = 22")) {
    findings.push("scripts/visual-check.mjs: expected 22-page manifest-only inventory is missing");
  }
  if (visual.includes('serverKey: "legacy"') || visual.includes("...pages.map")) {
    findings.push("scripts/visual-check.mjs: legacy visual discovery remains");
  }
  if (findings.length > 0) throw new Error(`Legacy-cleanup findings:\n${findings.join("\n")}`);
}
