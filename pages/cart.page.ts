import { Page, Locator } from '@playwright/test';

const COLUMN_INDEX: Record<string, number> = {
    Title: 1,
    Price: 2,
};

export class CartPage {
    readonly page: Page;

    productTable: Locator;
    placeOrderButton: Locator;
    productList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTable = page.locator('table');
        this.productList = page.locator('tbody tr');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    }

    cellLocator(index: number, columnName: string): Locator {
        return this.productList.nth(index).locator('td').nth(COLUMN_INDEX[columnName]);
    }

    // row order isn't stable, so match by title instead of index
    getRowByTitle(title: string): Locator {
        return this.productList.filter({ hasText: title });
    }

    async deleteProductByTitle(title: string): Promise<void> {
        await this.getRowByTitle(title).getByRole('link', { name: 'Delete' }).click();
    }
}
