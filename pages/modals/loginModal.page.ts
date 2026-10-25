import { Locator, Page } from '@playwright/test';

export class LoginModal {
    readonly page: Page;

    loginHeader: Locator;
    loginButton: Locator;
    usernameInput: Locator;
    passwordInput: Locator;

    constructor(page: Page) {
        this.page = page;
        const modal = page.locator('#logInModal');
        this.loginHeader = modal.getByRole('heading', { name: 'Log in' });
        this.loginButton = modal.getByRole('button', { name: 'Log in' });
        // no label/testid on these inputs, so plain CSS id it is
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
