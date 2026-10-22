import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginModal extends BasePage {
    //Login elements
    loginHeader: Locator = this.page.locator('//h5[.="Log in"]');
    loginButton: Locator = this.page.locator('//button[.="Log in"]');
    usernameInput: Locator = this.page.locator('#loginusername');
    passwordInput: Locator = this.page.locator('#loginpassword');

    constructor(page: Page) {
        super(page);
    }

    async is_loaded(): Promise<boolean> {
        return await this.isElementDisplayed(this.loginHeader);
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
