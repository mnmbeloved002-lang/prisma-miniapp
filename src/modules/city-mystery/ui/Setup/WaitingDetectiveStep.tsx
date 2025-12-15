import type React from 'react';
import { useEffect, useState } from 'react';
import { useSetupStore } from '../../application/setupStore';

const POSITION_IDS = [
  'p0',
  'p1',
  'p2',
  'p3',
  'p4',
  'p5',
  'p6',
  'p7',
  'p8',
  'p9',
  'p10',
  'p11',
  'p12',
  'p13',
  'p14',
  'p15',
];

export const WaitingDetectiveStep: React.FC = () => {
  const { nextPhase } = useSetupStore();
  const [aiThinking, setAiThinking] = useState(true);
  const [aiPosition, setAiPosition] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const position = Math.floor(Math.random() * 16);
      setAiPosition(position);
      setAiThinking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-6 italic leading-relaxed">
        "Детектив выходит на охоту...
        <br />
        <span className="text-zinc-600">Он выбирает стартовую позицию"</span>
      </p>

      <div className="flex-1 flex flex-col items-center justify-center">
        {aiThinking ? (
          <>
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
              <div className="absolute inset-0 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 uppercase tracking-wider animate-pulse">
              Детектив думает...
            </p>
          </>
        ) : (
          <>
            <div className="relative p-6 border border-red-700/60 bg-zinc-900/80 shadow-[0_0_40px_rgba(185,28,28,0.2)] mb-6">
              <div className="absolute -top-1 right-6 w-3 h-8 rounded-b-sm bg-red-600" />

              <div className="text-center">
                <span className="text-3xl mb-2 block">🔍</span>
                <p className="text-lg font-bold text-zinc-200 uppercase tracking-wide mb-1">
                  Детектив на месте
                </p>
                <p className="text-sm text-zinc-500">
                  Квартал [{Math.floor((aiPosition || 0) / 4)},{(aiPosition || 0) % 4}]
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-0.5 mb-4">
              {POSITION_IDS.map((id, i) => (
                <div
                  key={id}
                  className={`
                    w-6 h-6 border flex items-center justify-center text-[10px]
                    ${
                      i === aiPosition
                        ? 'border-red-600 bg-red-950/50 text-red-400'
                        : 'border-zinc-800 bg-zinc-900/30 text-zinc-700'
                    }
                  `}
                >
                  {i === aiPosition ? '��' : ''}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-zinc-600 italic">Теперь ваш ход — выберите личность</p>
          </>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          disabled={aiThinking}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold 
            border transition-all duration-300
            ${
              !aiThinking
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {aiThinking ? 'Ожидание...' : 'К выбору личности →'}
        </button>
      </div>
    </div>
  );
};
