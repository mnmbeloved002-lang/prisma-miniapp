import React from 'react';
import { useSetupStore } from '../../application/setupStore';

export const SelectRoleStep: React.FC = () => {
  const { setupState, selectRole, nextPhase } = useSetupStore();
  
  return (
    <div className="w-full">
      {/* Подзаголовок */}
      <p className="text-zinc-500 text-sm text-center mb-6 font-serif italic">
        "Кто вы в этой истории? Охотник или закон?"
      </p>

      {/* Блок с вариантами */}
      <div className="space-y-4 mb-8">
        
        {/* Кнопка УБИЙЦА */}
        <button
          onClick={() => selectRole('KILLER')}
          className={`
            group w-full p-5 rounded-sm border transition-all duration-300 relative overflow-hidden text-left
            ${setupState.selectedRole === 'KILLER' 
              ? 'border-red-600 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'}
          `}
        >
          {/* Маркер выбора */}
          {setupState.selectedRole === 'KILLER' && (
            <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
              Выбрано
            </div>
          )}

          <div className="flex items-start gap-4 relative z-10">
            <div className={`
              text-3xl p-3 rounded-full border 
              ${setupState.selectedRole === 'KILLER' ? 'border-red-600 text-red-500 bg-red-950/30' : 'border-zinc-700 text-zinc-600 bg-zinc-800'}
            `}>
              🔪
            </div>
            <div>
              <div className={`font-black text-lg uppercase tracking-wider ${setupState.selectedRole === 'KILLER' ? 'text-red-500' : 'text-zinc-300'}`}>
                Убийца
              </div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Ваша цель — устранить 5 жителей и остаться в тени.<br/>
                <span className="text-zinc-600">Скрытность. Саботаж. Устранение.</span>
              </div>
            </div>
          </div>
        </button>
        
        {/* Кнопка ДЕТЕКТИВ */}
        <button
          onClick={() => selectRole('DETECTIVE')}
          className={`
            group w-full p-5 rounded-sm border transition-all duration-300 relative overflow-hidden text-left
            ${setupState.selectedRole === 'DETECTIVE' 
              ? 'border-red-600 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'}
          `}
        >
          {setupState.selectedRole === 'DETECTIVE' && (
            <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
              Выбрано
            </div>
          )}

          <div className="flex items-start gap-4 relative z-10">
            <div className={`
              text-3xl p-3 rounded-full border 
              ${setupState.selectedRole === 'DETECTIVE' ? 'border-red-600 text-red-500 bg-red-950/30' : 'border-zinc-700 text-zinc-600 bg-zinc-800'}
            `}>
              🔍
            </div>
            <div>
              <div className={`font-black text-lg uppercase tracking-wider ${setupState.selectedRole === 'DETECTIVE' ? 'text-red-500' : 'text-zinc-300'}`}>
                Детектив
              </div>
              <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Ваша цель — вычислить маньяка и спасти город.<br/>
                <span className="text-zinc-600">Дедукция. Допросы. Закон.</span>
              </div>
            </div>
          </div>
        </button>
      </div>
      
      {/* Кнопка ДАЛЕЕ */}
      <button
        onClick={nextPhase}
        disabled={!setupState.selectedRole}
        className={`
          w-full py-4 uppercase tracking-[0.2em] text-sm font-bold border transition-all duration-300
          ${setupState.selectedRole
            ? 'bg-zinc-100 text-zinc-950 border-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            : 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-not-allowed'}
        `}
      >
        Подтвердить роль
      </button>
    </div>
  );
};
