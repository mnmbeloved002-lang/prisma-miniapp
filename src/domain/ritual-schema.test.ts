import { describe, expect, it } from 'vitest';
import { RitualSchema } from './ritual-schema';

describe('RitualSchema', () => {
  it('validates correct ritual data', () => {
    const valid = {
      id: 'r1',
      title: 'Morning Meditation',
      motivation: 'Start your day mindfully',
      task: 'Meditate for 5 minutes',
      affirmation: 'I am calm and focused',
    };
    const result = RitualSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  // Граничные тесты для title (min: 3)
  it('accepts title with exactly 3 characters (boundary)', () => {
    const valid = {
      id: 'r1',
      title: 'abc', // ровно 3
      motivation: 'Start',
      task: 'Med',
      affirmation: 'I am',
    };
    const result = RitualSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects title with 2 characters (below boundary)', () => {
    const invalid = {
      id: 'r1',
      title: 'ab', // < 3
      motivation: 'Start',
      task: 'Med',
      affirmation: 'I am',
    };
    const result = RitualSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  // Граничные тесты для motivation (min: 5)
  it('accepts motivation with exactly 5 characters (boundary)', () => {
    const valid = {
      id: 'r1',
      title: 'Title',
      motivation: 'Start', // ровно 5
      task: 'Med',
      affirmation: 'I am',
    };
    const result = RitualSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects motivation with 4 characters (below boundary)', () => {
    const invalid = {
      id: 'r1',
      title: 'Title',
      motivation: 'Star', // < 5
      task: 'Med',
      affirmation: 'I am',
    };
    const result = RitualSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  // Тест на optional fields
  it('accepts optional fields', () => {
    const withOptional = {
      id: 'r1',
      title: 'Evening Reflection',
      motivation: 'End day with gratitude',
      task: 'Write 3 things you are grateful for',
      affirmation: 'I am grateful',
      imagePrompt: 'sunset meditation',
      publishedAt: '2024-11-26',
    };
    const result = RitualSchema.safeParse(withOptional);
    expect(result.success).toBe(true);
  });

  // Тест на пустой id
  it('rejects empty id', () => {
    const invalid = {
      id: '',
      title: 'Title',
      motivation: 'Start',
      task: 'Med',
      affirmation: 'I am',
    };
    const result = RitualSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
