/**
 * Кнопки действий убийцы
 */

import React from 'react';
import type { PhaseStep } from '../../data/gameTypes';

interface KillerActionsProps {
  step: PhaseStep;
  selectedCount: number;
  canKill: boolean;
  canPassKill: boolean;
  onFrighten: () => void;
  onKill: () => void;
  onPassKill: () => void;
}

export const KillerActions: React.FC<KillerActionsProps> = ({
  step,
  selectedCount,
  canKill,
  canPassKill,
  onFrighten,
  onKill,
  onPassKill,
}) => {
  if (step === 'FRIGHTEN') {
    return (
      <div className="space-y-3">
        <button
          onClick={onFrighten}
          disabled={selectedCount !== 2}
          className={`
            w-full py-3 px-4 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${selectedCount === 2
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          😨 Запугать выбранных ({selectedCount}/2)
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          Выберите 2 жителей на карте
        </p>
      </div>
    );
  }

  if (step === 'KILL') {
    return (
      <div className="space-y-3">
        <button
          onClick={onKill}
          disabled={!canKill}
          className={`
            w-full py-3 px-4 rounded-xl font-semibold text-sm
            transition-all duration-200
            ${canKill
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          💀 Убить выбранного
        </button>

        {canPassKill && (
          <button
            onClick={onPassKill}
            className="w-full py-2 px-4 rounded-xl font-medium text-sm
              bg-gray-700 hover:bg-gray-600 text-gray-300
              transition-all duration-200"
          >
            ⏭️ Пропустить убийство (1 раз за игру)
          </button>
        )}

        <p className="text-xs text-gray-500 text-center">
          Выберите жертву согласно мотиву
        </p>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500 py-4">
      Ожидайте своего хода...
    </div>
  );
};
