import { Page, Locator } from '@playwright/test';
import { captureDialog } from '../shared/dialog';

export class LoginPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loggedInUsername: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#logInModal');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.submitButton = this.modal.getByRole('button', { name: 'Log in' });
    this.loggedInUsername = page.locator('#nameofuser');
  }

  async open() {
    await this.page.locator('#login2').click();
    await this.modal.waitFor({ state: 'visible' });
  }

  /** Returns the alert text if login fails, or null on success. */
  async login(username: string, password: string): Promise<string | null> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    return captureDialog(this.page, async () => {
      await this.submitButton.click();
    });
  }

  async expectLoggedInAs(username: string) {
    await this.loggedInUsername.waitFor({ state: 'visible' });
    const text = await this.loggedInUsername.textContent();
    if (!text?.includes(username)) {
      throw new Error(`Expected nav to show "${username}", got "${text}"`);
    }
  }
}
