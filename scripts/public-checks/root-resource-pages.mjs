import rawManifest from "../../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../../packages/public-content/src/schema.ts";

const expected = ["/about/", "/contact/", "/trust/", "/docs/"];

export function assertRootResourcePageSources() {
  const routes = definePublicRouteManifest(rawManifest).routes;
  for (const routePath of expected) {
    if (!routes.some((route) => route.urlPath === routePath)) throw new Error(`missing ${routePath}`);
  }
}

export function assertRootResourcePages() {
  assertRootResourcePageSources();
}
