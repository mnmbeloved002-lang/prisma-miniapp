import React from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Citizen } from '../../data/citizens';

export const SelectKillerStep: React.FC = () => {
  const { setupState, selectKillerIdentity, nextPhase, prevPhase } = useSetupStore();
  
  // Жители в квартале
  const getCitizensInDistrict = (districtIndex: number): Citizen[] => {
    const citizenIds = setupState.placedCitizens
      .filter(p => p.districtIndex === districtIndex)
      .map(p => p.citizenId);
    return setupState.availableCitizens.filter(c => citizenIds.includes(c.id));
  };
  
  // Выбранный убийца
  const selectedKiller = setupState.killerIdentityId 
    ? setupState.availableCitizens.find(c => c.id === setupState.killerIdentityId)
    : null;
  
  // Защита
  if (setupState.placedCitizens.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <p className="text-gray-400">Жители не расставлены. Вернитесь назад.</p>
        <button
          onClick={prevPhase}
          className="mt-4 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          ← Назад
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">🔪 Выберите личность</h1>
      <p className="text-gray-400 text-center mb-2">
        Кем из жителей вы будете? Это ваш секрет.
      </p>
      
      {selectedKiller && (
        <div className="text-center mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
          <span className="text-2xl">{selectedKiller.gender === 'MALE' ? '👨' : '👩'}</span>
          <span className="ml-2 font-bold">{selectedKiller.name || 'Неизвестный'}</span>
          <div className="text-sm text-gray-400">
            {selectedKiller.faction || '?'} • {selectedKiller.age || '?'} • {selectedKiller.build || '?'}
          </div>
        </div>
      )}
      
      {/* Поле с жителями */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {Array.from({ length: 16 }).map((_, i) => {
          const citizens = getCitizensInDistrict(i);
          const isDetectiveHere = setupState.detectivePosition === i;
          
          return (
            <div
              key={i}
              className={`
                min-h-[80px] p-1 rounded border-2 transition-all
                ${isDetectiveHere
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-800'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] text-gray-500">[{Math.floor(i/4)},{i%4}]</span>
                {isDetectiveHere && <span className="text-sm">🔍</span>}
              </div>
              
              <div className="space-y-0.5">
                {citizens.map(citizen => {
                  if (!citizen || !citizen.id) return null;
                  
                  const isSelected = setupState.killerIdentityId === citizen.id;
                  const displayName = citizen.role 
                    ? citizen.role.split(' ')[0] 
                    : citizen.id.slice(0, 6);
                  
                  return (
                    <button
                      key={citizen.id}
                      onClick={() => selectKillerIdentity(citizen.id)}
                      className={`
                        w-full text-[10px] p-0.5 rounded transition-all text-left
                        flex items-center gap-0.5
                        ${isSelected
                          ? 'bg-red-500 text-white'
                          : 'hover:bg-gray-700'}
                      `}
                    >
                      <span>{citizen.gender === 'MALE' ? '👨' : '👩'}</span>
                      <span className="truncate">{displayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={!setupState.killerIdentityId}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${setupState.killerIdentityId
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
