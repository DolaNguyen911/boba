import { Page, Locator } from '@playwright/test';
import { NavigationBarModule } from './modules/navigationBar.module';

export class ProductDetailPage {
    readonly page: Page;

    navigationBar: NavigationBarModule;

    productTitle: Locator;
    productPrice: Locator;
    addToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navigationBar = new NavigationBarModule(page);
        this.productTitle = page.getByRole('heading', { level: 2 });
        this.productPrice = page.getByRole('heading', { level: 3 });
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    }
}
