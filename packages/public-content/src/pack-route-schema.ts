import type { PackFoundationRoute, PackRouteManifest } from "./pack-route-types.ts";

export function definePackRouteManifest(value: unknown): PackRouteManifest {
  assertRecord(value, "Pack route manifest");
  assertExactKeys(value, ["app", "origin", "routes", "schemaVersion"], "Pack route manifest");
  assert(value.schemaVersion === 1, "Pack route manifest schemaVersion must be 1");
  assert(value.app === "pack", "Pack route manifest app must be pack");
  assert(
    value.origin === "https://pack.complyeaze.com",
    "Pack route manifest must use the canonical Pack origin",
  );
  assert(Array.isArray(value.routes) && value.routes.length === 1, "Pack manifest needs one route");
  validateFoundation(value.routes[0], "routes[0]");
  return value as unknown as PackRouteManifest;
}

function validateFoundation(value: unknown, label: string): asserts value is PackFoundationRoute {
  assertRecord(value, label);
  assertExactKeys(
    value,
    [
      "description",
      "heading",
      "kind",
      "robots",
      "signalTerms",
      "slug",
      "summary",
      "title",
      "urlPath",
    ],
    label,
  );
  for (const field of ["description", "heading", "summary", "title"] as const) {
    assertString(value[field], `${label}.${field}`);
  }
  assert(value.kind === "pack-foundation", `${label}.kind must be pack-foundation`);
  assert(value.slug === "index", `${label}.slug must be index`);
  assert(value.urlPath === "/", `${label}.urlPath must be /`);
  assert(value.robots === "noindex, nofollow", `${label}.robots must stay noindex, nofollow`);
  assert(Array.isArray(value.signalTerms) && value.signalTerms.length > 0, `${label}.signalTerms must not be empty`);
  value.signalTerms.forEach((term, index) => assertString(term, `${label}.signalTerms[${index}]`));
  const text = JSON.stringify(value);
  assert(
    !/chrome web store|production ready|release ready|install now|available now/i.test(text),
    `${label} contains a forbidden Pack readiness claim`,
  );
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, any> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assertExactKeys(value: Record<string, any>, expected: string[], label: string) {
  const actual = Object.keys(value).sort();
  const keys = [...expected].sort();
  assert(JSON.stringify(actual) === JSON.stringify(keys), `${label} has unsupported fields`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export type { PackFoundationRoute, PackRouteManifest };
