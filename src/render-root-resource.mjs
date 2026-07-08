export function renderRootResourcePage(page, escapeHtml) {
  const cards = page.highlights ?? page.lanes ?? [];
  return `<section class="resource-ledger" aria-label="${escapeHtml(page.heading)} routing">
    ${cards
      .map(
        (item) => `<article>
          <h2>${escapeHtml(item.label ?? item.title)}</h2>
          ${item.route ? `<p class="resource-route">${escapeHtml(item.route)}</p>` : ""}
          <p>${escapeHtml(item.detail ?? item.body)}</p>
        </article>`,
      )
      .join("")}
  </section>
  <section class="resource-proof" aria-label="Public-safe evidence">
    <h2>Why this is safe to publish</h2>
    <ul>
      ${page.proof.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  </section>`;
}
