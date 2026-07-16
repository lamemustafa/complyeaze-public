import type { CraftReviewRouteBase } from "./craft-review-types.ts";

export interface PackFoundationRoute {
  description: string;
  heading: string;
  kind: "pack-foundation";
  robots: "noindex, nofollow";
  signalTerms: string[];
  slug: "index";
  summary: string;
  title: string;
  urlPath: "/";
}

export interface PackRouteManifest {
  app: "pack";
  origin: "https://pack.complyeaze.com";
  routes: [PackFoundationRoute, PackCraftReviewRoute];
  schemaVersion: 1;
}

export interface PackCraftReviewRoute extends CraftReviewRouteBase {
  kind: "pack-craft-review";
}

export type PackRoute = PackCraftReviewRoute | PackFoundationRoute;
