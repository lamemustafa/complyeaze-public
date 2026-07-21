import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { appDistPath, publicRouteRegistry } from "../public-route-registry.mjs";
import { hasAuthoredClientScript } from "./static-json-ld.mjs";

export const p4ComplyEazePaths = [
  "/",
  "/products/",
  "/products/pack/",
  "/products/tools/",
  "/about/",
  "/contact/",
];

const expectedProductActions = new Map([
  ["Axal", "https://axal.complyeaze.com/"],
  ["Pack", "/products/pack/"],
  ["Tools", "/products/tools/"],
]);

const requiredSourceFiles = [
  "apps/complyeaze/src/components/PublicBuyerResourcePage.astro",
  "apps/complyeaze/src/styles/p4-register.css",
];

export function assertP4ComplyEazeSources(root) {
  const findings = [];
  for (const filePath of requiredSourceFiles) {
    if (!existsSync(path.join(root, filePath))) findings.push(`${filePath}: missing`);
  }

  const manifest = JSON.parse(
    readFileSync(path.join(root, "packages/public-content/src/complyeaze.routes.json"), "utf8"),
  );
  const productsRoute = manifest.routes.find((route) => route.urlPath === "/products/");
  for (const [name, href] of expectedProductActions) {
    const product = productsRoute?.products?.find((entry) => entry.name === name);
    if (!product) {
      findings.push(`/products/: missing ${name}`);
      continue;
    }
    for (const field of ["job", "boundary", "proof", "status"]) {
      if (typeof product[field] !== "string" || product[field].trim() === "") {
        findings.push(`/products/: ${name} is missing ${field}`);
      }
    }
    if (product.href !== href) findings.push(`/products/: ${name} action must be ${href}`);
    if (!product.evidence?.href) findings.push(`/products/: ${name} is missing evidence`);
  }

  const contact = manifest.routes.find((route) => route.urlPath === "/contact/");
  if (contact?.primaryAction?.href !== "https://github.com/lamemustafa/complyeaze-public/issues") {
    findings.push("/contact/: primary action must use the public issue tracker");
  }
  if (contact?.secondaryAction?.href !== "https://github.com/lamemustafa/complyeaze-public/blob/master/SECURITY.md") {
    findings.push("/contact/: secondary action must use the security policy while private reporting is disabled");
  }

  for (const filePath of [
    "apps/complyeaze/src/components/PublicHomePage.astro",
    "apps/complyeaze/src/components/PublicProductsPage.astro",
    "apps/complyeaze/src/components/PublicGatewayPage.astro",
    "apps/complyeaze/src/components/PublicBuyerResourcePage.astro",
  ]) {
    if (!existsSync(path.join(root, filePath))) continue;
    const source = readFileSync(path.join(root, filePath), "utf8");
    if (!source.includes("data-p4-register")) findings.push(`${filePath}: missing P4 register marker`);
    if (!source.includes("patternClassName")) findings.push(`${filePath}: must use Sanchika compositions`);
  }

  const catchAll = readFileSync(path.join(root, "apps/complyeaze/src/pages/[...slug].astro"), "utf8");
  if (!catchAll.includes("PublicBuyerResourcePage")) {
    findings.push("ComplyEaze resource routing must isolate the P4 About/Contact presentation");
  }
  const layout = readFileSync(path.join(root, "apps/complyeaze/src/layouts/PublicPageLayout.astro"), "utf8");
  if (!layout.includes('class="site-header"') || !layout.includes('class="site-footer"')) {
    findings.push("Public shell chrome must use explicit site-header and site-footer scope");
  }
  if (/\n\s*header(?:\s|,|>)/.test(layout) || /\n\s*footer(?:\s|,|>)/.test(layout)) {
    findings.push("Public shell styles must not target nested semantic headers or footers");
  }

  if (findings.length > 0) throw new Error(`P4 ComplyEaze source findings:\n${findings.join("\n")}`);
}

export function assertP4ComplyEazeBuild(root) {
  const findings = [];
  const manifest = JSON.parse(
    readFileSync(path.join(root, "packages/public-content/src/complyeaze.routes.json"), "utf8"),
  );
  const productsRoute = manifest.routes.find((route) => route.urlPath === "/products/");
  const routes = publicRouteRegistry.filter(
    (route) => route.app === "complyeaze" && p4ComplyEazePaths.includes(route.urlPath),
  );
  if (routes.length !== p4ComplyEazePaths.length) {
    findings.push(`expected ${p4ComplyEazePaths.length} P4 routes, found ${routes.length}`);
  }
  for (const route of routes) {
    const html = readFileSync(path.join(root, appDistPath(route)), "utf8");
    if (!html.includes('data-p4-register="true"')) {
      findings.push(`${route.urlPath}: missing rendered P4 register marker`);
    }
    if (hasAuthoredClientScript(html)) findings.push(`${route.urlPath}: authored script found`);
    if (/<form(?:\s|>)/i.test(html)) findings.push(`${route.urlPath}: form found`);
    const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
    if (!head.includes("p4-register")) findings.push(`${route.urlPath}: P4 stylesheet must load in the document head`);
    if (route.urlPath === "/") {
      const productIndexPosition = html.indexOf('class="p4-hero__index"');
      const supportPosition = html.indexOf('class="p4-hero__support"');
      if (productIndexPosition === -1 || supportPosition === -1 || productIndexPosition > supportPosition) {
        findings.push("/: product choices must precede supporting copy and actions in mobile reading order");
      }
      for (const product of productsRoute?.products ?? []) {
        if (!html.includes(product.proof)) findings.push(`/: missing ${product.name} proof in the decision register`);
        const hero = html.match(/<header[^>]*class="[^"]*p4-hero[^"]*"[\s\S]*?<\/header>/i)?.[0] ?? "";
        if (!hero.includes(product.name) || !hero.includes(product.role)) {
          findings.push(`/: first viewport must identify ${product.name}`);
        }
      }
    }
    if (["/about/", "/contact/"].includes(route.urlPath)) {
      for (const product of productsRoute?.products ?? []) {
        for (const field of ["boundary", "proof", "status"]) {
          if (!html.includes(product[field])) findings.push(`${route.urlPath}: missing ${product.name} ${field}`);
        }
        if (!html.includes(product.evidence.href)) findings.push(`${route.urlPath}: missing ${product.name} evidence action`);
      }
    }
  }
  for (const route of publicRouteRegistry.filter(
    (entry) => entry.app === "complyeaze" && !p4ComplyEazePaths.includes(entry.urlPath),
  )) {
    const html = readFileSync(path.join(root, appDistPath(route)), "utf8");
    if (html.includes('data-p4-register="true"')) {
      findings.push(`${route.urlPath}: P4 presentation leaked outside the approved scope`);
    }
    if (html.match(/<head>([\s\S]*?)<\/head>/i)?.[1]?.includes("p4-register")) {
      findings.push(`${route.urlPath}: P4 stylesheet leaked outside the approved scope`);
    }
  }
  if (findings.length > 0) throw new Error(`P4 ComplyEaze build findings:\n${findings.join("\n")}`);
}
