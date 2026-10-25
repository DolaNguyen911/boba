import { test, expect } from '../../fixtures/fixtures';
import { captureDialog } from '../../utils/dialog';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Tests', () => {
    test('[TC_LOGIN_01] User can login with valid credentials successfully', { tag: ['@smoke'] }, async ({ homePage, loginModal, workerAccount }) => {
        await test.step('open the login modal', async () => {
            await homePage.navigationBar.selectMenuItem('Log in');
            await expect(loginModal.loginHeader).toBeVisible();
        });

        await test.step('log in with valid credentials', async () => {
            await loginModal.login(workerAccount.username, workerAccount.password);
            await expect(homePage.navigationBar.menuItemLocator(`Welcome ${workerAccount.username}`)).toBeVisible();
            await expect(homePage.navigationBar.menuItemLocator('Log out')).toBeVisible();
            await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeHidden();
        });
    });

    test('[TC_LOGIN_02] User cannot login with a wrong password', async ({ page, homePage, loginModal, workerAccount }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        await test.step('submit the wrong password', async () => {
            const message = await captureDialog(page, () => loginModal.login(workerAccount.username, 'wrong-password'));
            expect(message).toContain('Wrong password.');
        });

        await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeVisible();
    });

    test('[TC_LOGIN_03] User cannot login with a username that was never registered', async ({ page, homePage, loginModal }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        await test.step('submit an unregistered username', async () => {
            const unknownUsername = `qa_never_registered_${Date.now()}`;
            const message = await captureDialog(page, () => loginModal.login(unknownUsername, 'any-password'));
            expect(message).toContain('User does not exist.');
        });

        await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeVisible();
    });

    test('[TC_LOGIN_04] Log out returns the nav to its logged-out state', async ({ homePage, loginModal, workerAccount }) => {
        await test.step('log in', async () => {
            await homePage.navigationBar.selectMenuItem('Log in');
            await loginModal.login(workerAccount.username, workerAccount.password);
            await expect(homePage.navigationBar.menuItemLocator(`Welcome ${workerAccount.username}`)).toBeVisible();
        });

        await test.step('log out', async () => {
            await homePage.navigationBar.selectMenuItem('Log out');
            await expect(homePage.navigationBar.menuItemLocator('Log in')).toBeVisible();
            await expect(homePage.navigationBar.menuItemLocator('Log out')).toBeHidden();
            await expect(homePage.navigationBar.menuItemLocator(`Welcome ${workerAccount.username}`)).toBeHidden();
        });
    });

    test('[TC_LOGIN_05] Login with both fields empty', async ({ page, homePage, loginModal }) => {
        await homePage.navigationBar.selectMenuItem('Log in');
        await expect(loginModal.loginHeader).toBeVisible();

        const message = await captureDialog(page, () => loginModal.login('', ''));
        expect(message).toContain('Please fill out Username and Password.');
    });
});
