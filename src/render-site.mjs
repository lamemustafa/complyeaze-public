import { site } from "./site-data.mjs";
import { products, proofLedger, trustSignals, migrationRoutes } from "./product-data.mjs";
import { renderAxalPage } from "./render-axal.mjs";
import { renderEvidencePage } from "./render-evidence.mjs";
import { renderGatewayPage } from "./render-gateway.mjs";
import { renderMigrationPage } from "./render-migration.mjs";
import { renderPolicyPage } from "./render-policy.mjs";
import { renderRootResourcePage } from "./render-root-resource.mjs";

export function renderPage(page) {
  const canonical = new URL(page.urlPath, site.origin).href;
  const footerLinks = [
    { label: "Trust policy", href: "/trust/" },
    { label: "Privacy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
    { label: "Status", href: "/status/" },
    { label: "Contact", href: "/contact/" }
  ];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <link rel="stylesheet" href="/assets/styles.css">
    ${page.slug === "products" ? '<link rel="stylesheet" href="/assets/products.css">' : ""}
    ${page.slug === "migration" ? '<link rel="stylesheet" href="/assets/migration.css">' : ""}
    ${page.type === "productGateway" ? '<link rel="stylesheet" href="/assets/gateway.css">' : ""}
    ${page.type === "rootResource" ? '<link rel="stylesheet" href="/assets/root-resource.css">' : ""}
    ${page.type === "policy" ? '<link rel="stylesheet" href="/assets/policy.css">' : ""}
    ${page.type?.startsWith("axal") ? '<link rel="stylesheet" href="/assets/axal.css">' : ""}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="ComplyEaze Public home">
        <span class="brand-mark" aria-hidden="true">CE</span>
        <span>ComplyEaze Public</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        ${site.nav
          .map(
            (item) =>
              `<a href="${item.href}"${isCurrentNavItem(item.href, page.urlPath) ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`,
          )
          .join("")}
      </nav>
    </header>
    <main id="main" class="page-shell">
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1 id="page-title">${escapeHtml(page.heading)}</h1>
        <p class="hero-summary">${escapeHtml(page.summary)}</p>
        ${renderCtas(page)}
      </section>
      ${renderPageBody(page)}
    </main>
    <footer class="site-footer">
      <p>Open-source public surfaces. Private app data stays outside this repository.</p>
      <nav aria-label="Footer navigation">
        ${footerLinks
          .map(
            (item) =>
              `<a href="${item.href}"${item.href === page.urlPath ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`,
          )
          .join("")}
      </nav>
    </footer>
  </body>
</html>`;
}

function renderCtas(page) {
  if (!page.primaryCta) return "";
  return `<div class="hero-actions">
    <a class="button-primary" href="${page.primaryCta.href}">${escapeHtml(page.primaryCta.label)}</a>
    <a class="button-secondary" href="${page.secondaryCta.href}">${escapeHtml(page.secondaryCta.label)}</a>
  </div>`;
}

function isCurrentNavItem(href, urlPath) {
  if (href === "/") return urlPath === "/";
  return urlPath === href || urlPath.startsWith(href);
}

function renderPageBody(page) {
  if (page.slug === "products") return renderProducts();
  if (page.type === "evidence") return renderEvidencePage(page, escapeHtml);
  if (page.type === "migration") return renderMigrationPage(page, escapeHtml);
  if (page.type === "productGateway") return renderGatewayPage(page, escapeHtml);
  if (page.type === "rootResource") return renderRootResourcePage(page, escapeHtml);
  if (page.type === "policy") return renderPolicyPage(page, escapeHtml);
  if (page.type?.startsWith("axal")) return renderAxalPage(page, escapeHtml);
  return renderSections(page.sections);
}

function renderSections(sections) {
  return `<section class="evidence-grid" aria-label="Public boundary evidence">
    ${sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`,
      )
      .join("")}
  </section>`;
}

function renderProducts() {
  return `<section class="proof-ledger" aria-label="Public proof ledger">
    ${proofLedger
      .map(
        (item) => `<article>
          <p>${escapeHtml(item.label)}</p>
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.detail)}</span>
        </article>`,
      )
      .join("")}
  </section>
  <section class="product-map" aria-label="ComplyEaze product-family map">
    ${products
      .map(
        (product) => `<article id="${escapeHtml(product.name.toLowerCase())}">
          <a class="product-name" href="${escapeHtml(product.href)}">${escapeHtml(product.name)}</a>
          <p class="product-role">${escapeHtml(product.role)}</p>
          <dl>
            <div><dt>Promise</dt><dd>${escapeHtml(product.promise)}</dd></div>
            <div><dt>Proof</dt><dd>${escapeHtml(product.proof)}</dd></div>
            <div><dt>Boundary</dt><dd>${escapeHtml(product.boundary)}</dd></div>
            <div><dt>Status</dt><dd>${escapeHtml(product.status)}</dd></div>
          </dl>
        </article>`,
      )
      .join("")}
  </section>
  <section class="trust-signal-grid" aria-label="Trust signals">
    ${trustSignals
      .map(
        (signal) => `<article>
          <h2>${escapeHtml(signal.title)}</h2>
          <p>${escapeHtml(signal.body)}</p>
        </article>`,
      )
      .join("")}
  </section>
  <section class="product-table-section" aria-label="Public migration inventory">
    <table>
      <thead>
        <tr>
          <th scope="col">Source</th>
          <th scope="col">Destination</th>
          <th scope="col">Status</th>
          <th scope="col">Notes</th>
        </tr>
      </thead>
      <tbody>
        ${migrationRoutes
          .map(
            (route) => `<tr>
              <th scope="row" data-label="Source">${escapeHtml(route.source)}</th>
              <td data-label="Destination">${escapeHtml(route.destination)}</td>
              <td data-label="Status">${escapeHtml(route.status)}</td>
              <td data-label="Notes">${escapeHtml(route.notes)}</td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </section>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
