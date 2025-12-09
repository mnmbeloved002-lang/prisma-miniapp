/**
 * Константы для игры "Городской убийца"
 */

import type { Motive, MotiveCard } from './gameTypes';

// ==================== КОНСТАНТЫ ПОЛЯ ====================

/** Размер игрового поля */
export const GRID_SIZE = 4; // 4x4
export const TOTAL_DISTRICTS = 16;
export const MAX_RESIDENTS_PER_DISTRICT = 3;

/** Координаты центральных кварталов (для мотива Головореза) */
export const CENTRAL_DISTRICTS = [5, 6, 9, 10]; // Индексы центральных 4 кварталов

/** Координаты угловых кварталов */
export const CORNER_DISTRICTS = [0, 3, 12, 15];

// ==================== КОНСТАНТЫ ЗДАНИЙ ====================

/** Стандартная расстановка зданий (как в правилах) */
export const DEFAULT_BUILDINGS = [
  { type: 'POLICE', position: 1 },    // [1,0]
  { type: 'POLICE', position: 14 },   // [2,3]
  { type: 'DINER', position: 4 },     // [0,1]
  { type: 'DINER', position: 11 },    // [3,2]
  { type: 'HOSPITAL', position: 2 },  // [2,0]
  { type: 'HOSPITAL', position: 13 }, // [1,3]
  { type: 'FIRE_STATION', position: 7 },  // [3,1]
  { type: 'FIRE_STATION', position: 8 },  // [0,2]
] as const;

// ==================== КОНСТАНТЫ МОТИВОВ ====================

/** Карты всех мотивов с описаниями */
export const MOTIVE_CARDS: Record<Motive, MotiveCard> = {
  MANIAC: {
    id: 'MANIAC',
    name: 'Маньяк',
    description: 'Все жертвы должны быть одного пола',
    icon: '🔪',
    condition: (victim, gameState) => {
      if (gameState.victims.length === 0) return true;
      return victim.gender === gameState.victims[0].gender;
    }
  },
  SADIST: {
    id: 'SADIST',
    name: 'Садист',
    description: 'Не может убивать запуганных граждан',
    icon: '😈',
    condition: (victim, gameState) => {
      return !gameState.frightenedResidents.includes(victim.id);
    }
  },
  HEADHUNTER: {
    id: 'HEADHUNTER',
    name: 'Головорез',
    description: 'Не может убивать в 4 центральных кварталах города',
    icon: '💀',
    condition: (victim, gameState) => {
      // Нужно найти позицию жертвы
      for (let i = 0; i < gameState.grid.length; i++) {
        if (gameState.grid[i].some(r => r.id === victim.id)) {
          return !CENTRAL_DISTRICTS.includes(i);
        }
      }
      return false;
    }
  },
  VIGILANTE: {
    id: 'VIGILANTE',
    name: 'Вигилант',
    description: 'Не может убивать в 8 кварталах вокруг фишки детектива',
    icon: '⚖️',
    condition: (victim, gameState) => {
      const detectivePos = gameState.detective.position;
      const victimPos = getDistrictForResident(victim.id, gameState.grid);
      
      if (victimPos === null || detectivePos === null) return false;
      
      // Рассчитываем "расстояние Чебышева" (максимум из разностей координат)
      const dx = Math.abs((victimPos % 4) - (detectivePos % 4));
      const dy = Math.abs(Math.floor(victimPos / 4) - Math.floor(detectivePos / 4));
      const distance = Math.max(dx, dy);
      
      return distance > 1; // Можно убивать только на расстоянии > 1
    }
  },
  KILLER: {
    id: 'KILLER',
    name: 'Киллер',
    description: 'Может убивать только в кварталах с одним жителем',
    icon: '🎯',
    condition: (victim, gameState) => {
      // Найти квартал жертвы
      for (let i = 0; i < gameState.grid.length; i++) {
        if (gameState.grid[i].some(r => r.id === victim.id)) {
          return gameState.grid[i].length === 1;
        }
      }
      return false;
    }
  },
  TERRORIST: {
    id: 'TERRORIST',
    name: 'Террорист',
    description: 'Все жертвы должны быть представителями разных фракций',
    icon: '💣',
    condition: (victim, gameState) => {
      const usedFactions = new Set(gameState.victims.map(v => v.faction));
      return !usedFactions.has(victim.faction);
    }
  },
  PSYCHOPATH: {
    id: 'PSYCHOPATH',
    name: 'Психопат',
    description: 'Все жертвы должны быть максимум двух разных возрастов',
    icon: '🌀',
    condition: (victim, gameState) => {
      const usedAges = new Set(gameState.victims.map(v => v.age));
      if (usedAges.size < 2) return true;
      if (usedAges.size === 2) return usedAges.has(victim.age);
      return false;
    }
  },
  CANNIBAL: {
    id: 'CANNIBAL',
    name: 'Каннибал',
    description: 'Среди жертв должны быть все три вида телосложения',
    icon: '🍖',
    condition: (victim, gameState) => {
      const usedBuilds = new Set(gameState.victims.map(v => v.build));
      // Если еще не все типы телосложения, можно убивать любого
      if (usedBuilds.size < 3) return true;
      // Если уже есть все типы, то нельзя убивать новых
      return false;
    }
  },
  RADICAL: {
    id: 'RADICAL',
    name: 'Радикал',
    description: 'Не более 2 жертв из одной фракции',
    icon: '🔥',
    condition: (victim, gameState) => {
      const factionCount = gameState.victims.filter(v => v.faction === victim.faction).length;
      return factionCount < 2;
    }
  },
  ROBBER: {
    id: 'ROBBER',
    name: 'Грабитель',
    description: 'Не убивает представителей власти и богатых',
    icon: '💰',
    condition: (victim, gameState) => {
      // Определяем "богатых" - это фракции ВЛАСТЬ, ПРЕССА, БОГЕМА
      const richFactions = ['POWER', 'PRESS', 'BOHEMIA'] as const;
      return !richFactions.includes(victim.faction);
    }
  },
  SPY: {
    id: 'SPY',
    name: 'Шпион',
    description: 'Может убивать только в окраинных кварталах',
    icon: '🕵️‍♂️',
    condition: (victim, gameState) => {
      // Окраинные = не центральные (противоположность Головорезу)
      for (let i = 0; i < gameState.grid.length; i++) {
        if (gameState.grid[i].some(r => r.id === victim.id)) {
          return !CENTRAL_DISTRICTS.includes(i);
        }
      }
      return false;
    }
  },
  CULTIST: {
    id: 'CULTIST',
    name: 'Культист',
    description: 'Первая жертва должна быть другой фракции, чем Фигурант. Должен убить Фигуранта.',
    icon: '👁️',
    condition: (victim, gameState) => {
      // Сложная логика - требует наличия фигуранта
      if (!gameState.killer.figure) return true;
      
      // Если это первое убийство
      if (gameState.victims.length === 0) {
        return victim.faction !== gameState.killer.figure.faction;
      }
      
      // Если еще не убил фигуранта и это 4-я жертва, то должен убить фигуранта
      const figureKilled = gameState.victims.some(v => v.id === gameState.killer.figure!.id);
      if (!figureKilled && gameState.victims.length === 4) {
        return victim.id === gameState.killer.figure.id;
      }
      
      return true;
    }
  }
};

