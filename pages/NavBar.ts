import { Page, Locator } from '@playwright/test';

export class NavBar {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly loggedInUsername: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator('#login2');
    this.signupLink = page.locator('#signin2');
    this.logoutLink = page.locator('#logout2');
    this.cartLink = page.locator('#cartur');
    this.loggedInUsername = page.locator('#nameofuser');
  }

  async openLoginModal() {
    await this.loginLink.click();
    await this.page.locator('#logInModal.show').waitFor();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}
