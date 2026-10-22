import { test, expect } from '@playwright/test';

test.describe('API - products', () => {
  test('entries returns the product catalog with the expected shape @api @regression', async ({
    request,
  }) => {
    const res = await request.get('/entries');

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(Array.isArray(body.Items)).toBe(true);
    expect(body.Items.length).toBeGreaterThan(0);

    for (const item of body.Items) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(typeof item.price).toBe('number');
    }
  });
});
