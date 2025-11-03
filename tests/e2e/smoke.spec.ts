// tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Phase 1 Smoke Tests', () => {

  test('Application UI renders (Network/JS Check)', async ({ page }) => {

    // Включаем "черный ящик" — логгер сети и ошибок
    const networkLog: string[] = [];

    page.on('request', (req) => {
      networkLog.push(`[REQ] ${req.method()} ${req.url()}`);
    });
    
    page.on('response', (res) => {
      networkLog.push(`[RES] ${res.status()} ${res.url()}`);
    });

    page.on('pageerror', (exception) => {
      networkLog.push(`[PAGE ERROR] ${exception.message}`);
    });
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
         networkLog.push(`[CONSOLE ERROR] ${msg.text()}`);
      }
    });

    try {
      // Загружаем страницу. Теперь мы "видим" все, что она грузит.
      await page.goto('/');

      // Пытаемся дождаться хедера
      const header = page.getByRole('banner');
      await expect(header).toBeVisible({ timeout: 10000 });

    } catch (error) {
      // ЕСЛИ ТЕСТ УПАЛ (по таймауту):
      // Выводим в лог терминала полный сетевой лог.
      console.error('============================================================');
      console.error('E2E FAILED: UI did not render. Dumping network/error log:');
      console.error('============================================================');
      console.error(networkLog.join('\n'));
      console.error('============================================================');
      
      // Пробрасываем оригинальную ошибку
      throw error;
    }
  });

  // ... (остальные тесты 'prod has security headers' и 'sourcemaps are hidden' остаются как есть)

  test('prod has security headers', async ({ request }) => {
    const res = await request.get('/');
    const h = res.headers();
    expect(h['content-security-policy']).toBeTruthy();
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
  });

  test('sourcemaps are hidden (404)', async ({ request }) => {
    const jsRes = await request.get('/assets/index-12345.js.map');
    expect([404, 403]).toContain(jsRes.status());
    
    const cssRes = await request.get('/assets/index-12345.css.map');
    expect([404, 403]).toContain(cssRes.status());
  });
});
