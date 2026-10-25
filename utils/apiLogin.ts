import { APIRequestContext } from '@playwright/test';

// the site base64-encodes the password client-side before calling /login, so match that
export async function loginViaApi(request: APIRequestContext, apiUrl: string, username: string, password: string): Promise<string> {
    const response = await request.post(`${apiUrl}/login`, {
        data: { username, password: Buffer.from(password).toString('base64') },
    });
    const text = (await response.text()).trim();
    const match = text.match(/Auth_token:\s*([^"]+)/);
    if (!match) {
        throw new Error(`Login failed for ${username}: ${text}`);
    }
    return match[1].trim();
}
