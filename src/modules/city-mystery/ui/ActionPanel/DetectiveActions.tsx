/**
 * Кнопки действий детектива
 */

import type React from 'react';
import type { PhaseStep } from '../../data/gameTypes';

interface DetectiveActionsProps {
  step: PhaseStep;
  actionsLeft: number;
  movementPoints: number;
  selectedCount: number;
  hasTrackingToken: boolean;
  onInterrogate: () => void;
  onTrack: () => void;
  onEndPhase: () => void;
}

export const DetectiveActions: React.FC<DetectiveActionsProps> = ({
  step,
  actionsLeft,
  movementPoints,
  selectedCount,
  hasTrackingToken,
  onInterrogate,
  onTrack,
  onEndPhase,
}) => {
  if (step === 'URGENT_CALL') {
    return (
      <div className="text-center text-gray-400 py-4">🚨 Перемещение на место преступления...</div>
    );
  }

  if (step === 'INVESTIGATE') {
    const canInterrogate = selectedCount === 1 && actionsLeft > 0;
    const canTrack = hasTrackingToken && selectedCount === 1;

    return (
      <div className="space-y-3">
        {/* Счётчики ресурсов */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{actionsLeft}</div>
            <div className="text-xs text-gray-500">действий</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{movementPoints}</div>
            <div className="text-xs text-gray-500">движения</div>
          </div>
        </div>

        {/* Кнопка допроса */}
        <button
          onClick={onInterrogate}
          disabled={!canInterrogate}
          className={`
            w-full py-3 px-4 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${
              canInterrogate
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          ❓ Допросить выбранного
        </button>

        {/* Кнопка слежки */}
        <button
          onClick={onTrack}
          disabled={!canTrack}
          className={`
            w-full py-2 px-4 rounded-xl font-medium text-sm
            transition-all duration-200
            ${
              canTrack
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          👁️ Слежка (бесплатно)
        </button>

        {/* Завершить ход */}
        <button
          onClick={onEndPhase}
          className="w-full py-2 px-4 rounded-xl font-medium text-sm
            bg-gray-700 hover:bg-gray-600 text-gray-300
            transition-all duration-200"
        >
          ✅ Завершить расследование
        </button>

        <p className="text-xs text-gray-500 text-center">
          Кликните на жителя для выбора, затем на действие
        </p>
      </div>
    );
  }

  return <div className="text-center text-gray-500 py-4">Ожидайте своего хода...</div>;
};
