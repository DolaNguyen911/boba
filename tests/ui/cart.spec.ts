import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { baseConfig } from '../../config/baseConfig';
import { ProductDetailPage } from '../../pages/productDetail.page';
import { CartPage } from '../../pages/cart.page';

test.describe('Cart Management Tests', () => {
    let homePage: HomePage;
    test.beforeEach(async ({ page }) => {
        await page.goto(baseConfig.serverUrl);
        homePage = new HomePage(page);
        expect(await homePage.is_loaded()).toBeTruthy();
    });

    test('User can add multiple products to cart and delete a specific one', {tag: ['@smoke']}, async ({ page }) => {
        // Home Page: Capture info for the first two products
        const firstProduct = await homePage.getProductInfomationByIndex(0);
        const secondProduct = await homePage.getProductInfomationByIndex(1);

        // Add first product to cart
        await homePage.clickOnProductByIndex(0);
        const productDetailPage = new ProductDetailPage(page);
        expect(await productDetailPage.is_loaded()).toBeTruthy();
        const [firstDialog] = await Promise.all([
            page.waitForEvent('dialog'),
            productDetailPage.addToCartButton.click(),
        ]);
        expect(firstDialog.message()).toContain('Product added');
        await firstDialog.accept();
        await productDetailPage.navigationBar.selectMenuItem("Home");

        // Add second product to cart
        expect(await homePage.is_loaded()).toBeTruthy();
        await homePage.clickOnProductByIndex(1);
        expect(await productDetailPage.is_loaded()).toBeTruthy();
        const [secondDialog] = await Promise.all([
            page.waitForEvent('dialog'),
            productDetailPage.addToCartButton.click(),
        ]);
        expect(secondDialog.message()).toContain('Product added');
        await secondDialog.accept();

        // Cart Page: Verify both products were added (cart row order is not guaranteed)
        await productDetailPage.navigationBar.selectMenuItem("Cart");
        const cartPage = new CartPage(page);
        expect(await cartPage.is_loaded()).toBeTruthy();
        await expect(cartPage.productList).toHaveCount(2);
        await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(1);
        await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);

        // Delete the first product and verify only the second one remains
        await cartPage.deleteProductByTitle(firstProduct.title);
        await expect(cartPage.productList).toHaveCount(1);
        await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(0);
        await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);
    });
});
