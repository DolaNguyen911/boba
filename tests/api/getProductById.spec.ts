import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import getProductByIdResponseSchema from './testData/schemas/getProductByIdResponseSchema.json';

test.describe('API Tests', () => {
    const baseUrl = process.env.API_URL || 'https://api.demoblaze.com';

    test('POST /view - should return single product matching schema', {tag: ['@smoke']}, async ({ request }) => {
        // API Action: Send POST request to /view with a valid product id
        const response = await request.post(`${baseUrl}/view`, { data: { id: '1' } });

        // Verification: Check status code
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        // Verification: Validate response body
        const responseBody = await response.json();
        expect(responseBody.id).toBe(1);

        // Verification: Validate JSON Schema
        const ajv = new Ajv();
        const validate = ajv.compile(getProductByIdResponseSchema);
        const valid = validate(responseBody);
        if (!valid) {
            console.error('Schema Errors:', validate.errors);
        }
        expect(valid, 'Response JSON should match the schema').toBe(true);
    });
});
