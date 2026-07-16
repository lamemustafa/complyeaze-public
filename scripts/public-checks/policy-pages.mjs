import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import rawManifest from "../../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";

const requiredPolicyPaths = ["/privacy/", "/terms/", "/status/", "/changelog/", "/release-evidence/"];

export function assertPolicyPageSources(root) {
  const component = path.join(root, "apps/complyeaze/src/components/PublicPolicyPage.astro");
  if (!existsSync(component)) throw new Error("PublicPolicyPage.astro is missing");
  if (!readFileSync(component, "utf8").includes("route.policySummary")) {
    throw new Error("PublicPolicyPage.astro must render canonical policy summary");
  }
}

export function assertPolicyPages() {
  const routes = definePublicRouteManifest(rawManifest).routes;
  for (const routePath of requiredPolicyPaths) {
    const route = routes.find((entry) => entry.urlPath === routePath);
    if (!route || route.kind !== "policy") throw new Error(`missing policy route ${routePath}`);
  }
}
