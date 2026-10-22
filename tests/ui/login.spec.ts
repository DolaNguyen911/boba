import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { baseConfig } from '../../config/baseConfig';
import { LoginModal } from '../../pages/modals';

test.describe('Login Tests', () => {
    let homePage: HomePage;
    test.beforeEach(async ({ page }) => {
        await page.goto(baseConfig.serverUrl);
        homePage = new HomePage(page);
        expect(await homePage.is_loaded()).toBeTruthy();
    });

    test('User can login with valid credentials successfully', {tag: ['@smoke']}, async ({ page }) => {
        // Prepare test data from configuration
        const { username, password } = baseConfig.userAccount;
        
        // Home Page: Open Login Modal via Navigation Bar
        await homePage.navigationBar.selectMenuItem("Log in");

        // Login Modal: Validate visibility and perform authentication
        const loginModal = new LoginModal(page);
        expect(await loginModal.is_loaded()).toBeTruthy();
        await loginModal.login(username, password);

        // Verification: Confirm user session and UI state change
        expect(await homePage.navigationBar.isMenuItemDisplayed(`Welcome ${username}`)).toBeTruthy();
        expect(await homePage.navigationBar.isMenuItemDisplayed('Log out')).toBeTruthy();
    });

    [
        { scenario: 'Invalid password', username: "ncthanh", password: "Pass123", expectedError: "Wrong password." },
        { scenario: 'User does not exist ', username: "InvalidUser", password: "Pass123", expectedError: "User does not exist." }
    ].forEach(({scenario, username, password, expectedError}) => {
        test(`User cannot login when: ${scenario}`, async ({ page }) => {
            
            // Home Page: Open Login Modal via Navigation Bar
            await homePage.navigationBar.selectMenuItem("Log in");

            // Attempt to login and verify that the Error Alert appears
            const loginModal = new LoginModal(page);
            expect(await loginModal.is_loaded()).toBeTruthy();
            const [dialog] = await Promise.all([
                page.waitForEvent('dialog'),
                loginModal.login(username, password)
            ]);         
            expect(dialog.message()).toContain(expectedError);
            await dialog.accept();
        });
    });
});
