// scripts/validate-news.mjs
import fs from 'fs';
import path from 'path';
import { default as Contract } from '../src/domain/types.js'; 

// NOTE: Путь к файлу адаптирован для ES Modules
const newsPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'public', 'news.json');

// UEC Helper: Логика проверки сортировки
function checkSorting(news) {
    for (let i = 0; i < news.length - 1; i++) {
        const date1 = new Date(news[i].publishedAt).getTime();
        const date2 = new Date(news[i+1].publishedAt).getTime();
        if (date1 < date2) {
            return { 
                ok: false, 
                message: `Нарушена сортировка: Новость ${i} (раньше) стоит перед новостью ${i+1} (позже).` 
            };
        }
    }
    return { ok: true, message: 'Сортировка соблюдена.' };
}

function validateNews() {
    const errors = [];
    let news = [];

    try {
        const data = fs.readFileSync(newsPath, 'utf8');
        const rootData = JSON.parse(data);
        
        // --- 1. Zod Validation (Schema, Types, Lengths, Structure) ---
        const validationResult = Contract.NewsFeedSchema.safeParse(rootData);
        
        // --- Атомарный фикс: Используем опциональную последовательность (?.) для устойчивости ---
        if (!validationResult.success) {
            const zodErrors = validationResult.error?.errors || []; // Защита от undefined/null
            console.log('❌ Найдены ошибки Zod-валидации:', zodErrors.length);
            zodErrors.forEach(err => {
                errors.push(`❌ Zod Error [${err.path.join('.') || 'Root'}]: ${err.message}`);
            });
        } else {
            // Если Zod прошел успешно, работаем с данными
            news = validationResult.data.news;
        
            // --- 2. Post-Zod Validation ---
            
            // Zero News Check (MUST 72/125)
            if (news.length === 0) {
                errors.push('❌ Найден "0 новостей" в news.json. Это ошибка ingestion-пайплайна.');
            }
            
            // Sorting check (MUST 92)
            const sortingResult = checkSorting(news);
            if (!sortingResult.ok) {
                errors.push(`❌ Нарушена сортировка: ${sortingResult.message}`);
            }
            
            // [TODO]: Здесь будет логика проверки уникальности (MUST 89-91)
        }

    } catch (error) {
        // Выводим полную трассировку для диагностики
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЧТЕНИЯ/ПАРСИНГА/ЛОГИКИ (См. trace ниже):', error.message);
        console.error(error.stack); 
        
        // Считаем это фатальной ошибкой
        process.exit(1);
    }
    
    // --- 3. Final Output ---
    if (errors.length === 0) {
        console.log('✅ Все проверки пройдены! Данные соответствуют Zod-контракту и требованиям L1.');
    } else {
        console.log('❌ Найдены ошибки:', errors.length);
        errors.forEach(error => console.log(error));
        // Вызываем throw, чтобы вызвать код ошибки (для CI)
        throw new Error(`Валидация провалена. Найдено ${errors.length} ошибок.`);
    }
}

// Запускаем валидацию
try {
    validateNews();
} catch {
    // В случае ошибки внутри validateNews, она уже была выведена 
    process.exit(1); 
}
