import { describe, it, expect } from 'vitest';
import { MOTIVE_CARDS, CENTRAL_DISTRICTS, getDistrictIndex } from './gameConstants';
import { allCitizens, type Citizen } from './citizens';
import type { GameState, Motive } from './gameTypes';

function createBaseState(motive: Motive): GameState {
  const killer = allCitizens[0];

  return {
    id: 'test-game',
    mode: 'LOGIC',
    phase: 'KILLER',
    step: 'FRIGHTEN',
    round: 1,
    maxRounds: 5,
    grid: Array.from({ length: 16 }, () => []),
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
      identity: killer,
      motive,
      figure: null,
      allies: killer.faction,
      frightenedThisRound: [],
      usedAbilities: [],
    },
    victims: [],
    availableMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    discardedMotives: [],
    history: [],
    isGameOver: false,
    winner: undefined,
    reason: undefined,
  };
}

function findCitizenBy(predicate: (c: Citizen) => boolean): Citizen {
  const citizen = allCitizens.find(predicate);
  if (!citizen) {
    throw new Error('Test citizen not found for given predicate');
  }
  return citizen;
}

describe('MOTIVE_CARDS conditions', () => {
  it('MANIAC: all victims must be same gender', () => {
    const card = MOTIVE_CARDS.MANIAC;
    const state = createBaseState('MANIAC');

    const male1 = findCitizenBy((c) => c.gender === 'MALE');
    const male2 = findCitizenBy((c) => c.gender === 'MALE' && c.id !== male1.id);
    const female = findCitizenBy((c) => c.gender === 'FEMALE');

    // первая жертва любого пола допустима
    expect(card.condition(male1, state)).toBe(true);
    state.victims.push(male1);

    // вторая жертва того же пола — ок
    expect(card.condition(male2, state)).toBe(true);

    // жертва другого пола — нарушает мотив
    expect(card.condition(female, state)).toBe(false);
  });

  it('SADIST: cannot kill frightened citizens', () => {
    const card = MOTIVE_CARDS.SADIST;
    const state = createBaseState('SADIST');

    const victim = findCitizenBy(() => true);

    // по умолчанию житель не запуган
    expect(card.condition(victim, state)).toBe(true);

    // если житель запуган — убивать нельзя
    state.frightenedResidents.push(victim.id);
    expect(card.condition(victim, state)).toBe(false);
  });

  it('HEADHUNTER: cannot kill in central districts', () => {
    const card = MOTIVE_CARDS.HEADHUNTER;
    const state = createBaseState('HEADHUNTER');

    const victim = findCitizenBy(() => true);

    // разместим жертву в центральном квартале
    const centralIndex = CENTRAL_DISTRICTS[0];
    state.grid[centralIndex] = [victim];

    expect(card.condition(victim, state)).toBe(false);

    // перенесём жертву в нецентральный квартал
    const nonCentralIndex = 0;
    state.grid[centralIndex] = [];
    state.grid[nonCentralIndex] = [victim];

    expect(card.condition(victim, state)).toBe(true);
  });

  it('KILLER: may only kill in districts with single resident', () => {
    const card = MOTIVE_CARDS.KILLER;
    const state = createBaseState('KILLER');

    const victim = findCitizenBy(() => true);
    const other = findCitizenBy((c) => c.id !== victim.id);

    const districtIndex = getDistrictIndex(1, 1);

    // квартал с одной фигурой — допустимо
    state.grid[districtIndex] = [victim];
    expect(card.condition(victim, state)).toBe(true);

    // квартал с двумя жителями — уже нельзя
    state.grid[districtIndex] = [victim, other];
    expect(card.condition(victim, state)).toBe(false);
  });

  it('TERRORIST: all victims must have different factions', () => {
    const card = MOTIVE_CARDS.TERRORIST;
    const state = createBaseState('TERRORIST');

    const victim1 = findCitizenBy(() => true);
    const victim2 = findCitizenBy((c) => c.faction !== victim1.faction);
    const victimSameFaction = findCitizenBy(
      (c) => c.faction === victim1.faction && c.id !== victim1.id,
    );

    // первая жертва
    expect(card.condition(victim1, state)).toBe(true);
    state.victims.push(victim1);

    // жертва другой фракции — ок
    expect(card.condition(victim2, state)).toBe(true);
    state.victims.push(victim2);

    // жертва той же фракции, что первая — нельзя
    expect(card.condition(victimSameFaction, state)).toBe(false);
  });
});
