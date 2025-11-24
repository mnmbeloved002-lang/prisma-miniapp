const fs = require("fs");
const path = require("path");

function normalizeNews(rawNews) {
	console.log("🔄 Нормализация новостей...");

	const normalized = [];
	let skipped = 0;

	for (const item of rawNews) {
		try {
			// Генерация ID
			const id = `mock-${Buffer.from(`${item.title}|${item.date}`).toString("base64").slice(0, 20)}`;

			// Очистка title
			const title = item.title
				.replace(/<[^>]*>/g, "")
				.replace(/\s+/g, " ")
				.trim();

			if (title.length < 10 || title.length > 180) {
				skipped++;
				continue;
			}

			// Создание preview
			let preview = item.preview || "";
			if (preview) {
				preview = preview
					.replace(/<[^>]*>/g, "")
					.replace(/\s+/g, " ")
					.trim()
					.slice(0, 240);
			}

			// Обработка тегов
			let tags = item.tags || ["новости"];
			if (!Array.isArray(tags)) tags = [tags];
			tags = tags
				.map((tag) =>
					tag
						.toString()
						.toLowerCase()
						.replace(/[^\wа-яё]/gi, ""),
				)
				.filter((tag) => tag.length >= 2 && tag.length <= 24)
				.slice(0, 5);

			if (tags.length === 0) tags = ["новости"];

			// Нормализация даты
			let date;
			try {
				date = new Date(item.date).toISOString().replace(/\.\d{3}Z$/, "Z");
			} catch (e) {
				date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
			}

			// Нормализация URL
			let url = item.url;
			if (url && url.startsWith("http://")) {
				url = url.replace("http://", "https://");
			}

			if (!url || !url.startsWith("https://")) {
				skipped++;
				continue;
			}

			normalized.push({
				id,
				title,
				preview,
				tags,
				date,
				url,
				source: item.source,
			});
		} catch (error) {
			skipped++;
		}
	}

	console.log(
		`✅ Нормализация: ${normalized.length} успешно, ${skipped} пропущено`,
	);
	return normalized;
}

function saveNormalizedNews(news) {
	const currentNewsPath = path.join(__dirname, "..", "public", "news.json");
	const normalizedPath = path.join(
		__dirname,
		"..",
		"docs",
		"fetch",
		"normalized-news.json",
	);

	let currentNews = [];
	try {
		const currentData = fs.readFileSync(currentNewsPath, "utf8");
		currentNews = JSON.parse(currentData);
	} catch (error) {
		console.log("ℹ️  Начинаем с чистого листа");
	}

	// Объединяем и сортируем
	const allNews = [...news, ...currentNews];
	allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Убираем дубликаты по ID
	const uniqueNews = [];
	const seenIds = new Set();

	for (const item of allNews) {
		if (!seenIds.has(item.id)) {
			seenIds.add(item.id);
			uniqueNews.push(item);
		}
	}

	// Сохраняем для отладки
	fs.writeFileSync(
		normalizedPath,
		JSON.stringify(
			{
				timestamp: new Date().toISOString(),
				normalizedCount: news.length,
				totalUniqueCount: uniqueNews.length,
				news: uniqueNews,
			},
			null,
			2,
		),
	);

	// Сохраняем в основной файл (первые 100)
	const finalNews = uniqueNews.slice(0, 100);
	fs.writeFileSync(currentNewsPath, JSON.stringify(finalNews, null, 2));

	console.log(`💾 Сохранено: ${finalNews.length} уникальных новостей`);
	return finalNews;
}

async function main() {
	try {
		const fetchPath = path.join(
			__dirname,
			"..",
			"docs",
			"fetch",
			"last-fetch.json",
		);
		if (!fs.existsSync(fetchPath)) {
			console.log("❌ Файл парсинга не найден");
			process.exit(1);
		}

		const fetchData = JSON.parse(fs.readFileSync(fetchPath, "utf8"));
		const rawNews = fetchData.news || [];

		if (rawNews.length === 0) {
			console.log("ℹ️  Нет новостей для нормализации");
			process.exit(0);
		}

		const normalizedNews = normalizeNews(rawNews);
		const finalNews = saveNormalizedNews(normalizedNews);

		console.log("✅ Нормализация завершена");
	} catch (error) {
		console.error("❌ Ошибка:", error.message);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}

module.exports = { normalizeNews, saveNormalizedNews };
