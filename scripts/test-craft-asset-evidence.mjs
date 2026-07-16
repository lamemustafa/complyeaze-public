import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import * as craftEvidence from "./public-checks/craft-visual-evidence.mjs";

assert.equal(typeof craftEvidence.craftAssetResponseIssue, "function");
assert.equal(typeof craftEvidence.craftAssetRequestFailureIssue, "function");
assert.equal(typeof craftEvidence.calculateCraftCssGzipBytes, "function");
assert.equal(typeof craftEvidence.calculateAuthoredJavaScriptBytes, "function");
assert.equal(craftEvidence.isCraftAssetResource(true, "font"), true);
assert.equal(craftEvidence.isCraftAssetResource(true, "image"), true);
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
assert.equal(
  craftEvidence.craftAssetResponseIssue({
    craftReview: true,
    ok: false,
    resourceType: "image",
    status: 404,
    url: "http://127.0.0.1/images/review-bg.webp",
  }),
  "image request returned 404: http://127.0.0.1/images/review-bg.webp",
);
assert.equal(
  craftEvidence.craftAssetRequestFailureIssue({
    craftReview: true,
    errorText: "net::ERR_FAILED",
    resourceType: "image",
    url: "http://127.0.0.1/images/review-bg.webp",
  }),
  "image request failed (net::ERR_FAILED): http://127.0.0.1/images/review-bg.webp",
);

for (const resourceType of ["document", "media"]) {
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

const transferredCss = Buffer.from(".external { color: navy; }");
const inlineCss = [".inline-a { color: teal; }", ".inline-b { color: teal; }"];
assert.equal(
  craftEvidence.calculateCraftCssGzipBytes(
    [{ type: "stylesheet", body: transferredCss }],
    inlineCss,
  ),
  gzipSync(transferredCss).byteLength + gzipSync(Buffer.from(inlineCss.join("\n"))).byteLength,
);
assert.equal(
  craftEvidence.calculateAuthoredJavaScriptBytes(
    [{ type: "script", body: Buffer.from("window.external = true;") }],
    ["window.inline = true;"],
    ["window.clicked = true;"],
  ),
  Buffer.byteLength("window.external = true;")
    + Buffer.byteLength("window.inline = true;")
    + Buffer.byteLength("window.clicked = true;"),
);

console.log("Craft asset evidence fixtures passed");
