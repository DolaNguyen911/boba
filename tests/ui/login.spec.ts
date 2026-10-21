import { test, expect } from '../../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logs in with valid credentials @smoke', async ({ page, loginPage, testUser }) => {
    await loginPage.open();
    const alertText = await loginPage.login(testUser.username, testUser.password);

    expect(alertText).toBeNull();
    await loginPage.expectLoggedInAs(testUser.username);
    await expect(page.locator('#login2')).toBeHidden();
    await expect(page.locator('#logout2')).toBeVisible();
  });

  test('rejects a wrong password @negative', async ({ loginPage, testUser }) => {
    await loginPage.open();
    const alertText = await loginPage.login(testUser.username, 'not-the-real-password');

    expect(alertText).toBe('Wrong password.');
  });

  test('rejects a username that was never registered @negative', async ({ loginPage }) => {
    await loginPage.open();
    const alertText = await loginPage.login(`ghost_${Date.now()}`, 'whatever123');

    expect(alertText).toBe('User does not exist.');
  });

  test('blocks submit with an empty username @edge', async ({ loginPage }) => {
    await loginPage.open();
    const alertText = await loginPage.login('', 'whatever123');

    expect(alertText).toBe('Please fill out Username and Password.');
  });

  test('blocks submit with an empty password @edge', async ({ loginPage, testUser }) => {
    await loginPage.open();
    const alertText = await loginPage.login(testUser.username, '');

    expect(alertText).toBe('Please fill out Username and Password.');
  });

  test('stays logged in after a page reload @edge', async ({ page, loginPage, testUser }) => {
    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);
    await loginPage.expectLoggedInAs(testUser.username);

    await page.reload();

    await loginPage.expectLoggedInAs(testUser.username);
  });
});
