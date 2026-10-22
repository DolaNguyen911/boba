import {Page, Locator} from '@playwright/test';
import { BasePage } from './base.page';
import { NavigationBarModule } from './modules/navigationBar.module';

export class HomePage extends BasePage {
    static readonly PRODUCT_TITLE = '//h4[@class="card-title"]';
    static readonly PRODUCT_PRICE = "//h5";

    // Modules
    navigationBar: NavigationBarModule = new NavigationBarModule(this.page);

    //Element locators
    productTable: Locator = this.page.locator('#tbodyid');
    productList: Locator = this.page.locator('#tbodyid > div');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.productTable);
    }

    async getProductInfomationByIndex(index: number): Promise<{ title: string; price: string }> {
        const productItem =  this.productList.nth(index)
        return {
            title: await productItem.locator(HomePage.PRODUCT_TITLE).innerText(),
            price: await productItem.locator(HomePage.PRODUCT_PRICE).innerText()
        }
    }

    async clickOnProductByIndex(index: number): Promise<void> {
        await this.productList.nth(index).locator(HomePage.PRODUCT_TITLE).click()
    }
    
}
