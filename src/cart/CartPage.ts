import { Page, Locator } from '@playwright/test';
import { captureDialog } from '../shared/dialog';

export interface OrderDetails {
  name: string;
  country?: string;
  city?: string;
  card: string;
  month?: string;
  year?: string;
}

export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly total: Locator;
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('#tbodyid tr');
    this.total = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.orderModal = page.locator('#orderModal');
    this.purchaseButton = this.orderModal.getByRole('button', { name: 'Purchase' });
  }

  async goto() {
    await this.page.goto('/cart.html');
    // #totalp is only populated once the cart fetch resolves.
    await this.page.waitForFunction(() => document.querySelector('#totalp')?.textContent !== '');
  }

  async getItemNames(): Promise<string[]> {
    return this.rows.locator('td:nth-child(2)').allTextContents();
  }

  async deleteItem(name: string) {
    const row = this.rows.filter({ hasText: name });
    await row.getByRole('link', { name: 'Delete' }).click();
    await row.waitFor({ state: 'detached' });
  }

  async openPlaceOrder() {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
  }

  /** Returns the alert text if validation fails, or null if the purchase confirmation appeared. */
  async submitOrder(details: OrderDetails): Promise<string | null> {
    await this.orderModal.locator('#name').fill(details.name);
    await this.orderModal.locator('#country').fill(details.country ?? '');
    await this.orderModal.locator('#city').fill(details.city ?? '');
    await this.orderModal.locator('#card').fill(details.card);
    await this.orderModal.locator('#month').fill(details.month ?? '');
    await this.orderModal.locator('#year').fill(details.year ?? '');

    return captureDialog(this.page, async () => {
      await this.purchaseButton.click();
    });
  }

  confirmationDialog() {
    return this.page.locator('.sweet-alert');
  }
}
