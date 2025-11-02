
import { z } from 'zod';

const BodySchema = z.object({
  message: z.string().min(1),
  stack: z.string().optional(),
  context: z.record(z.any()).optional(),
  userAgent: z.string().optional(),
  url: z.string().url().optional(),
});

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const data = BodySchema.parse(body);

    console.error('[report-error]', {
      message: data.message,
      stack: data.stack,
      context: data.context,
      userAgent: data.userAgent ?? req.headers?.['user-agent'],
      url: data.url,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (err: any) {
    if (err?.issues) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'Invalid body', issues: err.issues }));
      return;
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Internal Server Error' }));
  }
}
