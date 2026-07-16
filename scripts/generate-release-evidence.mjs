#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { publicRouteRegistry } from "./public-route-registry.mjs";
import { createReleaseEvidenceFromBuild } from "./release-evidence.mjs";

const root = process.cwd();
const output = path.join(root, "test-results/public-build/route-manifest.json");
const evidence = createReleaseEvidenceFromBuild(root, publicRouteRegistry);
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(`Generated release evidence for ${evidence.pageCount} Astro routes`);
