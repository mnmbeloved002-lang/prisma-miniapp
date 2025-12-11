import React from 'react';
import { useSetupStore } from '../../application/setupStore';

export const SelectModeStep: React.FC = () => {
  const { setupState, selectMode, nextPhase } = useSetupStore();
  
  return (
    <div className="w-full">
      {/* Подзаголовок (цитата) */}
      <p className="text-zinc-500 text-sm text-center mb-6 font-serif italic">
        "Выберите, по каким законам будет жить этот город..."
      </p>

      {/* Блок с вариантами */}
      <div className="space-y-4 mb-8">
        
        {/* Кнопка ЛОГИКА */}
        <button
          onClick={() => selectMode('LOGIC')}
          className={`
            group w-full p-5 rounded-sm border transition-all duration-300 relative overflow-hidden text-left
            ${setupState.selectedMode === 'LOGIC' 
              ? 'border-red-600 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'}
          `}
        >
          {/* Маркер выбора */}
          {setupState.selectedMode === 'LOGIC' && (
            <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
              Выбрано
            </div>
          )}

          <div className="flex items-start gap-4 relative z-10">
            <div className={`
              text-3xl p-3 rounded-full border 
              ${setupState.selectedMode === 'LOGIC' ? 'border-red-600 text-red-500 bg-red-950/30' : 'border-zinc-700 text-zinc-600 bg-zinc-800'}
            `}>
              🧠
            </div>
            <div>
              <div className={`font-black text-lg uppercase tracking-wider ${setupState.selectedMode === 'LOGIC' ? 'text-red-500' : 'text-zinc-300'}`}>
                Логика
              </div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Классическое расследование. Дедукция, допросы, факты. <br/>
                <span className="text-zinc-600">Рекомендуется для начала.</span>
              </div>
            </div>
          </div>
        </button>
        
        {/* Кнопка ИНТУИЦИЯ */}
        <button
          onClick={() => selectMode('INTUITION')}
          className={`
            group w-full p-5 rounded-sm border transition-all duration-300 relative overflow-hidden text-left
            ${setupState.selectedMode === 'INTUITION' 
              ? 'border-red-600 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'}
          `}
        >
          {setupState.selectedMode === 'INTUITION' && (
            <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
              Выбрано
            </div>
          )}

          <div className="flex items-start gap-4 relative z-10">
            <div className={`
              text-3xl p-3 rounded-full border 
              ${setupState.selectedMode === 'INTUITION' ? 'border-red-600 text-red-500 bg-red-950/30' : 'border-zinc-700 text-zinc-600 bg-zinc-800'}
            `}>
              🎴
            </div>
            <div>
              <div className={`font-black text-lg uppercase tracking-wider ${setupState.selectedMode === 'INTUITION' ? 'text-red-500' : 'text-zinc-300'}`}>
                Интуиция
              </div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Скрытые мотивы и карты способностей. Хаос и блеф.
              </div>
            </div>
          </div>
        </button>
      </div>
      
      {/* Кнопка ДАЛЕЕ (Теперь она сразу под вариантами) */}
      <button
        onClick={nextPhase}
        disabled={!setupState.selectedMode}
        className={`
          w-full py-4 uppercase tracking-[0.2em] text-sm font-bold border transition-all duration-300
          ${setupState.selectedMode
            ? 'bg-zinc-100 text-zinc-950 border-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            : 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-not-allowed'}
        `}
      >
        Подтвердить выбор
      </button>
    </div>
  );
};
