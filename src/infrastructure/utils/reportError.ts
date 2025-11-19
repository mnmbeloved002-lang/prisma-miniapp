// src/utils/reportError.ts
export async function reportError(err: unknown, meta: Record<string, unknown> = {}) {
  const safeMeta = meta && typeof meta === 'object' ? meta : {};

  const payload = {
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    meta: safeMeta, // <= гарантируем наличие поля meta
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof location !== 'undefined' ? location.href : undefined,
  };

  try {
    await fetch('/api/report-error', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // не роняем клиент из-за телеметрии
  }
}
