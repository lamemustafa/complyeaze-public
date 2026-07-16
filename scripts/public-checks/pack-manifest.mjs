import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/public-content/src/pack-route-schema.ts",
  "packages/public-content/src/pack-route-types.ts",
  "packages/public-content/src/pack.routes.json",
];

export async function assertPackManifest(root) {
  const findings = [];
  for (const filePath of requiredFiles) {
    if (!existsSync(path.join(root, filePath))) findings.push(`${filePath}: missing`);
  }
  const pagePath = path.join(root, "apps/pack/src/pages/index.astro");
  const page = readFileSync(pagePath, "utf8");
  if (!page.includes("definePackRouteManifest")) {
    findings.push("apps/pack/src/pages/index.astro: root must validate the Pack manifest");
  }
  if (!page.includes("route.heading") || !page.includes("route.description")) {
    findings.push("apps/pack/src/pages/index.astro: root must render canonical Pack content");
  }
  if (findings.length > 0) {
    throw new Error(`Pack manifest findings:\n${findings.join("\n")}`);
  }

  const rawManifest = JSON.parse(
    readFileSync(path.join(root, "packages/public-content/src/pack.routes.json"), "utf8"),
  );
  const { definePackRouteManifest } = await import(
    "../../packages/public-content/src/pack-route-schema.ts"
  );
  definePackRouteManifest(rawManifest);
  const invalid = structuredClone(rawManifest);
  invalid.routes[0].robots = "index, follow";
  assertRejected(definePackRouteManifest, invalid, "Pack manifest accepted indexing");
  const extra = structuredClone(rawManifest);
  extra.routes.push({ ...extra.routes[0], slug: "other", urlPath: "/other/" });
  assertRejected(definePackRouteManifest, extra, "Pack manifest accepted an extra route");
  const alternatePath = structuredClone(rawManifest);
  alternatePath.routes[0].urlPath = "/install/";
  assertRejected(definePackRouteManifest, alternatePath, "Pack manifest accepted another path");
  const unsafeClaim = structuredClone(rawManifest);
  unsafeClaim.routes[0].summary = "Install now from the Chrome Web Store.";
  assertRejected(definePackRouteManifest, unsafeClaim, "Pack manifest accepted a readiness claim");
  const unsupportedField = structuredClone(rawManifest);
  unsupportedField.routes[0].installUrl = "https://example.com";
  assertRejected(definePackRouteManifest, unsupportedField, "Pack manifest accepted an unsafe field");
}

function assertRejected(validator, value, message) {
  try {
    validator(value);
  } catch {
    return;
  }
  throw new Error(message);
}
