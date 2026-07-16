import rawManifest from "../packages/public-content/src/complyeaze.routes.json" with {
  type: "json",
};
import { definePublicRouteManifest } from "../packages/public-content/src/schema.ts";

const manifest = definePublicRouteManifest(rawManifest);

export const gatewayPages = manifest.routes
  .filter((route) => route.kind === "gateway")
  .map((route) => ({
    ...route,
    outputPath: `${route.slug}/index.html`,
    slug: `${route.product.toLowerCase()}-gateway`,
    type: "productGateway",
  }));
