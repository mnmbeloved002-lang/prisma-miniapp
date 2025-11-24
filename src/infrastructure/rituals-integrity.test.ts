import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { RitualSchema } from '../../src/domain/ritual-schema';

const mockPath = join(__dirname, 'mock-rituals.json');
const mockRituals = JSON.parse(readFileSync(mockPath, 'utf-8'));

describe('Rituals Integrity (Validation)', () => {
  it('должен содержать не менее 1 ритуала', () => {
    expect(mockRituals.rituals.length).toBeGreaterThanOrEqual(1);
  });

  it('все ритуалы должны соответствовать Zod-схеме', () => {
    mockRituals.rituals.forEach((ritual: unknown) => {
      // Zod-валидация для гарантии L4 Type Safety (см. Doc#2)
      const validation = RitualSchema.safeParse(ritual);
      expect(validation.success).toBe(true);
    });
  });
});
