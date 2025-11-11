const fs = require('fs');
const path = require('path');

function checkDataQuality(news) {
  console.log('📊 Проверка качества данных...');
  
  const total = news.length;
  const emptyPreviews = news.filter(item => !item.preview).length;
  const ratio = (emptyPreviews / total) * 100;
  
  console.log(`Пустые превью: ${ratio.toFixed(1)}%`);
  
  if (ratio > 20) {
    console.log('❌ Качество данных: КРАСНЫЙ');
    return false;
  } else if (ratio > 10) {
    console.log('⚠️ Качество данных: ЖЕЛТЫЙ');
    return true;
  } else {
    console.log('✅ Качество данных: ЗЕЛЕНЫЙ');
    return true;
  }
}

// Тест
checkDataQuality([{preview: "test"}, {preview: ""}]);
