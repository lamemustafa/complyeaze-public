# Public content boundary

This private workspace package owns typed, public-safe content and route metadata as pages move from the legacy renderer.

During incremental migration, the legacy root-resource renderer and the Astro
app both consume `src/complyeaze.routes.json`. Renderer-specific structure may
differ, but route copy, metadata, actions, and proof have one source of truth
while the legacy build remains the rollback baseline.

It must not contain auth logic, tenant data, private route types, or a competing design system.
