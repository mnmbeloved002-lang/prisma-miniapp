import React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';

export const SelectKillerMotiveStep: React.FC = () => {
  const { setupState, selectKillerMotive, nextPhase, prevPhase } = useSetupStore();
  
  // Выбранный убийца
  const selectedKiller = setupState.availableCitizens.find(
    c => c.id === setupState.killerIdentityId
  );
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">🎭 Выберите мотив</h1>
      <p className="text-gray-400 text-center mb-2">
        По какому мотиву вы будете убивать?
      </p>
      
      {selectedKiller && (
        <div className="text-center mb-4 p-2 bg-gray-800 rounded-lg">
          <span>Вы: </span>
          <span className="text-xl">{selectedKiller.gender === 'MALE' ? '👨' : '👩'}</span>
          <span className="ml-1 font-bold">{selectedKiller.role}</span>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {setupState.selectedMotives.map(motive => {
          const card = MOTIVE_CARDS[motive];
          const isSelected = setupState.killerMotive === motive;
          
          return (
            <button
              key={motive}
              onClick={() => selectKillerMotive(motive)}
              className={`
                p-3 rounded-lg border-2 text-left transition-all
                ${isSelected 
                  ? 'border-red-500 bg-red-500/20' 
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{card?.icon || '❓'}</span>
                <span className="font-bold text-sm">{card?.name || motive}</span>
              </div>
              <div className="text-xs text-gray-400">
                {card?.description || 'Описание отсутствует'}
              </div>
            </button>
          );
        })}
      </div>
      
      {setupState.killerMotive && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-center">
          <div className="text-sm text-gray-400">Ваш мотив:</div>
          <div className="text-lg font-bold">
            {MOTIVE_CARDS[setupState.killerMotive]?.icon}{' '}
            {MOTIVE_CARDS[setupState.killerMotive]?.name}
          </div>
          <div className="text-sm text-gray-300">
            {MOTIVE_CARDS[setupState.killerMotive]?.description}
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={!setupState.killerMotive}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${setupState.killerMotive
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
