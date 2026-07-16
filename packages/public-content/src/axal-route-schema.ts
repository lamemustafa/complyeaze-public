import type {
  AxalDetailRoute,
  AxalHomeRoute,
  AxalRoute,
  AxalRouteManifest,
} from "./axal-route-types.ts";

export function defineAxalRouteManifest(value: unknown): AxalRouteManifest {
  assertRecord(value, "Axal route manifest");
  assert(value.schemaVersion === 1, "Axal route manifest schemaVersion must be 1");
  assert(value.app === "axal", "Axal route manifest app must be axal");
  assert(
    value.origin === "https://axal.complyeaze.com",
    "Axal route manifest must use the canonical Axal origin",
  );
  assert(Array.isArray(value.routes), "Axal route manifest routes must be an array");
  assert(value.routes.length === 6, "Axal route manifest must contain exactly six routes");

  const paths = new Set<string>();
  for (const [index, route] of value.routes.entries()) {
    validateRoute(route, `routes[${index}]`);
    assert(!paths.has(route.urlPath), `duplicate Axal route path ${route.urlPath}`);
    paths.add(route.urlPath);
  }
  assert(
    value.routes.filter((route) => route.kind === "axal-home").length === 1,
    "Axal route manifest must contain exactly one axal-home route",
  );
  assert(
    value.routes.filter((route) => route.kind === "axal-detail").length === 5,
    "Axal route manifest must contain exactly five axal-detail routes",
  );
  for (const route of value.routes) {
    for (const related of route.relatedRoutes) {
      assert(paths.has(related.href), `${route.slug} has unknown related route ${related.href}`);
    }
  }
  return value as unknown as AxalRouteManifest;
}

function validateRoute(value: unknown, label: string): asserts value is AxalRoute {
  assertRecord(value, label);
  for (const field of [
    "audience",
    "boundary",
    "description",
    "eyebrow",
    "heading",
    "navLabel",
    "slug",
    "summary",
    "title",
    "urlPath",
  ] as const) {
    assertString(value[field], `${label}.${field}`);
  }
  assert(value.robots === "noindex, nofollow", `${label}.robots must remain noindex, nofollow`);
  validatePath(value.slug, value.urlPath, label);
  validateAction(value.primaryAction, `${label}.primaryAction`, "external");
  validateAction(value.secondaryAction, `${label}.secondaryAction`, "internal");
  validateEvidence(value.evidenceLinks, `${label}.evidenceLinks`);
  validateRelated(value.relatedRoutes, `${label}.relatedRoutes`);
  assertStringArray(value.signalTerms, `${label}.signalTerms`);
  validateSections(value.sections, `${label}.sections`);

  if (value.kind === "axal-home") {
    assert(value.urlPath === "/", `${label}.urlPath must be / for axal-home`);
    assert(value.slug === "index", `${label}.slug must be index for axal-home`);
    assertStringArray(value.proof, `${label}.proof`);
    assertStringArray(value.workbenchStates, `${label}.workbenchStates`);
    validateRelated(value.routeDirectory, `${label}.routeDirectory`);
    for (const field of ["faqs"] as const) {
      assert(value[field] === undefined, `${label}.${field} is not valid for axal-home`);
    }
    return;
  }

  assert(value.kind === "axal-detail", `${label}.kind must be axal-home or axal-detail`);
  assert(value.urlPath !== "/", `${label}.urlPath must not be / for axal-detail`);
  validateFaqs(value.faqs, `${label}.faqs`);
  for (const field of ["proof", "routeDirectory", "workbenchStates"] as const) {
    assert(value[field] === undefined, `${label}.${field} is not valid for axal-detail`);
  }
}

function validatePath(slug: string, urlPath: string, label: string) {
  if (urlPath === "/") return;
  assert(/^\/[a-z0-9-]+\/$/.test(urlPath), `${label}.urlPath must be a clean trailing-slash path`);
  assert(slug === urlPath.slice(1, -1), `${label}.slug must match urlPath`);
}

function validateAction(value: unknown, label: string, kind: "external" | "internal") {
  assertRecord(value, label);
  assertString(value.href, `${label}.href`);
  assertString(value.label, `${label}.label`);
  if (kind === "external") {
    assert(/^https:\/\//.test(value.href), `${label}.href must use HTTPS`);
    assert(
      value.href === "https://axal.complyeaze.com/signup" ||
        value.href === "https://axal.complyeaze.com/login",
      `${label}.href must stay with the current Axal app`,
    );
  } else {
    assert(/^\/(?:$|[a-z0-9-]+\/)$/.test(value.href), `${label}.href must be a clean Axal route`);
    assert(!/^\/(?:login|signup)\/$/.test(value.href), `${label}.href must not implement app actions`);
  }
}

function validateEvidence(value: unknown, label: string) {
  assert(Array.isArray(value) && value.length > 0, `${label} must not be empty`);
  const hrefs = new Set<string>();
  for (const [index, entry] of value.entries()) {
    assertRecord(entry, `${label}[${index}]`);
    assertString(entry.description, `${label}[${index}].description`);
    assertString(entry.href, `${label}[${index}].href`);
    assert(/^https:\/\//.test(entry.href), `${label}[${index}].href must use HTTPS`);
    assertString(entry.label, `${label}[${index}].label`);
    assert(!hrefs.has(entry.href), `${label} href values must be unique`);
    hrefs.add(entry.href);
  }
}

function validateRelated(value: unknown, label: string) {
  assert(Array.isArray(value), `${label} must be an array`);
  const hrefs = new Set<string>();
  for (const [index, entry] of value.entries()) {
    assertRecord(entry, `${label}[${index}]`);
    assertString(entry.href, `${label}[${index}].href`);
    assert(/^\/(?:$|[a-z0-9-]+\/)$/.test(entry.href), `${label}[${index}].href must be internal`);
    assertString(entry.label, `${label}[${index}].label`);
    assert(!hrefs.has(entry.href), `${label} href values must be unique`);
    hrefs.add(entry.href);
  }
}

function validateSections(value: unknown, label: string) {
  assert(Array.isArray(value) && value.length > 0, `${label} must not be empty`);
  for (const [index, section] of value.entries()) {
    assertRecord(section, `${label}[${index}]`);
    assertString(section.title, `${label}[${index}].title`);
    assertString(section.body, `${label}[${index}].body`);
    assertStringArray(section.points, `${label}[${index}].points`);
  }
}

function validateFaqs(value: unknown, label: string) {
  assert(Array.isArray(value) && value.length > 0, `${label} must not be empty`);
  for (const [index, faq] of value.entries()) {
    assertRecord(faq, `${label}[${index}]`);
    assertString(faq.answer, `${label}[${index}].answer`);
    assertString(faq.question, `${label}[${index}].question`);
  }
}

function assertStringArray(value: unknown, label: string) {
  assert(Array.isArray(value) && value.length > 0, `${label} must not be empty`);
  value.forEach((item, index) => assertString(item, `${label}[${index}]`));
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, any> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export type { AxalDetailRoute, AxalHomeRoute, AxalRoute, AxalRouteManifest };
