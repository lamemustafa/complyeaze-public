import rawManifest from "../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";

const manifest = definePublicRouteManifest(rawManifest);

// Keep the legacy renderer as the rollback baseline during migration, but adapt
// it from the same typed content manifest that feeds Astro. Policy copy and the
// evidence summary must remain canonical rather than drifting between outputs.
export const policyPages = manifest.routes
  .filter((route) => route.kind === "policy")
  .map((route) => ({
    ...route,
    type: "policy",
    outputPath: `${route.slug}/index.html`,
  }));
