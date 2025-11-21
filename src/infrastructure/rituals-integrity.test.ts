import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RitualSchema } from '../../src/domain/ritual-schema';

// L4: Тест проверяет статический файл данных
describe('Data Integrity: rituals.json', () => {
  it('should adhere to RitualSchema contract', () => {
    // 1. Читаем файл с диска
    const path = join(process.cwd(), 'public', 'rituals.json');
    const fileContent = readFileSync(path, 'utf-8');
    
    // 2. Парсим JSON
    const json = JSON.parse(fileContent);
    
    // 3. Проверяем структуру (должен быть корень "ritual")
    expect(json).toHaveProperty('ritual');
    
    // 4. Валидируем содержимое через Zod
    const result = RitualSchema.safeParse(json.ritual);
    
    if (!result.success) {
      console.error('Schema Violation:', result.error.format());
    }
    
    expect(result.success).toBe(true);
  });
});
