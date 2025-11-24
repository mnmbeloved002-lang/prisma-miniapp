const fs = require("fs");
const path = require("path");

const newsPath = path.join(__dirname, "..", "public", "news.json");
const backupDir = path.join(__dirname, "..", "archive", "backups");

// Создаем директорию если нет
if (!fs.existsSync(backupDir)) {
	fs.mkdirSync(backupDir, { recursive: true });
}

try {
	const data = fs.readFileSync(newsPath, "utf8");
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

	// Сохраняем с timestamp
	const backupFile = path.join(backupDir, `news.json.backup.${timestamp}`);
	fs.writeFileSync(backupFile, data);

	// Сохраняем как latest
	const latestBackup = path.join(backupDir, "news.json.backup.latest");
	fs.writeFileSync(latestBackup, data);

	console.log("✅ Бэкап создан:", backupFile);
} catch (error) {
	console.log("❌ Ошибка создания бэкапа:", error.message);
}
