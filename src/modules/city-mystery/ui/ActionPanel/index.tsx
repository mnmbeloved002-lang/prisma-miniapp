/**
 * ActionPanel — панель действий игрока
 * Оркестрирует дочерние компоненты
 */

import React, { useState } from 'react';
import { useGameStore } from '../../application/gameStore';
import { PhaseInfo } from './PhaseInfo';
import { GameStats } from './GameStats';
import { KillerActions } from './KillerActions';
import { DetectiveActions } from './DetectiveActions';
import { InterrogationModal } from '../InterrogationModal';
import type { QuestionType } from '../../data/gameTypes';

export const ActionPanel: React.FC = () => {
  const {
    gameState,
    playerRole,
    selectedResidents,
    frightenResidents,
    killResident,
    passKill,
    interrogateResident,
    nextPhase,
    clearSelection,
  } = useGameStore();

  const [isInterrogationOpen, setIsInterrogationOpen] = useState(false);

  // Не инициализировано
  if (!gameState || !playerRole) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="mr-3">🎮</span> Панель действий
        </h3>
        <div className="text-center text-gray-500 py-8">
          Игра не инициализирована. Выберите роль.
        </div>
      </div>
    );
  }

  const { phase, step, round, maxRounds, frightenedResidents, victims, detective } = gameState;
  const selectedCount = selectedResidents.length;

  // Получить выбранного жителя
  const getSelectedResident = () => {
    if (selectedCount !== 1) return null;
    return gameState.grid.flat().find(r => r.id === selectedResidents[0]) || null;
  };

  // === Обработчики убийцы ===
  const handleFrighten = () => {
    if (selectedCount === 2) {
      const result = frightenResidents(selectedResidents);
      if (result.isValid) {
        clearSelection();
      }
    }
  };

  const handleKill = () => {
    if (selectedCount === 1) {
      let districtIndex = -1;
      for (let i = 0; i < gameState.grid.length; i++) {
        if (gameState.grid[i].some(r => r.id === selectedResidents[0])) {
          districtIndex = i;
          break;
        }
      }
      if (districtIndex >= 0) {
        const result = killResident(selectedResidents[0], districtIndex);
        if (result.isValid) {
          clearSelection();
          nextPhase();
        }
      }
    }
  };

  const handlePassKill = () => {
    const result = passKill();
    if (result.isValid) {
      nextPhase();
    }
  };

  // === Обработчики детектива ===
  const handleOpenInterrogation = () => {
    if (selectedCount === 1) {
      setIsInterrogationOpen(true);
    }
  };

  const handleInterrogate = async (question: string, value: string) => {
    const result = interrogateResident(selectedResidents[0], question as QuestionType, value);
    if (result.isValid && result.data) {
      return {
        answer: result.data.answer,
        canLie: result.data.canLie,
      };
    }
    throw new Error(result.error || 'Ошибка допроса');
  };

  const handleCloseInterrogation = () => {
    setIsInterrogationOpen(false);
    clearSelection();
  };

  const handleTrack = () => {
    // TODO: выполнить слежку
    console.log('Слежка:', selectedResidents[0]);
  };

  const handleEndPhase = () => {
    nextPhase();
  };

  // === Определяем, чей ход ===
  const isKillerTurn = playerRole === 'KILLER' && phase === 'KILLER';
  const isDetectiveTurn = playerRole === 'DETECTIVE' && phase === 'DETECTIVE';
  const canPassKill = gameState.maxRounds === 5;
  const hasTrackingToken = detective.trackingToken.residentId !== null;
  const selectedResident = getSelectedResident();

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-3">🎮</span> Панель действий
      </h3>

      {/* Информация о фазе */}
      <PhaseInfo phase={phase} step={step} playerRole={playerRole} />

      {/* Кнопки действий */}
      <div className="my-6">
        {isKillerTurn && (
          <KillerActions
            step={step}
            selectedCount={selectedCount}
            canKill={selectedCount === 1}
            canPassKill={canPassKill}
            onFrighten={handleFrighten}
            onKill={handleKill}
            onPassKill={handlePassKill}
          />
        )}

        {isDetectiveTurn && (
          <DetectiveActions
            step={step}
            actionsLeft={detective.actionsLeft}
            movementPoints={detective.movementPoints}
            selectedCount={selectedCount}
            hasTrackingToken={hasTrackingToken}
            onInterrogate={handleOpenInterrogation}
            onTrack={handleTrack}
            onEndPhase={handleEndPhase}
          />
        )}

        {!isKillerTurn && !isDetectiveTurn && (
          <div className="text-center text-gray-500 py-4">
            Ожидайте своего хода...
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="pt-4 border-t border-gray-700">
        <GameStats
          round={round}
          maxRounds={maxRounds}
          victimsCount={victims.length}
          frightenedCount={frightenedResidents.length}
          selectedCount={selectedCount}
        />
      </div>

      {/* Модалка допроса */}
      <InterrogationModal
        residentName={selectedResident?.role || 'Житель'}
        residentId={selectedResidents[0] || ''}
        isOpen={isInterrogationOpen}
        onClose={handleCloseInterrogation}
        onInterrogate={handleInterrogate}
      />
    </div>
  );
};
