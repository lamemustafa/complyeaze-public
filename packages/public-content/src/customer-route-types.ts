import type { PublicAction, PublicRouteBase } from "./schema.ts";

export interface PublicProduct {
  boundary: string;
  evidence: PublicAction;
  href: string;
  job: string;
  name: string;
  proof: string;
  role: string;
  status: string;
}

export interface PublicHomeRoute extends PublicRouteBase {
  kind: "home";
  primaryAction: PublicAction;
  secondaryAction: PublicAction;
}

export interface PublicProductsRoute extends PublicRouteBase {
  kind: "products";
  products: PublicProduct[];
}
