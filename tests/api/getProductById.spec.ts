import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import getProductByIdResponseSchema from './testData/schemas/getProductByIdResponseSchema.json';

test.describe('API Tests', () => {
    const baseUrl = process.env.API_URL || 'https://api.demoblaze.com';

    test('[TC_API_02] POST /view - should return single product matching schema', {tag: ['@smoke']}, async ({ request }) => {
        const response = await request.post(`${baseUrl}/view`, { data: { id: '1' } });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toMatchObject({ id: 1, title: 'Samsung galaxy s6', price: 360 });

        const ajv = new Ajv();
        const validate = ajv.compile(getProductByIdResponseSchema);
        const valid = validate(responseBody);
        if (!valid) {
            console.error('Schema Errors:', validate.errors);
        }
        expect(valid, 'Response JSON should match the schema').toBe(true);
    });

    // well-formed id, just not one that exists
    test('[TC_API_03] POST /view - should return an error for a non-existent product id', async ({ request }) => {
        const response = await request.post(`${baseUrl}/view`, { data: { id: '999999' } });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual({ errorMessage: 'Not found.' });
    });
});
