# Visual Testing Standard

Visual changes must pass rendered review before commit.

## Required Coverage

- Desktop, tablet, and mobile widths.
- Homepage, top-level product pages, policy pages, trust pages, and any changed
  route.
- Header, navigation, footer, and first viewport.
- Long product names, long URLs, and long policy text.
- Keyboard focus states.
- Reduced-motion behavior.
- No horizontal overflow.
- No broken images.
- No blank sections.
- No overlapping text or controls.
- No clipped controls.
- Synthetic data only.

## Accessibility

Rendered checks should include:

- One `main` landmark.
- Visible focus indicators.
- Named links and buttons.
- Sufficient text contrast.
- Touch targets large enough for mobile.
- No color-only state.

## Evidence

Store visual evidence as CI artifacts or reviewed local artifacts:

- PNG screenshots for each route and viewport.
- JSON metrics for overflow, contrast, focus, and accessibility checks.
- Summary markdown with failures and dispositions.

Do not commit screenshots that contain real taxpayer data, portal data,
credentials, local paths, or production customer information.
