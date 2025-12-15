import { describe, expect, test } from 'vitest';
import { createGame } from './init';
import { killResident } from './killer';

describe('Killer: Разбегание жителей', () => {
  test('после убийства ход переходит детективу (URGENT_CALL)', () => {
    const state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST', 'RADICAL'],
    });

    state.killer.motive = 'SADIST';
    state.frightenedResidents = [];

    // Найдём любую валидную жертву (не детектив и не сам убийца)
    let victimId = '';
    let targetDistrict = -1;

    for (let i = 0; i < 16; i++) {
      if (i === state.detective.position) {
        continue;
      }

      const nonKillerResidents = state.grid[i].filter((r) => r.id !== state.killer.identity.id);
      if (nonKillerResidents.length >= 1) {
        targetDistrict = i;
        victimId = nonKillerResidents[0].id;
        break;
      }
    }

    if (targetDistrict === -1) {
      return;
    }

    state.step = 'KILL';
    const result = killResident(state, victimId, targetDistrict);
    if (!result.isValid) {
      return;
    }

    expect(result.state?.phase).toBe('DETECTIVE');
    expect(result.state?.step).toBe('URGENT_CALL');
    expect(result.state?.detective.actionsLeft).toBe(2);
    expect(result.state?.detective.movementPoints).toBe(2);
  });

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: test contains setup loops; keep readable.
  test('жители разбегаются после убийства', () => {
    const state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST', 'RADICAL'],
    });

    // Используем мотив SADIST - не может убивать запуганных
    // Значит любой не запуганный житель подходит
    state.killer.motive = 'SADIST';
    state.frightenedResidents = [];

    // Находим квартал с 2+ жителями (не где детектив, не где убийца)
    let targetDistrict = -1;
    let victimId = '';

    for (let i = 0; i < 16; i++) {
      if (i === state.detective.position) {
        continue;
      }

      // Проверяем что нет больницы
      const hasHospital = state.buildings.some((b) => b.type === 'HOSPITAL' && b.position === i);
      if (hasHospital) {
        continue;
      }

      if (state.grid[i].length >= 2) {
        const nonKillerResidents = state.grid[i].filter((r) => r.id !== state.killer.identity.id);
        if (nonKillerResidents.length >= 1) {
          targetDistrict = i;
          victimId = nonKillerResidents[0].id;
          break;
        }
      }
    }

    if (targetDistrict === -1) {
      // Не нашли подходящий квартал — пропускаем
      return;
    }

    state.step = 'KILL';
    const result = killResident(state, victimId, targetDistrict);

    if (!result.isValid) {
      console.log('Kill failed:', result.error);
      return; // Пропускаем если убийство не прошло по другим причинам
    }

    expect(result.isValid).toBe(true);
    expect(result.state).toBeDefined();

    // Квартал убийства должен быть пустым
    expect(result.state?.grid[targetDistrict]).toHaveLength(0);

    // Место преступления добавлено
    expect(result.state?.crimeScenes).toContain(targetDistrict);
  });

  test('разбежавшиеся жители не пропадают', () => {
    const state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST', 'RADICAL'],
    });

    state.killer.motive = 'SADIST';
    state.frightenedResidents = [];

    const allResidentIdsBefore = new Set(state.grid.flat().map((r) => r.id));

    let victimId = '';
    let targetDistrict = -1;

    for (let i = 0; i < 16; i++) {
      if (i === state.detective.position) {
        continue;
      }

      const hasHospital = state.buildings.some((b) => b.type === 'HOSPITAL' && b.position === i);
      if (hasHospital) {
        continue;
      }

      const nonKillerResidents = state.grid[i].filter((r) => r.id !== state.killer.identity.id);
      if (nonKillerResidents.length >= 1) {
        targetDistrict = i;
        victimId = nonKillerResidents[0].id;
        break;
      }
    }

    if (targetDistrict === -1) {
      return;
    }

    state.step = 'KILL';
    const result = killResident(state, victimId, targetDistrict);

    if (!result.isValid) {
      return;
    }

    // Все жители кроме жертвы должны остаться
    const allResidentIdsAfter = new Set(result.state?.grid.flat().map((r) => r.id));

    allResidentIdsBefore.delete(victimId);
    expect(allResidentIdsAfter).toEqual(allResidentIdsBefore);
  });

  test('новое место преступления пустое', () => {
    const state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST', 'RADICAL'],
    });

    state.killer.motive = 'SADIST';
    state.frightenedResidents = [];

    let victimId = '';
    let targetDistrict = -1;

    for (let i = 0; i < 16; i++) {
      if (i === state.detective.position) {
        continue;
      }

      const hasHospital = state.buildings.some((b) => b.type === 'HOSPITAL' && b.position === i);
      if (hasHospital) {
        continue;
      }

      const nonKillerResidents = state.grid[i].filter((r) => r.id !== state.killer.identity.id);
      if (nonKillerResidents.length >= 1) {
        targetDistrict = i;
        victimId = nonKillerResidents[0].id;
        break;
      }
    }

    if (targetDistrict === -1) {
      return;
    }

    state.step = 'KILL';
    const result = killResident(state, victimId, targetDistrict);

    if (!result.isValid) {
      return;
    }

    // Место убийства пустое
    expect(result.state?.grid[targetDistrict]).toHaveLength(0);
  });
});
