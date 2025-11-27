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

  it('rejects ritual with short title', () => {
    const invalid = {
      id: 'r1',
      title: 'ab', // < 3 chars
      motivation: 'Start your day mindfully',
      task: 'Meditate for 5 minutes',
      affirmation: 'I am calm',
    };

    const result = RitualSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

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
});
