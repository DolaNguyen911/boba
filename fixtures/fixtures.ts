import { test as base, expect, request as apiRequest } from '@playwright/test';
import path from 'path';
import crypto from 'crypto';
import { HomePage } from '../pages/home.page';
import { ProductDetailPage } from '../pages/productDetail.page';
import { CartPage } from '../pages/cart.page';
import { PlaceOrderModal } from '../pages/modals/placeOrderModal.page';
import { PurchaseSuccessfulModal } from '../pages/modals/purchaseSuccessfulModal.page';
import { LoginModal } from '../pages/modals/loginModal.page';
import { testAccounts } from '../config/testAccounts';
import { loginViaApi } from '../utils/apiLogin';

type Account = { username: string; password: string };

type Fixtures = {
    homePage: HomePage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    placeOrderModal: PlaceOrderModal;
    purchaseSuccessfulModal: PurchaseSuccessfulModal;
    loginModal: LoginModal;
    loggedInHomePage: HomePage;
};

type WorkerFixtures = {
    workerAccount: Account;
    workerAuthFile: string;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
    // each parallel worker claims exactly one account from the fixed pool, no signup
    workerAccount: [async ({}, use, workerInfo) => {
        await use(testAccounts[workerInfo.parallelIndex % testAccounts.length]);
    }, { scope: 'worker' }],

    // one API login per worker; every test's context reuses the saved cookies
    workerAuthFile: [async ({ browser, workerAccount }, use, workerInfo) => {
        const authFile = path.join(__dirname, '..', 'playwright', '.auth', `worker-${workerInfo.parallelIndex}.json`);
        const apiUrl = process.env.API_URL || 'https://api.demoblaze.com';
        const baseUrl = process.env.BASE_URL || 'https://www.demoblaze.com';
        const apiContext = await apiRequest.newContext();
        const token = await loginViaApi(apiContext, apiUrl, workerAccount.username, workerAccount.password);
        await apiContext.dispose();

        const context = await browser.newContext();
        await context.addCookies([
            { name: 'tokenp_', value: token, domain: new URL(baseUrl).hostname, path: '/' },
            { name: 'user', value: crypto.randomUUID(), domain: new URL(baseUrl).hostname, path: '/' },
        ]);
        await context.storageState({ path: authFile });
        await context.close();
        await use(authFile);
    }, { scope: 'worker' }],

    storageState: async ({ workerAuthFile }, use) => {
        await use(workerAuthFile);
    },

    // fixed accounts are reused across runs, so clear any cart left behind by this test
    page: async ({ page }, use) => {
        await use(page);

        const token = (await page.context().cookies()).find((c) => c.name === 'tokenp_')?.value;
        if (!token) return;

        const apiUrl = process.env.API_URL || 'https://api.demoblaze.com';
        const response = await page.request.post(`${apiUrl}/viewcart`, { data: { cookie: token, flag: true } });
        const { Items } = await response.json();
        for (const item of Items ?? []) {
            await page.request.post(`${apiUrl}/deleteitem`, { data: { id: item.id } });
        }
    },

    homePage: async ({ page }, use) => {
        await page.goto('/');
        await use(new HomePage(page));
    },
    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    placeOrderModal: async ({ page }, use) => {
        await use(new PlaceOrderModal(page));
    },
    purchaseSuccessfulModal: async ({ page }, use) => {
        await use(new PurchaseSuccessfulModal(page));
    },
    loginModal: async ({ page }, use) => {
        await use(new LoginModal(page));
    },

    // page already carries the worker's pre-authenticated storageState
    loggedInHomePage: async ({ page, workerAccount }, use) => {
        await page.goto('/');
        const homePage = new HomePage(page);
        await expect(homePage.navigationBar.menuItemLocator(`Welcome ${workerAccount.username}`)).toBeVisible();
        await use(homePage);
    },
});

export { expect };
