import type {
  PublicHomeRoute,
  PublicProduct,
  PublicProductsRoute,
} from "./customer-route-types.ts";
import type { PublicGatewayRoute } from "./gateway-route-types.ts";
import type { PublicServiceRoute, PublicServicesRoute } from "./service-route-types.ts";
import { defineCraftReviewEvidence } from "./craft-review-schema.ts";
import type { CraftReviewEvidence } from "./craft-review-types.ts";
export { defineCraftReviewEvidence } from "./craft-review-schema.ts";
export type { CraftReviewEvidence, CraftReviewRouteBase } from "./craft-review-types.ts";
export { defineSanchikaAdoptionManifest } from "./sanchika-adoption-schema.ts";
export type { SanchikaAdoptionManifest } from "./sanchika-adoption-types.ts";
export { defineAxalRouteManifest } from "./axal-route-schema.ts";
export type {
  AxalDetailRoute,
  AxalHomeRoute,
  AxalRoute,
  AxalRouteManifest,
} from "./axal-route-types.ts";

export type {
  PublicHomeRoute,
  PublicProduct,
  PublicProductsRoute,
} from "./customer-route-types.ts";
export type { PublicGatewayRoute } from "./gateway-route-types.ts";
export type {
  PublicServiceContact,
  PublicServiceRoute,
  PublicServicesRoute,
} from "./service-route-types.ts";

export interface PublicAction {
  href: string;
  label: string;
}

export interface PublicSection {
  body: string;
  meta?: string;
  title: string;
}

export interface PublicEvidenceLink {
  description: string;
  href: string;
  label: string;
}

export interface PublicMigrationStep {
  body: string;
  label: string;
}

export interface PublicRouteBase {
  description: string;
  eyebrow: string;
  heading: string;
  kind: "adoption" | "evidence" | "gateway" | "home" | "migration" | "policy" | "products" | "public-craft-review" | "resource" | "service" | "services";
  /** Words this route must never print; checked against every other field of the route. */
  forbiddenTerms?: string[];
  robots: "noindex, nofollow";
  sections: PublicSection[];
  signalTerms: string[];
  slug: string;
  summary: string;
  title: string;
  urlPath: string;
}

export interface PublicAdoptionRoute extends PublicRouteBase {
  kind: "adoption";
}

export interface PublicCraftReviewRoute extends PublicRouteBase {
  discoverability: "review-only";
  kind: "public-craft-review";
  reviewEvidence: CraftReviewEvidence;
  slug: "review/craft";
  urlPath: "/review/craft/";
}

export interface PublicResourceRoute extends PublicRouteBase {
  kind: "resource";
  primaryAction: PublicAction;
  proof: string[];
  secondaryAction: PublicAction;
}

export interface PublicPolicyRoute extends PublicRouteBase {
  kind: "policy";
  policySummary: {
    evidence: string;
    excluded: string;
    scope: string;
  };
}

export interface PublicEvidenceRoute extends PublicRouteBase {
  evidenceLinks: PublicEvidenceLink[];
  kind: "evidence";
}

export interface PublicMigrationRoute extends PublicRouteBase {
  kind: "migration";
  steps: PublicMigrationStep[];
}

export type PublicRoute =
  | PublicAdoptionRoute
  | PublicEvidenceRoute
  | PublicGatewayRoute
  | PublicHomeRoute
  | PublicMigrationRoute
  | PublicPolicyRoute
  | PublicCraftReviewRoute
  | PublicProductsRoute
  | PublicResourceRoute
  | PublicServiceRoute
  | PublicServicesRoute;

export interface PublicRouteManifest {
  app: string;
  origin: string;
  routes: PublicRoute[];
  schemaVersion: 1;
}