/** Базовые мотивы для первой игры (рекомендуемые) */
/** Все 12 мотивов */
export const ALL_MOTIVES: Motive[] = [
  'MANIAC',
  'SADIST',
  'HEADHUNTER',
  'VIGILANTE',
  'KILLER',
  'TERRORIST',
  'PSYCHOPATH',
  'CANNIBAL',
  'RADICAL',
  'ROBBER',
  'SPY',
  'CULTIST',
];

export const BASE_MOTIVES: Motive[] = [
  'MANIAC',
  'SADIST', 
  'HEADHUNTER',
  'VIGILANTE',
  'KILLER',
  'TERRORIST'
];

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/** Получить индекс квартала по координатам */
export function getDistrictIndex(x: number, y: number): number {
  return y * 4 + x;
}

/** Получить координаты по индексу квартала */
export function getCoordinates(index: number): { x: number; y: number } {
  return {
    x: index % 4,
    y: Math.floor(index / 4)
  };
}

/** Найти квартал, в котором находится житель */
export function getDistrictForResident(residentId: string, grid: any[][]): number | null {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].some((r: any) => r.id === residentId)) {
      return i;
    }
  }
  return null;
}

/** Проверить, являются ли кварталы соседними */
export function areDistrictsAdjacent(index1: number, index2: number): boolean {
  const pos1 = getCoordinates(index1);
  const pos2 = getCoordinates(index2);
  
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

/** Получить соседние кварталы */
export function getAdjacentDistricts(index: number): number[] {
  const { x, y } = getCoordinates(index);
  const neighbors: number[] = [];
  
  if (x > 0) neighbors.push(getDistrictIndex(x - 1, y));
  if (x < 3) neighbors.push(getDistrictIndex(x + 1, y));
  if (y > 0) neighbors.push(getDistrictIndex(x, y - 1));
  if (y < 3) neighbors.push(getDistrictIndex(x, y + 1));
  
  return neighbors;
}

// ==================== КОНСТАНТЫ ДЛЯ UI ====================

/** Иконки для фракций */
export const FACTION_ICONS: Record<string, string> = {
  LAW: '⚖️',
  MEDICINE: '🏥',
  CRIME: '🔫',
  WORKERS: '🔧',
  BOHEMIA: '🎭',
  PRESS: '📰',
  POWER: '👑',
  MARGINALS: '🏚️',
  MIGRANTS: '🌍'
};

/** Цвета для фракций (Tailwind классы) */
export const FACTION_COLORS: Record<string, string> = {
  LAW: 'bg-blue-900',
  MEDICINE: 'bg-green-900',
  CRIME: 'bg-red-900',
  WORKERS: 'bg-yellow-900',
  BOHEMIA: 'bg-purple-900',
  PRESS: 'bg-cyan-900',
  POWER: 'bg-amber-900',
  MARGINALS: 'bg-gray-700',
  MIGRANTS: 'bg-emerald-900'
};

/** Иконки для характеристик */
export const TRAIT_ICONS = {
  GENDER: {
    MALE: '♂️',
    FEMALE: '♀️'
  },
  AGE: {
    YOUNG: '👶',
    ADULT: '🧑',
    OLD: '👴'
  },
  BUILD: {
    SLIM: '💨',
    MEDIUM: '🔄',
    LARGE: '💪'
  },
  HEIGHT: {
    SHORT: '📏',
    MEDIUM: '📐',
    TALL: '📏📏'
  }
};

/** Иконки для зданий */
export const BUILDING_ICONS: Record<string, string> = {
  POLICE: '👮',
  DINER: '🍔',
  HOSPITAL: '🏥',
  FIRE_STATION: '🚒'
};
