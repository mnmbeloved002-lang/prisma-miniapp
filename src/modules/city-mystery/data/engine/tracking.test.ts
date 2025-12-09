/**
 * Тесты логики слежки
 */

import { describe, it, expect } from 'vitest';
import { canKillerMurder, performTracking } from './tracking';
import type { Citizen } from '../citizens';
import type { GameState } from '../gameTypes';

const createCitizen = (overrides: Partial<Citizen> = {}): Citizen => ({
  id: 'citizen-1',
  role: 'Тестовый',
  gender: 'MALE',
  age: 'ADULT',
  build: 'MEDIUM',
  height: 'MEDIUM',
  faction: 'LAW',
  ...overrides,
});

const createGameState = (overrides: Partial<GameState> = {}): GameState => {
  const killer = createCitizen({ id: 'killer-1', gender: 'FEMALE' });
  const resident = createCitizen({ id: 'resident-1', gender: 'FEMALE' });
  
  return {
    id: 'test-game',
    mode: 'LOGIC',
    phase: 'DETECTIVE',
    step: 'INVESTIGATE',
    round: 1,
    maxRounds: 5,
    grid: [
      [resident], // квартал 0
      [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    ],
    buildings: [],
    crimeScenes: [],
    frightenedResidents: [],
    detective: {
      position: 5, // Не в квартале с жителем
      actionsLeft: 2,
      movementPoints: 2,
      trackingToken: { residentId: null, districtIndex: null },
      collectedEvidence: [],
      availableCards: [],
    },
    killer: {
      identity: killer,
      motive: 'MANIAC', // Все жертвы одного пола
      figure: null,
      allies: null,
      frightenedThisRound: [],
      usedAbilities: [],
    },
    victims: [],
    availableMotives: ['MANIAC'],
    discardedMotives: [],
    history: [],
    isGameOver: false,
    ...overrides,
  } as GameState;
};

describe('tracking: canKillerMurder', () => {
  it('нельзя убить самого убийцу', () => {
    const killer = createCitizen({ id: 'killer-1' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        identity: killer,
      },
    });

    const result = canKillerMurder(killer, gameState);

    expect(result.canKill).toBe(false);
    expect(result.reason).toContain('убийца');
  });

  it('нельзя убить в квартале с детективом', () => {
    const resident = createCitizen({ id: 'resident-1', gender: 'FEMALE' });
    const gameState = createGameState({
      grid: [
        [resident], // квартал 0
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
      ],
      detective: {
        ...createGameState().detective,
        position: 0, // В том же квартале
      },
    });

    const result = canKillerMurder(resident, gameState);

    expect(result.canKill).toBe(false);
    expect(result.reason).toContain('детективом');
  });

  it('можно убить если подходит под мотив MANIAC (тот же пол)', () => {
    const resident = createCitizen({ id: 'resident-1', gender: 'FEMALE' });
    const gameState = createGameState({
      grid: [
        [resident],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
      ],
      victims: [], // Первая жертва — любой пол
    });

    const result = canKillerMurder(resident, gameState);

    expect(result.canKill).toBe(true);
  });

  it('нельзя убить если не подходит под мотив MANIAC (другой пол)', () => {
    const victim1 = createCitizen({ id: 'victim-1', gender: 'FEMALE' });
    const resident = createCitizen({ id: 'resident-1', gender: 'MALE' }); // Другой пол!
    
    const gameState = createGameState({
      grid: [
        [resident],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
      ],
      victims: [victim1], // Уже есть жертва-женщина
    });

    const result = canKillerMurder(resident, gameState);

    expect(result.canKill).toBe(false);
    expect(result.reason).toContain('мотив');
  });
});

describe('tracking: performTracking', () => {
  it('возвращает canKill: false если житель не найден', () => {
    const gameState = createGameState();

    const result = performTracking('non-existent-id', gameState);

    expect(result.canKill).toBe(false);
    expect(result.reason).toContain('не найден');
  });

  it('возвращает правильный результат для существующего жителя', () => {
    const resident = createCitizen({ id: 'resident-1', gender: 'FEMALE' });
    const gameState = createGameState({
      grid: [
        [resident],
        [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
      ],
    });

    const result = performTracking('resident-1', gameState);

    expect(result.canKill).toBe(true);
  });
});
