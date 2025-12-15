import type React from 'react';
import type { Citizen } from '../../data/citizens';

interface CitizenBadgeProps {
  citizen: Citizen;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const FACTION_ICONS: Record<string, string> = {
  Чиновники: '🏛️',
  Предприниматели: '💼',
  Интеллигенция: '📚',
  Рабочие: '🔧',
  Криминал: '🔫',
  Маргиналы: '🎭',
};

export const CitizenBadge: React.FC<CitizenBadgeProps> = ({
  citizen,
  isSelected,
  onClick,
  size = 'sm',
}) => {
  const genderIcon = citizen.gender === 'male' ? '👨' : '👩';
  const factionIcon = FACTION_ICONS[citizen.faction] || '👤';

  if (size === 'sm') {
    return (
      <button
        onClick={onClick}
        className={`
          px-1.5 py-0.5 rounded text-xs transition-all flex items-center gap-1
          ${isSelected ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}
        `}
        title={`${citizen.role}\n${citizen.faction} • ${citizen.age} • ${citizen.build}`}
      >
        <span>{genderIcon}</span>
        <span className="truncate max-w-[60px]">{citizen.role.split(' ')[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-lg border-2 text-left transition-all w-full
        ${
          isSelected
            ? 'border-yellow-500 bg-yellow-500/20'
            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{genderIcon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{citizen.role}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>{factionIcon}</span>
            <span>{citizen.faction}</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {citizen.age} • {citizen.build} • {citizen.height}
      </div>
    </button>
  );
};
