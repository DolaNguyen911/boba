import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { baseConfig } from '../../config/baseConfig';
import { ProductDetailPage } from '../../pages/productDetail.page';
import { CartPage, PlaceOrderModal, PurchaseSuccessfulModal } from '../../pages/cart.page';
import { LoginModal } from '../../pages/modals';

test.describe('Purchase Order Tests', () => {
    let homePage: HomePage;
    const { name, country, city, creditCard, month, year } = baseConfig.orderInformation;
    test.beforeEach(async ({ page }) => {
        await page.goto(baseConfig.serverUrl);
        homePage = new HomePage(page);
        expect(await homePage.is_loaded()).toBeTruthy();

        // Login via Login Modal
        await homePage.navigationBar.selectMenuItem("Log in");
        const loginModal = new LoginModal(page);
        await loginModal.login(baseConfig.userAccount.username, baseConfig.userAccount.password);

        // Verify successful login
        expect(await homePage.navigationBar.isMenuItemDisplayed(`Welcome ${baseConfig.userAccount.username}`)).toBeTruthy();
    });

    test('User can place order successfully', {tag: ['@smoke']}, async ({ page }) => {
        // Home Page: Capture product info and navigate to details
        const { title, price } = await homePage.getProductInfomationByIndex(0);
        await homePage.clickOnProductByIndex(0);

        // Product Detail Page: Validate info and add to cart
        const productDetailPage = new ProductDetailPage(page);
        expect(await productDetailPage.is_loaded()).toBeTruthy();
        // Validate product info and add to cart
        await expect(productDetailPage.productTitle).toHaveText(title);
        await expect(productDetailPage.productPrice).toContainText(price);
        // Handle success dialog and navigate to Cart
        const [dialog] = await Promise.all([
            page.waitForEvent('dialog'), 
            productDetailPage.addToCartButton.click(), 
        ]);         
        expect(dialog.message()).toContain('Product added.');
        await dialog.accept();
        await productDetailPage.navigationBar.selectMenuItem("Cart");
        
        // Cart Page: Verify product details and initiate checkout
        const cartPage = new CartPage(page);
        expect(await cartPage.is_loaded()).toBeTruthy();
        expect(await cartPage.getProductInfoOnRowByIndexAndColumn(0, "Title")).toBe(title);
        expect(price).toContain(await cartPage.getProductInfoOnRowByIndexAndColumn(0, "Price"));
        await cartPage.placeOrderButton.click();

        // Place Order Modal: Fill form and submit purchase
        const placeOrderModal = new PlaceOrderModal(page);
        expect(await placeOrderModal.is_loaded()).toBeTruthy();
        
        await placeOrderModal.fillOrderInfoAndPurchase(name, country, city, creditCard, month, year);

        // Purchase Success Modal: Confirm transaction completion
        const purchaseSuccessfulModal = new PurchaseSuccessfulModal(page);
        expect(await purchaseSuccessfulModal.is_loaded()).toBeTruthy();
        await purchaseSuccessfulModal.okButton.click({delay: 1000})

        // Verification: Ensure redirection to Home and Cart is empty
        expect(await homePage.is_loaded()).toBeTruthy();
        await homePage.navigationBar.selectMenuItem("Cart");
        expect(await cartPage.is_loaded()).toBeTruthy();
        await expect(cartPage.productList).toHaveCount(0);
    });
});
