export interface PublicAction {
  href: string;
  label: string;
}

export interface PublicSection {
  body: string;
  meta?: string;
  title: string;
}

export interface PublicRouteBase {
  description: string;
  eyebrow: string;
  heading: string;
  kind: "policy" | "resource";
  robots: "noindex, nofollow";
  sections: PublicSection[];
  signalTerms: string[];
  slug: string;
  summary: string;
  title: string;
  urlPath: string;
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

export type PublicRoute = PublicPolicyRoute | PublicResourceRoute;

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
  assert(
    /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/.test(urlPath),
    `${label}.urlPath must be a clean trailing-slash route`,
  );
  assert(slug === urlPath.slice(1, -1), `${label}.slug must match urlPath`);
  assert(value.robots === "noindex, nofollow", `${label}.robots must stay noindex before cutover`);
  assert(Array.isArray(value.sections) && value.sections.length > 0, `${label}.sections must not be empty`);
  value.sections.forEach((section, index) => validateSection(section, `${label}.sections[${index}]`));
  assertStringArray(value.signalTerms, `${label}.signalTerms`);
  if (value.kind === "resource") {
    assert(value.policySummary === undefined, `${label}.policySummary is only valid for policy routes`);
    validateAction(value.primaryAction, `${label}.primaryAction`);
    validateAction(value.secondaryAction, `${label}.secondaryAction`);
    assertStringArray(value.proof, `${label}.proof`);
    return;
  }
  assert(value.kind === "policy", `${label}.kind must be policy or resource`);
  for (const field of ["primaryAction", "proof", "secondaryAction"] as const) {
    assert(value[field] === undefined, `${label}.${field} is only valid for resource routes`);
  }
  validatePolicySummary(value.policySummary, `${label}.policySummary`);
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

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
