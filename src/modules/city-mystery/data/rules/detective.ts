import { interrogate, performTracking } from '../engine';
import { areDistrictsAdjacent, getDistrictForResident } from '../gameConstants';
import type { BuildingType, GameState, QuestionType } from '../gameTypes';
import { cloneState, type GameRuleResult } from './utils';

export function moveDetective(state: GameState, toDistrict: number): GameRuleResult {
  if (state.phase !== 'DETECTIVE') {
    return { isValid: false, error: 'Сейчас не фаза детектива' };
  }
  if (state.detective.movementPoints < 1) {
    return { isValid: false, error: 'Нет очков движения' };
  }
  if (toDistrict < 0 || toDistrict > 15) {
    return { isValid: false, error: 'Неверный индекс квартала' };
  }
  if (!areDistrictsAdjacent(state.detective.position, toDistrict)) {
    return { isValid: false, error: 'Можно перемещаться только в соседние кварталы' };
  }

  const newState = cloneState(state);
  newState.detective.position = toDistrict;
  newState.detective.movementPoints--;

  return { isValid: true, state: newState };
}

export function interrogateResident(
  state: GameState,
  residentId: string,
  question: QuestionType,
  value: string,
): GameRuleResult {
  if (state.detective.actionsLeft < 1) {
    return { isValid: false, error: 'Не осталось действий' };
  }

  const resident = state.grid.flat().find((c) => c.id === residentId);
  if (!resident) {
    return { isValid: false, error: 'Житель не найден' };
  }

  const residentDistrict = getDistrictForResident(residentId, state.grid);
  if (residentDistrict !== state.detective.position) {
    return { isValid: false, error: 'Житель не в вашем квартале' };
  }
  if (state.frightenedResidents.includes(residentId)) {
    return { isValid: false, error: 'Житель запуган и не будет отвечать' };
  }

  const dinerInDistrict = state.buildings.find(
    (b) => b.type === 'DINER' && b.position === state.detective.position,
  );
  const forceTruth = !!dinerInDistrict;

  const result = interrogate(resident, question, value, state, forceTruth);

  const newState = cloneState(state);
  newState.detective.actionsLeft--;

  return { isValid: true, state: newState, data: result };
}
/**
 * ПОЛИЦЕЙСКИЙ УЧАСТОК
 * Положить жетон слежки на жителя в этом или соседнем квартале
 */
export function usePoliceStation(state: GameState, targetResidentId: string): GameRuleResult {
  if (state.detective.actionsLeft < 1) {
    return { isValid: false, error: 'Не осталось действий' };
  }

  const building = state.buildings.find(
    (b) => b.type === 'POLICE' && b.position === state.detective.position,
  );
  if (!building) {
    return { isValid: false, error: 'В этом квартале нет полицейского участка' };
  }

  // Проверяем что житель в этом или соседнем квартале
  const residentDistrict = getDistrictForResident(targetResidentId, state.grid);
  if (residentDistrict === null) {
    return { isValid: false, error: 'Житель не найден' };
  }

  const isHere = residentDistrict === state.detective.position;
  const isAdjacent = areDistrictsAdjacent(state.detective.position, residentDistrict);
  if (!isHere && !isAdjacent) {
    return {
      isValid: false,
      error: 'Жетон слежки можно положить только на жителя в этом или соседнем квартале',
    };
  }

  const newState = cloneState(state);
  newState.detective.trackingToken = {
    residentId: targetResidentId,
    districtIndex: residentDistrict,
  };
  newState.detective.actionsLeft--;

  const stateWithUsedPolice = {
    ...newState,
    buildings: newState.buildings.map((b) =>
      b.type === 'POLICE' ? { ...b, usedThisRound: true } : b,
    ),
  };
  return { isValid: true, state: stateWithUsedPolice };
}

/**
 * БОЛЬНИЦА
 * Успокоить одного запуганного жителя в этом или соседнем квартале
 */
export function useHospital(state: GameState, targetResidentId: string): GameRuleResult {
  if (state.detective.actionsLeft < 1) {
    return { isValid: false, error: 'Не осталось действий' };
  }

  const building = state.buildings.find(
    (b) => b.type === 'HOSPITAL' && b.position === state.detective.position,
  );
  if (!building) {
    return { isValid: false, error: 'В этом квартале нет больницы' };
  }

  // Проверяем что житель запуган
  if (!state.frightenedResidents.includes(targetResidentId)) {
    return { isValid: false, error: 'Этот житель не запуган' };
  }

  // Проверяем что житель в этом или соседнем квартале
  const residentDistrict = getDistrictForResident(targetResidentId, state.grid);
  if (residentDistrict === null) {
    return { isValid: false, error: 'Житель не найден' };
  }

  const isHere = residentDistrict === state.detective.position;
  const isAdjacent = areDistrictsAdjacent(state.detective.position, residentDistrict);
  if (!isHere && !isAdjacent) {
    return { isValid: false, error: 'Можно успокоить только жителя в этом или соседнем квартале' };
  }

  const newState = cloneState(state);
  newState.frightenedResidents = newState.frightenedResidents.filter(
    (id) => id !== targetResidentId,
  );
  newState.detective.actionsLeft--;

  return { isValid: true, state: newState };
}

/**
 * ЗАКУСОЧНАЯ
 * Допросить одного незапуганного жителя в этом или соседнем квартале
 */
