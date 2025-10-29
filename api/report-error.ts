export const config = { runtime: 'edge' };
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ok: true}), { status: 200, headers: {'Content-Type': 'application/json'}});
  }
  
  const data = await req.json().catch(() => null);
  
  // Логируем ошибку. Vercel Console будет содержать полный стектрейс.
  console.error('[CLIENT_ERROR]', JSON.stringify(data));
  
  return new Response(JSON.stringify({ok: true}), { headers: {'Content-Type': 'application/json'}});
};
