/**
 * Типы для игры "Городской убийца"
 * Основано на правилах из PDF
 */

import type { Citizen, Faction } from './citizens';

// ==================== БАЗОВЫЕ ТИПЫ ====================

/** Режим игры */
export type GameMode = 'LOGIC' | 'INTUITION';

/** Роль игрока */
export type PlayerRole = 'KILLER' | 'DETECTIVE';

/** Формат игры */
export type PlayMode = 'PVP' | 'PVE';

/** Сложность ИИ */
export type AIDifficulty = 'EASY' | 'NORMAL' | 'HARD';

/** Фаза игры */
export type GamePhase = 'KILLER' | 'DETECTIVE' | 'CITY';

/** Шаг внутри фазы */
export type PhaseStep =
  | 'FRIGHTEN' // Убийца запугивает
  | 'KILL' // Убийца убивает
  | 'URGENT_CALL' // Детектив - срочный вызов
  | 'INVESTIGATE' // Детектив - расследование
  | 'POPULATION' // Город - работа с населением
  | 'MOVEMENT'; // Город - перемещение жителей

// ==================== МОТИВЫ УБИЙЦЫ ====================

/** Все возможные мотивы (12 штук) */
export type Motive =
  | 'MANIAC' // Все жертвы одного пола
  | 'SADIST' // Не может убивать запуганных
  | 'HEADHUNTER' // Не убивает в 4 центральных кварталах
  | 'VIGILANTE' // Не убивает в 8 кварталах вокруг детектива
  | 'KILLER' // Только в кварталах с одним жителем
  | 'TERRORIST' // Все жертвы разных фракций
  | 'PSYCHOPATH' // Максимум 2 разных возраста у жертв
  | 'CANNIBAL' // Все типы телосложения среди жертв
  | 'RADICAL' // Не более 2 жертв одной фракции
  | 'ROBBER' // Не убивает "богатых" (определить критерий)
  | 'SPY' // Только в окраинных кварталах
  | 'CULTIST'; // Должен убить Фигуранта дела

// ==================== ИГРОВЫЕ КОМПОНЕНТЫ ====================

/** Тип здания */
export type BuildingType = 'POLICE' | 'DINER' | 'HOSPITAL' | 'FIRE_STATION';

/** Здание на поле */
export interface Building {
  type: BuildingType;
  position: number; // индекс квартала 0-15
  usedThisRound?: boolean;
}

/** Квартал на игровом поле (4x4) */
export interface District {
  index: number; // 0-15
  x: number; // 0-3
  y: number; // 0-3
  residents: Citizen[];
  hasCrimeScene: boolean;
  building?: BuildingType;
}

// ==================== ДЕЙСТВИЯ ИГРОКОВ ====================

/** Вопрос при допросе */
export type QuestionType =
  | 'GENDER' // Убийца мужчина/женщина?
  | 'AGE' // Убийца молодой/взрослый/старый?
  | 'BUILD' // Убийца худой/средний/крепкий?
  | 'HEIGHT' // Убийца низкий/средний/высокий?
  | 'FACTION'; // Убийца из фракции X?

/** Действие убийцы */
export type KillerAction =
  | { type: 'FRIGHTEN'; residentIds: string[] }
  | { type: 'KILL'; residentId: string; districtIndex: number }
  | { type: 'PASS_KILL' } // Пропуск убийства (1 раз за игру)
  | { type: 'USE_ABILITY'; cardId?: string }; // Для режима Интуиция

/** Действие детектива */
export type DetectiveAction =
  | { type: 'MOVE'; toDistrict: number }
  | { type: 'INTERROGATE'; residentId: string; question: QuestionType; value: string }
  | { type: 'USE_BUILDING'; buildingType: BuildingType }
  | { type: 'TRACK'; residentId: string; askQuestion: boolean }
  | { type: 'INVESTIGATE_CRIME_SCENE' } // Изучить место преступления
  | { type: 'CHECK_EVIDENCE' } // Проверить улики (Интуиция)
  | { type: 'USE_CARD'; cardId: string }; // Использовать карту (Интуиция)

// ==================== СОСТОЯНИЯ ИГРОКОВ ====================

/** Состояние детектива */
export interface DetectiveState {
  position: number; // индекс квартала
  actionsLeft: number; // 2 действия за фазу
  movementPoints: number; // 2 очка движения
  trackingToken: {
    residentId: string | null;
    districtIndex: number | null;
  };
  collectedEvidence: string[]; // Для режима Интуиция
  availableCards: string[]; // Для режима Интуиция
  usedActionTypes?: string[]; // Использованные типы действий в раунде
}

/** Состояние убийцы */
export interface KillerState {
  identity: Citizen; // Личность убийцы
  motive: Motive; // Выбранный мотив
  figure: Citizen | null; // Фигурант дела
  allies: Faction | null; // Союзники (фракция)
  frightenedThisRound: string[]; // Кого запугал в этом раунде
  usedAbilities: string[]; // Для режима Интуиция
}

// ==================== СОСТОЯНИЕ ИГРЫ ====================

/** Полное состояние игры */
export interface GameState {
  // Идентификаторы
  id: string;
  mode: GameMode;

  // Прогресс
  phase: GamePhase;
  step: PhaseStep;
  round: number;
  maxRounds: 5 | 6; // 6 если убийца пропустил убийство

  // Игровое поле
  grid: Citizen[][]; // 16 кварталов (индексы 0-15)
  buildings: Building[];
  crimeScenes: number[]; // индексы кварталов с местами преступлений
  frightenedResidents: string[]; // ID запуганных жителей

