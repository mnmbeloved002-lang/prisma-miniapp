/**
 * Правила настройки игры "Городской убийца"
 * Реализует пошаговую настройку перед началом игры
 */

import { allCitizens, type Citizen } from '../citizens';
import type { 
  SetupState, 
  SetupPhase, 
  GameMode, 
  PlayerRole, 
  Motive,
  BuildingType,
  GameState 
} from '../gameTypes';
import { ALL_MOTIVES, DEFAULT_BUILDINGS } from '../gameConstants';
import { shuffle, pickRandom, generateId } from './utils';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

/** Создать начальное состояние настройки */
export function createSetupState(): SetupState {
  const citizens = pickRandom(allCitizens, 20);
  
  return {
    phase: 'SELECT_MODE',
    
    selectedMode: null,
    selectedRole: null,
    
    availableMotives: [...ALL_MOTIVES],
    selectedMotives: [],
    
    availableCitizens: citizens,
    placedCitizens: [],
    
    availableBuildings: [
      { type: 'FIRE_STATION', placed: false, position: null },
      { type: 'HOSPITAL', placed: false, position: null },
      { type: 'POLICE', placed: false, position: null },
      { type: 'DINER', placed: false, position: null },
      { type: 'DINER', placed: false, position: null },
      { type: 'HOSPITAL', placed: false, position: null },
      { type: 'FIRE_STATION', placed: false, position: null },
      { type: 'POLICE', placed: false, position: null },
    ],
    
    detectivePosition: null,
    
    killerIdentityId: null,
    killerMotive: null,
    
    includeFigure: false,
    figureId: null,
  };
}

// ==================== ВЫБОР РЕЖИМА ====================

export function selectMode(
  state: SetupState, 
  mode: GameMode
): SetupState {
  return {
    ...state,
    selectedMode: mode,
  };
}

// ==================== ВЫБОР РОЛИ ====================

export function selectRole(
  state: SetupState, 
  role: PlayerRole
): SetupState {
  return {
    ...state,
    selectedRole: role,
  };
}

// ==================== ВЫБОР МОТИВОВ ====================

/** Переключить выбор мотива (добавить/убрать) */
export function toggleMotive(
  state: SetupState, 
  motive: Motive
): { state: SetupState; error?: string } {
  const isSelected = state.selectedMotives.includes(motive);
  
  if (isSelected) {
    // Убираем мотив
    return {
      state: {
        ...state,
        selectedMotives: state.selectedMotives.filter(m => m !== motive),
      }
    };
  } else {
    // Добавляем мотив (максимум 6)
    if (state.selectedMotives.length >= 6) {
      return { 
        state, 
        error: 'Можно выбрать только 6 мотивов. Сначала уберите один.' 
      };
    }
    return {
      state: {
        ...state,
        selectedMotives: [...state.selectedMotives, motive],
      }
    };
  }
}

/** Автоматически выбрать 6 случайных мотивов */
export function autoSelectMotives(state: SetupState): SetupState {
  const randomMotives = pickRandom(state.availableMotives, 6);
  return {
    ...state,
    selectedMotives: randomMotives,
  };
}

// ==================== РАССТАНОВКА ЖИТЕЛЕЙ ====================

/** Разместить жителя в квартале */
export function placeCitizen(
  state: SetupState,
  citizenId: string,
  districtIndex: number
): { state: SetupState; error?: string } {
  // Проверка: квартал в пределах поля
  if (districtIndex < 0 || districtIndex > 15) {
    return { state, error: 'Неверный индекс квартала (0-15)' };
  }
  
  // Проверка: житель существует
  const citizen = state.availableCitizens.find(c => c.id === citizenId);
  if (!citizen) {
    return { state, error: 'Житель не найден' };
  }
  
  // Проверка: житель ещё не размещён
  const alreadyPlaced = state.placedCitizens.find(p => p.citizenId === citizenId);
  if (alreadyPlaced) {
    return { state, error: 'Этот житель уже размещён на поле' };
  }
  
  // Проверка лимита в квартале (LOGIC: углы=2, остальные=1)
  const CORNER_DISTRICTS = [0, 3, 12, 15];
  const isCorner = CORNER_DISTRICTS.includes(districtIndex);
  const citizensInDistrict = state.placedCitizens.filter(
    p => p.districtIndex === districtIndex
  ).length;
  const maxAllowed = state.selectedMode === 'LOGIC'
    ? (isCorner ? 2 : 1)
    : 3;
  if (citizensInDistrict >= maxAllowed) {
    return { 
      state, 
      error: state.selectedMode === 'LOGIC'
        ? isCorner 
          ? 'В угловом квартале должно быть ровно 2 жителя'
          : 'В обычном квартале должен быть ровно 1 житель'
        : 'В квартале уже 3 жителя (максимум)'
    };
  }
  
  return {
    state: {
      ...state,
      placedCitizens: [
        ...state.placedCitizens,
        { citizenId, districtIndex }
      ],
    }
  };
}

