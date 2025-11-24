const fs = require("fs");
const path = require("path");

const newsPath = path.join(__dirname, "..", "public", "news.json");
const backupDir = path.join(__dirname, "..", "archive", "backups");
const latestBackup = path.join(backupDir, "news.json.backup.latest");

try {
	if (fs.existsSync(latestBackup)) {
		const data = fs.readFileSync(latestBackup, "utf8");
		fs.writeFileSync(newsPath, data);
		console.log("✅ Восстановлен последний бэкап");
	} else {
		// Создаем пустой файл если бэкапов нет
		fs.writeFileSync(newsPath, "[]");
		console.log("✅ Создан новый пустой news.json");
	}
} catch (error) {
	console.log("❌ Ошибка восстановления:", error.message);
}