export function definePublicRouteManifest(value: unknown): PublicRouteManifest {
  assertRecord(value, "route manifest");
  assert(value.schemaVersion === 1, "route manifest schemaVersion must be 1");
  assertString(value.app, "route manifest app");
  assertHttpsOrigin(value.origin, "route manifest origin");
  assert(Array.isArray(value.routes) && value.routes.length > 0, "route manifest needs routes");

  const paths = new Set<string>();
  for (const [index, route] of value.routes.entries()) {
    validateRoute(route, `routes[${index}]`);
    assert(!paths.has(route.urlPath), `duplicate route path ${route.urlPath}`);
    paths.add(route.urlPath);
  }
  return value as unknown as PublicRouteManifest;
}

function validateRoute(value: unknown, label: string): asserts value is PublicRoute {
  assertRecord(value, label);
  for (const field of ["title", "description", "eyebrow", "heading", "summary"] as const) {
    assertString(value[field], `${label}.${field}`);
  }
  const { slug, urlPath } = value;
  assertString(slug, `${label}.slug`);
  assertString(urlPath, `${label}.urlPath`);
  if (urlPath === "/") {
    assert(slug === "index", `${label}.slug must be index for the root route`);
    assert(value.kind === "home", `${label}.kind must be home for the root route`);
  } else {
    assert(
      /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/.test(urlPath),
      `${label}.urlPath must be a clean trailing-slash route`,
    );
    assert(slug === urlPath.slice(1, -1), `${label}.slug must match urlPath`);
  }
  assert(value.robots === "noindex, nofollow", `${label}.robots must stay noindex before cutover`);
  assert(Array.isArray(value.sections) && value.sections.length > 0, `${label}.sections must not be empty`);
  value.sections.forEach((section, index) => validateSection(section, `${label}.sections[${index}]`));
  assertStringArray(value.signalTerms, `${label}.signalTerms`);
  if (value.forbiddenTerms !== undefined) validateForbiddenTerms(value, label);
  if (value.kind === "service" || value.kind === "services") {
    for (const field of [
      "evidenceLinks",
      "policySummary",
      "primaryAction",
      "product",
      "products",
      "proof",
      "secondaryAction",
      "steps",
    ] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for ${value.kind} routes`);
    }
    assert(
      value.kind === "services" ? urlPath === "/services/" : /^\/services\/[a-z0-9-]+\/$/.test(urlPath),
      `${label}.urlPath must be /services/ for the index or one level below it for a service`,
    );
    validateServiceContact(value.contact, `${label}.contact`);
    assertStringArray(value.operator, `${label}.operator`);
    if (value.kind === "services") {
      assert(Array.isArray(value.services) && value.services.length > 0, `${label}.services must not be empty`);
      value.services.forEach((entry, index) => {
        const entryLabel = `${label}.services[${index}]`;
        assertRecord(entry, entryLabel);
        for (const field of ["audience", "name", "price", "summary"] as const) {
          assertString(entry[field], `${entryLabel}.${field}`);
        }
        assertInternalHref(entry.href, `${entryLabel}.href`);
      });
      return;
    }
    validateServiceRoute(value, label);
    return;
  }
  if (value.kind === "home") {
    for (const field of ["evidenceLinks", "policySummary", "product", "products", "proof", "steps"] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for home routes`);
    }
    assert(value.urlPath === "/", `${label}.urlPath must be / for home routes`);
    validateAction(value.primaryAction, `${label}.primaryAction`);
    validateAction(value.secondaryAction, `${label}.secondaryAction`);
    return;
  }
  if (value.kind === "products") {
    for (const field of [
      "evidenceLinks",
      "policySummary",
      "primaryAction",
      "product",
      "proof",
      "secondaryAction",
      "steps",
    ] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for products routes`);
    }
    assert(
      Array.isArray(value.products) && value.products.length > 0,
      `${label}.products must not be empty`,
    );
    value.products.forEach((product, index) =>
      validateProduct(product, `${label}.products[${index}]`),
    );
    const productNames = value.products.map((product) => product.name);
    assert(
      new Set(productNames).size === productNames.length,
      `${label}.products names must be unique`,
    );
    const productHrefs = value.products.map((product) => product.href);
    assert(
      new Set(productHrefs).size === productHrefs.length,
      `${label}.products href values must be unique`,
    );
    return;
  }
  if (value.kind === "gateway") {
    for (const field of ["policySummary", "products", "proof", "steps"] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for gateway routes`);
    }
    assertString(value.product, `${label}.product`);
    validateAction(value.primaryAction, `${label}.primaryAction`);
    assertHttpsHref(value.primaryAction.href, `${label}.primaryAction.href`);
    validateAction(value.secondaryAction, `${label}.secondaryAction`);
    assertInternalHref(value.secondaryAction.href, `${label}.secondaryAction.href`);
    assert(
      Array.isArray(value.evidenceLinks) && value.evidenceLinks.length > 0,
      `${label}.evidenceLinks must not be empty`,
    );
    value.evidenceLinks.forEach((link, index) => {
      validateEvidenceLink(link, `${label}.evidenceLinks[${index}]`);
      assertHttpsHref(link.href, `${label}.evidenceLinks[${index}].href`);
    });
    const evidenceHrefs = value.evidenceLinks.map((link) => link.href);
    assert(
      new Set(evidenceHrefs).size === evidenceHrefs.length,
      `${label}.evidenceLinks href values must be unique`,
    );
    return;
  }
  if (value.kind === "resource") {
    for (const field of ["evidenceLinks", "policySummary", "product", "products", "steps"] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for resource routes`);
    }
    validateAction(value.primaryAction, `${label}.primaryAction`);
    validateAction(value.secondaryAction, `${label}.secondaryAction`);
    assertStringArray(value.proof, `${label}.proof`);
    return;
  }
  if (value.kind === "evidence") {
    for (const field of [
      "policySummary",
      "primaryAction",
      "product",
      "products",
      "proof",
      "secondaryAction",
      "steps",
    ] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for evidence routes`);
    }
    assert(
      Array.isArray(value.evidenceLinks) && value.evidenceLinks.length > 0,
      `${label}.evidenceLinks must not be empty`,
    );
    value.evidenceLinks.forEach((link, index) =>
      validateEvidenceLink(link, `${label}.evidenceLinks[${index}]`),
    );
    const evidenceHrefs = value.evidenceLinks.map((link) => link.href);
    assert(
      new Set(evidenceHrefs).size === evidenceHrefs.length,
      `${label}.evidenceLinks href values must be unique`,
    );
    return;
  }
  if (value.kind === "migration") {
    for (const field of [
      "evidenceLinks",
      "policySummary",
      "primaryAction",
      "product",
      "products",
      "proof",
      "secondaryAction",
    ] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for migration routes`);
    }
    assert(
      Array.isArray(value.steps) && value.steps.length > 0,
      `${label}.steps must not be empty`,
    );
    value.steps.forEach((step, index) => validateMigrationStep(step, `${label}.steps[${index}]`));
    const stepLabels = value.steps.map((step) => step.label);
    assert(
      new Set(stepLabels).size === stepLabels.length,
      `${label}.steps labels must be unique`,
    );
    return;
  }
  if (value.kind === "adoption") {
    for (const field of [
      "evidenceLinks",
      "policySummary",
      "primaryAction",
      "product",
      "products",
      "proof",
      "secondaryAction",
      "steps",
    ] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for adoption routes`);
    }
    return;
  }
  if (value.kind === "public-craft-review") {
    assert(value.slug === "review/craft", `${label}.slug must be review/craft`);
    assert(value.urlPath === "/review/craft/", `${label}.urlPath must be /review/craft/`);
    assert(value.discoverability === "review-only", `${label}.discoverability must be review-only`);
    defineCraftReviewEvidence(value.reviewEvidence, [
      "PublicHero", "ProductRouteMap", "ProofStrip", "ReviewDeskPreview", "EvidencePanel", "HumanReviewCheckpoint",
    ]);
    return;
  }
  assert(
    value.kind === "policy",
    `${label}.kind must be adoption, evidence, gateway, home, migration, policy, products, public-craft-review, resource, service, or services`,
  );
  for (const field of [
    "evidenceLinks",
    "primaryAction",
    "product",
    "products",
    "proof",
    "secondaryAction",
    "steps",
  ] as const) {
    assert(value[field] === undefined, `${label}.${field} is not valid for policy routes`);
  }
  validatePolicySummary(value.policySummary, `${label}.policySummary`);
}

