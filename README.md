# boba - Playwright Automation Framework

## Overview
**boba** is a scalable end-to-end automation framework developed for the DemoBlaze web application. Built with **Playwright** and **TypeScript**, this framework showcases a professional approach to hybrid testing, covering both UI and API layers with a focus on maintainability and clear execution reporting.

**Test Case Suite:** [test-cases/test-cases.xlsx](test-cases/test-cases.xlsx)

## Project Structure
The framework follows a modular folder hierarchy to ensure a clean separation of concerns:

```text
boba/
├── .github/workflows/   # CI/CD pipeline configurations
├── config/              # Environment settings and the fixed test-account pool
├── fixtures/            # Custom Playwright fixtures (page objects, worker auth)
├── pages/               # Page Object Model (POM) implementations
│   ├── modules/         # Reusable UI components (Navigation Bar,...)
│   └── modals/          # Modal page objects (Login, Place Order, Purchase Success)
├── tests/               # Test suites
│   ├── api/             # Functional API tests
│   └── ui/              # End-to-end UI tests
├── utils/               # Common utility and helper functions (e.g. dialog handling)
├── .gitignore           # Git exclusion rules
├── package.json         # Project dependencies and scripts
└── playwright.config.ts # Global Playwright configuration
```

## Key Features
* **Hybrid Testing Strategy:** Unified automation for UI and API validation within a single repository.
* **Modular Page Objects:** Component-based architecture using modules for highly reusable UI elements.
* **Data-Driven Testing:** Support for multiple test scenarios by decoupling test data from execution logic.
* **Parallel-Safe Account State:** Fixed account pool, one per worker — logged in once (fixture setup) and cleaned up per test (fixture teardown), so workers never collide.
* **Cross-Platform Emulation:** Built-in configuration for testing across desktop browsers and mobile viewports.
* **Automated CI/CD:** Ready-to-use GitHub Actions for continuous integration and automated test execution.

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **npm**

### Installation
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```
3.  **Set up `.env`** (copy `.env.example`): `TEST_ACCOUNT_PASSWORD` must match the password of the fixed pool in `config/testAccounts.ts` (`qa_worker_01/02/03`). Each worker logs into one of these accounts once and reuses that session; `workers` in `playwright.config.ts` is capped to the pool size (3) so workers never share an account.

### Execution
* **Run all tests:** `npm run test`
* **Run UI tests:** `npm run test:ui`
* **Run API tests:** `npm run test:api`
* **Mobile Chrome:** `npm run test:mobile`
* **Smoke tests:** `npm run test:smoketest`

## Reporting
The framework generates detailed execution reports to facilitate debugging and quality assessment:
* **HTML Report:** `npx playwright show-report`

## Future Roadmap
* **Performance:** Integrate load testing using k6 or Playwright timing.
* **Mobile:** Expand to native app testing via Appium integration.
