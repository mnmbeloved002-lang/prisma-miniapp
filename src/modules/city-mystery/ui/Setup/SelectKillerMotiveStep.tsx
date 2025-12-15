import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';
import type { Motive } from '../../data/gameTypes';

interface MotiveCardProps {
  motive: Motive;
  isSelected: boolean;
  onSelect: () => void;
}

const MotiveCard: React.FC<MotiveCardProps> = ({ motive, isSelected, onSelect }) => {
  const card = MOTIVE_CARDS[motive];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left transition-all duration-300 relative
        ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
    >
      <div
        className={`
        relative p-2 border transition-all duration-300
        ${
          isSelected
            ? 'bg-zinc-900/80 border-red-700/60 shadow-[0_0_30px_rgba(185,28,28,0.15)]'
            : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/60 hover:bg-zinc-900/60'
        }
      `}
      >
        <div
          className={`
          absolute -top-1 right-4 w-3 h-6 rounded-b-sm transition-colors
          ${isSelected ? 'bg-red-600' : 'bg-zinc-700'}
        `}
        />

        {isSelected && (
          <div className="absolute top-2 right-2 px-2 py-0.5 border border-red-600/60 text-red-500 text-[9px] font-bold uppercase tracking-widest rotate-[-3deg]">
            Мотив
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-lg">{card?.icon || '❓'}</span>
          <div className="flex-1 min-w-0">
            <h3
              className={`
              text-xs font-bold uppercase tracking-wider mb-1
              ${isSelected ? 'text-red-400' : 'text-zinc-300'}
            `}
            >
              {card?.name || motive}
            </h3>
            <p className="text-[9px] text-zinc-500 leading-tight ">
              {card?.description || 'Описание отсутствует'}
            </p>
          </div>
        </div>

        <div
          className={`
          absolute bottom-0 left-0 h-0.5 transition-all duration-500
          ${isSelected ? 'w-full bg-red-700/50' : 'w-0 bg-zinc-700'}
        `}
        />
      </div>
    </button>
  );
};

export const SelectKillerMotiveStep: React.FC = () => {
  const { setupState, selectKillerMotive, nextPhase, prevPhase } = useSetupStore();

  const selectedKiller = setupState.availableCitizens.find(
    (c) => c.id === setupState.killerIdentityId,
  );

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-4 italic leading-relaxed">
        "У каждого преступления есть причина...
        <br />
        <span className="text-zinc-600">Выберите свой мотив"</span>
      </p>

      {selectedKiller && (
        <div className="mb-4 p-3 border border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center border-2 border-zinc-700 text-lg bg-zinc-800/50">
            {selectedKiller.gender === 'MALE' ? '👨' : '👩'}
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Ваша личность</p>
            <p className="text-xs font-bold text-zinc-300">
              {selectedKiller.name || selectedKiller.role}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 flex-1 content-start">
        {setupState.selectedMotives.map((motive) => (
          <MotiveCard
            key={motive}
            motive={motive}
            isSelected={setupState.killerMotive === motive}
            onSelect={() => selectKillerMotive(motive)}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex gap-3">
        <button
          type="button"
          onClick={prevPhase}
          className="flex-1 py-4 uppercase tracking-[0.25em] text-xs font-semibold border border-zinc-700/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-all"
          style={{ minHeight: '52px' }}
        >
          ← Назад
        </button>
        <button
          type="button"
          onClick={nextPhase}
          disabled={!setupState.killerMotive}
          className={`
            flex-1 py-4 uppercase tracking-[0.25em] text-xs font-semibold border transition-all duration-300
            ${
              setupState.killerMotive
                ? 'border-zinc-600 text-zinc-300 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'border-zinc-800/50 text-zinc-700 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          Подтвердить →
        </button>
      </div>
    </div>
  );
};
