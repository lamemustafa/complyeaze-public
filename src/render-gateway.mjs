export function renderGatewayPage(page, escapeHtml) {
  return `<section class="gateway-actions" aria-label="${escapeHtml(page.product)} destination">
    <a class="button-primary" href="${escapeHtml(page.primaryAction.href)}">${escapeHtml(page.primaryAction.label)}</a>
    <a class="button-secondary" href="${escapeHtml(page.secondaryAction.href)}">${escapeHtml(page.secondaryAction.label)}</a>
  </section>
  <section class="gateway-grid" aria-label="${escapeHtml(page.product)} boundary notes">
    ${page.sections
      .map(
        (section) => `<article>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>`,
      )
      .join("")}
  </section>
  <section class="gateway-evidence" aria-labelledby="gateway-evidence-title">
    <h2 id="gateway-evidence-title">Review product-owned evidence</h2>
    <ul>
      ${page.evidenceLinks
        .map(
          (link) => `<li>
            <a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>
            <p>${escapeHtml(link.description)}</p>
          </li>`,
        )
        .join("")}
    </ul>
  </section>`;
}
