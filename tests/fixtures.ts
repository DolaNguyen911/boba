import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductDetailPage } from '../pages/productDetail.page';
import { CartPage, PlaceOrderModal, PurchaseSuccessfulModal } from '../pages/cart.page';
import { LoginModal } from '../pages/modals';

type TestUser = { username: string; password: string };

type Fixtures = {
    homePage: HomePage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    placeOrderModal: PlaceOrderModal;
    purchaseSuccessfulModal: PurchaseSuccessfulModal;
    loginModal: LoginModal;
    testUser: TestUser;
    loggedInHomePage: HomePage;
};

export const test = base.extend<Fixtures>({
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

    // a shared account collides across parallel workers, so each test gets its own
    testUser: async ({ request }, use) => {
        const username = `qa_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const password = 'Test@1234';
        const apiUrl = process.env.API_URL || 'https://api.demoblaze.com';
        // UI base64-encodes the password before signup/login, so match that here
        await request.post(`${apiUrl}/signup`, {
            data: { username, password: Buffer.from(password).toString('base64') },
        });
        await use({ username, password });
    },

    loggedInHomePage: async ({ page, testUser, loginModal }, use) => {
        await page.goto('/');
        const homePage = new HomePage(page);
        await homePage.navigationBar.selectMenuItem('Log in');
        await loginModal.login(testUser.username, testUser.password);
        await expect(homePage.navigationBar.menuItemLocator(`Welcome ${testUser.username}`)).toBeVisible();
        await use(homePage);
    },
});

export { expect };
