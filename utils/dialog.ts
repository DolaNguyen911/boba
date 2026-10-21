import { Page, Dialog } from '@playwright/test';

/**
 * demoblaze reports every login/cart/order error via a native alert() and gives
 * no DOM signal when an action succeeds instead, so callers can't just wait for
 * a selector. Some alerts (empty-field checks) fire synchronously inside the
 * click, which would block `action()` from ever resolving unless the dialog is
 * accepted from within the event handler itself rather than after awaiting it.
 * Others (wrong password, server-side checks) only show up after an async ajax
 * call, so we still need to wait up to `timeout` for those.
 */
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
