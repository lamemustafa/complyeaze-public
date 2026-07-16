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
  routes: [PackFoundationRoute];
  schemaVersion: 1;
}
