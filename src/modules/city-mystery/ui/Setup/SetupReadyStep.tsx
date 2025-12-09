import React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';

interface SetupReadyStepProps {
  onStart: () => void;
}

export const SetupReadyStep: React.FC<SetupReadyStepProps> = ({ onStart }) => {
  const { setupState, prevPhase } = useSetupStore();
  
  const selectedKiller = setupState.availableCitizens.find(
    c => c.id === setupState.killerIdentityId
  );
  
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">✅ Всё готово!</h1>
      
      <div className="space-y-4 mb-8">
        {/* Режим */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Режим</div>
          <div className="text-lg font-bold">
            {setupState.selectedMode === 'LOGIC' ? '🧠 Логика' : '🎴 Интуиция'}
          </div>
        </div>
        
        {/* Роль */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Ваша роль</div>
          <div className="text-lg font-bold">
            {setupState.selectedRole === 'KILLER' ? '🔪 Убийца' : '🔍 Детектив'}
          </div>
        </div>
        
        {/* Для убийцы — показать секретную инфу */}
        {setupState.selectedRole === 'KILLER' && selectedKiller && (
          <>
            <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg">
              <div className="text-sm text-gray-400">Ваша личность</div>
              <div className="text-lg font-bold">
                {selectedKiller.gender === 'MALE' ? '👨' : '👩'} {selectedKiller.role}
              </div>
              <div className="text-sm text-gray-400">
                {selectedKiller.faction} • {selectedKiller.age} • {selectedKiller.build}
              </div>
            </div>
            
            {setupState.killerMotive && (
              <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg">
                <div className="text-sm text-gray-400">Ваш мотив</div>
                <div className="text-lg font-bold">
                  {MOTIVE_CARDS[setupState.killerMotive]?.icon}{' '}
                  {MOTIVE_CARDS[setupState.killerMotive]?.name}
                </div>
                <div className="text-sm text-gray-300">
                  {MOTIVE_CARDS[setupState.killerMotive]?.description}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Статистика */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">На поле</div>
          <div className="text-sm">
            👥 {setupState.placedCitizens.length} жителей •{' '}
            🏢 {setupState.availableBuildings.filter(b => b.placed).length} зданий •{' '}
            🎭 {setupState.selectedMotives.length} мотивов
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={onStart}
          className="flex-1 py-4 rounded-lg font-bold text-lg bg-green-500 text-black hover:bg-green-400 transition-all"
        >
          🎮 Начать игру!
        </button>
      </div>
    </div>
  );
};
