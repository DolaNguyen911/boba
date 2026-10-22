import { Page, Locator } from '@playwright/test';
import { captureDialog } from '../shared/dialog';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.name');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
  }

  async openProductFromHome(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
    await this.productName.waitFor({ state: 'visible' });
  }

  /** Returns the alert text shown after the add-to-cart call resolves. */
  async addToCart(): Promise<string | null> {
    return captureDialog(this.page, async () => {
      await this.addToCartButton.click();
    });
  }
}