/** Убрать жителя с поля */
export function removeCitizen(
  state: SetupState,
  citizenId: string
): SetupState {
  return {
    ...state,
    placedCitizens: state.placedCitizens.filter(p => p.citizenId !== citizenId),
  };
}

/** Переместить жителя в другой квартал */
export function moveCitizen(
  state: SetupState,
  citizenId: string,
  newDistrictIndex: number
): { state: SetupState; error?: string } {
  // Сначала убираем
  const stateWithoutCitizen = removeCitizen(state, citizenId);
  // Потом размещаем в новом месте
  return placeCitizen(stateWithoutCitizen, citizenId, newDistrictIndex);
}

/** Автоматически расставить всех жителей */
export function autoPlaceCitizens(state: SetupState): SetupState {
  const shuffledCitizens = shuffle([...state.availableCitizens]);
  const placements: { citizenId: string; districtIndex: number }[] = [];
  
  // По правилам: угловые кварталы — 2 жителя, остальные — 1
  const CORNER_DISTRICTS = [0, 3, 12, 15]; // [0,0], [0,3], [3,0], [3,3]
  
  let citizenIndex = 0;
  
  // Сначала раскладываем по 2 в углы
  for (const corner of CORNER_DISTRICTS) {
    for (let i = 0; i < 2 && citizenIndex < shuffledCitizens.length; i++) {
      placements.push({
        citizenId: shuffledCitizens[citizenIndex].id,
        districtIndex: corner,
      });
      citizenIndex++;
    }
  }
  
  // Затем по 1 в остальные кварталы
  for (let district = 0; district < 16 && citizenIndex < shuffledCitizens.length; district++) {
    if (!CORNER_DISTRICTS.includes(district)) {
      placements.push({
        citizenId: shuffledCitizens[citizenIndex].id,
        districtIndex: district,
      });
      citizenIndex++;
    }
  }
  
  return {
    ...state,
    placedCitizens: placements,
  };
}

// ==================== РАССТАНОВКА ЗДАНИЙ ====================

/** Разместить здание в квартале */
export function placeBuilding(
  state: SetupState,
  buildingType: BuildingType,
  position: number
): { state: SetupState; error?: string } {
  if (position < 0 || position > 15) {
    return { state, error: 'Неверный индекс квартала (0-15)' };
  }
  
  // Проверка: в квартале нет здания
  const buildingInDistrict = state.availableBuildings.find(
    b => b.position === position && b.placed
  );
  if (buildingInDistrict) {
    return { state, error: 'В этом квартале уже есть здание' };
  }
  
  // Находим неразмещённое здание нужного типа
  const buildingIndex = state.availableBuildings.findIndex(
    b => b.type === buildingType && !b.placed
  );
  if (buildingIndex === -1) {
    return { state, error: `Все здания типа "${buildingType}" уже размещены` };
  }
  
  const newBuildings = [...state.availableBuildings];
  newBuildings[buildingIndex] = {
    ...newBuildings[buildingIndex],
    placed: true,
    position,
  };
  
  return {
    state: {
      ...state,
      availableBuildings: newBuildings,
    }
  };
}

/** Убрать здание с поля */
export function removeBuilding(
  state: SetupState,
  position: number
): SetupState {
  const buildingIndex = state.availableBuildings.findIndex(
    b => b.position === position && b.placed
  );
  
  if (buildingIndex === -1) return state;
  
  const newBuildings = [...state.availableBuildings];
  newBuildings[buildingIndex] = {
    ...newBuildings[buildingIndex],
    placed: false,
    position: null,
  };
  
  return {
    ...state,
    availableBuildings: newBuildings,
  };
}

/** Автоматически расставить здания (стандартная расстановка) */
export function autoPlaceBuildings(state: SetupState): SetupState {
  const newBuildings = state.availableBuildings.map((b, i) => ({
    ...b,
    placed: true,
    position: DEFAULT_BUILDINGS[i]?.position ?? i,
  }));
  
  return {
    ...state,
    availableBuildings: newBuildings,
  };
}

