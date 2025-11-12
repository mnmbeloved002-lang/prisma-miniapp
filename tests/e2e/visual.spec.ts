import { test, expect } from '@playwright/test';

async function harden(page) {
  // Убираем анимации/мигания, чтобы скриншоты были детерминированными
  await page.addInitScript(() => {
    // фикс времени
    const fixed = new Date('2024-01-01T00:00:00.000Z').getTime();
    const _Date = Date;
    // @ts-ignore
    globalThis.Date = class extends _Date {
      constructor(...args) { return args.length ? new _Date(...args) : new _Date(fixed); }
      static now() { return fixed; }
    };
  });
  await page.addStyleTag({ content: `
    *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  `});
}

test('home — desktop baseline', async ({ page }) => {
  await harden(page);
  await page.goto('/');
  await expect(page).toHaveScreenshot('home-desktop.png', { fullPage: true });
});

test('home — mobile baseline', async ({ page }) => {
  await harden(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page).toHaveScreenshot('home-mobile.png', { fullPage: true });
});
