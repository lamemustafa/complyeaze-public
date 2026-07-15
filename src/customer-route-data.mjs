import rawManifest from "../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";

const manifest = definePublicRouteManifest(rawManifest);

// Keep the legacy renderer as the rollback baseline during P1, but source its
// customer-facing route copy and product facts from the same typed manifest as
// Astro. Preview-only robots metadata remains owned by the Astro boundary.
export const customerRoutePages = manifest.routes
  .filter((route) => route.kind === "home" || route.kind === "products")
  .map((route) => ({
    ...route,
    type: route.kind === "home" ? "customerHome" : "customerProducts",
    outputPath: route.kind === "home" ? "index.html" : `${route.slug}/index.html`,
    ...(route.kind === "home"
      ? {
          primaryCta: route.primaryAction,
          secondaryCta: route.secondaryAction,
        }
      : {}),
  }));

export const customerProductsPage = customerRoutePages.find(
  (route) => route.kind === "products",
);

if (!customerProductsPage) {
  throw new Error("Canonical products route is missing");
}
