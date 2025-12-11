/**
 * Главный компонент игры "Городской убийца"
 * Координирует все UI компоненты и взаимодействие с store
 */

import type React from 'react';
import { useState } from 'react';
import { useGameStore } from '../application/gameStore';
import { useSetupStore } from '../application/setupStore';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { ActionPanel } from './ActionPanel';
import { GameBoard } from './GameBoard';
import { GameLog } from './GameLog';
import { GameOverScreen } from './GameOverScreen';
import { MotiveGrid } from './MotiveGrid';
import { SetupWizard } from './Setup';
import { WelcomeScreen } from './WelcomeScreen';

type GameScreen = 'WELCOME' | 'SETUP' | 'GAME' | 'GAME_OVER';

export const CityMysteryPage: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>('WELCOME');

  // Инициализация Telegram Mini App
  useTelegramApp();

  const {
    gameState,
    playerRole,
    setGameState,
    setPlayerRole,
    error: gameError,
    clearError,
  } = useGameStore();

  const { setupState, finishSetup, reset: resetSetup } = useSetupStore();

  // Переход от вступления к настройке
  const handleStart = () => {
    setScreen('SETUP');
  };

  // Завершение настройки и старт игры
  const handleSetupComplete = () => {
    const gameState = finishSetup();
    if (gameState) {
      setGameState(gameState);
      setPlayerRole(setupState.selectedRole || 'DETECTIVE');
      setScreen('GAME');
    }
  };

  // Новая игра
  const handleNewGame = () => {
    resetSetup();
    setScreen('SETUP');
  };

  // Экран приветствия
  if (screen === 'WELCOME') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Проверка окончания игры
  if (screen === 'GAME' && gameState?.isGameOver) {
    return (
      <GameOverScreen
        winner={gameState.winner || 'DETECTIVE'}
        reason={gameState.reason}
        onNewGame={handleNewGame}
      />
    );
  }

  // Экран настройки
  if (screen === 'SETUP') {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  // Экран игры
  if (screen === 'GAME' && gameState) {
    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-200 font-mono">
        {/* Хедер игры */}
        <header className="p-4 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40 shadow-md">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
              <h1 className="text-xl font-black text-red-600 tracking-wider">CITY MYSTERY</h1>
              <div className="text-xs text-zinc-500 font-bold mt-1 tracking-tight">
                РАУНД {gameState.round}/{gameState.maxRounds} • ФАЗА:{' '}
                {gameState.phase === 'KILLER'
                  ? '🔪 УБИЙЦА'
                  : gameState.phase === 'DETECTIVE'
                    ? '🔍 ДЕТЕКТИВ'
                    : '🏙️ ГОРОД'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-zinc-300">
                {playerRole === 'KILLER' ? 'ВЫ: УБИЙЦА' : 'ВЫ: ДЕТЕКТИВ'}
              </div>
              <div className="text-xs text-zinc-500">ЖЕРТВ: {gameState.victims.length}/5</div>
            </div>
          </div>
        </header>

        {/* Ошибка */}
        {gameError && (
          <div className="max-w-7xl mx-auto m-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 flex justify-between items-center backdrop-blur-sm animate-pulse">
            <span>{gameError}</span>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-300 px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Основной контент */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Игровое поле */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-zinc-800/30 rounded-lg p-1 border border-zinc-800 shadow-inner">
              <GameBoard />
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6 order-1 lg:order-2">
            <ActionPanel />
            <MotiveGrid />
            <div className="hidden lg:block bg-zinc-950 p-4 rounded border border-zinc-800 h-64 overflow-y-auto font-mono text-xs">
              <GameLog />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Загрузка
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono">
      <div className="text-xl animate-pulse text-red-600">ЗАГРУЗКА ДЕЛА...</div>
    </div>
  );
};
