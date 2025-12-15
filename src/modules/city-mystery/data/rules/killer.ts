import type { Citizen } from '../citizens';
import { getAdjacentDistricts, getDistrictForResident, MOTIVE_CARDS } from '../gameConstants';
import type { GameState } from '../gameTypes';
import { cloneState, type GameRuleResult, shuffle } from './utils';

export function frightenResidents(state: GameState, residentIds: string[]): GameRuleResult {
  if (state.phase !== 'KILLER' || state.step !== 'FRIGHTEN') {
    return { isValid: false, error: 'Сейчас не этап запугивания' };
  }

  if (residentIds.length !== 2) {
    return { isValid: false, error: 'Нужно выбрать ровно 2 жителей' };
  }

  const allResidents = state.grid.flat();
  const validResidents = residentIds.every((id) => allResidents.some((r) => r.id === id));

  if (!validResidents) {
    return { isValid: false, error: 'Один или несколько жителей не найдены' };
  }

  const detectivePos = state.detective.position;
  for (const id of residentIds) {
    const district = getDistrictForResident(id, state.grid);
    if (district === detectivePos) {
      return { isValid: false, error: 'Нельзя запугать жителей в квартале с детективом' };
    }
  }

  const newState = cloneState(state);
  for (const id of residentIds) {
    if (!newState.frightenedResidents.includes(id)) {
      newState.frightenedResidents.push(id);
    }
  }
  newState.killer.frightenedThisRound = residentIds;
  newState.step = 'KILL';

  return { isValid: true, state: newState };
}

function checkMotive(victim: Citizen, state: GameState): { isValid: boolean; error?: string } {
  const motiveCard = MOTIVE_CARDS[state.killer.motive];
  if (!motiveCard) {
    return { isValid: false, error: 'Мотив не найден' };
  }
  if (motiveCard.condition(victim, state)) {
    return { isValid: true };
  }
  return {
    isValid: false,
    error: `Не соответствует мотиву "${motiveCard.name}": ${motiveCard.description}`,
  };
}

/**
 * Разбегание жителей после убийства
 * Оставшиеся жители квартала убегают в соседние кварталы
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: scatterResidents is intentionally verbose; refactor later.
function scatterResidents(
  grid: Citizen[][],
  crimeSceneIndex: number,
  crimeScenes: number[],
): Citizen[][] {
  const newGrid = grid.map((district) => [...district]);
  const residentsToScatter = [...newGrid[crimeSceneIndex]];

  // Очищаем квартал преступления
  newGrid[crimeSceneIndex] = [];

  // Получаем соседние кварталы
  const adjacentDistricts = getAdjacentDistricts(crimeSceneIndex);

  // Перемешиваем жителей и кварталы для случайности
  const shuffledResidents = shuffle(residentsToScatter);
  const shuffledDistricts = shuffle(adjacentDistricts);

  for (const resident of shuffledResidents) {
    let placed = false;

    // Ищем квартал с местом (не более 3, не место преступления)
    for (const districtIndex of shuffledDistricts) {
      if (newGrid[districtIndex].length < 3 && !crimeScenes.includes(districtIndex)) {
        newGrid[districtIndex].push(resident);
        placed = true;
        break;
      }
    }

    // Если все соседние заняты — ищем любой свободный квартал
    if (!placed) {
      for (let i = 0; i < 16; i++) {
        if (i !== crimeSceneIndex && newGrid[i].length < 3 && !crimeScenes.includes(i)) {
          newGrid[i].push(resident);
          break;
        }
      }
    }
  }

  return newGrid;
}

export function killResident(
  state: GameState,
  residentId: string,
  _districtIndex: number,
): GameRuleResult {
  if (state.step !== 'KILL') {
    return { isValid: false, error: 'Сейчас не этап убийства' };
  }

  if (state.awaitingFinalAccusation) {
    return { isValid: false, error: 'Ожидается финальное обвинение детектива' };
  }

  const victim = state.grid.flat().find((c) => c.id === residentId);
  if (!victim) {
    return { isValid: false, error: 'Жертва не найдена' };
  }

  const victimDistrict = getDistrictForResident(residentId, state.grid);

  if (victimDistrict == null) {
    return { isValid: false, error: 'Квартал жертвы не найден' };
  }

  // Проверки
  if (residentId === state.killer.identity.id) {
    return { isValid: false, error: 'Убийца не может совершить самоубийство' };
  }
  if (victimDistrict === state.detective.position) {
    return { isValid: false, error: 'Нельзя убить в квартале с детективом' };
  }

  const motiveCheck = checkMotive(victim, state);
  if (!motiveCheck.isValid) {
    return { isValid: false, error: motiveCheck.error };
  }

  // Применяем убийство
  const newState = cloneState(state);

  // Удаляем жертву
  const district = newState.grid[victimDistrict];
  const victimIndex = district.findIndex((c) => c.id === residentId);
  if (victimIndex > -1) {
    district.splice(victimIndex, 1);
  }

  // Добавляем место преступления
  newState.crimeScenes.push(victimDistrict);

  // Разбегание жителей из квартала убийства
  newState.grid = scatterResidents(newState.grid, victimDistrict, newState.crimeScenes);

  // Добавляем жертву в список
  newState.victims.push(victim);

  // Пятое убийство: игра не заканчивается сразу — ждём финального обвинения детектива
  if (newState.victims.length >= 5) {
    newState.awaitingFinalAccusation = true;
    newState.finalRound = true;
  }

  // Завершаем фазу убийцы: ход детектива

  newState.phase = 'DETECTIVE';

  newState.step = 'URGENT_CALL';

  newState.detective.actionsLeft = 2;

  newState.detective.movementPoints = 2;
  return { isValid: true, state: newState };
}

export function passKill(state: GameState): GameRuleResult {
  if (state.step !== 'KILL') {
    return { isValid: false, error: 'Сейчас не этап убийства' };
  }

  if (state.awaitingFinalAccusation) {
    return { isValid: false, error: 'Ожидается финальное обвинение детектива' };
  }
  if (state.maxRounds !== 5) {
    return { isValid: false, error: 'Убийство можно пропустить только один раз за игру' };
  }

  const newState = cloneState(state);
  newState.maxRounds = 6;
  // Завершаем фазу убийцы: ход детектива
  newState.phase = 'DETECTIVE';
  newState.step = 'URGENT_CALL';
  newState.detective.actionsLeft = 2;
  newState.detective.movementPoints = 2;
  return { isValid: true, state: newState };
}
