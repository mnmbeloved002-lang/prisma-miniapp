const fs = require("fs");
const path = require("path");

const newsPath = path.join(__dirname, "..", "public", "news.json");

function validateNews() {
	try {
		const data = fs.readFileSync(newsPath, "utf8");
		const news = JSON.parse(data);

		const errors = [];
		const ids = new Set();
		const urls = new Set();
		const titleDateCombos = new Set();

		// Проверяем что это массив
		if (!Array.isArray(news)) {
			errors.push("❌ news.json должен быть массивом");
			return errors;
		}

		news.forEach((item, index) => {
			// Проверка обязательных полей
			const requiredFields = ["id", "title", "date", "url", "tags"];
			requiredFields.forEach((field) => {
				if (!item[field]) {
					errors.push(
						`❌ Запись ${index}: отсутствует обязательное поле "${field}"`,
					);
				}
			});

			// Проверка уникальности id
			if (item.id) {
				if (ids.has(item.id)) {
					errors.push(`❌ Запись ${index}: дубликат id "${item.id}"`);
				}
				ids.add(item.id);
			}

			// Проверка уникальности url
			if (item.url) {
				if (urls.has(item.url)) {
					errors.push(`❌ Запись ${index}: дубликат url "${item.url}"`);
				}
				urls.add(item.url);
			}

			// Проверка уникальности title + date
			if (item.title && item.date) {
				const combo = `${item.title}|${item.date}`;
				if (titleDateCombos.has(combo)) {
					errors.push(`❌ Запись ${index}: дубликат комбинации title+date`);
				}
				titleDateCombos.add(combo);
			}

			// Проверка формата даты
			if (item.date && !item.date.endsWith("Z")) {
				errors.push(
					`❌ Запись ${index}: дата должна заканчиваться на Z (UTC) - "${item.date}"`,
				);
			}

			// Проверка HTTPS
			if (item.url && !item.url.startsWith("https://")) {
				errors.push(
					`❌ Запись ${index}: URL должен начинаться с https:// - "${item.url}"`,
				);
			}

			// Проверка длины title
			if (item.title && (item.title.length < 10 || item.title.length > 180)) {
				errors.push(
					`❌ Запись ${index}: title должен быть 10-180 символов - ${item.title.length}`,
				);
			}

			// Проверка тегов
			if (item.tags) {
				if (!Array.isArray(item.tags)) {
					errors.push(`❌ Запись ${index}: tags должен быть массивом`);
				} else {
					if (item.tags.length < 1 || item.tags.length > 5) {
						errors.push(
							`❌ Запись ${index}: tags должен содержать 1-5 элементов - ${item.tags.length}`,
						);
					}
					item.tags.forEach((tag) => {
						if (tag.length < 2 || tag.length > 24) {
							errors.push(
								`❌ Запись ${index}: тег "${tag}" должен быть 2-24 символа`,
							);
						}
					});
				}
			}
		});

		// Проверка сортировки
		for (let i = 1; i < news.length; i++) {
			const prevDate = new Date(news[i - 1].date);
			const currDate = new Date(news[i].date);
			if (prevDate < currDate) {
				errors.push(
					`❌ Нарушена сортировка: запись ${i - 1} (${news[i - 1].date}) должна быть после ${i} (${news[i].date})`,
				);
			}
		}

		if (errors.length === 0) {
			console.log("✅ Все проверки пройдены! Данные соответствуют контракту.");
		} else {
			console.log("❌ Найдены ошибки:");
			errors.forEach((error) => console.log(error));
		}

		return errors;
	} catch (error) {
		console.log("❌ Ошибка при валидации:", error.message);
		return [error.message];
	}
}

// Запускаем валидацию если скрипт вызван напрямую
if (require.main === module) {
	validateNews();
}

module.exports = validateNews;
