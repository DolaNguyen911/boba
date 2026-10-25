import { test, expect } from '../../fixtures/fixtures';
import { captureDialog } from '../../utils/dialog';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Cart Management Tests', () => {
    test('[TC_CART_02] User can add multiple products to cart as a guest and delete one', { tag: ['@smoke'] }, async ({
        page,
        homePage,
        productDetailPage,
        cartPage,
    }) => {
        const firstProduct = await homePage.getProductInfomationByIndex(0);
        const secondProduct = await homePage.getProductInfomationByIndex(1);

        await test.step('add two products to the cart', async () => {
            await homePage.clickOnProductByIndex(0);
            const firstMessage = await captureDialog(page, () => productDetailPage.addToCartButton.click());
            expect(firstMessage).toContain('Product added');
            await productDetailPage.navigationBar.selectMenuItem('Home');

            await expect(homePage.productList.first()).toBeVisible();
            await homePage.clickOnProductByIndex(1);
            const secondMessage = await captureDialog(page, () => productDetailPage.addToCartButton.click());
            expect(secondMessage).toContain('Product added');
        });

        await test.step('verify both products are in the cart', async () => {
            // add-to-cart reads can lag right after the dialog, so retry the nav itself
            await expect(async () => {
                await productDetailPage.navigationBar.selectMenuItem('Cart');
                await expect(cartPage.productList).toHaveCount(2);
            }).toPass({ timeout: 15_000 });

            await expect(cartPage.productTable).toBeVisible();
            await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(1);
            await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);
        });

        await test.step('delete one product and verify the other remains', async () => {
            await cartPage.deleteProductByTitle(firstProduct.title);
            // the delete link's href="#" causes a transient navigation in webkit, during
            // which the row count can briefly read 0 before settling - give it more room
            await expect(cartPage.productList).toHaveCount(1, { timeout: 20_000 });
            await expect(cartPage.getRowByTitle(firstProduct.title)).toHaveCount(0);
            await expect(cartPage.getRowByTitle(secondProduct.title)).toHaveCount(1);
        });
    });

    test('[TC_CART_03] Cart contents persist after a page reload', { tag: ['@smoke'] }, async ({
        page,
        homePage,
        productDetailPage,
        cartPage,
    }) => {
        const product = await homePage.getProductInfomationByIndex(0);

        await homePage.clickOnProductByIndex(0);
        const message = await captureDialog(page, () => productDetailPage.addToCartButton.click());
        expect(message).toContain('Product added');

        await expect(async () => {
            await productDetailPage.navigationBar.selectMenuItem('Cart');
            await expect(cartPage.productList).toHaveCount(1);
        }).toPass({ timeout: 15_000 });

        await page.reload();
        await expect(cartPage.productList).toHaveCount(1);
        await expect(cartPage.getRowByTitle(product.title)).toHaveCount(1);
    });
});