function validateServiceRoute(value: Record<string, unknown>, label: string): void {
  assertRecord(value.headings, `${label}.headings`);
  for (const field of ["approach", "contact", "facts", "offers", "operator", "proof"] as const) {
    assertString(value.headings[field], `${label}.headings.${field}`);
  }
  assert(Array.isArray(value.facts) && value.facts.length > 0, `${label}.facts must not be empty`);
  value.facts.forEach((fact, index) => {
    const factLabel = `${label}.facts[${index}]`;
    assertRecord(fact, factLabel);
    for (const field of ["body", "figure", "title"] as const) assertString(fact[field], `${factLabel}.${field}`);
    assert(Array.isArray(fact.sources) && fact.sources.length > 0, `${factLabel}.sources must not be empty`);
    fact.sources.forEach((source, sourceIndex) => validateServiceSource(source, `${factLabel}.sources[${sourceIndex}]`));
  });

  const table = value.proofTable;
  assertRecord(table, `${label}.proofTable`);
  assertString(table.caption, `${label}.proofTable.caption`);
  assertString(table.note, `${label}.proofTable.note`);
  const { columns } = table;
  assertStringArray(columns, `${label}.proofTable.columns`);
  assert(Array.isArray(table.rows) && table.rows.length > 0, `${label}.proofTable.rows must not be empty`);
  table.rows.forEach((row, index) => {
    assertStringArray(row, `${label}.proofTable.rows[${index}]`);
    assert(row.length === columns.length, `${label}.proofTable.rows[${index}] must match the column count`);
  });
  validateServiceSource(table.source, `${label}.proofTable.source`);
  if (table.stamp !== undefined) assertString(table.stamp, `${label}.proofTable.stamp`);

  if (value.example !== undefined) {
    assertRecord(value.example, `${label}.example`);
    assertString(value.example.title, `${label}.example.title`);
    assertString(value.example.result, `${label}.example.result`);
    assertStringArray(value.example.lines, `${label}.example.lines`);
  }
  if (value.freeCheck !== undefined) {
    assertRecord(value.freeCheck, `${label}.freeCheck`);
    assertString(value.freeCheck.title, `${label}.freeCheck.title`);
    assertString(value.freeCheck.body, `${label}.freeCheck.body`);
  }
  if (value.notice !== undefined) assertString(value.notice, `${label}.notice`);
  if (value.factsNote !== undefined) assertString(value.factsNote, `${label}.factsNote`);

  assert(Array.isArray(value.offers) && value.offers.length > 0, `${label}.offers must not be empty`);
  value.offers.forEach((offer, index) => {
    const offerLabel = `${label}.offers[${index}]`;
    assertRecord(offer, offerLabel);
    assertString(offer.name, `${offerLabel}.name`);
    assertString(offer.price, `${offerLabel}.price`);
    assertStringArray(offer.deliverables, `${offerLabel}.deliverables`);
  });
  assertString(value.terms, `${label}.terms`);

  assertRecord(value.sample, `${label}.sample`);
  assertString(value.sample.body, `${label}.sample.body`);
  assertString(value.sample.label, `${label}.sample.label`);
  assertString(value.sample.href, `${label}.sample.href`);
  assert(
    /^\/samples\/[a-z0-9-]+\.pdf$/.test(value.sample.href),
    `${label}.sample.href must be a /samples/*.pdf download`,
  );

  assertStringArray(value.boundaries, `${label}.boundaries`);
  validateAction(value.related, `${label}.related`);
  assertInternalHref(value.related.href, `${label}.related.href`);
}

