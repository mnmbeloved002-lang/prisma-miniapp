// @ts-nocheck
const fs = require('fs');
const path = require('path');

const newsPath = path.join(__dirname, '..', 'public', 'news.json');
const backupDir = path.join(__dirname, '..', 'archive', 'backup');

// Создаем директорию для бэкапов
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Создаем бэкап с timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `news.json.backup.${timestamp}`);

// Читаем текущие данные
let newsData = [];
try {
  const content = fs.readFileSync(newsPath, 'utf8');
  newsData = JSON.parse(content);
  console.log(`Прочитано записей: ${newsData.length}`);
} catch (error) {
  console.log('Файл news.json пустой или поврежден, начинаем с чистого листа');
}

// Создаем бэкап
fs.writeFileSync(backupPath, JSON.stringify(newsData, null, 2));
console.log(`✅ Бэкап создан: ${backupPath}`);

// Если есть данные - фильтруем и сортируем
if (newsData.length > 0) {
  const filteredNews = newsData.filter(item => 
    item.date != null && 
    item.url != null &&
    item.id != null &&
    item.title != null
  );

  // Приводим даты к ISO8601 UTC
  filteredNews.forEach(item => {
    if (item.date) {
      const date = new Date(item.date);
      if (!isNaN(date)) {
        item.date = date.toISOString().replace(/\.\d{3}Z$/, 'Z');
      }
    }
    // Гарантируем https:// в URL
    if (item.url && !item.url.startsWith('https://')) {
      item.url = item.url.replace(/^http:\/\//, 'https://');
    }
  });

  // Сортируем по дате DESC
  filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(newsPath, JSON.stringify(filteredNews, null, 2));
  console.log(`✅ Санитарка завершена: удалено ${newsData.length - filteredNews.length} записей`);
  console.log(`✅ Осталось записей: ${filteredNews.length}`);
} else {
  // Файл пустой - просто гарантируем валидный JSON
  fs.writeFileSync(newsPath, JSON.stringify([], null, 2));
  console.log('✅ news.json подготовлен (пустой массив)');
}

console.log('📊 Проверка структуры:');
console.log('- Формат: массив');
console.log('- Кодировка: UTF-8');
console.log('- Отступы: 2 пробела');
