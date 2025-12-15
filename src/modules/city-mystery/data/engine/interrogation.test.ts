/**
 * Тесты логики допроса
 */

import { describe, expect, it } from 'vitest';
import type { Citizen } from '../citizens';
import type { GameState } from '../gameTypes';
import { canResidentLie, getTruthfulAnswer, interrogate } from './interrogation';

// Мок жителей
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

// Мок состояния игры
const createGameState = (overrides: Partial<GameState> = {}): GameState =>
  ({
    id: 'test-game',
    mode: 'LOGIC',
    phase: 'DETECTIVE',
    step: 'INVESTIGATE',
    round: 1,
    maxRounds: 5,
    grid: [],
    buildings: [],
    crimeScenes: [],
    frightenedResidents: [],
    detective: {
      position: 0,
      actionsLeft: 2,
      movementPoints: 2,
      trackingToken: { residentId: null, districtIndex: null },
      collectedEvidence: [],
      availableCards: [],
    },
    killer: {
      identity: createCitizen({ id: 'killer-1', gender: 'FEMALE', age: 'YOUNG' }),
      motive: 'MANIAC',
      figure: null,
      allies: null,
      frightenedThisRound: [],
      usedAbilities: [],
    },
    victims: [],
    availableMotives: [],
    discardedMotives: [],
    history: [],
    isGameOver: false,
    ...overrides,
  }) as GameState;

describe('interrogation: canResidentLie', () => {
  it('убийца может лгать', () => {
    const killer = createCitizen({ id: 'killer-1' });
    const gameState = createGameState();

    const result = canResidentLie(killer, gameState);

    expect(result.canLie).toBe(true);
    expect(result.reason).toContain('убийца');
  });

  it('фигурант может лгать', () => {
    const figure = createCitizen({ id: 'figure-1' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        figure,
      },
    });

    const result = canResidentLie(figure, gameState);

    expect(result.canLie).toBe(true);
    expect(result.reason).toContain('фигурант');
  });

  it('союзник (та же фракция) может лгать', () => {
    const ally = createCitizen({ id: 'ally-1', faction: 'CRIME' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        allies: 'CRIME',
      },
    });

    const result = canResidentLie(ally, gameState);

    expect(result.canLie).toBe(true);
    expect(result.reason).toContain('союзник');
  });

  it('обычный житель не может лгать', () => {
    const resident = createCitizen({ id: 'honest-1', faction: 'MEDICINE' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        allies: 'CRIME',
      },
    });

    const result = canResidentLie(resident, gameState);

    expect(result.canLie).toBe(false);
  });
});

describe('interrogation: getTruthfulAnswer', () => {
  const killer = createCitizen({
    gender: 'FEMALE',
    age: 'YOUNG',
    build: 'SLIM',
    height: 'TALL',
  });

  it('правильно отвечает на вопрос о поле', () => {
    expect(getTruthfulAnswer('GENDER', 'FEMALE', killer)).toBe(true);
    expect(getTruthfulAnswer('GENDER', 'MALE', killer)).toBe(false);
  });

  it('правильно отвечает на вопрос о возрасте', () => {
    expect(getTruthfulAnswer('AGE', 'YOUNG', killer)).toBe(true);
    expect(getTruthfulAnswer('AGE', 'OLD', killer)).toBe(false);
  });

  it('правильно отвечает на вопрос о телосложении', () => {
    expect(getTruthfulAnswer('BUILD', 'SLIM', killer)).toBe(true);
    expect(getTruthfulAnswer('BUILD', 'LARGE', killer)).toBe(false);
  });

  it('правильно отвечает на вопрос о росте', () => {
    expect(getTruthfulAnswer('HEIGHT', 'TALL', killer)).toBe(true);
    expect(getTruthfulAnswer('HEIGHT', 'SHORT', killer)).toBe(false);
  });
});

describe('interrogation: interrogate', () => {
  it('честный житель всегда говорит правду', () => {
    const resident = createCitizen({ id: 'honest-1', faction: 'MEDICINE' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        identity: createCitizen({ id: 'killer-1', gender: 'FEMALE' }),
        allies: 'CRIME',
      },
    });

    const result = interrogate(resident, 'GENDER', 'FEMALE', gameState, true);

    expect(result.answer).toBe(true); // Правда, даже если chooseLie=true
    expect(result.canLie).toBe(false);
    expect(result.isLying).toBe(false);
  });

  it('убийца может солгать', () => {
    const killer = createCitizen({ id: 'killer-1', gender: 'FEMALE' });
    const gameState = createGameState({
      killer: {
        ...createGameState().killer,
        identity: killer,
      },
    });

    const truthful = interrogate(killer, 'GENDER', 'FEMALE', gameState, false);
    const lying = interrogate(killer, 'GENDER', 'FEMALE', gameState, true);

    expect(truthful.answer).toBe(true);
    expect(truthful.isLying).toBe(false);

    expect(lying.answer).toBe(false); // Ложь!
    expect(lying.isLying).toBe(true);
  });
});