function validateServiceContact(value: unknown, label: string): void {
  assertRecord(value, label);
  assertString(value.email, `${label}.email`);
  assert(/^[a-z0-9._-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(value.email), `${label}.email must be a plain address`);
  assertString(value.label, `${label}.label`);
  assertString(value.subject, `${label}.subject`);
  if (value.bookingHref !== undefined) assertHttpsHref(value.bookingHref, `${label}.bookingHref`);
}

function validateServiceSource(value: unknown, label: string): void {
  assertRecord(value, label);
  assertString(value.label, `${label}.label`);
  assertHttpsHref(value.href, `${label}.href`);
}

function validateForbiddenTerms(value: Record<string, unknown>, label: string): void {
  assertStringArray(value.forbiddenTerms, `${label}.forbiddenTerms`);
  const { forbiddenTerms, ...printed } = value;
  const text = normalizeForTermMatch(JSON.stringify(printed));
  for (const term of forbiddenTerms) {
    assert(!text.includes(normalizeForTermMatch(term)), `${label} prints forbidden term "${term}"`);
  }
}

/** Fold case, compatibility forms, invisible characters and whitespace so a banned term cannot hide. */
export function normalizeForTermMatch(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u00AD\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function validateProduct(value: unknown, label: string): asserts value is PublicProduct {
  assertRecord(value, label);
  for (const field of ["boundary", "job", "name", "proof", "role", "status"] as const) {
    assertString(value[field], `${label}.${field}`);
  }
  assertPublicHref(value.href, `${label}.href`);
  validateAction(value.evidence, `${label}.evidence`);
}

function validateMigrationStep(value: unknown, label: string): asserts value is PublicMigrationStep {
  assertRecord(value, label);
  assertString(value.body, `${label}.body`);
  assertString(value.label, `${label}.label`);
}

function validateEvidenceLink(value: unknown, label: string): asserts value is PublicEvidenceLink {
  assertRecord(value, label);
  assertString(value.description, `${label}.description`);
  assertPublicHref(value.href, `${label}.href`);
  assertString(value.label, `${label}.label`);
}

function validateAction(value: unknown, label: string): asserts value is PublicAction {
  assertRecord(value, label);
  assertPublicHref(value.href, `${label}.href`);
  assertString(value.label, `${label}.label`);
}

function validateSection(value: unknown, label: string): asserts value is PublicSection {
  assertRecord(value, label);
  assertString(value.title, `${label}.title`);
  assertString(value.body, `${label}.body`);
  if (value.meta !== undefined) assertString(value.meta, `${label}.meta`);
}

function validatePolicySummary(value: unknown, label: string): void {
  assertRecord(value, label);
  for (const field of ["evidence", "excluded", "scope"] as const) {
    assertString(value[field], `${label}.${field}`);
  }
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  assert(Array.isArray(value) && value.length > 0, `${label} must not be empty`);
  value.forEach((item, index) => assertString(item, `${label}[${index}]`));
}

function assertHttpsOrigin(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  const url = new URL(value);
  assert(url.protocol === "https:" && url.origin === value, `${label} must be an HTTPS origin`);
}

function assertPublicHref(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  if (/^\/(?:[a-z0-9-]+\/)*$/.test(value)) return;
  const url = new URL(value);
  assert(url.protocol === "https:", `${label} must be an internal trailing-slash path or HTTPS URL`);
}

function assertHttpsHref(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  const url = new URL(value);
  assert(url.protocol === "https:", `${label} must be an HTTPS URL`);
}

function assertInternalHref(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  assert(
    /^\/(?:[a-z0-9-]+\/)*$/.test(value),
    `${label} must be an internal trailing-slash path`,
  );
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
