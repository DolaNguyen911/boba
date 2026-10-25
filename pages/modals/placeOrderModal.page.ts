import { Page, Locator } from '@playwright/test';

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
