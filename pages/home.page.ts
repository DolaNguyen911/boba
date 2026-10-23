import { Page, Locator } from '@playwright/test';
import { NavigationBarModule } from './modules/navigationBar.module';

export class HomePage {
    readonly page: Page;

    navigationBar: NavigationBarModule;

    // #tbodyid is reused on cart.html too, so scope to the card divs (cart rows are <tr>)
    productList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navigationBar = new NavigationBarModule(page);
        this.productList = page.locator('#tbodyid > div');
    }

    private productItem(index: number): Locator {
        return this.productList.nth(index);
    }

    async getProductInfomationByIndex(index: number): Promise<{ title: string; price: string }> {
        const item = this.productItem(index);
        return {
            title: await item.getByRole('heading', { level: 4 }).innerText(),
            price: await item.getByRole('heading', { level: 5 }).innerText(),
        };
    }

    async clickOnProductByIndex(index: number): Promise<void> {
        await this.productItem(index).getByRole('heading', { level: 4 }).getByRole('link').click();
    }
}
