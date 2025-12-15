import { describe, expect, test } from 'vitest';
import {
  autoPlaceBuildings,
  autoPlaceCitizens,
  autoPlaceDetective,
  autoSelectMotives,
  autoSetup,
  createSetupState,
  nextSetupPhase,
  placeBuilding,
  placeCitizen,
  placeDetective,
  prevSetupPhase,
  removeCitizen,
  selectKillerIdentity,
  selectKillerMotive,
  selectMode,
  selectRole,
  setupToGameState,
  toggleMotive,
} from './setup';

describe('Setup: Инициализация', () => {
  test('создаёт начальное состояние', () => {
    const state = createSetupState();

    expect(state.phase).toBe('SELECT_MODE');
    expect(state.selectedMode).toBeNull();
    expect(state.selectedRole).toBeNull();
    expect(state.availableMotives).toHaveLength(12);
    expect(state.selectedMotives).toHaveLength(0);
    expect(state.availableCitizens).toHaveLength(20);
    expect(state.placedCitizens).toHaveLength(0);
    expect(state.availableBuildings).toHaveLength(8);
    expect(state.detectivePosition).toBeNull();
  });
});

describe('Setup: Выбор режима и роли', () => {
  test('выбирает режим LOGIC', () => {
    let state = createSetupState();
    state = selectMode(state, 'LOGIC');
    expect(state.selectedMode).toBe('LOGIC');
  });

  test('выбирает режим INTUITION', () => {
    let state = createSetupState();
    state = selectMode(state, 'INTUITION');
    expect(state.selectedMode).toBe('INTUITION');
  });

  test('выбирает роль KILLER', () => {
    let state = createSetupState();
    state = selectRole(state, 'KILLER');
    expect(state.selectedRole).toBe('KILLER');
  });

  test('выбирает роль DETECTIVE', () => {
    let state = createSetupState();
    state = selectRole(state, 'DETECTIVE');
    expect(state.selectedRole).toBe('DETECTIVE');
  });
});

describe('Setup: Выбор мотивов', () => {
  test('добавляет мотив', () => {
    const state = createSetupState();
    const result = toggleMotive(state, 'MANIAC');

    expect(result.error).toBeUndefined();
    expect(result.state.selectedMotives).toContain('MANIAC');
  });

  test('убирает мотив', () => {
    let state = createSetupState();
    state = toggleMotive(state, 'MANIAC').state;
    const result = toggleMotive(state, 'MANIAC');

    expect(result.state.selectedMotives).not.toContain('MANIAC');
  });

  test('не позволяет выбрать более 6 мотивов', () => {
    let state = createSetupState();

    // Выбираем 6 мотивов
    state = toggleMotive(state, 'MANIAC').state;
    state = toggleMotive(state, 'SADIST').state;
    state = toggleMotive(state, 'HEADHUNTER').state;
    state = toggleMotive(state, 'VIGILANTE').state;
    state = toggleMotive(state, 'KILLER').state;
    state = toggleMotive(state, 'TERRORIST').state;

    expect(state.selectedMotives).toHaveLength(6);

    // Попытка добавить 7-й
    const result = toggleMotive(state, 'PSYCHOPATH');
    expect(result.error).toContain('только 6');
    expect(result.state.selectedMotives).toHaveLength(6);
  });

  test('автоматически выбирает 6 мотивов', () => {
    let state = createSetupState();
    state = autoSelectMotives(state);

    expect(state.selectedMotives).toHaveLength(6);
  });
});

