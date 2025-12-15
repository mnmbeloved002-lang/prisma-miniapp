import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { PlayMode } from '../../data/gameTypes';
import { Typewriter } from './Typewriter';

interface PlayModeCardProps {
  caseNumber: string;
  title: string;
  subtitle: string;
  description: string;
  hint: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PlayModeCard: React.FC<PlayModeCardProps> = ({
  caseNumber,
  title,
  subtitle,
  description,
  hint,
  isSelected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`
      group w-full text-left transition-all duration-300 relative
      ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
    `}
  >
    <div
      className={`
      relative p-5 border transition-all duration-300
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
        <div className="absolute top-3 right-3 px-2 py-0.5 border border-red-600/60 text-red-500 text-[9px] font-bold uppercase tracking-widest rotate-[-3deg]">
          Выбрано
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`
          w-12 h-12 flex items-center justify-center border-2 text-lg font-black
          ${
            isSelected
              ? 'border-red-600/60 text-red-500 bg-red-950/30'
              : 'border-zinc-700/60 text-zinc-500 bg-zinc-800/50'
          }
        `}
        >
          {caseNumber}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
            text-base sm:text-lg font-bold uppercase tracking-wider mb-0.5
            ${isSelected ? 'text-red-400' : 'text-zinc-300'}
          `}
          >
            {title}
          </h3>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">{subtitle}</p>
          <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">{description}</p>
          <p className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider">● {hint}</p>
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

export const SelectPlayModeStep: React.FC = () => {
  const { setupState, setPlayMode, nextPhase } = useSetupStore();
  const selectedPlayMode = setupState.playMode;

  const handleSelect = (mode: PlayMode) => {
    setPlayMode(mode);
  };

  const handleNext = () => {
    if (selectedPlayMode) {
      nextPhase();
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-8 italic leading-relaxed">
        <Typewriter text='"Каждое дело уникально..."' speed={35} />
        <br />
        <span className="text-zinc-600">
          <Typewriter text='Выберите формат расследования"' speed={35} delay={800} />
        </span>
      </p>

      <div className="space-y-4 flex-1">
        <PlayModeCard
          caseNumber="01"
          title="Против ИИ"
          subtitle="PvE • Одиночная игра"
          description="Сразитесь с искусственным интеллектом. Идеально для обучения и практики."
          hint="Рекомендуется для первой игры"
          isSelected={selectedPlayMode === 'PVE'}
          onSelect={() => handleSelect('PVE')}
        />

        <PlayModeCard
          caseNumber="02"
          title="Против игрока"
          subtitle="PvP • Два игрока"
          description="Противостояние двух умов. Один — Убийца, другой — Детектив."
          hint="Для опытных игроков"
          isSelected={selectedPlayMode === 'PVP'}
          onSelect={() => handleSelect('PVP')}
        />
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedPlayMode}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold
            border transition-all duration-300 relative overflow-hidden
            ${
              selectedPlayMode
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {selectedPlayMode ? 'Подтвердить →' : 'Выберите формат'}
        </button>
      </div>
    </div>
  );
};
