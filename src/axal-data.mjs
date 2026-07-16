import rawManifest from "../packages/public-content/src/axal.routes.json" with { type: "json" };
import { defineAxalRouteManifest } from "../packages/public-content/src/axal-route-schema.ts";

const manifest = defineAxalRouteManifest(rawManifest);
const axalBasePath = "/products/axal/";

function legacyPath(route) {
  return route.urlPath === "/" ? axalBasePath : `${axalBasePath}${route.slug}/`;
}

function adaptDetail(route) {
  return {
    ...route,
    carefulBoundary: route.boundary,
    faqs: route.faqs,
    h1: route.heading,
    primaryAction: route.primaryAction.label,
    sections: route.sections.map((section) => ({
      body: section.body,
      heading: section.title,
      points: section.points,
    })),
  };
}

export const axalDetails = manifest.routes
  .filter((route) => route.kind === "axal-detail")
  .map(adaptDetail);

export const axalPages = manifest.routes.map((route) => ({
  ...(route.kind === "axal-detail" ? adaptDetail(route) : route),
  slug: route.kind === "axal-home" ? "axal-index" : route.slug,
  outputPath:
    route.urlPath === "/"
      ? "products/axal/index.html"
      : `products/axal/${route.slug}/index.html`,
  urlPath: legacyPath(route),
  type: route.kind === "axal-home" ? "axalIndex" : "axalDetail",
}));

export { manifest as axalManifest };