describe('Setup: Расстановка жителей', () => {
  test('размещает жителя в квартале', () => {
    const state = createSetupState();
    const citizenId = state.availableCitizens[0].id;

    const result = placeCitizen(state, citizenId, 0);

    expect(result.error).toBeUndefined();
    expect(result.state.placedCitizens).toHaveLength(1);
    expect(result.state.placedCitizens[0]).toEqual({
      citizenId,
      districtIndex: 0,
    });
  });

  test('не позволяет разместить более 3 жителей в квартале', () => {
    let state = createSetupState();

    // Размещаем 3 жителей в квартале 0
    state = placeCitizen(state, state.availableCitizens[0].id, 0).state;
    state = placeCitizen(state, state.availableCitizens[1].id, 0).state;
    state = placeCitizen(state, state.availableCitizens[2].id, 0).state;

    // Попытка добавить 4-го
    const result = placeCitizen(state, state.availableCitizens[3].id, 0);
    expect(result.error).toContain('3 жителя');
  });

  test('не позволяет разместить жителя дважды', () => {
    let state = createSetupState();
    const citizenId = state.availableCitizens[0].id;

    state = placeCitizen(state, citizenId, 0).state;
    const result = placeCitizen(state, citizenId, 1);

    expect(result.error).toContain('уже размещён');
  });

  test('убирает жителя с поля', () => {
    let state = createSetupState();
    const citizenId = state.availableCitizens[0].id;

    state = placeCitizen(state, citizenId, 0).state;
    state = removeCitizen(state, citizenId);

    expect(state.placedCitizens).toHaveLength(0);
  });

  test('автоматически расставляет всех жителей', () => {
    let state = createSetupState();
    state = autoPlaceCitizens(state);

    expect(state.placedCitizens).toHaveLength(20);

    // Проверяем что в каждом квартале не более 3
    const districtCounts = new Array(16).fill(0);
    for (const p of state.placedCitizens) {
      districtCounts[p.districtIndex]++;
    }
    expect(districtCounts.every((c) => c <= 3)).toBe(true);
  });
});

describe('Setup: Расстановка зданий', () => {
  test('размещает здание', () => {
    const state = createSetupState();
    const result = placeBuilding(state, 'POLICE', 0);

    expect(result.error).toBeUndefined();
    const placed = result.state.availableBuildings.find((b) => b.type === 'POLICE' && b.placed);
    expect(placed?.position).toBe(0);
  });

  test('не позволяет два здания в одном квартале', () => {
    let state = createSetupState();
    state = placeBuilding(state, 'POLICE', 0).state;
    const result = placeBuilding(state, 'DINER', 0);

    expect(result.error).toContain('уже есть здание');
  });

  test('автоматически расставляет все здания', () => {
    let state = createSetupState();
    state = autoPlaceBuildings(state);

    const placedCount = state.availableBuildings.filter((b) => b.placed).length;
    expect(placedCount).toBe(8);
  });
});

describe('Setup: Размещение детектива', () => {
  test('размещает детектива', () => {
    const state = createSetupState();
    const result = placeDetective(state, 5);

    expect(result.error).toBeUndefined();
    expect(result.state.detectivePosition).toBe(5);
  });

  test('автоматически размещает детектива', () => {
    let state = createSetupState();
    state = autoPlaceDetective(state);

    expect(state.detectivePosition).toBeGreaterThanOrEqual(0);
    expect(state.detectivePosition).toBeLessThanOrEqual(15);
  });
});

describe('Setup: Выбор убийцы', () => {
  test('выбирает личность убийцы', () => {
    let state = createSetupState();
    state = autoPlaceCitizens(state);

    const citizenId = state.placedCitizens[0].citizenId;
    const result = selectKillerIdentity(state, citizenId);

    expect(result.error).toBeUndefined();
    expect(result.state.killerIdentityId).toBe(citizenId);
  });

  test('не позволяет выбрать неразмещённого жителя', () => {
    const state = createSetupState();
    // Жители не размещены
    const citizenId = state.availableCitizens[0].id;
    const result = selectKillerIdentity(state, citizenId);

    expect(result.error).toContain('размещён на поле');
  });

  test('выбирает мотив убийцы', () => {
    let state = createSetupState();
    state = autoSelectMotives(state);

    const motive = state.selectedMotives[0];
    const result = selectKillerMotive(state, motive);

    expect(result.error).toBeUndefined();
    expect(result.state.killerMotive).toBe(motive);
  });

  test('не позволяет выбрать невыбранный мотив', () => {
    const state = createSetupState();
    state.selectedMotives = ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'];

    const result = selectKillerMotive(state, 'PSYCHOPATH');
    expect(result.error).toContain('не входит');
  });
});

