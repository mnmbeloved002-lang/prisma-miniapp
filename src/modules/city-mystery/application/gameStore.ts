/**
 * Zustand store для управления состоянием игры "Городской убийца"
 *
 * АРХИТЕКТУРА 2026:
 * - gameState = ЕДИНСТВЕННЫЙ источник правды
 * - gameRules = чистые функции (state, action) => newState
 * - Нет дублирования состояния
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gameRules } from '../data/gameRules';
import type {
  BuildingType,
  GameMode,
  GameState,
  Motive,
  NewGameConfig,
  PlayerRole,
  QuestionType,
} from '../data/gameTypes';

// ==================== ТИПЫ ====================

interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

interface GameStoreState {
  // Состояние игры (ЕДИНСТВЕННЫЙ источник правды)
  gameState: GameState | null;
  playerRole: PlayerRole | null;
  gameMode: GameMode;

  // История для undo
  history: GameState[];

  // UI состояние
  selectedResidents: string[];
  selectedMotive: Motive | null;
  isGameInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  gameLog: string[];

  // Действия
  initializeGame: (config: NewGameConfig) => void;
  setPlayerRole: (role: PlayerRole) => void;
  setGameState: (state: GameState) => void;

  // Действия убийцы
  frightenResidents: (residentIds: string[]) => ValidationResult;
  killResident: (residentId: string, districtIndex: number) => ValidationResult;
  passKill: () => ValidationResult;

  // Действия детектива
  moveDetective: (districtIndex: number) => ValidationResult;
  interrogateResident: (
    residentId: string,
    question: QuestionType,
    value: string,
  ) => ValidationResult;
  useBuilding: (buildingType: BuildingType) => ValidationResult;
  placeTrackingToken: (residentId: string, districtIndex: number) => ValidationResult;
  trackResident: (residentId: string) => ValidationResult;

  // Управление игрой
  nextPhase: () => ValidationResult;
  undoAction: () => ValidationResult;
  restartGame: (config?: NewGameConfig) => void;
  resetGame: () => void;

  // UI действия
  selectResident: (residentId: string) => void;
  deselectResident: (residentId: string) => void;
  clearSelection: () => void;
  toggleMotive: (motive: Motive) => void;
  addLogMessage: (message: string) => void;
  clearError: () => void;
}

// Вспомогательная функция для координат
function getCoordinates(index: number): { x: number; y: number } {
  return { x: index % 4, y: Math.floor(index / 4) };
}

// ==================== СОЗДАНИЕ STORE ====================

export const useGameStore = create<GameStoreState>()(
  devtools(
    (set, get) => ({
      // ==================== НАЧАЛЬНОЕ СОСТОЯНИЕ ====================

      gameState: null,
      playerRole: null,
      gameMode: 'LOGIC',
      history: [],
      selectedResidents: [],
      selectedMotive: null,
      isGameInitialized: false,
      isLoading: false,
      error: null,
      gameLog: [],

      // ==================== ИНИЦИАЛИЗАЦИЯ ====================

      initializeGame: (config) => {
        set({ isLoading: true, error: null });

        try {
          const gameState = gameRules.createGame(config);

          set({
            gameState,
            gameMode: config.mode,
            isGameInitialized: true,
            isLoading: false,
            history: [],
            gameLog: [`🎮 Новая игра начата! Режим: ${config.mode}`],
          });
        } catch (error) {
          set({
            error: `Ошибка инициализации: ${error}`,
            isLoading: false,
          });
        }
      },

      setGameState: (state) => {
        set({ gameState: state, isGameInitialized: true });
      },

      setPlayerRole: (role) => {
        set({ playerRole: role });
        get().addLogMessage(`👤 Игрок выбрал роль: ${role === 'KILLER' ? 'Убийцу' : 'Детектива'}`);
      },

      // ==================== ДЕЙСТВИЯ УБИЙЦЫ ====================

      frightenResidents: (residentIds) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'KILLER') {
          return { isValid: false, error: 'Только убийца может запугивать' };
        }

        // Сохраняем историю
        const history = [...get().history, gameState];

        const result = gameRules.frightenResidents(gameState, residentIds);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          get().addLogMessage(`😨 Запуганы 2 жителя`);
          get().clearSelection();
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      killResident: (residentId, districtIndex) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'KILLER') {
          return { isValid: false, error: 'Только убийца может убивать' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.killResident(gameState, residentId, districtIndex);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          const { x, y } = getCoordinates(districtIndex);
          get().addLogMessage(`💀 Убийство в квартале [${x}, ${y}]`);

          if (result.state.isGameOver) {
            get().addLogMessage(`🏆 Убийца победил!`);
          }
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      passKill: () => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'KILLER') {
          return { isValid: false, error: 'Только убийца может пропустить' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.passKill(gameState);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          get().addLogMessage(`⏭️ Убийца пропустил убийство (раундов: ${result.state.maxRounds})`);
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      // ==================== ДЕЙСТВИЯ ДЕТЕКТИВА ====================

      moveDetective: (districtIndex) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'DETECTIVE') {
          return { isValid: false, error: 'Только детектив может перемещаться' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.moveDetective(gameState, districtIndex);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          const { x, y } = getCoordinates(districtIndex);
          get().addLogMessage(`🚶 Детектив переместился в [${x}, ${y}]`);
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      interrogateResident: (residentId, question, value) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'DETECTIVE') {
          return { isValid: false, error: 'Только детектив может допрашивать' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.interrogateResident(gameState, residentId, question, value);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          get().addLogMessage(`❓ Допрос: ${question} = ${value}`);
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error, data: result.data };
      },

      useBuilding: (buildingType) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'DETECTIVE') {
          return { isValid: false, error: 'Только детектив может использовать здания' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.useBuilding(gameState, buildingType);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          get().addLogMessage(`🏢 Использовано здание: ${buildingType}`);
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      placeTrackingToken: (residentId, districtIndex) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'DETECTIVE') {
          return { isValid: false, error: 'Только детектив может ставить жетон' };
        }

        // Простая установка жетона (без валидации движком)
        const newState = JSON.parse(JSON.stringify(gameState));
        newState.detective.trackingToken = { residentId, districtIndex };

        set({ gameState: newState });
        get().addLogMessage(`��️ Жетон слежки установлен`);

        return { isValid: true };
      },

      trackResident: (residentId) => {
        const { gameState, playerRole } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        if (playerRole !== 'DETECTIVE') {
          return { isValid: false, error: 'Только детектив может следить' };
        }

        const history = [...get().history, gameState];

        const result = gameRules.trackResident(gameState, residentId);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          const canKill = (result.data as any)?.canKill;
          get().addLogMessage(`🔍 Слежка: ${canKill ? 'МОЖЕТ убить' : 'НЕ может убить'}`);
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error, data: result.data };
      },

      // ==================== УПРАВЛЕНИЕ ФАЗАМИ ====================

      nextPhase: () => {
        const { gameState } = get();

        if (!gameState) {
          return { isValid: false, error: 'Игра не инициализирована' };
        }

        const history = [...get().history, gameState];

        // Сначала проверяем срочный вызов
        if (gameState.step === 'URGENT_CALL') {
          const urgentResult = gameRules.urgentCall(gameState);
          if (urgentResult.isValid && urgentResult.state) {
            set({ gameState: urgentResult.state, history });
            get().addLogMessage(`🚨 Срочный вызов! Детектив на месте преступления`);
            return { isValid: true };
          }
        }

        const result = gameRules.nextPhase(gameState);

        if (result.isValid && result.state) {
          set({ gameState: result.state, history });
          get().addLogMessage(`📍 Фаза: ${result.state.phase}, Раунд: ${result.state.round}`);

          if (result.state.isGameOver) {
            get().addLogMessage(
              `🏆 ${result.state.winner === 'DETECTIVE' ? 'Детектив' : 'Убийца'} победил!`,
            );
          }
        } else {
          set({ error: result.error });
        }

        return { isValid: result.isValid, error: result.error };
      },

      undoAction: () => {
        const { history } = get();

        if (history.length === 0) {
          return { isValid: false, error: 'Нет действий для отмены' };
        }

        const newHistory = [...history];
        const previousState = newHistory.pop()!;

        set({ gameState: previousState, history: newHistory });
        get().addLogMessage(`↩️ Действие отменено`);

        return { isValid: true };
      },

      restartGame: (config) => {
        const currentMode = get().gameMode;
        const newConfig: NewGameConfig = config || {
          mode: currentMode,
          includeFigure: false,
          selectedMotives: [],
        };

        get().initializeGame(newConfig);
        get().addLogMessage(`🔄 Игра перезапущена`);
      },

      resetGame: () => {
        set({
          gameState: null,
          playerRole: null,
          history: [],
          selectedResidents: [],
          selectedMotive: null,
          isGameInitialized: false,
          isLoading: false,
          error: null,
          gameLog: [],
        });
      },

      // ==================== UI ДЕЙСТВИЯ ====================

      selectResident: (residentId) => {
        const { selectedResidents, gameState, playerRole } = get();

        // Toggle: если уже выбран — снимаем выделение
        if (selectedResidents.includes(residentId)) {
          set({ selectedResidents: selectedResidents.filter((id) => id !== residentId) });
          return;
        }

        // Определяем лимит выбора
        let maxSelection = 1;
        if (playerRole === 'KILLER' && gameState?.step === 'FRIGHTEN') {
          maxSelection = 2;
        }

        if (selectedResidents.length >= maxSelection) {
          // Заменяем последний выбранный
          set({ selectedResidents: [residentId] });
        } else {
          set({ selectedResidents: [...selectedResidents, residentId] });
        }
      },

      deselectResident: (residentId) => {
        const { selectedResidents } = get();
        set({ selectedResidents: selectedResidents.filter((id) => id !== residentId) });
      },

      clearSelection: () => {
        set({ selectedResidents: [] });
      },

      toggleMotive: (motive) => {
        const { selectedMotive } = get();
        set({ selectedMotive: selectedMotive === motive ? null : motive });
      },

      addLogMessage: (message) => {
        const { gameLog } = get();
        const timestamp = new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        });
        set({ gameLog: [...gameLog, `[${timestamp}] ${message}`] });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'city-mystery-store',
      enabled: process.env.NODE_ENV !== 'production',
    },
  ),
);
