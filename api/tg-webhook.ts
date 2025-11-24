import type { VercelRequest, VercelResponse } from "@vercel/node";

// L1.7/L1.8 Webhook Handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
	// Шаг 1: Healthcheck для Vercel/Telegram (Шаг 8.6)
	if (req.method === "GET") {
		return res.status(200).json({ status: "ok", check: "GET" });
	}

	// Шаг 2: Валидация метода
	if (req.method !== "POST") {
		console.warn("[TG-WEBHOOK] Method Not Allowed:", req.method);
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	// Шаг 3: Валидация секрета (Шаг 8.5)
	const expectedSecret = process.env.TG_WEBHOOK_SECRET;
	const providedSecret = req.headers["x-telegram-bot-api-secret-token"];

	if (!expectedSecret || providedSecret !== expectedSecret) {
		console.error("[TG-WEBHOOK] Unauthorized: Invalid Secret");
		// Мы возвращаем 401 (Unauthorized), как и ожидалось в Шаге 8.6
		return res.status(401).json({ error: "Unauthorized" });
	}

	// Шаг 4: (Успех) Секрет верный, логируем тело
	try {
		console.log("[TG-WEBHOOK] Update Received:", Object.keys(req.body || {}));
		// TODO: (Phase 1) Обработать req.body...
	} catch (e) {
		console.error("[TG-WEBHOOK] Error parsing body:", e);
	}

	// Отвечаем Telegram, что все ОК
	return res.status(200).json({ status: "ok", check: "POST" });
}
