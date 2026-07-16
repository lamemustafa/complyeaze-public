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
  assertRecord(value.measurementCeilings, "craft measurement ceilings");
  assert(
    value.measurementCeilings.authoredJavaScriptBytes === 0,
    "authored JavaScript measurement ceiling must be zero",
  );
  assert(
    Number.isInteger(value.measurementCeilings.cssGzipBytes)
      && value.measurementCeilings.cssGzipBytes >= 0
      && value.measurementCeilings.cssGzipBytes <= value.budgets.cssGzipBytes,
    "craft CSS measurement ceiling must fit the CSS budget",
  );
  assert(
    Number.isInteger(value.measurementCeilings.criticalFonts)
      && value.measurementCeilings.criticalFonts >= 0
      && value.measurementCeilings.criticalFonts <= value.budgets.criticalFonts,
    "critical-font measurement ceiling must fit the font budget",
  );
  assert(
    typeof value.measurementCeilings.maxCls === "number"
      && value.measurementCeilings.maxCls >= 0
      && value.measurementCeilings.maxCls <= value.budgets.maxCls,
    "CLS measurement ceiling must fit the CLS budget",
  );
  assertRecord(value.measurementCeilings.cls, "craft viewport CLS measurement ceilings");
  const viewportCls = [
    value.measurementCeilings.cls.desktop,
    value.measurementCeilings.cls.tablet,
    value.measurementCeilings.cls.mobile,
  ];
  assert(
    viewportCls.every((measurement) =>
      typeof measurement === "number"
      && measurement >= 0
      && measurement <= value.budgets.maxCls
    ),
    "each viewport CLS measurement ceiling must fit the CLS budget",
  );
  assert(
    value.measurementCeilings.maxCls === Math.max(...viewportCls),
    "maximum CLS measurement ceiling must match the viewport ceilings",
  );
  assert(
    JSON.stringify(value.measurementCeilings.viewports) === JSON.stringify(["desktop", "tablet", "mobile"]),
    "craft measurement ceilings must cover desktop, tablet, and mobile",
  );
  return value as unknown as CraftReviewEvidence;
}

function assertRecord(value: unknown, label: string): asserts value is Record<string, any> {
  assert(typeof value === "object" && value !== null && !Array.isArray(value), `${label} must be an object`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
