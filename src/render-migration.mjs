import { migrationLedger } from "./migration-data.mjs";

export function renderMigrationPage(page, escapeHtml) {
  return `${renderSections(page.sections, escapeHtml)}
  <ol class="migration-summary" aria-label="Migration order">
    ${page.steps
      .map(
        (step) => `<li>
          <strong>${escapeHtml(step.label)}</strong>
          <span>${escapeHtml(step.body)}</span>
        </li>`,
      )
      .join("")}
  </ol>
  <section class="migration-ledger" aria-label="Route migration ledger">
    ${migrationLedger
      .map(
        (entry) => `<article>
          <header>
            <h2>${escapeHtml(entry.family)}</h2>
            <span>${escapeHtml(entry.status)}</span>
          </header>
          <dl>
            <div><dt>Source</dt><dd>${escapeHtml(entry.source)}</dd></div>
            <div><dt>Destination</dt><dd>${escapeHtml(entry.destination)}</dd></div>
            <div><dt>Cleanup rule</dt><dd>${escapeHtml(entry.cleanup)}</dd></div>
            <div><dt>Parent cleanup</dt><dd>${escapeHtml(entry.parentCleanup)}</dd></div>
            <div><dt>Evidence</dt><dd>${escapeHtml(entry.evidence)}</dd></div>
            <div><dt>Rollback</dt><dd>${escapeHtml(entry.rollback)}</dd></div>
          </dl>
          ${renderMigrationRoutes(entry.routes, entry.family, escapeHtml)}
        </article>`,
      )
      .join("")}
  </section>`;
}

function renderSections(sections, escapeHtml) {
  return `<section class="evidence-grid" aria-label="Migration evidence boundary">
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

function renderMigrationRoutes(routes, family, escapeHtml) {
  const hintId = `route-ledger-hint-${family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  return `<div class="route-ledger" role="region" tabindex="0" aria-describedby="${hintId}" aria-label="${escapeHtml(family)} source route cleanup evidence">
    <p id="${hintId}" class="route-ledger-hint">Nine-column route ledger; scroll horizontally when displayed as a table.</p>
    <table>
      <caption>${escapeHtml(family)} route-level cleanup blockers</caption>
      <thead>
        <tr>
          <th scope="col">Source host</th>
          <th scope="col">Source route</th>
          <th scope="col">Destination host</th>
          <th scope="col">Destination</th>
          <th scope="col">Cleanup</th>
          <th scope="col">Evidence</th>
          <th scope="col">Redirect</th>
          <th scope="col">Cleanup PR</th>
          <th scope="col">Rollback</th>
        </tr>
      </thead>
      <tbody>
        ${routes
          .map(
            (route) => `<tr>
              <th scope="row" data-label="Source host">${escapeHtml(route.sourceHost)}</th>
              <td data-label="Source route">${escapeHtml(route.sourceRoute)}</td>
              <td data-label="Destination host">${escapeHtml(route.destinationHost)}</td>
              <td data-label="Destination">${escapeHtml(route.destinationRoute)}</td>
              <td data-label="Cleanup">${escapeHtml(route.cleanupStatus)}</td>
              <td data-label="Evidence">${escapeHtml(route.evidenceStatus)}; hosted evidence: ${escapeHtml(route.hostedEvidenceUrl)}</td>
              <td data-label="Redirect">${escapeHtml(route.redirectStatus)}; plan: ${escapeHtml(route.redirectPlan)}</td>
              <td data-label="Cleanup PR">${escapeHtml(route.parentCleanupPr)}</td>
              <td data-label="Rollback">${escapeHtml(route.rollback)}; owner/path: ${escapeHtml(route.rollbackCommandOrOwner)}</td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}
