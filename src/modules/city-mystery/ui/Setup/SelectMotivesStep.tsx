import React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';
import type { Motive } from '../../data/gameTypes';

const ALL_MOTIVES: Motive[] = [
  'MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST',
  'PSYCHOPATH', 'CANNIBAL', 'RADICAL', 'ROBBER', 'SPY', 'CULTIST'
];

export const SelectMotivesStep: React.FC = () => {
  const { setupState, toggleMotive, autoSelectMotives, nextPhase, prevPhase } = useSetupStore();
  
  const selectedCount = setupState.selectedMotives.length;
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Выберите мотивы</h1>
      <p className="text-gray-400 text-center mb-2">
        Выберите 6 мотивов из 12 для этой игры
      </p>
      <p className="text-center mb-6">
        <span className={selectedCount === 6 ? 'text-green-400' : 'text-yellow-400'}>
          {selectedCount}/6 выбрано
        </span>
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {ALL_MOTIVES.map(motive => {
          const card = MOTIVE_CARDS[motive];
          const isSelected = setupState.selectedMotives.includes(motive);
          
          return (
            <button
              key={motive}
              onClick={() => toggleMotive(motive)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${isSelected 
                  ? 'border-yellow-500 bg-yellow-500/20' 
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{card?.icon || '❓'}</span>
                <span className="font-bold text-sm">{card?.name || motive}</span>
              </div>
              <div className="text-xs text-gray-400 line-clamp-2">
                {card?.description || 'Описание отсутствует'}
              </div>
            </button>
          );
        })}
      </div>
      
      <button
        onClick={autoSelectMotives}
        className="w-full py-2 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-sm"
      >
        🎲 Выбрать случайно
      </button>
      
      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={selectedCount !== 6}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${selectedCount === 6
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};
