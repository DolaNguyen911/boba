import { test, expect } from '../fixtures';
import { buildOrderInfo } from '../testData/orderData';

test.describe('Purchase Order Tests', () => {
    test('[TC_CART_01] User can place order successfully', { tag: ['@smoke'] }, async ({
        page,
        loggedInHomePage,
        productDetailPage,
        cartPage,
        placeOrderModal,
        purchaseSuccessfulModal,
    }) => {
        const { title, price } = await loggedInHomePage.getProductInfomationByIndex(0);
        await loggedInHomePage.clickOnProductByIndex(0);

        await expect(productDetailPage.productTitle).toHaveText(title);
        await expect(productDetailPage.productPrice).toContainText(price);
        const [addedDialog] = await Promise.all([
            page.waitForEvent('dialog'),
            productDetailPage.addToCartButton.click(),
        ]);
        expect(addedDialog.message()).toContain('Product added');
        await addedDialog.accept();

        // cart can briefly read back empty right after the dialog, so retry the nav
        await expect(async () => {
            await productDetailPage.navigationBar.selectMenuItem('Cart');
            await expect(cartPage.productList).toHaveCount(1);
        }).toPass({ timeout: 15_000 });

        await expect(cartPage.productTable).toBeVisible();
        await expect(cartPage.cellLocator(0, 'Title')).toHaveText(title);
        await expect(cartPage.cellLocator(0, 'Price')).toHaveText(price.replace('$', ''));
        await cartPage.placeOrderButton.click();

        await expect(placeOrderModal.modalTitle).toBeVisible();
        const orderInfo = buildOrderInfo();
        await placeOrderModal.fillOrderInfoAndPurchase(
            orderInfo.name,
            orderInfo.country,
            orderInfo.city,
            orderInfo.creditCard,
            orderInfo.month,
            orderInfo.year
        );

        await expect(purchaseSuccessfulModal.modalTitle).toBeVisible();
        await purchaseSuccessfulModal.okButton.click();
        await expect(purchaseSuccessfulModal.modalTitle).toBeHidden();

        // purchase clears the cart server-side but the page doesn't live-update
        await page.reload();
        await expect(cartPage.productList).toHaveCount(0);
    });
});
