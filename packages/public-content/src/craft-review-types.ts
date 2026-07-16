export interface CraftReviewBudgets {
  authoredJavaScriptBytes: 0;
  criticalFonts: 2;
  cssGzipBytes: 61440;
  maxCls: 0.05;
}

export interface CraftReviewEvidence {
  accessibility: ["axe", "keyboard", "reduced-motion", "forced-colors"];
  budgets: CraftReviewBudgets;
  compositions: string[];
  contentMode: "synthetic";
  interactionMode: "zero-js";
  measurements: {
    authoredJavaScriptBytes: 0;
    cls: { desktop: number; mobile: number; tablet: number };
    criticalFonts: number;
    cssGzipBytes: number;
    maxCls: number;
    viewports: ["desktop", "tablet", "mobile"];
  };
  reviewStatus: "C3 human craft approval pending";
  sanchikaRelease: "v0.1.1";
}

export interface CraftReviewRouteBase {
  description: string;
  discoverability: "review-only";
  heading: string;
  reviewEvidence: CraftReviewEvidence;
  robots: "noindex, nofollow";
  signalTerms: string[];
  slug: "review/craft";
  summary: string;
  title: string;
  urlPath: "/review/craft/";
}
