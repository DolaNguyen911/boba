import { Locator, Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    static readonly ELEMENT_WAITING_TIMEOUT = 30000;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForElementVisible(
        elementIdentifier: string | Locator, 
        timeout: number = BasePage.ELEMENT_WAITING_TIMEOUT
    ): Promise<void> {
        /**
         * elementIdentifier: can be selector or locator
         */
        if (typeof elementIdentifier === 'string') {
        await this.page.waitForSelector(elementIdentifier, { state: 'visible', timeout });
        } 
        else {
        await elementIdentifier.waitFor({ state: 'visible', timeout });
        }
    }

    async isElementDisplayed(
        elementIdentifier: string | Locator, 
        timeout: number = BasePage.ELEMENT_WAITING_TIMEOUT
    ): Promise<boolean> {
        /**
         * Check if element detected by elementIdentifier can be displayed in given timeout or not
         * elementIdentifier: can be selector or locator
         * timeout: timeout
         * return boolean
         */
        try {
        await this.waitForElementVisible(elementIdentifier, timeout);
        return true;
        } 
        catch (error) {
        if (error instanceof Error && error.name === 'TimeoutError') {
            return false;
        }
        throw error;
        }
    }
}
