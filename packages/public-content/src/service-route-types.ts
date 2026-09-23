import type { PublicAction, PublicRouteBase } from "./schema.ts";

/** A primary or official source for one printed fact. Always an HTTPS URL. */
export interface PublicServiceSource {
  href: string;
  label: string;
}

/** One sourced fact stated in money or date terms. */
export interface PublicServiceFact {
  body: string;
  figure: string;
  sources: PublicServiceSource[];
  title: string;
}

/** A small reference table printed on the hero slip; every row comes from `source`. */
export interface PublicServiceTable {
  caption: string;
  columns: string[];
  note: string;
  rows: string[][];
  source: PublicServiceSource;
  stamp?: string;
}

/** Arithmetic on invented inputs, labelled as such on the page. */
export interface PublicServiceExample {
  lines: string[];
  result: string;
  title: string;
}

export interface PublicServiceOffer {
  deliverables: string[];
  name: string;
  price: string;
}

export interface PublicServiceSample {
  body: string;
  href: string;
  label: string;
}

export interface PublicServiceContact {
  /** Optional scheduling link; the page renders it only when the owner supplies one. */
  bookingHref?: string;
  email: string;
  label: string;
  subject: string;
}

/** Section headings, written per page so each reads as a sentence, not a label. */
export interface PublicServiceHeadings {
  approach: string;
  contact: string;
  facts: string;
  offers: string;
  operator: string;
  proof: string;
}

export interface PublicServiceRoute extends PublicRouteBase {
  boundaries: string[];
  contact: PublicServiceContact;
  example?: PublicServiceExample;
  facts: PublicServiceFact[];
  /** One qualifying line printed directly under the facts heading. */
  factsNote?: string;
  /** A no-cost first look the owner sends before any engagement. */
  freeCheck?: { body: string; title: string };
  headings: PublicServiceHeadings;
  kind: "service";
  /** Plain-text notice under the page: trademarks, not-legal-advice. */
  notice?: string;
  offers: PublicServiceOffer[];
  operator: string[];
  proofTable: PublicServiceTable;
  related: PublicAction;
  sample: PublicServiceSample;
  terms: string;
}

export interface PublicServiceIndexEntry {
  audience: string;
  href: string;
  name: string;
  price: string;
  summary: string;
}

export interface PublicServicesRoute extends PublicRouteBase {
  contact: PublicServiceContact;
  kind: "services";
  operator: string[];
  services: PublicServiceIndexEntry[];
}
