/**
 * Логика слежки за жителями
 * 
 * Правила:
 * - Детектив кладёт жетон слежки на жителя (действие полицейского участка)
 * - Потом может спросить: "Можешь ли ты убить этого жителя?"
 * - Убийца ОБЯЗАН ответить честно
 * - Ответ "нет" если: житель = убийца ИЛИ не подходит под мотив
 */

import type { Citizen } from '../citizens';
import type { GameState, Motive } from '../gameTypes';
import { MOTIVE_CARDS } from '../gameConstants';

export interface TrackingResult {
  canKill: boolean;
  reason?: string; // Для отладки, не показываем игроку
}

/**
 * Проверить, может ли убийца убить этого жителя прямо сейчас
 */
export function canKillerMurder(
  resident: Citizen,
  gameState: GameState
): TrackingResult {
  const { killer, detective, frightenedResidents, grid, crimeScenes } = gameState;

  // 1. Нельзя убить самого себя
  if (resident.id === killer.identity.id) {
    return { canKill: false, reason: 'Это сам убийца' };
  }

  // 2. Нельзя убить в квартале с детективом
  const residentDistrict = findResidentDistrict(resident.id, grid);
  if (residentDistrict === detective.position) {
    return { canKill: false, reason: 'Житель в квартале с детективом' };
  }

  // 3. Нельзя убить на месте преступления (жители туда не могут попасть, но на всякий случай)
  if (residentDistrict !== null && crimeScenes.includes(residentDistrict)) {
    return { canKill: false, reason: 'Житель на месте преступления' };
  }

  // 4. Проверяем мотив
  const motiveCard = MOTIVE_CARDS[killer.motive];
  if (!motiveCard) {
    return { canKill: false, reason: 'Неизвестный мотив' };
  }

  try {
    const matchesMotive = motiveCard.condition(resident, gameState);
    if (!matchesMotive) {
      return { canKill: false, reason: `Не подходит под мотив "${motiveCard.name}"` };
    }
  } catch (error) {
    return { canKill: false, reason: `Ошибка проверки мотива: ${error}` };
  }

  // Всё ок — можно убить
  return { canKill: true };
}

/**
 * Найти квартал, где находится житель
 */
function findResidentDistrict(residentId: string, grid: Citizen[][]): number | null {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].some(r => r.id === residentId)) {
      return i;
    }
  }
  return null;
}

/**
 * Выполнить слежку (вопрос "можешь ли убить?")
 */
export function performTracking(
  residentId: string,
  gameState: GameState
): TrackingResult {
  const resident = gameState.grid.flat().find(r => r.id === residentId);
  
  if (!resident) {
    return { canKill: false, reason: 'Житель не найден' };
  }

  return canKillerMurder(resident, gameState);
}