describe('Setup: Переходы между этапами', () => {
  test('переходит к следующему этапу после выбора режима', () => {
    let state = createSetupState();
    state = selectMode(state, 'LOGIC');

    const result = nextSetupPhase(state);
    expect(result.error).toBeUndefined();
    expect(result.state.phase).toBe('SELECT_PLAY_MODE');
  });

  test('не переходит без выбора режима', () => {
    const state = createSetupState();
    const result = nextSetupPhase(state);

    expect(result.error).toContain('Выберите режим');
  });

  test('возвращается к предыдущему этапу', () => {
    let state = createSetupState();
    state = selectMode(state, 'LOGIC');
    state = nextSetupPhase(state).state;

    expect(state.phase).toBe('SELECT_PLAY_MODE');

    state = prevSetupPhase(state);
    expect(state.phase).toBe('SELECT_MODE');
  });

  test('детектив пропускает этапы выбора убийцы', () => {
    let state = createSetupState();
    state = selectMode(state, 'LOGIC');
    state = selectRole(state, 'DETECTIVE');
    state = autoSelectMotives(state);
    state = autoPlaceCitizens(state);
    state = autoPlaceBuildings(state);
    state = autoPlaceDetective(state);

    // Проходим все этапы
    state = nextSetupPhase(state).state; // SELECT_MODE -> SELECT_ROLE
    state = nextSetupPhase(state).state; // SELECT_ROLE -> SELECT_MOTIVES
    state = nextSetupPhase(state).state; // SELECT_MOTIVES -> PLACE_CITIZENS
    state = nextSetupPhase(state).state; // PLACE_CITIZENS -> PLACE_BUILDINGS
    state = nextSetupPhase(state).state; // PLACE_BUILDINGS -> PLACE_DETECTIVE
    state = nextSetupPhase(state).state; // PLACE_DETECTIVE -> READY (пропускает SELECT_KILLER и SELECT_MOTIVE)

    expect(state.phase).toBe('READY');
  });
});

describe('Setup: Автонастройка', () => {
  test('полностью настраивает игру за убийцу', () => {
    const state = autoSetup('LOGIC', 'KILLER');

    expect(state.phase).toBe('READY');
    expect(state.selectedMode).toBe('LOGIC');
    expect(state.selectedRole).toBe('KILLER');
    expect(state.selectedMotives).toHaveLength(6);
    expect(state.placedCitizens).toHaveLength(20);
    expect(state.detectivePosition).not.toBeNull();
    expect(state.killerIdentityId).not.toBeNull();
    expect(state.killerMotive).not.toBeNull();
  });

  test('полностью настраивает игру за детектива', () => {
    const state = autoSetup('LOGIC', 'DETECTIVE');

    expect(state.phase).toBe('READY');
    expect(state.selectedRole).toBe('DETECTIVE');
    // Для детектива killerIdentityId остаётся null (AI выберет)
  });
});

describe('Setup: Конвертация в GameState', () => {
  test('конвертирует готовую настройку в GameState', () => {
    const setup = autoSetup('LOGIC', 'KILLER');
    const result = setupToGameState(setup);

    expect('error' in result).toBe(false);

    const gameState = result as any;
    expect(gameState.mode).toBe('LOGIC');
    expect(gameState.phase).toBe('KILLER');
    expect(gameState.step).toBe('FRIGHTEN');
    expect(gameState.round).toBe(1);
    expect(gameState.grid).toHaveLength(16);
    expect(gameState.buildings).toHaveLength(8);
    expect(gameState.killer.identity).toBeDefined();
    expect(gameState.killer.motive).toBeDefined();
  });

  test('не конвертирует незаконченную настройку', () => {
    const setup = createSetupState();
    const result = setupToGameState(setup);

    expect('error' in result).toBe(true);
  });
});
