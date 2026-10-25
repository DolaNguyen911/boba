import { Page, Locator } from '@playwright/test';

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
