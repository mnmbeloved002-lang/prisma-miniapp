const fs = require('fs');
const path = require('path');

function collectMetrics(startTime, newsCount, errorCount) {
  const duration = (new Date() - startTime) / 1000 / 60;
  
  const metrics = {
    timestamp: new Date().toISOString(),
    ttfpr: duration,
    news_count: newsCount,
    error_count: errorCount
  };
  
  console.log('📊 Метрики:', metrics);
}

collectMetrics(new Date(), 5, 0);
