import { expect, test } from '@playwright/test';

test.describe('Telegram Mini App Smoke Tests', () => {
  test('Application UI renders in Telegram-like environment', async ({ page, isMobile }) => {
    const networkLog: string[] = [];

    // Логирование для дебага
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
      // ✅ Эмулируем Telegram WebView окружение
      await page.addInitScript(() => {
        // Мокаем Telegram WebApp API если его нет
        if (typeof window.Telegram === 'undefined') {
          type TelegramWebApp = {
            WebApp: {
              ready: () => void;
              expand: () => void;
              MainButton: {
                show: () => void;
                hide: () => void;
                onClick: (cb: () => void) => void;
                offClick: (cb: () => void) => void;
              };
            };
          };

          (window as typeof window & { Telegram: TelegramWebApp }).Telegram = {
            WebApp: {
              ready: () => {},
              expand: () => {},
              MainButton: {
                show: () => {},
                hide: () => {},
                onClick: (_cb: () => void) => {},
                offClick: (_cb: () => void) => {},
              },
            },
          };
        }
      });

      // Загружаем страницу
      await page.goto('/');

      // ✅ Адаптивная проверка для mobile/desktop
      if (isMobile) {
        // Для мобильных: проверяем адаптивность
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThanOrEqual(428); // Pixel 5 width

        // Проверяем, что контент не выходит за границы
        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.clientWidth);

        if (viewport?.width !== undefined) {
          expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
        }
      }

      // ✅ Универсальная проверка контента
      const visibleContent = await page.locator('body').textContent();
      expect(visibleContent?.length).toBeGreaterThan(10);

      // ✅ Проверяем, что нет горизонтального скролла
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    } catch (error) {
      console.error('============================================================');
      console.error('Telegram Mini App E2E FAILED:');
      console.error('============================================================');
      console.error(networkLog.join('\n'));
      console.error('============================================================');
      throw error;
    }
  });

  // ✅ Только для мобильных устройств
  test('Mobile-friendly touch targets', async ({ page, isMobile }) => {
    // Пропускаем тест на десктопе
    test.skip(!isMobile, 'This test is for mobile devices only');

    await page.goto('/');

    // Проверяем, что кликабельные элементы достаточно большие для touch
    const buttons = page.locator('button, [onclick], a[href]');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        // Минимальный размер для touch согласно guidelines
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

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
