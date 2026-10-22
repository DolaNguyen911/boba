import {Page, Locator} from '@playwright/test';
import { BasePage } from './base.page';
import { format } from '../utils/stringUtils';

export class CartPage extends BasePage {
    static readonly PRODUCT_INFORMATION = '//tbody/tr[%s]/td[count(//thead//th[.="%s"]//preceding-sibling::th) + 1]'

    //Admin Search elements
    productTable: Locator = this.page.locator('//table');
    placeOrderButton: Locator = this.page.locator('//button[.="Place Order"]');
    productList: Locator = this.page.locator('//tbody/tr');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.productTable);
    }

    /**
     * Get text content of a specific table cell.
     * @param index - The zero-based row index.
     * @param columnName - The header name of the column.
     * @returns The text of the target cell.
     */
    async getProductInfoOnRowByIndexAndColumn(index: number, columnName: string): Promise<string> {
        return await this.page.locator(format(CartPage.PRODUCT_INFORMATION, index + 1, columnName)).innerText();
    }

    /**
     * Cart row order is not guaranteed to match insertion order and can shift between
     * reads, so rows are targeted by product title rather than by index.
     */
    getRowByTitle(title: string): Locator {
        return this.productList.filter({ hasText: title });
    }

    async deleteProductByTitle(title: string): Promise<void> {
        await this.getRowByTitle(title).locator('a', { hasText: 'Delete' }).click();
    }
}

export class PlaceOrderModal extends BasePage {
    static readonly ORDER_INFORMATION_INPUT = 'input[id="%s"]'

    //Modal elements
    modalTitle: Locator = this.page.locator('//h5[.="Place order"]');
    purchaseButton: Locator = this.page.locator('//button[.="Purchase"]');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.modalTitle);
    }
    
    async fillOrderInfoAndPurchase(
        name: string, 
        country: string, 
        city: string, 
        creditCard: string, 
        month: string, 
        year: string
    ): Promise<void> {
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "name")).fill(name);
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "country")).fill(country);
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "city")).fill(city);
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "card")).fill(creditCard);
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "month")).fill(month);
        await this.page.locator(format(PlaceOrderModal.ORDER_INFORMATION_INPUT, "year")).fill(year);
        await this.purchaseButton.click();
    }
}

export class PurchaseSuccessfulModal extends BasePage {
    //Modal elements
    modalTitle: Locator = this.page.locator('//h2[.="Thank you for your purchase!"]');
    okButton: Locator = this.page.locator('//button[.="OK"]');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.modalTitle);
    }
}
