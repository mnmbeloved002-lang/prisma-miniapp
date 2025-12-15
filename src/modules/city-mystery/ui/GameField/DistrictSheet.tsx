import type React from 'react';
import type { Citizen } from '../../data/citizens';
import type { BuildingType, PlayerRole } from '../../data/gameTypes';

interface Building {
  type: BuildingType;
  position: number;
  usedThisRound?: boolean;
}

interface DistrictSheetProps {
  districtIndex: number;
  citizens: Citizen[];
  building?: Building;
  hasDetective: boolean;
  hasCrimeScene: boolean;
  frightenedIds: string[];
  playerRole: PlayerRole | null;
  phase: string;
  onClose: () => void;
  onAction: (action: string, target?: string) => void;
}

const BUILDING_INFO: Record<BuildingType, { name: string; icon: string }> = {
  POLICE: { name: 'Полиция', icon: '🚔' },
  HOSPITAL: { name: 'Госпиталь', icon: '🏥' },
  DINER: { name: 'Закусочная', icon: '🍽' },
  FIRE_STATION: { name: 'Пожарная', icon: '🚒' },
};

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

const AGE_RU: Record<string, string> = { YOUNG: 'Молодой', ADULT: 'Взрослый', OLD: 'Пожилой' };
const HEIGHT_RU: Record<string, string> = { SHORT: 'Низкий', MEDIUM: 'Средний', TALL: 'Высокий' };
const BUILD_RU: Record<string, string> = { SLIM: 'Худой', MEDIUM: 'Среднее', LARGE: 'Крупный' };

export const DistrictSheet: React.FC<DistrictSheetProps> = ({
  districtIndex,
  citizens,
  building,
  hasDetective,
  hasCrimeScene,
  frightenedIds,
  playerRole,
  phase,
  onClose,
  onAction,
}) => {
  const row = Math.floor(districtIndex / 4);
  const col = districtIndex % 4;

  const canKillerAct = playerRole === 'KILLER' && phase === 'KILLER';
  const canDetectiveAct = playerRole === 'DETECTIVE' && phase === 'DETECTIVE';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />

      {/* Sheet - компактный и центрированный */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-2">
        <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl animate-slide-up">
          <style>{`
            @keyframes slide-up {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up { animation: slide-up 0.2s ease-out; }
          `}</style>

          {/* Header */}
          <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-300">
                [{row},{col}]
              </span>
              {hasDetective && <span>🔍</span>}
              {hasCrimeScene && <span>💀</span>}
              {building && <span className="text-sm">{BUILDING_INFO[building.type].icon}</span>}
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm px-1">
              ✕
            </button>
          </div>

          {/* Citizens */}
          <div className="max-h-[40vh] overflow-y-auto">
            {citizens.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center py-4">Пусто</p>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {citizens.map((citizen) => {
                  const isFrightened = frightenedIds.includes(citizen.id);
                  return (
                    <div
                      key={citizen.id}
                      className={`
                        px-3 py-2 flex items-center gap-2
                        ${isFrightened ? 'bg-yellow-950/20' : ''}
                      `}
                    >
                      <span className="text-lg">{citizen.gender === 'MALE' ? '👨' : '👩'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-300 truncate">
                          {citizen.name || citizen.role}
                          {isFrightened && <span className="ml-1">😨</span>}
                        </p>
                        <p className="text-[9px] text-zinc-500">
                          {FACTION_RU[citizen.faction]} • {AGE_RU[citizen.age]} •{' '}
                          {HEIGHT_RU[citizen.height]} • {BUILD_RU[citizen.build]}
                        </p>
                      </div>

                      {/* Действия убийцы */}
                      {canKillerAct && (
                        <div className="flex gap-1">
                          {!isFrightened && (
                            <button
                              type="button"
                              onClick={() => onAction('FRIGHTEN', citizen.id)}
                              className="w-7 h-7 flex items-center justify-center text-xs border border-yellow-700/50 text-yellow-500 hover:bg-yellow-950/30 rounded"
                              title="Запугать"
                            >
                              😨
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onAction('KILL', citizen.id)}
                            className="w-7 h-7 flex items-center justify-center text-xs border border-red-700/50 text-red-500 hover:bg-red-950/30 rounded"
                            title="Убить"
                          >
                            🔪
                          </button>
                        </div>
                      )}

                      {/* Действия детектива */}
                      {canDetectiveAct && hasDetective && (
                        <button
                          type="button"
                          onClick={() => onAction('INTERROGATE', citizen.id)}
                          className="w-7 h-7 flex items-center justify-center text-xs border border-blue-700/50 text-blue-400 hover:bg-blue-950/30 rounded"
                          title="Допросить"
                        >
                          ❓
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-900/95">
            {canDetectiveAct && !hasDetective && (
              <button
                type="button"
                onClick={() => onAction('MOVE_HERE')}
                className="w-full py-2 text-[10px] uppercase tracking-wider border border-zinc-700 text-zinc-400 hover:border-blue-600 hover:text-blue-400 rounded"
              >
                🚶 Идти сюда
              </button>
            )}
            {building && canDetectiveAct && hasDetective && (
              <button
                type="button"
                onClick={() => onAction('USE_BUILDING')}
                className="w-full py-2 text-[10px] uppercase tracking-wider border border-green-700/50 text-green-400 hover:bg-green-950/30 rounded"
              >
                {BUILDING_INFO[building.type].icon} Использовать
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
