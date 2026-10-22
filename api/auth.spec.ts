import { test, expect } from '@playwright/test';

// The site base64-encodes the password client-side before sending it, but the API
// itself just stores and compares whatever string it's given, so plain strings here
// are enough to exercise the contract.
const PASSWORD = 'Test1234!';

test.describe('API - auth', () => {
  test('signup creates a new user @api', async ({ request }) => {
    const username = `api_${Date.now()}`;
    const res = await request.post('/signup', { data: { username, password: PASSWORD } });

    expect(res.ok()).toBeTruthy();
    expect((await res.text()).trim()).toBe('""');
  });

  test('signup rejects a username that already exists @api @negative', async ({ request }) => {
    const username = `api_dup_${Date.now()}`;
    await request.post('/signup', { data: { username, password: PASSWORD } });

    const res = await request.post('/signup', { data: { username, password: PASSWORD } });
    const body = await res.json();

    expect(body.errorMessage).toBe('This user already exist.');
  });

  test('login succeeds and returns an auth token @api', async ({ request }) => {
    const username = `api_login_${Date.now()}`;
    await request.post('/signup', { data: { username, password: PASSWORD } });

    const res = await request.post('/login', { data: { username, password: PASSWORD } });
    const body = await res.text();

    expect(body).toContain('Auth_token:');
  });

  test('login fails with the wrong password @api @negative', async ({ request }) => {
    const username = `api_wrongpw_${Date.now()}`;
    await request.post('/signup', { data: { username, password: PASSWORD } });

    const res = await request.post('/login', { data: { username, password: 'not-the-password' } });
    const body = await res.json();

    expect(body.errorMessage).toBe('Wrong password.');
  });

  test('login fails for a username that was never registered @api @negative', async ({ request }) => {
    const res = await request.post('/login', {
      data: { username: `ghost_${Date.now()}`, password: PASSWORD },
    });
    const body = await res.json();

    expect(body.errorMessage).toBe('User does not exist.');
  });
});
