import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import getAllProductsResponseSchema from './testData/schemas/getAllProductsResponseSchema.json';

test.describe('API Tests', () => {
    const baseUrl = process.env.API_URL || 'https://api.demoblaze.com';

    test('GET /entries - should return list of products successfully', {tag: ['@smoke']}, async ({ request }) => {
        // API Action: Send GET request to /entries
        const response = await request.get(`${baseUrl}/entries`);

        // Verification: Check status code
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Verification: Validate response body
        const responseBody = await response.json();
        expect(responseBody.Items.length).toBeGreaterThan(0);

        // Verification: Validate JSON Schema
        const ajv = new Ajv();
        const validate = ajv.compile(getAllProductsResponseSchema);
        const valid = validate(responseBody);
        if (!valid) {
            console.error('Schema Errors:', validate.errors);
        }
        expect(valid, 'Response JSON should match the schema').toBe(true);
    });
});
