import type { PublicAction, PublicEvidenceLink, PublicSection } from "./schema.ts";

export interface AxalWorkflowSection extends PublicSection {
  points: string[];
}

export interface AxalFaq {
  answer: string;
  question: string;
}

export interface AxalRelatedRoute {
  href: string;
  label: string;
}

export interface AxalRouteBase {
  audience: string;
  boundary: string;
  description: string;
  evidenceLinks: PublicEvidenceLink[];
  eyebrow: string;
  heading: string;
  navLabel: string;
  primaryAction: PublicAction;
  relatedRoutes: AxalRelatedRoute[];
  robots: "noindex, nofollow";
  secondaryAction: PublicAction;
  signalTerms: string[];
  slug: string;
  summary: string;
  title: string;
  urlPath: string;
}

export interface AxalHomeRoute extends AxalRouteBase {
  kind: "axal-home";
  proof: string[];
  routeDirectory: AxalRelatedRoute[];
  sections: AxalWorkflowSection[];
  workbenchStates: string[];
}

export interface AxalDetailRoute extends AxalRouteBase {
  faqs: AxalFaq[];
  kind: "axal-detail";
  sections: AxalWorkflowSection[];
}

export type AxalRoute = AxalDetailRoute | AxalHomeRoute;

export interface AxalRouteManifest {
  app: "axal";
  origin: "https://axal.complyeaze.com";
  routes: AxalRoute[];
  schemaVersion: 1;
}
