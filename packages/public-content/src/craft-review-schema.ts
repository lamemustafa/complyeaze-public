import type { CraftReviewEvidence } from "./craft-review-types.ts";

const accessibility = ["axe", "keyboard", "reduced-motion", "forced-colors"];

export function defineCraftReviewEvidence(
  value: unknown,
  requiredCompositions: readonly string[],
): CraftReviewEvidence {
  assertRecord(value, "craft review evidence");
  assert(value.contentMode === "synthetic", "craft content must be synthetic");
  assert(value.interactionMode === "zero-js", "craft interaction must be zero-js");
  assert(value.sanchikaRelease === "v0.1.1", "craft route must use Sanchika v0.1.1");
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
  assertRecord(value.measurements, "craft measurements");
  assert(
    value.measurements.authoredJavaScriptBytes === 0,
    "measured authored JavaScript must be zero",
  );
  assert(
    Number.isInteger(value.measurements.cssGzipBytes)
      && value.measurements.cssGzipBytes >= 0
      && value.measurements.cssGzipBytes <= value.budgets.cssGzipBytes,
    "measured craft CSS must fit the CSS budget",
  );
  assert(
    Number.isInteger(value.measurements.criticalFonts)
      && value.measurements.criticalFonts >= 0
      && value.measurements.criticalFonts <= value.budgets.criticalFonts,
    "measured critical fonts must fit the font budget",
  );
  assert(
    typeof value.measurements.maxCls === "number"
      && value.measurements.maxCls >= 0
      && value.measurements.maxCls <= value.budgets.maxCls,
    "measured CLS must fit the CLS budget",
  );
  assertRecord(value.measurements.cls, "craft viewport CLS measurements");
  const viewportCls = [
    value.measurements.cls.desktop,
    value.measurements.cls.tablet,
    value.measurements.cls.mobile,
  ];
  assert(
    viewportCls.every((measurement) =>
      typeof measurement === "number"
      && measurement >= 0
      && measurement <= value.budgets.maxCls
    ),
    "each measured viewport CLS must fit the CLS budget",
  );
  assert(
    value.measurements.maxCls === Math.max(...viewportCls),
    "measured maximum CLS must match the viewport evidence",
  );
  assert(
    JSON.stringify(value.measurements.viewports) === JSON.stringify(["desktop", "tablet", "mobile"]),
    "craft measurements must cover desktop, tablet, and mobile",
  );
  return value as unknown as CraftReviewEvidence;
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, any> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
