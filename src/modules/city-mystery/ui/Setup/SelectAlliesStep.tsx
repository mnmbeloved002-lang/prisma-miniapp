import type React from 'react';
import { useEffect, useState } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Faction } from '../../data/gameTypes';

const ALL_FACTIONS: Faction[] = [
  'OFFICIALS',
  'CIVILIANS',
  'CRIMINALS',
  'CLERGY',
  'OUTSIDERS',
  'BOURGEOIS',
  'WORKERS',
  'INTELLIGENTSIA',
];

const FACTION_INFO: Record<Faction, { name: string; icon: string; description: string }> = {
  OFFICIALS: { name: 'Чиновники', icon: '🏛️', description: 'Служители закона и порядка' },
  CIVILIANS: { name: 'Обыватели', icon: '👥', description: 'Простые жители города' },
  CRIMINALS: { name: 'Криминал', icon: '🔫', description: 'Теневая сторона города' },
  CLERGY: { name: 'Духовенство', icon: '⛪', description: 'Служители веры' },
  OUTSIDERS: { name: 'Маргиналы', icon: '🎭', description: 'Изгои общества' },
  BOURGEOIS: { name: 'Буржуазия', icon: '💰', description: 'Богатые и влиятельные' },
  WORKERS: { name: 'Рабочие', icon: '⚒️', description: 'Трудовой народ' },
  INTELLIGENTSIA: { name: 'Интеллигенция', icon: '📚', description: 'Образованные умы' },
};

interface AllyCardProps {
  faction: Faction;
  isSelected: boolean;
  onSelect: () => void;
}

const AllyCard: React.FC<AllyCardProps> = ({ faction, isSelected, onSelect }) => {
  const info = FACTION_INFO[faction];

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
        relative p-2.5 border transition-all duration-300
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
            Союзник
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-lg">{info.icon}</span>
          <div className="flex-1 min-w-0">
            <h3
              className={`
              text-xs font-bold uppercase tracking-wider
              ${isSelected ? 'text-red-400' : 'text-zinc-300'}
            `}
            >
              {info.name}
            </h3>
            <p className="text-[9px] text-zinc-500">{info.description}</p>
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

export const SelectAlliesStep: React.FC = () => {
  const { setupState, selectKillerAllies, nextPhase } = useSetupStore();
  const [availableFactions, setAvailableFactions] = useState<Faction[]>([]);

  useEffect(() => {
    if (availableFactions.length === 0) {
      const shuffled = [...ALL_FACTIONS].sort(() => Math.random() - 0.5);
      setAvailableFactions(shuffled.slice(0, 3));
    }
  }, [availableFactions.length]);

  const handleSelect = (faction: Faction) => {
    selectKillerAllies(faction);
  };

  const handleConfirm = () => {
    if (setupState.killerAllies) {
      nextPhase();
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-4 italic leading-relaxed">
        "У каждого хищника есть стая...
        <br />
        <span className="text-zinc-600">Выберите тех, кто прикроет вам спину"</span>
      </p>

      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-900/50">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Доступно:</span>
          <span className="text-xs font-bold text-zinc-400">3</span>
          <span className="text-zinc-700">→</span>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Выбрать:</span>
          <span className="text-xs font-bold text-red-500">1</span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {availableFactions.map((faction) => (
          <AllyCard
            key={faction}
            faction={faction}
            isSelected={setupState.killerAllies === faction}
            onSelect={() => handleSelect(faction)}
          />
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 text-center mt-4 italic">
        Союзники не дадут показаний против вас
      </p>

      <div className="mt-4 pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!setupState.killerAllies}
          className={`
            w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold 
            border transition-all duration-300
            ${
              setupState.killerAllies
                ? 'bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]'
                : 'bg-zinc-900/30 text-zinc-700 border-zinc-800/50 cursor-not-allowed'
            }
          `}
          style={{ minHeight: '52px' }}
        >
          {setupState.killerAllies ? 'Заключить союз →' : 'Выберите союзника'}
        </button>
      </div>
    </div>
  );
};
