# Public content boundary

This private workspace package owns typed, public-safe content and route metadata
for the ComplyEaze, Axal, and Pack Astro apps.

`src/complyeaze.routes.json`, `src/axal.routes.json`, and
`src/pack.routes.json` are validated manifests and the only public route-content
sources. Their owning Astro apps render them independently; aggregate release
evidence records the built output without becoming a deployable route.

It must not contain auth logic, tenant data, private route types, or a competing design system.
