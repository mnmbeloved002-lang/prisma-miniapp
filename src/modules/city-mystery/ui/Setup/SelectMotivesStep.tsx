import type React from 'react';
import { useState } from 'react';
import { useSetupStore } from '../../application/setupStore';
import { MOTIVE_CARDS } from '../../data/gameConstants';
import type { Motive } from '../../data/gameTypes';

const ALL_MOTIVES: Motive[] = [
  'MANIAC',
  'SADIST',
  'HEADHUNTER',
  'VIGILANTE',
  'KILLER',
  'TERRORIST',
  'PSYCHOPATH',
  'CANNIBAL',
  'RADICAL',
  'ROBBER',
  'SPY',
  'CULTIST',
];

interface MotiveChipProps {
  motive: Motive;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  onShowInfo: () => void;
}

const MotiveChip: React.FC<MotiveChipProps> = ({
  motive,
  isSelected,
  isDisabled,
  onToggle,
  onShowInfo,
}) => {
  const card = MOTIVE_CARDS[motive];

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowInfo();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      className={`
        relative p-2 border transition-all duration-200 flex flex-col items-center justify-center
        ${
          isSelected
            ? 'bg-red-950/40 border-red-700/60 scale-[1.02]'
            : isDisabled
              ? 'bg-zinc-900/20 border-zinc-800/30 opacity-40 cursor-not-allowed'
              : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/60'
        }
      `}
    >
      {/* Кнопка info */}
      <button
        type="button"
        onClick={handleInfoClick}
        className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[8px] text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer z-10"
        aria-label="Info"
      >
        i
      </button>

      {/* Булавка выбора */}
      {isSelected && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-600 rounded-full shadow-lg" />
      )}

      <span className="text-lg mb-0.5">{card?.icon || '❓'}</span>
      <span
        className={`
        text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-center leading-tight
        ${isSelected ? 'text-red-400' : 'text-zinc-500'}
      `}
      >
        {card?.name || motive}
      </span>
    </button>
  );
};

interface MotiveInfoPopupProps {
  motive: Motive;
  onClose: () => void;
}

const MotiveInfoPopup: React.FC<MotiveInfoPopupProps> = ({ motive, onClose }) => {
  const card = MOTIVE_CARDS[motive];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: Cannot use <button> here because it contains another button (close icon)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Close popup"
    >
      {/* Контейнер */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Key events handled by parent wrapper */}
      <div
        className="relative max-w-xs w-full bg-zinc-900 border border-zinc-700 p-5 shadow-2xl cursor-default"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Скрепка */}
        <div className="absolute -top-1 right-6 w-3 h-6 rounded-b-sm bg-red-600" />

        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Контент */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{card?.icon || '❓'}</span>
          <div>
            <h3 className="text-lg font-bold text-zinc-200 uppercase tracking-wide">
              {card?.name || motive}
            </h3>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Мотив преступления</p>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-800 mb-4" />

        <p className="text-sm text-zinc-400 leading-relaxed italic">
          "{card?.description || 'Описание отсутствует'}"
        </p>

        <div className="mt-4 pt-3 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-600 text-center uppercase tracking-wider">
            Нажмите чтобы закрыть
          </p>
        </div>
      </div>
    </div>
  );
};

export const SelectMotivesStep: React.FC = () => {
  const { setupState, toggleMotive, autoSelectMotives, nextPhase } = useSetupStore();
  const [infoMotive, setInfoMotive] = useState<Motive | null>(null);

  const selectedCount = setupState.selectedMotives.length;
  const isComplete = selectedCount === 6;

  return (
    <div className="w-full flex flex-col h-full">
      {/* Popup */}
      {infoMotive && <MotiveInfoPopup motive={infoMotive} onClose={() => setInfoMotive(null)} />}

      {/* Эпиграф + счётчик */}
      <div className="text-center mb-4">
        <p className="text-zinc-500 text-xs italic mb-3">"У каждого убийцы есть причина..."</p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Досье:</span>
          <span className={`text-sm font-bold ${isComplete ? 'text-red-500' : 'text-zinc-400'}`}>
            {selectedCount}
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-600">6</span>
        </div>
      </div>

      {/* Сетка мотивов 4x3 */}
      <div className="grid grid-cols-4 gap-2 flex-1 content-start">
        {ALL_MOTIVES.map((motive) => (
          <MotiveChip
            key={motive}
            motive={motive}
            isSelected={setupState.selectedMotives.includes(motive)}
            isDisabled={isComplete}
            onToggle={() => toggleMotive(motive)}
            onShowInfo={() => setInfoMotive(motive)}
          />
        ))}
      </div>

      {/* Кнопка случайного выбора */}
      <button
        type="button"
        onClick={autoSelectMotives}
        className="w-full py-2.5 mt-4 text-[11px] uppercase tracking-wider text-zinc-500 border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:text-zinc-400 transition-all"
      >
        ⚄ Случайный набор
      </button>

      {/* Кнопка подтверждения */}
      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          disabled={!isComplete}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold 
            border transition-all duration-300
            ${
              isComplete
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {isComplete ? 'Утвердить мотивы →' : `Выберите ещё ${6 - selectedCount}`}
        </button>
      </div>
    </div>
  );
};
