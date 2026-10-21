# demoblaze-test-automation

E2E automation for the Login and Cart flows on [demoblaze.com](https://www.demoblaze.com/), built with Playwright + TypeScript.

## Why it's structured this way

- **Page Object Model** (`pages/`) - each page/modal (login, product, cart) is a class with its own locators and actions, so a selector change only touches one file.
- **Fixtures** (`fixtures/`) - tests get `loginPage`/`productPage`/`cartPage` ready to use, plus a `testUser` fixture that registers a fresh account through the API before the test runs. demoblaze has no fixed demo account, so provisioning one per test avoids tests colliding or depending on manual setup.
- **`utils/dialog.ts`** - demoblaze reports every error (login, add-to-cart, place order) through a native `alert()`, and some of those fire synchronously inside the click itself. This helper captures the alert text correctly in both the sync and async case, instead of a blind `sleep`.
- **Multi-project config** - `chromium`/`firefox`/`webkit` projects cover cross-browser UI, and a separate `api` project hits `api.demoblaze.com` directly for faster, UI-independent checks on the same login/signup contract.
- **`tests/ui` vs `tests/api`** - kept apart so API tests don't need a browser and UI tests don't accidentally run twice under the API project.

## What's covered

- `tests/ui/login.spec.ts` - valid login, wrong password, unregistered user, empty fields, session surviving a reload.
- `tests/ui/cart.spec.ts` - login → add to cart → place an order (the main demo flow), guest add-to-cart, missing Name/Card validation, deleting an item.
- `tests/api/api.spec.ts` - signup/login contract checks directly against the API (duplicate user, wrong password, unknown user).
- `test-cases/test-cases.xlsx` - the full manual test case suite for Login and Cart (functional/negative/edge), including a few documented gaps in demoblaze itself (e.g. Credit card and Month/Year accept anything) that aren't automated since they describe a known gap rather than a pass/fail check.

## Running it

```bash
npm install
npx playwright install        # first time only, downloads browser binaries
cp .env.example .env           # defaults already point at the public demoblaze site

npm test                       # all UI tests, chromium + firefox + webkit
npm run test:ui                # UI tests on chromium only (fastest for local iteration)
npm run test:api               # API-only checks, no browser
npm run test:smoke             # just the two @smoke tests (login, full cart→checkout flow)
npm run report                 # open the last HTML report
```

Tests run against the public demoblaze.com site, so no local server is required. `BASE_URL`/`API_URL` in `.env` can be pointed at a different environment if needed.

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main` and uploads the HTML report as a build artifact.
