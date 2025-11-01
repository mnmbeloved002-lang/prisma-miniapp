import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const BodySchema = z.object({
  message: z.string().min(1),
  stack: z.string().optional(),
  context: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  url: z.string().url().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const data = BodySchema.parse(body);

    // здесь можем логировать в консоль/провайдер — пока просто no-op
    console.error('[report-error]', {
      message: data.message,
      stack: data.stack,
      context: data.context,
      userAgent: data.userAgent ?? req.headers['user-agent'],
      url: data.url,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, error: 'Invalid body', issues: err.issues });
    }
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
}
