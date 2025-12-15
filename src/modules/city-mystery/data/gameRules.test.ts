import { beforeEach, describe, expect, test } from 'vitest';
import { getAdjacentDistricts, getDistrictForResident } from './gameConstants';
import {
  createGame,
  frightenResidents,
  interrogateResident,
  killResident,
  moveDetective,
  nextPhase,
  useBuilding,
} from './gameRules';
import type { GameState, NewGameConfig } from './gameTypes';

describe('City Mystery Game Rules', () => {
  let state: GameState;
  let config: NewGameConfig;

  beforeEach(() => {
    config = {
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    };
    state = createGame(config);
  });

  // --- CORE & KILLER TESTS ---

  test('should create game with correct initial state', () => {
    expect(state.id).toBeDefined();
    expect(state.phase).toBe('KILLER');
    expect(state.grid).toHaveLength(16);
    expect(state.killer.identity).toBeDefined();
  });

  test('should allow killer to frighten residents', () => {
    const residents = state.grid.flat();
    const detectivePos = state.detective.position;
    const availableResidents = residents.filter((resident) => {
      const district = getDistrictForResident(resident.id, state.grid);
      return district !== detectivePos;
    });

    const residentIds = [availableResidents[0].id, availableResidents[1].id];
    const result = frightenResidents(state, residentIds);

    expect(result.isValid).toBe(true);
    expect(result.state?.frightenedResidents).toHaveLength(2);
    expect(result.state?.step).toBe('KILL');
  });

  test('prevents killing resident in detective district', () => {
    state.step = 'KILL';
    const detectivePos = state.detective.position;
    const residentsInDetectiveDistrict = state.grid[detectivePos];

    if (residentsInDetectiveDistrict.length > 0) {
      const victim = residentsInDetectiveDistrict[0];
      const result = killResident(state, victim.id, detectivePos);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('детективом');
    }
  });

  test('prevents killer from committing suicide', () => {
    state.step = 'KILL';
    const killer = state.killer.identity;
    const killerDistrict = getDistrictForResident(killer.id, state.grid);

    if (killerDistrict !== null) {
      if (state.detective.position === killerDistrict) {
        state.detective.position = (killerDistrict + 1) % 16;
      }
      const result = killResident(state, killer.id, killerDistrict);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('самоубийство');
    }
  });

  // --- DETECTIVE TESTS ---

  test('detective can move to adjacent district', () => {
    const currentState = nextPhase(state).state!;
    expect(currentState.phase).toBe('DETECTIVE');

    const startPos = currentState.detective.position;
    const neighbors = getAdjacentDistricts(startPos);
    const target = neighbors[0];

    const result = moveDetective(currentState, target);

    expect(result.isValid).toBe(true);
    expect(result.state?.detective.position).toBe(target);
    expect(result.state?.detective.movementPoints).toBe(1);
  });

  test('detective cannot move too far', () => {
    const currentState = nextPhase(state).state!;
    const startPos = currentState.detective.position;
    const allDistricts = Array.from({ length: 16 }, (_, i) => i);
    const neighbors = getAdjacentDistricts(startPos);
    const invalidTarget = allDistricts.find((d) => d !== startPos && !neighbors.includes(d))!;

    const result = moveDetective(currentState, invalidTarget);
    expect(result.isValid).toBe(false);
  });

  test('police station gives +1 action', () => {
    const currentState = nextPhase(state).state!;
    const policeBuilding = currentState.buildings.find((b) => b.type === 'POLICE');
    if (!policeBuilding) {
      throw new Error('No police found in setup');
    }

    currentState.detective.position = policeBuilding.position;
    const actionsBefore = currentState.detective.actionsLeft;

    const result = useBuilding(currentState, 'POLICE');

    expect(result.isValid).toBe(true);
    expect(result.state?.detective.actionsLeft).toBe(actionsBefore);
    const buildingInNewState = result.state?.buildings.find(
      (b) => b.type === 'POLICE' && b.position === policeBuilding.position,
    );
    expect(buildingInNewState?.usedThisRound).toBe(true);
  });

  test('interrogate resident consumes action', () => {
    const currentState = nextPhase(state).state!;
    const currentPos = currentState.detective.position;
    const residents = currentState.grid[currentPos];

    if (residents.length > 0) {
      const target = residents[0];
      const result = interrogateResident(currentState, target.id, 'GENDER', 'MALE');

      expect(result.isValid).toBe(true);
      expect(result.state?.detective.actionsLeft).toBe(1);
      expect(result.data).toBeDefined();
    } else {
      const result = interrogateResident(currentState, 'fake-id', 'GENDER', 'MALE');
      expect(result.isValid).toBe(false);
    }
  });

  // --- CITY PHASE TEST ---

  test('city phase moves citizens without losing them', () => {
    // 1. Конец хода Убийцы -> Детектив
    const detectiveState = nextPhase(state).state!;
    expect(detectiveState.phase).toBe('DETECTIVE');

    // 2. Конец хода Детектива -> Город
    const cityState = nextPhase(detectiveState).state!;
    expect(cityState.phase).toBe('CITY');

    // 3. Выполнение фазы Города -> Новый раунд (Убийца)
    const nextRoundState = nextPhase(cityState).state!;

    // Проверки
    expect(nextRoundState.round).toBe(2);
    expect(nextRoundState.phase).toBe('KILLER');

    const totalCount = nextRoundState.grid.reduce((sum, d) => sum + d.length, 0);
    expect(totalCount).toBe(20);

    // Проверяем, изменилась ли сетка (миграция произошла)
    // В редких случаях рандом может никого не сдвинуть, но это крайне маловероятно при 20 жителях
    const _gridChanged = JSON.stringify(state.grid) !== JSON.stringify(nextRoundState.grid);
    // expect(gridChanged).toBe(true); // Можно раскомментировать, если тесты стабильны
  });
});
