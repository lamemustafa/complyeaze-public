import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import rawManifest from "../../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";

const expected = ["/products/pack/", "/products/tools/"];
const forbidden = /migration ledger|route cleanup|cleanup blocked|review gate|deployment methodology/i;

export function assertGatewayPageSources(root) {
  const component = path.join(root, "apps/complyeaze/src/components/PublicGatewayPage.astro");
  if (!existsSync(component)) throw new Error("PublicGatewayPage.astro is missing");
  const source = readFileSync(component, "utf8");
  for (const field of ["route.primaryAction", "route.secondaryAction", "route.evidenceLinks"]) {
    if (!source.includes(field)) throw new Error(`PublicGatewayPage.astro is missing ${field}`);
  }
}

export function assertGatewayPages() {
  const routes = definePublicRouteManifest(rawManifest).routes.filter((route) => route.kind === "gateway");
  if (routes.length !== 2) throw new Error(`expected 2 gateway routes, found ${routes.length}`);
  for (const routePath of expected) {
    const route = routes.find((entry) => entry.urlPath === routePath);
    if (!route) throw new Error(`missing gateway route ${routePath}`);
    if (forbidden.test(JSON.stringify(route))) throw new Error(`${routePath}: exposes internal methodology`);
  }
}
