import type React from 'react';
import { useState } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Citizen } from '../../data/citizens';
import { Typewriter } from './Typewriter';

const FACTION_RU: Record<string, string> = {
  WORKERS: 'Рабочие',
  LAW: 'Закон',
  CRIME: 'Преступность',
  PRESS: 'Пресса',
  MEDICINE: 'Медицина',
  MIGRANTS: 'Мигранты',
  POWER: 'Власть',
  BOHEMIA: 'Богема',
  MARGINALS: 'Маргиналы',
};

// Иконки характеристик
const AGE_ICON: Record<string, string> = { YOUNG: '🧒', ADULT: '👤', OLD: '👴' };
const HEIGHT_ICON: Record<string, string> = { SHORT: '↓', MEDIUM: '—', TALL: '↑' };
const BUILD_ICON: Record<string, string> = { SLIM: '◇', MEDIUM: '○', LARGE: '●' };

interface CitizenCardProps {
  citizen: Citizen;
  isSelected: boolean;
  onSelect: () => void;
  onShowDetails: () => void;
}

const CitizenCard: React.FC<CitizenCardProps> = ({
  citizen,
  isSelected,
  onSelect,
  onShowDetails,
}) => {
  const displayName = citizen.name || citizen.role || citizen.id.slice(0, 8);
  const faction = FACTION_RU[citizen.faction] || citizen.faction;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowDetails();
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onContextMenu={handleContextMenu}
      className={`
        w-full text-left transition-all duration-200 relative
        ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
      `}
    >
      <div
        className={`
        relative p-2 border transition-all duration-200
        ${
          isSelected
            ? 'bg-zinc-900/80 border-red-700/60 shadow-[0_0_20px_rgba(185,28,28,0.15)]'
            : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700/60'
        }
      `}
      >
        {/* Скрепка */}
        <div
          className={`
          absolute -top-0.5 right-3 w-2 h-4 rounded-b-sm transition-colors
          ${isSelected ? 'bg-red-600' : 'bg-zinc-700'}
        `}
        />

        {/* Контент */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{citizen.gender === 'MALE' ? '👨' : '👩'}</span>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold truncate ${isSelected ? 'text-red-400' : 'text-zinc-300'}`}
            >
              {displayName}
            </p>
            <p className="text-[9px] text-zinc-600 truncate">{faction}</p>
          </div>
        </div>

        {/* Характеристики иконками */}
        <div className="flex items-center gap-3 mt-2 text-zinc-500">
          <span className="text-sm" title="Возраст">
            {AGE_ICON[citizen.age] || '?'}
          </span>
          <span className="text-sm" title="Рост">
            {HEIGHT_ICON[citizen.height] || '?'}
          </span>
          <span className="text-sm" title="Телосложение">
            {BUILD_ICON[citizen.build] || '?'}
          </span>
        </div>

        {/* Полоса выбора */}
        <div
          className={`
          absolute bottom-0 left-0 h-0.5 transition-all duration-300
          ${isSelected ? 'w-full bg-red-700/60' : 'w-0'}
        `}
        />
      </div>
    </button>
  );
};

// Popup с деталями
interface DetailsPopupProps {
  citizen: Citizen;
  onClose: () => void;
}

const AGE_RU: Record<string, string> = { YOUNG: 'Молодой', ADULT: 'Взрослый', OLD: 'Пожилой' };
const HEIGHT_RU: Record<string, string> = { SHORT: 'Низкий', MEDIUM: 'Средний', TALL: 'Высокий' };
const BUILD_RU: Record<string, string> = { SLIM: 'Худощавый', MEDIUM: 'Среднее', LARGE: 'Крупный' };

const DetailsPopup: React.FC<DetailsPopupProps> = ({ citizen, onClose }) => {
  const displayName = citizen.name || citizen.role;
  const faction = FACTION_RU[citizen.faction] || citizen.faction;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-xs w-full bg-zinc-900 border border-zinc-700 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-1 right-6 w-3 h-6 rounded-b-sm bg-red-600" />

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{citizen.gender === 'MALE' ? '👨' : '👩'}</span>
          <div>
            <h3 className="text-lg font-bold text-zinc-200">{displayName}</h3>
            <p className="text-xs text-zinc-500">{faction}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">Возраст</span>
            <span className="text-zinc-300">{AGE_RU[citizen.age]}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span className="text-zinc-500">Рост</span>
            <span className="text-zinc-300">{HEIGHT_RU[citizen.height]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Телосложение</span>
            <span className="text-zinc-300">{BUILD_RU[citizen.build]}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2 text-xs uppercase tracking-wider text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export const SelectKillerStep: React.FC = () => {
  const { setupState, selectKillerIdentity, nextPhase, prevPhase } = useSetupStore();
  const [detailsCitizen, setDetailsCitizen] = useState<Citizen | null>(null);

  const selectedKiller = setupState.killerIdentityId
    ? (setupState.availableCitizens.find((c) => c.id === setupState.killerIdentityId) ?? null)
    : null;

  return (
    <div className="w-full flex flex-col h-full">
      {/* Popup */}
      {detailsCitizen && (
        <DetailsPopup citizen={detailsCitizen} onClose={() => setDetailsCitizen(null)} />
      )}

      <p className="text-zinc-500 text-xs text-center mb-3 italic">
        <Typewriter text='"Выберите свою личность — это ваш секрет"' speed={30} />
      </p>

      {/* Легенда характеристик */}
      <div className="flex justify-center gap-4 mb-3 text-[10px] text-zinc-600">
        <span>🧒👤👴 возраст</span>
        <span>↓—↑ рост</span>
        <span>◇○● сложение</span>
      </div>

      {/* Выбранный */}
      {selectedKiller && (
        <div className="mb-3 p-2 bg-red-950/30 border border-red-700/40 flex items-center gap-2">
          <span className="text-lg">{selectedKiller.gender === 'MALE' ? '👨' : '👩'}</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-red-400">
              {selectedKiller.name || selectedKiller.role}
            </p>
            <p className="text-[9px] text-zinc-500">{FACTION_RU[selectedKiller.faction]}</p>
          </div>
          <span className="text-xs text-zinc-600">🔪</span>
        </div>
      )}

      {/* Сетка жителей */}
      <div className="grid grid-cols-2 gap-1.5 max-w-xs mx-auto w-full flex-1 overflow-y-auto overflow-x-hidden content-start pb-2">
        {setupState.availableCitizens.map((citizen) => (
          <CitizenCard
            key={citizen.id}
            citizen={citizen}
            isSelected={setupState.killerIdentityId === citizen.id}
            onSelect={() => selectKillerIdentity(citizen.id)}
            onShowDetails={() => setDetailsCitizen(citizen)}
          />
        ))}
      </div>

      <p className="text-[9px] text-zinc-600 text-center mt-2 italic">
        Удерживайте карточку для деталей
      </p>

      {/* Кнопки */}
      <div className="mt-3 pt-3 border-t border-zinc-800/50 flex gap-2">
        <button
          type="button"
          onClick={prevPhase}
          className="flex-1 py-3 uppercase tracking-[0.2em] text-[10px] font-semibold border border-zinc-700/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
        >
          ← Назад
        </button>
        <button
          type="button"
          onClick={nextPhase}
          disabled={!setupState.killerIdentityId}
          className={`
            flex-1 py-3 uppercase tracking-[0.2em] text-[10px] font-semibold border transition-all duration-300
            ${
              setupState.killerIdentityId
                ? 'border-zinc-600 text-zinc-300 hover:border-red-600 hover:text-red-400'
                : 'border-zinc-800/50 text-zinc-700 cursor-not-allowed'
            }
          `}
        >
          Подтвердить →
        </button>
      </div>
    </div>
  );
};
