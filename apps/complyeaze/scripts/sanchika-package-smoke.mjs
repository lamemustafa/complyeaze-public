#!/usr/bin/env node
import { tokenDefinitions } from "@sanchika/tokens";
import { primitiveClassName } from "@sanchika/primitives";
import { patternClassName } from "@sanchika/patterns";

const proof = {
  definitionCount: tokenDefinitions.length,
  button: primitiveClassName("Button", "brand", "md"),
  pattern: patternClassName("ReviewDeskPreview", {
    variant: "three-pane",
    state: "ca-review-needed",
  }),
};

if (proof.definitionCount === 0 || !proof.button.includes("sk-button") || !proof.pattern.includes("sk-pattern")) {
  throw new Error("Sanchika package-backed consumer smoke failed");
}

console.log(`Sanchika package smoke passed (${proof.definitionCount} definitions)`);
