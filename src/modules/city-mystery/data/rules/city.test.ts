import { describe, test, expect } from 'vitest';
import { createGame } from './init';
import { addPopulation, moveCitizens, performCityPhase } from './city';
import { allCitizens } from '../citizens';

describe('City: Работа с населением', () => {
  test('добавляет новых жителей в город', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    // Переходим в фазу города
    state.phase = 'CITY';
    state.step = 'POPULATION';
    
    const citizensBefore = state.grid.flat().length;
    
    const result = addPopulation(state);
    
    expect(result.isValid).toBe(true);
    expect(result.state!.step).toBe('MOVEMENT');
    
    const citizensAfter = result.state!.grid.flat().length;
    
    // Должно добавиться до 3 жителей
    expect(citizensAfter).toBeGreaterThanOrEqual(citizensBefore);
    expect(citizensAfter).toBeLessThanOrEqual(citizensBefore + 3);
  });

  test('не добавляет жителей на места преступлений', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'POPULATION';
    
    // Делаем много мест преступлений
    state.crimeScenes = [0, 1, 2, 3, 4, 5];
    // Очищаем эти кварталы
    for (const scene of state.crimeScenes) {
      state.grid[scene] = [];
    }
    
    const result = addPopulation(state);
    
    expect(result.isValid).toBe(true);
    
    // Места преступлений должны остаться пустыми
    for (const scene of state.crimeScenes) {
      expect(result.state!.grid[scene]).toHaveLength(0);
    }
  });

  test('не добавляет больше 3 жителей в квартал', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'POPULATION';
    
    const result = addPopulation(state);
    
    expect(result.isValid).toBe(true);
    
    // Ни один квартал не должен иметь > 3 жителей
    for (let i = 0; i < 16; i++) {
      expect(result.state!.grid[i].length).toBeLessThanOrEqual(3);
    }
  });

  test('нельзя добавить население в неправильную фазу', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    // Фаза убийцы
    state.phase = 'KILLER';
    
    const result = addPopulation(state);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('не этап');
  });
});

describe('City: Перемещение жителей', () => {
  test('перемещает жителей', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'MOVEMENT';
    
    // Общее количество жителей не должно измениться
    const totalBefore = state.grid.flat().length;
    
    const result = moveCitizens(state);
    
    expect(result.isValid).toBe(true);
    
    const totalAfter = result.state!.grid.flat().length;
    expect(totalAfter).toBe(totalBefore);
  });

  test('жители не перемещаются на места преступлений', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'MOVEMENT';
    state.crimeScenes = [0, 1, 2];
    
    // Очищаем места преступлений
    for (const scene of state.crimeScenes) {
      state.grid[scene] = [];
    }
    
    const result = moveCitizens(state);
    
    expect(result.isValid).toBe(true);
    
    // Места преступлений должны остаться пустыми
    for (const scene of state.crimeScenes) {
      expect(result.state!.grid[scene]).toHaveLength(0);
    }
  });

  test('не переполняет кварталы', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'MOVEMENT';
    
    const result = moveCitizens(state);
    
    expect(result.isValid).toBe(true);
    
    for (let i = 0; i < 16; i++) {
      expect(result.state!.grid[i].length).toBeLessThanOrEqual(3);
    }
  });
});

describe('City: Полный цикл', () => {
  test('выполняет полный цикл фазы города', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'POPULATION';
    
    const result = performCityPhase(state);
    
    expect(result.isValid).toBe(true);
    expect(result.state!.step).toBe('MOVEMENT');
  });

  test('жители не пропадают в полном цикле', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'CITY';
    state.step = 'POPULATION';
    
    const idsBefore = new Set(state.grid.flat().map(c => c.id));
    
    const result = performCityPhase(state);
    
    expect(result.isValid).toBe(true);
    
    // Все старые жители должны остаться
    const idsAfter = new Set(result.state!.grid.flat().map(c => c.id));
    for (const id of idsBefore) {
      expect(idsAfter.has(id)).toBe(true);
    }
  });
});
