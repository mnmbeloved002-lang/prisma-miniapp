import { beforeEach, describe, expect, it } from 'vitest';
import { getAdjacentDistricts } from '../data/gameConstants';
import type { NewGameConfig } from '../data/gameTypes';
import { useGameStore } from './gameStore';

function createDefaultConfig(): NewGameConfig {
  return {
    mode: 'LOGIC',
    includeFigure: false,
    selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
  };
}

function initGameWithRole(role: 'KILLER' | 'DETECTIVE') {
  const { initializeGame, setPlayerRole } = useGameStore.getState();
  initializeGame(createDefaultConfig());
  setPlayerRole(role);
}

describe('city-mystery gameStore', () => {
  beforeEach(() => {
    // Жёсткий сброс стора между тестами
    const state = useGameStore.getState();
    state.resetGame();
    state.clearError();
  });

  it('initializeGame создаёт движок и состояние игры', () => {
    const { initializeGame } = useGameStore.getState();

    initializeGame(createDefaultConfig());

    const state = useGameStore.getState();

    expect(state.engine).not.toBeNull();
    expect(state.gameState).not.toBeNull();
    expect(state.isGameInitialized).toBe(true);
    expect(state.gameMode).toBe('LOGIC');

    // Лог игры должен содержать хотя бы сообщение об инициализации
    expect(state.gameLog.length).toBeGreaterThanOrEqual(1);
  });

  it('setPlayerRole сохраняет роль и пишет сообщение в лог', () => {
    const { initializeGame, setPlayerRole } = useGameStore.getState();

    initializeGame(createDefaultConfig());
    setPlayerRole('KILLER');

    const state = useGameStore.getState();
    expect(state.playerRole).toBe('KILLER');

    const lastLog = state.gameLog[state.gameLog.length - 1] ?? '';
    expect(lastLog).toContain('Игрок выбрал роль');
  });

  it('frightenResidents: запугивание жертв убийцей и очистка выбора', () => {
    initGameWithRole('KILLER');

    const storeBefore = useGameStore.getState();
    const gameState = storeBefore.gameState;
    expect(gameState).not.toBeNull();

    if (!gameState) {
      throw new Error('gameState is null after initGameWithRole');
    }

    const detectivePos = gameState.detective.position;
    const residents = gameState.grid.flat();

    // берём двух жителей не в квартале детектива
    const availableResidents = residents.filter((resident) => {
      for (let i = 0; i < gameState.grid.length; i++) {
        if (gameState.grid[i].some((r) => r.id === resident.id)) {
          return i !== detectivePos;
        }
      }
      return false;
    });

    const residentIds = [availableResidents[0].id, availableResidents[1].id];

    // имитируем выбор в UI
    useGameStore.getState().selectResident(residentIds[0]);
    useGameStore.getState().selectResident(residentIds[1]);

    const result = useGameStore.getState().frightenResidents(residentIds);
    expect(result.isValid).toBe(true);

    const after = useGameStore.getState();
    expect(after.gameState?.frightenedResidents).toEqual(expect.arrayContaining(residentIds));
    // выбор должен быть очищен
    expect(after.selectedResidents).toEqual([]);
  });

  it('frightenResidents: запрещено запугивать детективу', () => {
    initGameWithRole('DETECTIVE');

    const stateBefore = useGameStore.getState();
    const gameState = stateBefore.gameState;
    expect(gameState).not.toBeNull();

    if (!gameState) {
      throw new Error('gameState is null after initGameWithRole');
    }

    const anyResident = gameState.grid.flat()[0];
    const result = useGameStore.getState().frightenResidents([anyResident.id]);

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Только убийца может запугивать');

    const after = useGameStore.getState();
    expect(after.gameState?.frightenedResidents ?? []).toHaveLength(0);
  });

  it('moveDetective: детектив может переместиться в соседний квартал', () => {
    initGameWithRole('DETECTIVE');

    // Переводим игру в фазу детектива (KILLER -> DETECTIVE)
    const { nextPhase } = useGameStore.getState();
    const phaseResult = nextPhase();
    expect(phaseResult.isValid).toBe(true);

    const stateBefore = useGameStore.getState();
    const gameState = stateBefore.gameState;
    expect(gameState).not.toBeNull();

    if (!gameState) {
      throw new Error('gameState is null after initGameWithRole');
    }

    const currentPos = gameState.detective.position;
    const neighbors = getAdjacentDistricts(currentPos);
    expect(neighbors.length).toBeGreaterThan(0);

    const target = neighbors[0];

    const result = useGameStore.getState().moveDetective(target);
    expect(result.isValid).toBe(true);

    const after = useGameStore.getState();
    expect(after.gameState?.detective.position).toBe(target);
  });

  it('moveDetective: запрещено ходить убийцей', () => {
    initGameWithRole('KILLER');

    const stateBefore = useGameStore.getState();
    const gameState = stateBefore.gameState;
    expect(gameState).not.toBeNull();

    if (!gameState) {
      throw new Error('gameState is null after initGameWithRole');
    }

    const currentPos = gameState.detective.position;
    const neighbors = getAdjacentDistricts(currentPos);
    const target = neighbors[0];

    const result = useGameStore.getState().moveDetective(target);

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Только детектив может перемещаться');

    const after = useGameStore.getState();
    expect(after.gameState?.detective.position).toBe(currentPos);
  });
});
