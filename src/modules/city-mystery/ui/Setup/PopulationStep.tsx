import type React from 'react';
import { useEffect, useState } from 'react';
import { useSetupStore } from '../../application/setupStore';

export const PopulationStep: React.FC = () => {
  const { setupState, nextPhase } = useSetupStore();
  const [revealed, setRevealed] = useState(false);

  const totalCitizens = setupState.availableCitizens?.length || 20;

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-6 italic leading-relaxed">
        "Город полон душ...
        <br />
        <span className="text-zinc-600">Некоторые из них станут жертвами"</span>
      </p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className={`
          relative p-8 border transition-all duration-700
          ${
            revealed
              ? 'border-red-700/60 bg-zinc-900/80 shadow-[0_0_40px_rgba(185,28,28,0.2)]'
              : 'border-zinc-800 bg-zinc-900/40'
          }
        `}
        >
          <div
            className={`
            absolute -top-1 right-6 w-3 h-8 rounded-b-sm transition-colors duration-500
            ${revealed ? 'bg-red-600' : 'bg-zinc-700'}
          `}
          />

          {revealed && (
            <div className="absolute top-3 right-3 px-2 py-0.5 border border-red-600/60 text-red-500 text-[9px] font-bold uppercase tracking-widest rotate-[-3deg]">
              Колода
            </div>
          )}

          <div className="text-center">
            <div
              className={`
              text-6xl font-black mb-2 transition-all duration-500
              ${revealed ? 'text-red-500' : 'text-zinc-700'}
            `}
            >
              {totalCitizens}
            </div>
            <p className="text-sm text-zinc-400 uppercase tracking-wider">жителей</p>
          </div>

          <div
            className={`
            absolute bottom-0 left-0 h-0.5 bg-red-700/50 transition-all duration-700
            ${revealed ? 'w-full' : 'w-0'}
          `}
          />
        </div>

        <div
          className={`
          mt-6 text-center transition-opacity duration-500
          ${revealed ? 'opacity-100' : 'opacity-0'}
        `}
        >
          <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[280px]">
            Из колоды случайным образом отобраны карты жителей.
            <br />
            Детектив расставит их по кварталам.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          disabled={!revealed}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold 
            border transition-all duration-300
            ${
              revealed
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          Продолжить →
        </button>
      </div>
    </div>
  );
};
