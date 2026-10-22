import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

type TestUser = { username: string; password: string };

type Fixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  testUser: TestUser;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  // No fixed demo account exists, so provision a fresh one per test. Password must be
  // base64-encoded the same way the UI does it, or a later UI login won't match.
  testUser: async ({ request }, use) => {
    const username = `qa_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const password = 'Test1234!';
    const apiUrl = process.env.API_URL || 'https://api.demoblaze.com';
    await request.post(`${apiUrl}/signup`, {
      data: { username, password: Buffer.from(password).toString('base64') },
    });
    await use({ username, password });
  },
});

export { expect };
