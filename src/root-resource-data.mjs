import rawManifest from "../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";

const manifest = definePublicRouteManifest(rawManifest);

// Keep the legacy renderer as the rollback baseline during migration, but adapt
// it from the same typed content manifest that feeds Astro. Renderer-specific
// structure may differ; route copy, metadata, actions, and proof must not.
export const rootResourcePages = manifest.routes.map((route) => ({
  ...route,
  type: "rootResource",
  outputPath: `${route.slug}/index.html`,
  primaryCta: route.primaryAction,
  secondaryCta: route.secondaryAction,
  highlights: route.sections.map((section) => ({
    title: section.title,
    body: section.body,
    ...(section.meta ? { route: section.meta } : {}),
  })),
}));
