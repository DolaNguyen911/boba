import { test, expect } from '../fixtures';

test.describe('Login Tests', () => {
    test('[TC_LOGIN_01] User can login with valid credentials successfully', { tag: ['@smoke'] }, async ({ homePage, loginModal, testUser }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        await loginModal.login(testUser.username, testUser.password);

        await expect(homePage.navigationBar.menuItemLocator(`Welcome ${testUser.username}`)).toBeVisible();
        await expect(homePage.navigationBar.menuItemLocator('Log out')).toBeVisible();
        await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeHidden();
    });

    test('[TC_LOGIN_02] User cannot login with a wrong password', async ({ page, homePage, loginModal, testUser }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        const [dialog] = await Promise.all([
            page.waitForEvent('dialog'),
            loginModal.login(testUser.username, 'wrong-password'),
        ]);
        expect(dialog.message()).toContain('Wrong password.');
        await dialog.accept();
        await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeVisible();
    });

    test('[TC_LOGIN_03] User cannot login with a username that was never registered', async ({ page, homePage, loginModal }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        const unknownUsername = `qa_never_registered_${Date.now()}`;
        const [dialog] = await Promise.all([
            page.waitForEvent('dialog'),
            loginModal.login(unknownUsername, 'any-password'),
        ]);
        expect(dialog.message()).toContain('User does not exist.');
        await dialog.accept();
        await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeVisible();
    });
});
