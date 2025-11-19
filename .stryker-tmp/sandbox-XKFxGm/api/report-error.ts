// @ts-nocheck
// api/report-error.ts
type ReportPayload = {
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  extra?: Record<string, unknown>;
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const data = (isPlainObject(body) ? body : {}) as Partial<ReportPayload>;
  if (typeof data.message !== 'string' || data.message.trim().length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'message_required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const payload: ReportPayload = {
    message: data.message,
    stack: typeof data.stack === 'string' ? data.stack : undefined,
    userAgent: typeof data.userAgent === 'string' ? data.userAgent : undefined,
    url: typeof data.url === 'string' ? data.url : undefined,
    extra: isPlainObject(data.extra) ? data.extra : undefined,
  };

  // здесь можно писать в лог/метрику/бэкенд
  // console.error('[client-error]', payload);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

// Для совместимости с некоторых роутерами:
export const runtime = 'edge'; // убери/измени при необходимости
