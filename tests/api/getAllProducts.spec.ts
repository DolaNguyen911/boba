import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import getAllProductsResponseSchema from './testData/schemas/getAllProductsResponseSchema.json';

test.describe('API Tests', () => {
    const baseUrl = process.env.API_URL || 'https://api.demoblaze.com';

    test('[TC_API_01] GET /entries - should return list of products successfully', {tag: ['@smoke']}, async ({ request }) => {
        const response = await request.get(`${baseUrl}/entries`);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.Items.length).toBeGreaterThan(0);

        const knownProduct = responseBody.Items.find((item: { id: number }) => item.id === 1);
        expect(knownProduct).toMatchObject({ title: 'Samsung galaxy s6', price: 360, cat: 'phone' });

        const ajv = new Ajv();
        const validate = ajv.compile(getAllProductsResponseSchema);
        const valid = validate(responseBody);
        if (!valid) {
            console.error('Schema Errors:', validate.errors);
        }
        expect(valid, 'Response JSON should match the schema').toBe(true);
    });
});
