/**
 * Главный компонент игры "Городской убийца"
 * Координирует все UI компоненты и взаимодействие с store
 */

import React, { useState } from 'react';
import { useGameStore } from '../application/gameStore';
import { useSetupStore } from '../application/setupStore';
import { SetupWizard } from './Setup';
import { GameBoard } from './GameBoard';
import { ActionPanel } from './ActionPanel';
import { MotiveGrid } from './MotiveGrid';
import { GameLog } from './GameLog';
import { GameOverScreen } from './GameOverScreen';

type GameScreen = 'SETUP' | 'GAME' | 'GAME_OVER';

export const CityMysteryPage: React.FC = () => {
  const [screen, setScreen] = useState<GameScreen>('SETUP');
  
  const { 
    gameState, 
    playerRole,
    setGameState,
    setPlayerRole,
    error: gameError,
    clearError 
  } = useGameStore();
  
  const { 
    setupState, 
    finishSetup, 
    reset: resetSetup 
  } = useSetupStore();
  
  // Завершение настройки и старт игры
  const handleSetupComplete = () => {
    const gameState = finishSetup();
    if (gameState) {
      setGameState(gameState);
      setPlayerRole(setupState.selectedRole!);
      setScreen('GAME');
    }
  };
  
  // Новая игра
  const handleNewGame = () => {
    resetSetup();
    setScreen('SETUP');
  };
  
  // Проверка окончания игры
  if (screen === 'GAME' && gameState?.isGameOver) {
    return (
      <GameOverScreen 
        winner={gameState.winner!}
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
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Заголовок */}
        <header className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">�� Городской Убийца</h1>
              <div className="text-sm text-gray-400">
                Раунд {gameState.round}/{gameState.maxRounds} • 
                Фаза: {gameState.phase === 'KILLER' ? '🔪 Убийца' : 
                       gameState.phase === 'DETECTIVE' ? '🔍 Детектив' : '🏙️ Город'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                Вы: {playerRole === 'KILLER' ? '🔪 Убийца' : '🔍 Детектив'}
              </div>
              <div className="text-xs text-gray-400">
                Жертв: {gameState.victims.length}/5
              </div>
            </div>
          </div>
        </header>
        
        {/* Ошибка */}
        {gameError && (
          <div className="m-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 flex justify-between items-center">
            <span>{gameError}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300">✕</button>
          </div>
        )}
        
        {/* Основной контент */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Игровое поле */}
          <div className="lg:col-span-2">
            <GameBoard />
          </div>
          
          {/* Боковая панель */}
          <div className="space-y-4">
            <ActionPanel />
            <MotiveGrid />
            <GameLog />
          </div>
        </div>
      </div>
    );
  }
  
  // Загрузка
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-xl">Загрузка...</div>
    </div>
  );
};
