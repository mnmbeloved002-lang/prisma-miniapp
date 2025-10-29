export async function reportError(err: unknown) {
  try {
    const payload = {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      url: location.href,
      ua: navigator.userAgent,
      ts: new Date().toISOString(),
    };
    await fetch('/api/report-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch { /* глушим, чтобы не мешать UX */ }
}
