/**
 * Сетка мотивов убийцы
 */

import React from 'react';
import { useGameStore } from '../application/gameStore';
import type { Motive } from '../data/gameTypes';

void React;

type AnyMotive = Motive & {
  id?: string;
  name?: string;
  description?: string;
};

export const MotiveGrid: React.FC = () => {
  const { gameState, selectedMotive } = useGameStore();
  const motives: AnyMotive[] = (gameState?.availableMotives ?? []) as AnyMotive[];

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">🧩</span> Мотивы
      </h3>

      {!gameState || motives.length === 0 ? (
        <div className="text-sm text-gray-500">
          Мотивы пока недоступны. Инициализируйте игру, чтобы увидеть список.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {motives.map((rawMotive, index) => {
            const motive = rawMotive as AnyMotive;
            const isSelected =
              selectedMotive &&
              (selectedMotive as AnyMotive).id &&
              motive.id &&
              (selectedMotive as AnyMotive).id === motive.id;

            const key = motive.id ?? `motive-${index}`;

            return (
              <div
                key={key}
                data-testid={`motive-card-${key}`}
                className={[
                  'p-3 rounded-lg border text-sm transition-colors',
                  isSelected ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-900/40',
                ].join(' ')}
              >
                <div className="font-semibold">
                  {motive.name ?? motive.id ?? `Мотив #${index + 1}`}
                </div>
                {motive.description && (
                  <div className="mt-1 text-gray-400 text-xs">{motive.description}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
