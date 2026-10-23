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

export class PlaceOrderModal {
    readonly page: Page;

    modalTitle: Locator;
    purchaseButton: Locator;
    nameInput: Locator;
    countryInput: Locator;
    cityInput: Locator;
    cardInput: Locator;
    monthInput: Locator;
    yearInput: Locator;

    constructor(page: Page) {
        this.page = page;
        const modal = page.locator('#orderModal');
        this.modalTitle = modal.getByRole('heading', { name: 'Place order' });
        this.purchaseButton = modal.getByRole('button', { name: 'Purchase' });
        this.nameInput = page.locator('#name');
        this.countryInput = page.locator('#country');
        this.cityInput = page.locator('#city');
        this.cardInput = page.locator('#card');
        this.monthInput = page.locator('#month');
        this.yearInput = page.locator('#year');
    }

    async fillOrderInfoAndPurchase(
        name: string,
        country: string,
        city: string,
        creditCard: string,
        month: string,
        year: string
    ): Promise<void> {
        await this.nameInput.fill(name);
        await this.countryInput.fill(country);
        await this.cityInput.fill(city);
        await this.cardInput.fill(creditCard);
        await this.monthInput.fill(month);
        await this.yearInput.fill(year);
        await this.purchaseButton.click();
    }
}

export class PurchaseSuccessfulModal {
    readonly page: Page;

    modalTitle: Locator;
    okButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalTitle = page.getByRole('heading', { name: 'Thank you for your purchase!' });
        this.okButton = page.getByRole('button', { name: 'OK' });
    }
}
