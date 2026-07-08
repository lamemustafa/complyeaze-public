#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pages } from "../src/site-data.mjs";
import { renderPage } from "../src/render-site.mjs";

const root = process.cwd();
const dist = path.join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(path.join(dist, "assets"), { recursive: true });

cpSync(path.join(root, "src", "styles.css"), path.join(dist, "assets", "styles.css"));

for (const page of pages) {
  const outputPath = path.join(dist, page.outputPath);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderPage(page), "utf8");
}

writeFileSync(
  path.join(dist, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://complyeaze.com/sitemap.xml\n",
  "utf8",
);

writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((page) => `  <url><loc>https://complyeaze.com${page.urlPath}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
  "utf8",
);

console.log(`Built ${pages.length} public pages into dist/`);
