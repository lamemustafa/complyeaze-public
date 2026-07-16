import assert from "node:assert/strict";
import * as craftEvidence from "./public-checks/craft-visual-evidence.mjs";

assert.equal(typeof craftEvidence.craftAssetResponseIssue, "function");
assert.equal(typeof craftEvidence.craftAssetRequestFailureIssue, "function");
assert.equal(craftEvidence.isCraftAssetResource(true, "font"), true);
assert.equal(craftEvidence.isCraftAssetResource(true, "image"), false);
assert.equal(craftEvidence.isCraftAssetResource(false, "font"), false);

assert.equal(
  craftEvidence.craftAssetResponseIssue({
    craftReview: true,
    ok: false,
    resourceType: "font",
    status: 404,
    url: "http://127.0.0.1/fonts/review.woff2",
  }),
  "font request returned 404: http://127.0.0.1/fonts/review.woff2",
);
assert.equal(
  craftEvidence.craftAssetRequestFailureIssue({
    craftReview: true,
    errorText: "net::ERR_CONNECTION_REFUSED",
    resourceType: "stylesheet",
    url: "http://127.0.0.1/styles/review.css",
  }),
  "stylesheet request failed (net::ERR_CONNECTION_REFUSED): http://127.0.0.1/styles/review.css",
);

for (const resourceType of ["document", "image"]) {
  assert.equal(
    craftEvidence.craftAssetResponseIssue({
      craftReview: true,
      ok: false,
      resourceType,
      status: 404,
      url: `http://127.0.0.1/${resourceType}`,
    }),
    null,
  );
}
assert.equal(
  craftEvidence.craftAssetResponseIssue({
    craftReview: false,
    ok: false,
    resourceType: "font",
    status: 404,
    url: "http://127.0.0.1/fonts/review.woff2",
  }),
  null,
);

console.log("Craft asset evidence fixtures passed");
