import { test, expect } from '../fixtures';

test.describe('Cart Management Tests', () => {
    test('[TC_CART_02] User can add multiple products to cart as a guest and delete one', { tag: ['@smoke'] }, async ({
        page,
        homePage,
        productDetailPage,
        cartPage,
    }) => {
        const firstProduct = await homePage.getProductInfomationByIndex(0);
        const secondProduct = await homePage.getProductInfomationByIndex(1);

        await homePage.clickOnProductByIndex(0);
        const [firstDialog] = await Promise.all([
            page.waitForEvent('dialog'),
            productDetailPage.addToCartButton.click(),
        ]);
        expect(firstDialog.message()).toContain('Product added');
        await firstDialog.accept();
        await productDetailPage.navigationBar.selectMenuItem('Home');

        await expect(homePage.productList.first()).toBeVisible();
        await homePage.clickOnProductByIndex(1);
        const [secondDialog] = await Promise.all([
            page.waitForEvent('dialog'),
            productDetailPage.addToCartButton.click(),
        ]);
        expect(secondDialog.message()).toContain('Product added');
        await secondDialog.accept();

        // add-to-cart reads can lag right after the dialog, so retry the nav itself
        await expect(async () => {
            await productDetailPage.navigationBar.selectMenuItem('Cart');
            await expect(cartPage.productList).toHaveCount(2);
        }).toPass({ timeout: 15_000 });

        await expect(cartPage.productTable).toBeVisible();
        await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(1);
        await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);

        await cartPage.deleteProductByTitle(firstProduct.title);
        await expect(cartPage.productList).toHaveCount(1);
        await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(0);
        await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);
    });
});
