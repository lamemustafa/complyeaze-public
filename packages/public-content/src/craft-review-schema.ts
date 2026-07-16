import type { CraftReviewEvidence } from "./craft-review-types.ts";

const accessibility = ["axe", "keyboard", "reduced-motion", "forced-colors"];

export function defineCraftReviewEvidence(
  value: unknown,
  requiredCompositions: readonly string[],
): CraftReviewEvidence {
  assertRecord(value, "craft review evidence");
  assert(value.contentMode === "synthetic", "craft content must be synthetic");
  assert(value.interactionMode === "zero-js", "craft interaction must be zero-js");
  assert(value.sanchikaRelease === "v0.1.0", "craft route must use Sanchika v0.1.0");
  assert(
    value.reviewStatus === "C3 human craft approval pending",
    "craft route must leave C3 human approval pending",
  );
  assert(
    JSON.stringify(value.accessibility) === JSON.stringify(accessibility),
    "craft accessibility checks are incomplete",
  );
  assert(Array.isArray(value.compositions), "craft compositions must be an array");
  assert(
    JSON.stringify(value.compositions) === JSON.stringify(requiredCompositions),
    "craft compositions must match the app contract exactly",
  );
  assertRecord(value.budgets, "craft budgets");
  assert(value.budgets.authoredJavaScriptBytes === 0, "craft authored JavaScript budget must be zero");
  assert(value.budgets.cssGzipBytes === 61440, "craft CSS budget must be 60 KiB gzip");
  assert(value.budgets.criticalFonts === 2, "craft critical font budget must be two");
  assert(value.budgets.maxCls === 0.05, "craft CLS budget must be 0.05");
  return value as unknown as CraftReviewEvidence;
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, any> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