export function useDiner(
  state: GameState,
  targetResidentId: string,
  question: QuestionType,
  value: string,
): GameRuleResult {
  if (state.detective.actionsLeft < 1) {
    return { isValid: false, error: 'Не осталось действий' };
  }

  const building = state.buildings.find(
    (b) => b.type === 'DINER' && b.position === state.detective.position,
  );
  if (!building) {
    return { isValid: false, error: 'В этом квартале нет закусочной' };
  }

  const resident = state.grid.flat().find((c) => c.id === targetResidentId);
  if (!resident) {
    return { isValid: false, error: 'Житель не найден' };
  }

  // Проверяем что житель не запуган
  if (state.frightenedResidents.includes(targetResidentId)) {
    return { isValid: false, error: 'Житель запуган и не будет отвечать' };
  }

  // Проверяем что житель в этом или соседнем квартале
  const residentDistrict = getDistrictForResident(targetResidentId, state.grid);
  if (residentDistrict === null) {
    return { isValid: false, error: 'Житель не найден' };
  }

  const isHere = residentDistrict === state.detective.position;
  const isAdjacent = areDistrictsAdjacent(state.detective.position, residentDistrict);
  if (!isHere && !isAdjacent) {
    return { isValid: false, error: 'Можно допросить только жителя в этом или соседнем квартале' };
  }

  const result = interrogate(resident, question, value, state, false);

  const newState = cloneState(state);
  newState.detective.actionsLeft--;

  return { isValid: true, state: newState, data: result };
}

/**
 * ПОЖАРНАЯ ЧАСТЬ
 * Тянуть случайный жетон соцгруппы, переместить жителей этой группы
 * Возвращает выпавшую соцгруппу в data.faction
 */
export function useFireStation(state: GameState): GameRuleResult {
  if (state.detective.actionsLeft < 1) {
    return { isValid: false, error: 'Не осталось действий' };
  }

  const building = state.buildings.find(
    (b) => b.type === 'FIRE_STATION' && b.position === state.detective.position,
  );
  if (!building) {
    return { isValid: false, error: 'В этом квартале нет пожарной части' };
  }

  // Тянем случайную соцгруппу
  const factions = [
    'LAW',
    'PRESS',
    'MEDICINE',
    'CRIME',
    'POWER',
    'BOHEMIA',
    'MARGINALS',
    'WORKERS',
    'MIGRANTS',
  ];
  const randomFaction = factions[Math.floor(Math.random() * factions.length)];

  const newState = cloneState(state);
  newState.detective.actionsLeft--;

  // Возвращаем соцгруппу — UI должен дать игроку переместить жителей
  return {
    isValid: true,
    state: newState,
    data: { faction: randomFaction },
  };
}

// Старая функция useBuilding оставлена для совместимости (deprecated)
export function useBuilding(_state: GameState, _buildingType: BuildingType): GameRuleResult {
  return {
    isValid: false,
    // biome-ignore lint/security/noSecrets: false positive (human-readable error message, not a secret)
    error: 'Используйте usePoliceStation, useHospital, useDiner или useFireStation',
  };
}

export function trackResident(state: GameState, residentId: string): GameRuleResult {
  const resident = state.grid.flat().find((c) => c.id === residentId);
  if (!resident) {
    return { isValid: false, error: 'Житель не найден' };
  }

  if (state.detective.trackingToken.residentId !== residentId) {
    return { isValid: false, error: 'На этом жителе нет жетона слежки' };
  }

  const trackingResult = performTracking(residentId, state);
  const newState = cloneState(state);
  newState.detective.trackingToken = { residentId: null, districtIndex: null };

  return { isValid: true, state: newState, data: trackingResult };
}

/**
 * Финальное обвинение детектива
 * Детектив называет убийцу И его мотив
 * Если оба верны — победа детектива
 * Если хотя бы один неверен — победа убийцы
 */
export function makeAccusation(
  state: GameState,
  suspectId: string,
  motive: string,
): GameRuleResult {
  if (state.phase !== 'DETECTIVE') {
    return { isValid: false, error: 'Обвинение можно предъявить только в фазе детектива' };
  }

  if (state.isGameOver) {
    return { isValid: false, error: 'Игра уже завершена' };
  }

  // Проверяем что подозреваемый существует на поле
  const suspect = state.grid.flat().find((c) => c.id === suspectId);
  if (!suspect) {
    return { isValid: false, error: 'Подозреваемый не найден на поле' };
  }

  // Проверяем что мотив из доступных
  if (!state.availableMotives.includes(motive as (typeof state.availableMotives)[number])) {
    return { isValid: false, error: 'Этот мотив не входит в игру' };
  }

  const newState = cloneState(state);
  newState.isGameOver = true;

  const correctKiller = suspectId === state.killer.identity.id;
  const correctMotive = motive === state.killer.motive;

  if (correctKiller && correctMotive) {
    // Детектив угадал обоих
    newState.winner = 'DETECTIVE';
    newState.reason = 'Детектив верно назвал убийцу и мотив';
  } else if (correctKiller) {
    // Угадал убийцу, но не мотив
    newState.winner = 'KILLER';
    newState.reason = 'Детектив назвал убийцу, но ошибся с мотивом';
  } else if (correctMotive) {
    // Угадал мотив, но не убийцу
    newState.winner = 'KILLER';
    newState.reason = 'Детектив угадал мотив, но ошибся с убийцей';
  } else {
    // Не угадал ничего
    newState.winner = 'KILLER';
    newState.reason = 'Детектив ошибся и с убийцей, и с мотивом';
  }

  return {
    isValid: true,
    state: newState,
    data: {
      correctKiller,
      correctMotive,
      actualKiller: state.killer.identity.id,
      actualMotive: state.killer.motive,
    },
  };
}
