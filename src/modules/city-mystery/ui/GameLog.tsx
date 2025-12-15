/**
 * Журнал событий игры "Городской убийца"
 */

import React from 'react';
import { useGameStore } from '../application/gameStore';

void React;

export const GameLog: React.FC = () => {
  const { gameLog } = useGameStore();

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-3">📜</span> Журнал событий
      </h3>

      {(!gameLog || gameLog.length === 0) && (
        <div className="text-sm text-gray-500">
          Действий пока нет. Сделайте первый ход, чтобы появился лог.
        </div>
      )}

      {gameLog && gameLog.length > 0 && (
        <div className="max-h-64 overflow-y-auto space-y-2 text-sm">
          {gameLog.map((entry, index) => (
            <div
              key={`${index}-${entry}`}
              className="flex items-start gap-2 bg-gray-900/40 border border-gray-700 rounded-lg px-3 py-2"
            >
              <span className="text-xs text-gray-500 mt-0.5">{index + 1}.</span>
              <span className="text-gray-200 break-words">{entry}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
