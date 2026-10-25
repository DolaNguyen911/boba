import { test, expect } from '../../fixtures/fixtures';
import { buildOrderInfo } from '../testData/orderData';
import { captureDialog } from '../../utils/dialog';

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

        await test.step('add the product to the cart', async () => {
            await loggedInHomePage.clickOnProductByIndex(0);
            await expect(productDetailPage.productTitle).toHaveText(title);
            await expect(productDetailPage.productPrice).toContainText(price);
            const addedMessage = await captureDialog(page, () => productDetailPage.addToCartButton.click());
            expect(addedMessage).toContain('Product added');
        });

        await test.step('verify the cart and go to checkout', async () => {
            // cart can briefly read back empty right after the dialog, so retry the nav
            await expect(async () => {
                await productDetailPage.navigationBar.selectMenuItem('Cart');
                await expect(cartPage.productList).toHaveCount(1);
            }).toPass({ timeout: 15_000 });

            await expect(cartPage.productTable).toBeVisible();
            await expect(cartPage.cellLocator(0, 'Title')).toHaveText(title);
            await expect(cartPage.cellLocator(0, 'Price')).toHaveText(price.replace('$', ''));
            await cartPage.placeOrderButton.click();
        });

        await test.step('fill order info and purchase', async () => {
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
        });

        await test.step('verify the cart is empty', async () => {
            // purchase clears the cart server-side but the page doesn't live-update
            await page.reload();
            await expect(cartPage.productList).toHaveCount(0);
        });
    });
});
