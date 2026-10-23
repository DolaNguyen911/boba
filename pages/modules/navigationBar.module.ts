import { Locator, Page } from "@playwright/test";

export class NavigationBarModule {
    readonly page: Page;
    private readonly nav: Locator;

    constructor(page: Page) {
        this.page = page;
        // nav id differs per page, but there's always exactly one <nav>
        this.nav = page.locator('nav');
    }

    private menuItem(name: string): Locator {
        return this.nav.getByRole('link', { name });
    }

    async selectMenuItem(menuItem: string): Promise<void> {
        await this.menuItem(menuItem).click();
    }

    menuItemLocator(menuItem: string): Locator {
        return this.menuItem(menuItem);
    }
}
