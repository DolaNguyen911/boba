# boba

E2E automation for the Login and Cart flows on [demoblaze.com](https://www.demoblaze.com/), built with Playwright + TypeScript.

## Layout

```
src/
  login/   LoginPage.ts + login.spec.ts
  cart/    CartPage.ts, ProductPage.ts + cart.spec.ts
  shared/  fixtures.ts, dialog.ts
api/       auth.spec.ts, products.spec.ts
test-cases/test-cases.xlsx
```

Grouped by feature instead of splitting into generic `pages/`/`tests/` folders - the page object and the spec that drives it sit next to each other, so working on Cart means one folder, not three. `api/` is separate since it never touches a browser.

## Why it's structured this way

- **Page object next to its spec** - `src/login/LoginPage.ts` and `src/login/login.spec.ts` live together; a selector change and the test that exercises it are one folder away from each other instead of two parallel trees.
- **`src/shared/fixtures.ts`** - hands tests a ready `loginPage`/`productPage`/`cartPage`, plus a `testUser` fixture that registers a fresh account through the API before the test runs. demoblaze has no fixed demo account, so provisioning one per test avoids collisions or manual setup.
- **`src/shared/dialog.ts`** - demoblaze reports every error (login, add-to-cart, place order) through a native `alert()`, and some fire synchronously inside the click itself. This helper captures the alert text correctly in both the sync and async case, instead of a blind `sleep`.
- **Multi-project config** - `chromium`/`firefox`/`webkit` cover cross-browser UI, `mobile-chrome` emulates a Pixel 7 viewport, and a separate `api` project hits `api.demoblaze.com` directly for faster, UI-independent checks.

## What's covered

- `src/login/login.spec.ts` - valid login, wrong password, unregistered user, empty fields, session surviving a reload.
- `src/cart/cart.spec.ts` - login → add to cart → place an order (the main demo flow), guest add-to-cart, missing Name/Card validation, deleting an item.
- `api/auth.spec.ts` - signup/login contract checks directly against the API (duplicate user, wrong password, unknown user).
- `api/products.spec.ts` - sanity check on the product catalog response shape.
- `test-cases/test-cases.xlsx` - the full manual test case suite for Login and Cart (functional/negative/edge), including a few documented gaps in demoblaze itself (e.g. Credit card and Month/Year accept anything) that aren't automated since they describe a known gap rather than a pass/fail check.

## Running it

```bash
npm install
npx playwright install        # first time only, downloads browser binaries
cp .env.example .env           # defaults already point at the public demoblaze site

npm test                       # all UI tests, chromium + firefox + webkit
npm run test:ui                # UI tests on chromium only (fastest for local iteration)
npm run test:api               # API-only checks, no browser
npm run test:mobile            # UI tests on a Pixel 7 viewport
npm run test:smoke             # just the two @smoke tests (login, full cart→checkout flow)
npm run report                 # open the last HTML report
```

Tests run against the public demoblaze.com site, so no local server is required. `BASE_URL`/`API_URL` in `.env` can be pointed at a different environment if needed.

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main` and uploads the HTML report as a build artifact.
