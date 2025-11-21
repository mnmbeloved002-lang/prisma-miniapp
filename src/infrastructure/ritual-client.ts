import { RitualSchema, type Ritual } from '../domain/ritual-schema';

// Тип ответа от сервера (обертка)
type RitualResponse = { ritual: unknown };

export async function getRitualCached(): Promise<Ritual> {
  // Имитация лага сети для реалистичности UI
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    // 1. Запрос к статическому файлу
    const res = await fetch('/rituals.json');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 2. Парсинг JSON
    const json = (await res.json()) as RitualResponse;

    // 3. 🛡️ ZOD VALIDATION (L4 Security Gate)
    // Проверяем именно вложенный объект ritual
    const validData = RitualSchema.parse(json.ritual);
    
    return validData;
  } catch (error) {
    console.error('Data Fetch Error:', error);
    // В продакшене здесь может быть фолбэк на кэш
    throw new Error('Не удалось загрузить ритуал. Проверьте связь с космосом.');
  }
}
