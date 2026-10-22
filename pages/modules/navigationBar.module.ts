import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";

export class NavigationBarModule extends BasePage {
    // Common navigation bar elements
    navigationMenuItems: Locator = this.page.locator('a[class*="nav-link"]');

    constructor(page: Page) {
        super(page);
    }

    async selectMenuItem(menuItem: string): Promise<void>{
        await this.navigationMenuItems.filter({hasText: menuItem}).click();
    }

    async isMenuItemDisplayed(menuItem: string): Promise<boolean>{
        return await this.isElementDisplayed(this.navigationMenuItems.filter({hasText: menuItem}));
    }
}