// ==================== РАЗМЕЩЕНИЕ ДЕТЕКТИВА ====================

export function placeDetective(
  state: SetupState,
  position: number
): { state: SetupState; error?: string } {
  if (position < 0 || position > 15) {
    return { state, error: 'Неверный индекс квартала (0-15)' };
  }
  
  return {
    state: {
      ...state,
      detectivePosition: position,
    }
  };
}

/** Случайная позиция детектива */
export function autoPlaceDetective(state: SetupState): SetupState {
  const position = Math.floor(Math.random() * 16);
  return {
    ...state,
    detectivePosition: position,
  };
}

// ==================== ВЫБОР УБИЙЦЫ ====================

/** Убийца выбирает свою личность */
export function selectKillerIdentity(
  state: SetupState,
  citizenId: string
): { state: SetupState; error?: string } {
  // Проверка: житель размещён на поле
  const isPlaced = state.placedCitizens.some(p => p.citizenId === citizenId);
  if (!isPlaced) {
    return { state, error: 'Выберите жителя, который размещён на поле' };
  }
  
  return {
    state: {
      ...state,
      killerIdentityId: citizenId,
    }
  };
}

/** Убийца выбирает свой мотив */
export function selectKillerMotive(
  state: SetupState,
  motive: Motive
): { state: SetupState; error?: string } {
  // Проверка: мотив из выбранных 6
  if (!state.selectedMotives.includes(motive)) {
    return { state, error: 'Этот мотив не входит в выбранные 6' };
  }
  
  return {
    state: {
      ...state,
      killerMotive: motive,
    }
  };
}

// ==================== ПЕРЕХОДЫ МЕЖДУ ЭТАПАМИ ====================

/** Валидация текущего этапа */
export function validatePhase(state: SetupState): { isValid: boolean; error?: string } {
  switch (state.phase) {
    case 'SELECT_MODE':
      if (!state.selectedMode) {
        return { isValid: false, error: 'Выберите режим игры' };
      }
      break;
      
    case 'SELECT_ROLE':
      if (!state.selectedRole) {
        return { isValid: false, error: 'Выберите роль' };
      }
      break;
      
    case 'SELECT_MOTIVES':
      if (state.selectedMotives.length !== 6) {
        return { isValid: false, error: `Выбрано ${state.selectedMotives.length} из 6 мотивов` };
      }
      break;
      
    case 'PLACE_CITIZENS':
      if (state.placedCitizens.length !== 20) {
        return { isValid: false, error: `Размещено ${state.placedCitizens.length} из 20 жителей` };
      }
      break;
      
    case 'PLACE_BUILDINGS':
      const placedCount = state.availableBuildings.filter(b => b.placed).length;
      if (placedCount !== 8) {
        return { isValid: false, error: `Размещено ${placedCount} из 8 зданий` };
      }
      break;
      
    case 'PLACE_DETECTIVE':
      if (state.detectivePosition === null) {
        return { isValid: false, error: 'Разместите детектива на поле' };
      }
      break;
      
    case 'SELECT_KILLER':
      if (state.selectedRole === 'KILLER' && !state.killerIdentityId) {
        return { isValid: false, error: 'Выберите личность убийцы' };
      }
      break;
      
    case 'SELECT_MOTIVE':
      if (state.selectedRole === 'KILLER' && !state.killerMotive) {
        return { isValid: false, error: 'Выберите мотив убийцы' };
      }
      break;
  }
  
  return { isValid: true };
}

/** Перейти к следующему этапу */
export function nextSetupPhase(state: SetupState): { state: SetupState; error?: string } {
  const validation = validatePhase(state);
  if (!validation.isValid) {
    return { state, error: validation.error };
  }
  
  const phases: SetupPhase[] = [
    'SELECT_MODE',
    'SELECT_ROLE', 
    'SELECT_MOTIVES',
    'PLACE_CITIZENS',
    'PLACE_BUILDINGS',
    'PLACE_DETECTIVE',
    'SELECT_KILLER',
    'SELECT_MOTIVE',
    'READY',
  ];
  
  const currentIndex = phases.indexOf(state.phase);
  let nextIndex = currentIndex + 1;
  
  // Пропускаем этапы выбора убийцы для детектива
  if (state.selectedRole === 'DETECTIVE') {
    if (phases[nextIndex] === 'SELECT_KILLER') nextIndex++;
    if (phases[nextIndex] === 'SELECT_MOTIVE') nextIndex++;
  }
  
  if (nextIndex >= phases.length) {
    return { state: { ...state, phase: 'READY' } };
  }
  
  return {
    state: {
      ...state,
      phase: phases[nextIndex],
    }
  };
}

