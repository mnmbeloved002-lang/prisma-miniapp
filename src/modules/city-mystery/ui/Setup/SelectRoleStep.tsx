import React from 'react';
import { useSetupStore } from '../../application/setupStore';

export const SelectRoleStep: React.FC = () => {
  const { setupState, selectRole, nextPhase, prevPhase } = useSetupStore();
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Выберите роль</h1>
      <p className="text-gray-400 text-center mb-8">За кого вы будете играть?</p>
      
      <div className="space-y-4">
        <button
          onClick={() => selectRole('KILLER')}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${setupState.selectedRole === 'KILLER' 
              ? 'border-red-500 bg-red-500/20' 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔪</span>
            <div>
              <div className="font-bold text-lg text-red-400">Убийца</div>
              <div className="text-sm text-gray-400">
                Совершите 5 убийств, следуя своему мотиву. Не попадитесь детективу!
              </div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => selectRole('DETECTIVE')}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${setupState.selectedRole === 'DETECTIVE' 
              ? 'border-blue-500 bg-blue-500/20' 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔍</span>
            <div>
              <div className="font-bold text-lg text-blue-400">Детектив</div>
              <div className="text-sm text-gray-400">
                Вычислите убийцу и его мотив. Допрашивайте жителей и следите за уликами.
              </div>
            </div>
          </div>
        </button>
      </div>
      
      <div className="flex gap-3 mt-8">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={!setupState.selectedRole}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${setupState.selectedRole
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
