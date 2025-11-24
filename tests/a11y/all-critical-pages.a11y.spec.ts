import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility Compliance (Ritual AI - Full Cycle)', () => {
  test('State 1: Idle (Home Page Content)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 1. Ждем окончания загрузки (появления заголовка ритуала)
    await expect(page.getByText('Пробуждение Силы')).toBeVisible({
      timeout: 10000,
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('State 2: Interactive (After Action)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 1. Ждем контент (Fix Race Condition)
    await expect(page.getByText('Пробуждение Силы')).toBeVisible({
      timeout: 10000,
    });

    const btn = page.getByRole('button', { name: /Сохранить Ритуал/i });
    await expect(btn).toBeVisible();

    // 2. Эмулируем действие
    await btn.click();

    // 3. Ждем изменения состояния кнопки
    await expect(page.getByRole('button', { name: /Сохранено/i })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });

  test('State 3: Loading State (Transition)', async ({ page }) => {
    // Проверяем доступность самого лоадера (контрастность, aria и т.д.)
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Лоадер висит 500мс, ловим его сразу
    await expect(page.getByText(/Загрузка.../i)).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations).toEqual([]);
  });
});
