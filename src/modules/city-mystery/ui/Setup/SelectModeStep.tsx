import React from 'react';
import { useSetupStore } from '../../application/setupStore';

export const SelectModeStep: React.FC = () => {
  const { setupState, selectMode, nextPhase } = useSetupStore();
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">🔪 Городской Убийца</h1>
      <p className="text-gray-400 text-center mb-8">Выберите режим игры</p>
      
      <div className="space-y-4">
        <button
          onClick={() => selectMode('LOGIC')}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${setupState.selectedMode === 'LOGIC' 
              ? 'border-yellow-500 bg-yellow-500/20' 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div>
              <div className="font-bold text-lg">Логика</div>
              <div className="text-sm text-gray-400">
                Классический режим. Детектив допрашивает жителей и вычисляет убийцу.
              </div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => selectMode('INTUITION')}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${setupState.selectedMode === 'INTUITION' 
              ? 'border-yellow-500 bg-yellow-500/20' 
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎴</span>
            <div>
              <div className="font-bold text-lg">Интуиция</div>
              <div className="text-sm text-gray-400">
                С картами способностей. Больше возможностей и неожиданностей.
              </div>
            </div>
          </div>
        </button>
      </div>
      
      <button
        onClick={nextPhase}
        disabled={!setupState.selectedMode}
        className={`
          w-full mt-8 py-3 rounded-lg font-bold transition-all
          ${setupState.selectedMode
            ? 'bg-yellow-500 text-black hover:bg-yellow-400'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
        `}
      >
        Далее →
      </button>
    </div>
  );
};
