import type { GameState } from '../gameTypes';

export function shuffle<T>(array: readonly T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function pickRandom<T>(array: readonly T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}

export function generateId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

export interface GameRuleResult {
  isValid: boolean;
  state?: GameState;
  error?: string;
  data?: Record<string, unknown>;
}
