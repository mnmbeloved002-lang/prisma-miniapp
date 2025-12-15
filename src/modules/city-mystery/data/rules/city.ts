/**
 * Фаза города — работа с населением и перемещение жителей
 */

import { allCitizens, type Citizen } from '../citizens';
import { getAdjacentDistricts } from '../gameConstants';
import type { GameState } from '../gameTypes';
import { cloneState, type GameRuleResult, pickRandom, shuffle } from './utils';

/**
 * Шаг 1: Работа с населением
 * Добавить 3 новых жителя в город (если есть место)
 */
export function addPopulation(state: GameState): GameRuleResult {
  if (state.phase !== 'CITY' || state.step !== 'POPULATION') {
    return { isValid: false, error: 'Сейчас не этап работы с населением' };
  }

  const newState = cloneState(state);

  // Находим жителей которые ещё не на поле
  const citizensOnField = new Set(newState.grid.flat().map((c) => c.id));
  const citizensInReserve = allCitizens.filter((c) => !citizensOnField.has(c.id));

  // Выбираем до 3 жителей из резерва
  const newCitizens = pickRandom(citizensInReserve, Math.min(3, citizensInReserve.length));

  // Находим кварталы с местом (не места преступлений, не переполненные)
  const availableDistricts: number[] = [];
  for (let i = 0; i < 16; i++) {
    if (!newState.crimeScenes.includes(i) && newState.grid[i].length < 3) {
      availableDistricts.push(i);
    }
  }

  // Размещаем новых жителей
  let placedCount = 0;
  for (const citizen of newCitizens) {
    if (availableDistricts.length === 0) {
      break;
    }

    // Выбираем случайный квартал
    const randomIndex = Math.floor(Math.random() * availableDistricts.length);
    const districtIndex = availableDistricts[randomIndex];

    newState.grid[districtIndex].push(citizen);
    placedCount++;

    // Если квартал заполнился — убираем из доступных
    if (newState.grid[districtIndex].length >= 3) {
      availableDistricts.splice(randomIndex, 1);
    }
  }

  // Переходим к шагу перемещения
  newState.step = 'MOVEMENT';

  return {
    isValid: true,
    state: newState,
    data: {
      addedCitizens: placedCount,
      reserveLeft: citizensInReserve.length - placedCount,
    },
  };
}

/**
 * Шаг 2: Перемещение жителей по фракциям
 * Жители одной фракции стремятся быть ближе друг к другу
 */
export function moveCitizens(state: GameState): GameRuleResult {
  if (state.phase !== 'CITY' || state.step !== 'MOVEMENT') {
    return { isValid: false, error: 'Сейчас не этап перемещения' };
  }

  const newState = cloneState(state);
  newState.grid = performFactionMigration(newState.grid, newState.crimeScenes);

  return { isValid: true, state: newState };
}

/**
 * Перемещение жителей с учётом фракций
 * Жители стремятся к своей фракции
 */
function performFactionMigration(grid: Citizen[][], crimeScenes: number[]): Citizen[][] {
  const newGrid: Citizen[][] = grid.map((cell) => [...cell]);

  // Собираем информацию о фракциях по кварталам
  const factionCounts: Map<string, number[]>[] = [];
  for (let i = 0; i < 16; i++) {
    const counts = new Map<string, number>();
    for (const citizen of newGrid[i]) {
      counts.set(citizen.faction, (counts.get(citizen.faction) || 0) + 1);
    }
    factionCounts.push(counts as any);
  }

  // Перемещаем жителей (50% шанс для каждого квартала)
  const processOrder = shuffle([...Array(16).keys()]);

  for (const i of processOrder) {
    if (newGrid[i].length === 0) {
      continue;
    }
    if (crimeScenes.includes(i)) {
      continue;
    }
    if (Math.random() > 0.5) {
      continue;
    }

    // Выбираем случайного жителя из квартала
    const citizenIndex = Math.floor(Math.random() * newGrid[i].length);
    const citizen = newGrid[i][citizenIndex];

    // Ищем соседний квартал с жителями той же фракции
    const neighbors = getAdjacentDistricts(i);
    const validNeighbors = neighbors.filter(
      (n) => newGrid[n].length < 3 && !crimeScenes.includes(n),
    );

    if (validNeighbors.length === 0) {
      continue;
    }

    // Приоритет: кварталы с той же фракцией
    const factionNeighbors = validNeighbors.filter((n) =>
      newGrid[n].some((c) => c.faction === citizen.faction),
    );

    const targetPool = factionNeighbors.length > 0 ? factionNeighbors : validNeighbors;
    const target = targetPool[Math.floor(Math.random() * targetPool.length)];

    // Перемещаем
    newGrid[i].splice(citizenIndex, 1);
    newGrid[target].push(citizen);
  }

  return newGrid;
}

/**
 * Полный цикл фазы города (для удобства)
 */
export function performCityPhase(state: GameState): GameRuleResult {
  if (state.phase !== 'CITY') {
    return { isValid: false, error: 'Сейчас не фаза города' };
  }

  let currentState = state;

  // Шаг 1: Добавление населения
  if (currentState.step === 'POPULATION') {
    const popResult = addPopulation(currentState);
    if (!popResult.isValid) {
      return popResult;
    }
    currentState = popResult.state!;
  }

  // Шаг 2: Перемещение
  if (currentState.step === 'MOVEMENT') {
    const moveResult = moveCitizens(currentState);
    if (!moveResult.isValid) {
      return moveResult;
    }
    currentState = moveResult.state!;
  }

  return { isValid: true, state: currentState };
}
