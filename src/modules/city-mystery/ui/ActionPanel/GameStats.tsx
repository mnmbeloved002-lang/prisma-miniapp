/**
 * Статистика игры: раунд, жертвы, запуганные, выбранные
 */

import React from 'react';

interface GameStatsProps {
  round: number;
  maxRounds: number;
  victimsCount: number;
  frightenedCount: number;
  selectedCount: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  round,
  maxRounds,
  victimsCount,
  frightenedCount,
  selectedCount,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
      <div>
        <span className="text-gray-500">Раунд:</span>{' '}
        <span className="font-semibold text-gray-200">
          {round}/{maxRounds}
        </span>
      </div>
      <div>
        <span className="text-gray-500">Жертвы:</span>{' '}
        <span className="font-semibold text-red-300">
          {victimsCount}/5
        </span>
      </div>
      <div>
        <span className="text-gray-500">Запугано:</span>{' '}
        <span className="font-semibold text-yellow-300">
          {frightenedCount}
        </span>
      </div>
      <div>
        <span className="text-gray-500">Выбрано:</span>{' '}
        <span className="font-semibold text-blue-300">
          {selectedCount}
        </span>
      </div>
    </div>
  );
};
