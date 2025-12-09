import type { GameState, QuestionType, BuildingType } from '../gameTypes';
import { getDistrictForResident, areDistrictsAdjacent } from '../gameConstants';
import { interrogate, performTracking } from '../engine';
import { cloneState, type GameRuleResult } from './utils';

export function moveDetective(state: GameState, toDistrict: number): GameRuleResult {
  if (state.phase !== 'DETECTIVE') return { isValid: false, error: 'Сейчас не фаза детектива' };
  if (state.detective.movementPoints < 1) return { isValid: false, error: 'Нет очков движения' };
  if (toDistrict < 0 || toDistrict > 15) return { isValid: false, error: 'Неверный индекс квартала' };
  if (!areDistrictsAdjacent(state.detective.position, toDistrict)) return { isValid: false, error: 'Можно перемещаться только в соседние кварталы' };
  if (state.crimeScenes.includes(toDistrict)) return { isValid: false, error: 'Нельзя войти на место преступления' };
  
  const newState = cloneState(state);
  newState.detective.position = toDistrict;
  newState.detective.movementPoints--;
  
  return { isValid: true, state: newState };
}

export function interrogateResident(
  state: GameState, 
  residentId: string, 
  question: QuestionType, 
  value: string
): GameRuleResult {
  if (state.detective.actionsLeft < 1) return { isValid: false, error: 'Не осталось действий' };
  
  const resident = state.grid.flat().find(c => c.id === residentId);
  if (!resident) return { isValid: false, error: 'Житель не найден' };
  
  const residentDistrict = getDistrictForResident(residentId, state.grid);
  if (residentDistrict !== state.detective.position) return { isValid: false, error: 'Житель не в вашем квартале' };
  if (state.frightenedResidents.includes(residentId)) return { isValid: false, error: 'Житель запуган и не будет отвечать' };
  
  const dinerInDistrict = state.buildings.find(b => b.type === 'DINER' && b.position === state.detective.position);
  const forceTruth = !!dinerInDistrict;
  
  const result = interrogate(resident, question, value, state, forceTruth);
  
  const newState = cloneState(state);
  newState.detective.actionsLeft--;
  
  return { isValid: true, state: newState, data: result };
}

export function useBuilding(state: GameState, buildingType: BuildingType): GameRuleResult {
  if (state.detective.actionsLeft < 1) return { isValid: false, error: 'Не осталось действий' };
  
  const building = state.buildings.find(b => b.type === buildingType && b.position === state.detective.position);
  if (!building) return { isValid: false, error: 'В этом квартале нет такого здания' };
  if (building.usedThisRound) return { isValid: false, error: 'Это здание уже использовано в этом раунде' };
  
  const newState = cloneState(state);
  const buildingInState = newState.buildings.find(b => b.type === buildingType && b.position === state.detective.position)!;
  buildingInState.usedThisRound = true;
  newState.detective.actionsLeft--;
  
  switch (buildingType) {
    case 'POLICE':
      newState.detective.actionsLeft++;
      break;
    case 'FIRE_STATION':
      const currentPos = state.detective.position;
      const scenesToRemove = state.crimeScenes.filter(scene => 
          scene === currentPos || areDistrictsAdjacent(scene, currentPos)
      );
      if (scenesToRemove.length > 0) {
          newState.crimeScenes = newState.crimeScenes.filter(s => !scenesToRemove.includes(s));
      }
      break;
  }
  
  return { isValid: true, state: newState };
}

export function trackResident(state: GameState, residentId: string): GameRuleResult {
  const resident = state.grid.flat().find(c => c.id === residentId);
  if (!resident) return { isValid: false, error: 'Житель не найден' };
  
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
  motive: string
): GameRuleResult {
  if (state.phase !== 'DETECTIVE') {
    return { isValid: false, error: 'Обвинение можно предъявить только в фазе детектива' };
  }
  
  if (state.isGameOver) {
    return { isValid: false, error: 'Игра уже завершена' };
  }
  
  // Проверяем что подозреваемый существует на поле
  const suspect = state.grid.flat().find(c => c.id === suspectId);
  if (!suspect) {
    return { isValid: false, error: 'Подозреваемый не найден на поле' };
  }
  
  // Проверяем что мотив из доступных
  if (!state.availableMotives.includes(motive as any)) {
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
    }
  };
}
