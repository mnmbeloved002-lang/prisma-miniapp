const fs = require("fs");
const path = require("path");

// Заглушка для реального парсера
async function fetchNews() {
	console.log("📡 Запуск парсинга новостей...");

	const sources = [
		{
			name: "Lenta.ru",
			url: "https://lenta.ru/rss/news",
			type: "rss",
		},
		{
			name: "РИА Новости",
			url: "https://ria.ru/export/rss2/index.xml",
			type: "rss",
		},
	];

	const results = [];

	for (const source of sources) {
		console.log(`🔍 Парсинг ${source.name}...`);

		// Имитация задержки сети
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Заглушка - в реальности здесь будет парсинг RSS
		const mockNews = {
			id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			title: `Тестовая новость от ${source.name}`,
			preview: "Это тестовая новость для проверки работы пайплайна",
			tags: ["тест", "заглушка"],
			date: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
			url: `https://example.com/test-news-${Date.now()}`,
			source: source.name,
		};

		results.push(mockNews);
		console.log(`✅ ${source.name}: найдено 1 новость`);
	}

	return results;
}

// Сохраняем результаты в файл
async function saveResults(news) {
	const outputPath = path.join(
		__dirname,
		"..",
		"docs",
		"fetch",
		"last-fetch.json",
	);
	const reportPath = path.join(__dirname, "..", "docs", "fetch", "REPORT.md");

	// Сохраняем сырые данные
	fs.writeFileSync(
		outputPath,
		JSON.stringify(
			{
				timestamp: new Date().toISOString(),
				sourceCount: news.length,
				news: news,
			},
			null,
			2,
		),
	);

	// Создаем отчет
	const report = `# Отчет парсинга
## Дата: ${new Date().toISOString()}
## Найдено новостей: ${news.length}
## Источники: ${news.map((n) => n.source).join(", ")}

## Новости:
${news.map((item) => `- ${item.title} (${item.source})`).join("\n")}
`;

	fs.writeFileSync(reportPath, report);

	console.log(`📊 Отчет сохранен: ${news.length} новостей`);
	return news;
}

// Основная функция
async function main() {
	try {
		const news = await fetchNews();
		await saveResults(news);

		if (news.length === 0) {
			console.log("⚠️  Новостей не найдено");
			process.exit(0);
		}

		console.log("✅ Парсинг завершен успешно");
		process.exit(0);
	} catch (error) {
		console.error("❌ Ошибка парсинга:", error.message);
		process.exit(1);
	}
}

// Запуск если вызвано напрямую
if (require.main === module) {
	main();
}

module.exports = { fetchNews, saveResults };