  // Игроки
  detective: DetectiveState;
  killer: KillerState;

  // Контент игры
  victims: Citizen[];
  availableMotives: Motive[]; // 6 мотивов в текущей игре
  discardedMotives: Motive[]; // Исключенные детективом

  // История действий (для отмены/повтора)
  history: {
    action: KillerAction | DetectiveAction;
    stateSnapshot: Partial<GameState>;
  }[];

  // Статус игры
  isGameOver: boolean;
  // Финальный раунд: после 5-го убийства детектив делает финальное обвинение
  finalRound?: boolean;
  awaitingFinalAccusation?: boolean;
  winner?: PlayerRole;
  reason?: string;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ====================

/** Координаты на поле 4x4 */
export type GridPosition = {
  x: number; // 0-3
  y: number; // 0-3
};

/** Результат проверки действия */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/** Условие мотива для проверки убийства */
export type MotiveCondition = (victim: Citizen, gameState: GameState) => boolean;

/** Карта мотива для UI */
export interface MotiveCard {
  id: Motive;
  name: string;
  description: string;
  icon: string;
  condition: MotiveCondition;
}

// ==================== СОБЫТИЯ ИГРЫ ====================

/** Событие в игре (для лога) */
export interface GameEvent {
  id: string;
  type:
    | 'KILL'
    | 'FRIGHTEN'
    | 'INTERROGATION'
    | 'TRACKING'
    | 'MOVEMENT'
    | 'BUILDING_ACTION'
    | 'PHASE_CHANGE';
  timestamp: Date;
  playerRole: PlayerRole;
  data: unknown;
  message: string;
}

/** Конфигурация новой игры */
export interface NewGameConfig {
  mode: GameMode;
  includeFigure: boolean; // Включать ли Фигуранта дела
  selectedMotives: Motive[]; // Какие мотивы использовать
  scenario?: string; // Идентификатор сценария
}

// ==================== ЭКСПОРТ ВСЕХ ТИПОВ ====================

export type {
  Citizen,
  Faction,
} from './citizens';

// ==================== ЭТАПЫ НАСТРОЙКИ ====================

/** Этап настройки игры */
export type SetupPhase =
  // Общие
  | 'SELECT_MODE' // Выбор режима: Логика/Интуиция
  | 'SELECT_PLAY_MODE' // Выбор формата: PvP/PvE
  | 'SELECT_ROLE' // Выбор роли: Убийца/Детектив
  // Убийца
  | 'SELECT_MOTIVES' // Выбор 6 мотивов из 12
  | 'POPULATION' // Уведомление о 20 жителях
  | 'INFRASTRUCTURE' // Подтверждение зданий
  | 'WAITING_DETECTIVE' // Ожидание позиции детектива
  | 'SELECT_KILLER' // Выбор личности
  | 'SELECT_FIGURE' // Выбор Фигуранта дела (опция)
  | 'SELECT_MOTIVE' // Выбор мотива
  | 'SELECT_ALLIES' // Выбор союзников
  | 'KILLER_NOTEBOOK' // Финальное досье
  // Детектив
  | 'PLACE_CITIZENS' // Расстановка жителей
  | 'PLACE_DETECTIVE' // Позиция детектива
  | 'READY'; // Готово

/** Состояние настройки игры */
export interface SetupState {
  phase: SetupPhase;

  // Выбор режима и роли
  selectedMode: GameMode | null;
  selectedRole: PlayerRole | null;

  // Формат игры (PvP/PvE)
  playMode: PlayMode | null;
  // PvE: сложность ИИ противника
  aiDifficulty: AIDifficulty | null;

  // Выбор мотивов (нужно выбрать 6 из 12)
  availableMotives: Motive[]; // Все 12 мотивов
  selectedMotives: Motive[]; // Выбранные 6

  // Расстановка жителей
  availableCitizens: Citizen[]; // 20 жителей для расстановки
  placedCitizens: {
    // Размещённые жители
    citizenId: string;
    districtIndex: number;
  }[];

  // Расстановка зданий
  availableBuildings: {
    // 8 зданий для размещения
    type: BuildingType;
    placed: boolean;
    position: number | null;
  }[];

  // Позиция детектива
  detectivePosition: number | null;

  // Выбор убийцы (только для роли KILLER)
  killerIdentityId: string | null;
  killerMotive: Motive | null;
  killerAllies: string | null;

  // Фигурант дела (опционально)
  includeFigure: boolean;
  figureId: string | null;
}

/** Действия при настройке */
export type SetupAction =
  | { type: 'SELECT_MODE'; mode: GameMode }
  | { type: 'SELECT_ROLE'; role: PlayerRole }
  | { type: 'TOGGLE_MOTIVE'; motive: Motive }
  | { type: 'PLACE_CITIZEN'; citizenId: string; districtIndex: number }
  | { type: 'REMOVE_CITIZEN'; citizenId: string }
  | { type: 'PLACE_BUILDING'; buildingType: BuildingType; position: number }
  | { type: 'REMOVE_BUILDING'; buildingType: BuildingType; position: number }
  | { type: 'PLACE_DETECTIVE'; position: number }
  | { type: 'SELECT_KILLER_IDENTITY'; citizenId: string }
  | { type: 'SELECT_KILLER_MOTIVE'; motive: Motive }
  | { type: 'SET_FIGURE'; citizenId: string | null }
  | { type: 'AUTO_SETUP' } // Автоматическая расстановка
  | { type: 'CONFIRM_PHASE' } // Подтвердить и перейти дальше
  | { type: 'BACK_PHASE' }; // Вернуться назад
