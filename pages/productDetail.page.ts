import {Page, Locator} from '@playwright/test';
import { BasePage } from './base.page';
import { NavigationBarModule } from './modules/navigationBar.module';

export class ProductDetailPage extends BasePage {

    // Modules
    navigationBar: NavigationBarModule = new NavigationBarModule(this.page);

    //Element locators
    productTitle: Locator = this.page.locator('h2[class="name"]');
    productPrice: Locator = this.page.locator('h3[class="price-container"]');
    addToCartButton: Locator = this.page.locator('//a[.="Add to cart"]');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.productTitle);
    }
}
