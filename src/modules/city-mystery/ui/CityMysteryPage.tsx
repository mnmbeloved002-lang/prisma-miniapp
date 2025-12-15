import { GameField } from './GameField/GameField';
/**
 * Главный компонент игры "Городской убийца"
 * Координирует все UI компоненты и взаимодействие с store
 */

import type React from 'react';
import { useState } from 'react';
import { useGameStore } from '../application/gameStore';
import { useSetupStore } from '../application/setupStore';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { GameOverScreen } from './GameOverScreen';
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
    console.log('finishSetup result:', gameState);
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
    return <GameField />;
  }

  // Загрузка
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono">
      <div className="text-xl animate-pulse text-red-600">ЗАГРУЗКА ДЕЛА...</div>
    </div>
  );
};