/** Вернуться к предыдущему этапу */
export function prevSetupPhase(state: SetupState): SetupState {
  const phases: SetupPhase[] = [
    'SELECT_MODE',
    'SELECT_ROLE',
    'SELECT_MOTIVES', 
    'PLACE_CITIZENS',
    'PLACE_BUILDINGS',
    'PLACE_DETECTIVE',
    'SELECT_KILLER',
    'SELECT_MOTIVE',
    'READY',
  ];
  
  const currentIndex = phases.indexOf(state.phase);
  let prevIndex = currentIndex - 1;
  
  // Пропускаем этапы выбора убийцы для детектива
  if (state.selectedRole === 'DETECTIVE') {
    if (phases[prevIndex] === 'SELECT_MOTIVE') prevIndex--;
    if (phases[prevIndex] === 'SELECT_KILLER') prevIndex--;
  }
  
  if (prevIndex < 0) prevIndex = 0;
  
  return {
    ...state,
    phase: phases[prevIndex],
  };
}

// ==================== ПОЛНАЯ АВТОНАСТРОЙКА ====================

/** Автоматически настроить всё и перейти к игре */
export function autoSetup(mode: GameMode, role: PlayerRole): SetupState {
  let state = createSetupState();
  
  state = selectMode(state, mode);
  state = selectRole(state, role);
  state = autoSelectMotives(state);
  state = autoPlaceCitizens(state);
  state = autoPlaceBuildings(state);
  state = autoPlaceDetective(state);
  
  if (role === 'KILLER') {
    // Случайный убийца из размещённых
    const randomCitizen = pickRandom(state.placedCitizens, 1)[0];
    state.killerIdentityId = randomCitizen.citizenId;
    // Случайный мотив из выбранных
    state.killerMotive = pickRandom(state.selectedMotives, 1)[0];
  }
  
  state.phase = 'READY';
  
  return state;
}

// ==================== КОНВЕРТАЦИЯ В GAMESTATE ====================

/** Конвертировать SetupState в GameState для начала игры */
export function setupToGameState(setup: SetupState): GameState | { error: string } {
  if (setup.phase !== 'READY') {
    return { error: 'Настройка не завершена' };
  }
  
  // Строим grid из placedCitizens
  const grid: Citizen[][] = Array.from({ length: 16 }, () => []);
  for (const placement of setup.placedCitizens) {
    const citizen = setup.availableCitizens.find(c => c.id === placement.citizenId);
    if (citizen) {
      grid[placement.districtIndex].push(citizen);
    }
  }
  
  // Строим buildings
  const buildings = setup.availableBuildings
    .filter(b => b.placed && b.position !== null)
    .map(b => ({
      type: b.type,
      position: b.position!,
      usedThisRound: false,
    }));
  
  // Находим убийцу
  const killerCitizen = setup.availableCitizens.find(
    c => c.id === setup.killerIdentityId
  );
  
  if (!killerCitizen && setup.selectedRole === 'KILLER') {
    return { error: 'Убийца не выбран' };
  }
  
  // Для детектива — убийца выбирается случайно (или AI)
  const finalKiller = killerCitizen ?? pickRandom(setup.availableCitizens, 1)[0];
  const finalMotive = setup.killerMotive ?? pickRandom(setup.selectedMotives, 1)[0];
  
  return {
    id: generateId('game-'),
    mode: setup.selectedMode!,
    phase: 'KILLER',
    step: 'FRIGHTEN',
    round: 1,
    maxRounds: 5,
    grid,
    buildings,
    crimeScenes: [],
    frightenedResidents: [],
    detective: {
      position: setup.detectivePosition!,
      actionsLeft: 2,
      movementPoints: 2,
      trackingToken: { residentId: null, districtIndex: null },
      collectedEvidence: [],
      availableCards: [],
    },
    killer: {
      identity: finalKiller,
      motive: finalMotive,
      allies: null,
      figure: null,
      frightenedThisRound: [],
      usedAbilities: [],
    },
    victims: [],
    availableMotives: setup.selectedMotives,
    discardedMotives: [],
    history: [],
    isGameOver: false,
  };
}
