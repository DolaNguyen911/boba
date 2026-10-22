import { Page, Dialog } from '@playwright/test';

// demoblaze reports errors via native alert() and nothing on success. Some alerts
// fire synchronously inside the click (would deadlock if we awaited the click first),
// others only after an async ajax call - the handler below covers both.
export async function captureDialog(
  page: Page,
  action: () => Promise<void>,
  timeout = 6000,
): Promise<string | null> {
  let resolveMessage: (message: string | null) => void;
  const messagePromise = new Promise<string | null>((resolve) => {
    resolveMessage = resolve;
  });

  const handler = async (dialog: Dialog) => {
    const message = dialog.message();
    await dialog.accept();
    resolveMessage(message);
  };
  page.once('dialog', handler);

  await action();

  const timer = setTimeout(() => resolveMessage(null), timeout);
  const result = await messagePromise;
  clearTimeout(timer);
  page.off('dialog', handler);

  return result;
}
