import { test, expect } from '../shared/fixtures';

const PRODUCT_NAME = 'Samsung galaxy s6';

test.describe('Cart', () => {
  test('logs in, adds a product to the cart, and places an order @smoke', async ({
    page,
    loginPage,
    productPage,
    cartPage,
    testUser,
  }) => {
    await page.goto('/');
    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);
    await loginPage.expectLoggedInAs(testUser.username);

    await productPage.openProductFromHome(PRODUCT_NAME);
    const addAlert = await productPage.addToCart();
    expect(addAlert).toBe('Product added.');

    await cartPage.goto();
    await expect(cartPage.getItemNames()).resolves.toContain(PRODUCT_NAME);

    await cartPage.openPlaceOrder();
    const orderAlert = await cartPage.submitOrder({
      name: testUser.username,
      card: '4111111111111111',
    });

    expect(orderAlert).toBeNull();
    await expect(cartPage.confirmationDialog()).toContainText('Thank you for your purchase');
  });

  test('a guest can add to cart without logging in @edge', async ({ page, productPage, cartPage }) => {
    await page.goto('/');
    await productPage.openProductFromHome(PRODUCT_NAME);

    const addAlert = await productPage.addToCart();
    expect(addAlert).toBe('Product added');

    await cartPage.goto();
    await expect(cartPage.getItemNames()).resolves.toContain(PRODUCT_NAME);
  });

  test('rejects placing an order with no name and no card @negative', async ({
    page,
    productPage,
    cartPage,
  }) => {
    await page.goto('/');
    await productPage.openProductFromHome(PRODUCT_NAME);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.openPlaceOrder();
    const orderAlert = await cartPage.submitOrder({ name: '', card: '' });

    expect(orderAlert).toBe('Please fill out Name and Creditcard.');
  });

  test('removes an item from the cart @functional', async ({ page, productPage, cartPage }) => {
    await page.goto('/');
    await productPage.openProductFromHome(PRODUCT_NAME);
    await productPage.addToCart();

    await cartPage.goto();
    await cartPage.deleteItem(PRODUCT_NAME);

    await expect(cartPage.getItemNames()).resolves.not.toContain(PRODUCT_NAME);
  });
});
