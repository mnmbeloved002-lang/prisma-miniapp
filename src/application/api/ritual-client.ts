// 1. Сначала config (по алфавиту)
import { CACHE_TTL_MS } from '../../config';
// 2. Потом domain
import { type Ritual, RitualSchema } from '../../domain/ritual-schema';

// Тип ответа от сервера
type RitualResponse = { ritual: unknown };

// Переменные для кэша
let cachedData: Ritual | null = null;
let lastFetchTime = 0;

export async function getRitualCached(): Promise<Ritual> {
  const now = Date.now();

  // 1. Проверка кэша по TTL
  if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
    console.log('🔄 Возвращаем ритуал из кэша (без запроса к сети)');
    return cachedData;
  }

  // 2. Искусственный лаг сети (выключен в тестах через NODE_ENV)
  if (process.env.NODE_ENV !== 'test') {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  try {
    // 3. Запрос к статическому файлу
    const res = await fetch('/rituals.json');

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = (await res.json()) as RitualResponse;

    // 4. ZOD VALIDATION
    const validData = RitualSchema.parse(json.ritual);

    // 5. Сохраняем в кэш
    cachedData = validData;
    lastFetchTime = now;
    console.log('🌐 Данные загружены из сети и сохранены в кэш');

    return validData;
  } catch (error) {
    console.error('Data Fetch Error:', error);

    // 6. Fallback на кэш при любой ошибке сети/валидации
    if (cachedData) {
      console.warn('⚠️ Ошибка сети, возвращаем устаревшие данные из кэша');
      return cachedData;
    }

    throw new Error('Не удалось загрузить ритуал. Проверьте связь с космосом.');
  }
}
