// api/report-error.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const Payload = z.object({
  message: z.string().min(1).max(10_000),
  stack: z.string().max(50_000).optional(),
  meta: z
    .object({
      url: z.string().url().optional(),
      userAgent: z.string().optional(),
      context: z.string().max(200).optional(),
      env: z.enum(['dev', 'prod']).optional(),
      extra: z.record(z.any()).optional(),
    })
    .optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const parse = Payload.safeParse(req.body ?? {});
  if (!parse.success) {
    console.warn('report-error: invalid payload', parse.error.flatten());
    return res.status(400).json({ ok: false });
  }

  const ua = (req.headers['user-agent'] as string | undefined) ?? parse.data.meta?.userAgent;
  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
    (req.socket?.remoteAddress ?? 'n/a');

  const event = {
    ts: new Date().toISOString(),
    ip,
    ua,
    message: parse.data.message.slice(0, 10_000),
    stack: parse.data.stack?.slice(0, 50_000),
    meta: {
      ...parse.data.meta,
      // подстрахуемся от больших объектов
      extra: parse.data.meta?.extra ? JSON.parse(JSON.stringify(parse.data.meta.extra)).slice?.(0, 0) ?? parse.data.meta.extra : undefined,
    },
  };

  // Пишем в лог (дальше можно будет слать в Sentry/PostHog)
  console.error('FE_ERROR', JSON.stringify(event));

  // Ничего не раскрываем наружу
  return res.status(204).end();
}
