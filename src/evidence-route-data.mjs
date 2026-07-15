import rawManifest from "../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";

const manifest = definePublicRouteManifest(rawManifest);

// Keep the legacy renderer as the rollback baseline during migration, but adapt
// it from the same typed route records that feed the Astro preview.
export const evidenceRoutePages = manifest.routes
  .filter((route) => route.kind === "evidence" || route.kind === "migration")
  .map((route) => ({
    ...route,
    type: route.kind,
    outputPath: `${route.slug}/index.html`,
  }));
