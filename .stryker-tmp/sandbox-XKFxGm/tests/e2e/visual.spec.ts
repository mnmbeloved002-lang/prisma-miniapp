// @ts-nocheck
import { expect, test, type Locator, type Page } from '@playwright/test';

// Убираем анимации/мигания, чтобы скриншоты были детерминированными
async function harden(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });
}

// Пытаемся открыть первую новость (ReaderPreview / карточка)
// Стратегия многоступенчатая, чтобы не зависеть от точной верстки
async function openFirstCard(page: Page) {
  const candidates: Locator[] = [
    page.getByTestId('news-card').first(),
    page.getByRole('link').first(),
    page.getByRole('button', { name: /читать|подробнее|read|open/i }).first(),
    page.getByRole('button').first(),
  ];

  for (const locator of candidates) {
    try {
      if (await locator.isVisible()) {
        await locator.click();
        return;
      }
    } catch {
      // игнорируем ошибки локатора и пробуем следующий вариант
    }
  }
}

// Делаем пустое состояние через поиск
async function makeEmptyState(page: Page) {
  const searchCandidates: Locator[] = [
    page.getByRole('textbox', { name: /поиск|search/i }),
    page.getByPlaceholder(/поиск|search/i),
    page.getByRole('textbox').first(),
  ];

  for (const locator of searchCandidates) {
    try {
      if (await locator.isVisible()) {
        await locator.fill('qwertyuiopasdf1234-no-results-expected');
        return;
      }
    } catch {
      // пробуем следующий вариант
    }
  }
}

// Форсируем ошибку загрузки news.json
async function forceError(page: Page) {
  await page.route('**/news.json', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'forced error for visual baseline' }),
    });
  });
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

test('card — desktop baseline', async ({ page }) => {
  await harden(page);
  await page.goto('/');
  await openFirstCard(page);
  await expect(page).toHaveScreenshot('card-desktop.png', { fullPage: true });
});

test('empty — desktop baseline', async ({ page }) => {
  await harden(page);
  await page.goto('/');
  await makeEmptyState(page);
  await expect(page).toHaveScreenshot('empty-desktop.png', { fullPage: true });
});

test('error — desktop baseline', async ({ page }) => {
  await harden(page);
  await forceError(page);
  await page.goto('/');
  await expect(page).toHaveScreenshot('error-desktop.png', { fullPage: true });
});
