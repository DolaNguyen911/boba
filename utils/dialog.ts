import { Page } from '@playwright/test';

// some alerts fire synchronously inside the click, which deadlocks Promise.all([waitForEvent, click])
// registering the handler first and not awaiting it alongside the click avoids that
export async function captureDialog(page: Page, action: () => Promise<void>, timeout = 10_000): Promise<string> {
    let resolveMessage: (message: string) => void;
    let rejectMessage: (err: Error) => void;
    const messagePromise = new Promise<string>((resolve, reject) => {
        resolveMessage = resolve;
        rejectMessage = reject;
    });

    const handler = async (dialog: import('@playwright/test').Dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolveMessage(message);
    };
    page.once('dialog', handler);

    const timer = setTimeout(() => rejectMessage(new Error('No dialog appeared in time')), timeout);
    await action();
    const result = await messagePromise;
    clearTimeout(timer);
    return result;
}
