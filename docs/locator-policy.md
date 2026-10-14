# Locator policy

Prefer, in order: `getByRole` with an accessible name, `getByLabel`, `getByPlaceholder`, `getByText` on
static copy, then `getByTestId` where the app ships a `data-test` attribute. Never a CSS class, an
XPath or an `nth-child` chain: those encode layout and appearance, not identity, and break on a
restyle. Scope a locator to its container whenever the element can repeat, such as an inventory card.

Sauce Demo ships `data-test` attributes, so `playwright.config.ts` sets `testIdAttribute` to
`data-test` where a role or label is not unique enough.
