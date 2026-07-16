import complyeazeRaw from "../packages/public-content/src/complyeaze.routes.json" with { type: "json" };
import axalRaw from "../packages/public-content/src/axal.routes.json" with { type: "json" };
import packRaw from "../packages/public-content/src/pack.routes.json" with { type: "json" };
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";
import { defineAxalRouteManifest } from "../packages/public-content/src/axal-route-schema.ts";
import { definePackRouteManifest } from "../packages/public-content/src/pack-route-schema.ts";

const manifests = [
  definePublicRouteManifest(complyeazeRaw),
  defineAxalRouteManifest(axalRaw),
  definePackRouteManifest(packRaw),
];

export const publicRouteRegistry = manifests.flatMap((manifest) =>
  manifest.routes.map((route) => ({
    app: manifest.app,
    description: route.description,
    heading: route.heading,
    origin: manifest.origin,
    outputPath: routeOutputPath(route.urlPath),
    profile: route.kind === "pack-foundation" ? "foundation" : "site",
    robots: route.robots,
    signalTerms: route.signalTerms,
    slug: route.slug,
    title: route.title,
    urlPath: route.urlPath,
  })),
);

const ownership = publicRouteRegistry.map((route) => `${route.origin}${route.urlPath}`);
if (new Set(ownership).size !== ownership.length) {
  throw new Error("Canonical route manifests contain duplicate host/path ownership");
}

export function routeOutputPath(urlPath) {
  return urlPath === "/" ? "index.html" : `${urlPath.slice(1)}index.html`;
}

export function appDistPath(route) {
  return `apps/${route.app}/dist/${route.outputPath}`;
}
