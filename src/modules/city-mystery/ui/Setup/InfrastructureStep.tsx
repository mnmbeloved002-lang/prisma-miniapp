import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import { DEFAULT_BUILDINGS } from '../../data/gameConstants';

const BUILDING_INFO: Record<string, { name: string; icon: string }> = {
  POLICE: { name: 'Полиция', icon: '🚔' },
  HOSPITAL: { name: 'Госпиталь', icon: '🏥' },
  DINER: { name: 'Закусочная', icon: '🍽️' },
  FIRE_STATION: { name: 'Пожарная', icon: '🚒' },
};

const DISTRICT_IDS = [
  'd0',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'd8',
  'd9',
  'd10',
  'd11',
  'd12',
  'd13',
  'd14',
  'd15',
];

export const InfrastructureStep: React.FC = () => {
  const { nextPhase } = useSetupStore();

  // Создаём карту позиций зданий из DEFAULT_BUILDINGS
  const buildingMap = new Map<number, string>();
  for (const building of DEFAULT_BUILDINGS) {
    buildingMap.set(building.position, building.type);
  }

  return (
    <div className="w-full flex flex-col h-full">
      <p className="text-zinc-500 text-xs sm:text-sm text-center mb-4 italic leading-relaxed">
        "Город имеет свою структуру...
        <br />
        <span className="text-zinc-600">Здания расставлены согласно плану"</span>
      </p>

      <div className="grid grid-cols-4 gap-1 mb-4">
        {DISTRICT_IDS.map((id, i) => {
          const building = buildingMap.get(i);
          const info = building ? BUILDING_INFO[building] : null;

          return (
            <div
              key={id}
              className={`
                aspect-square border flex flex-col items-center justify-center p-1
                ${info ? 'border-zinc-700 bg-zinc-800/60' : 'border-zinc-800/50 bg-zinc-900/30'}
              `}
            >
              {info ? (
                <>
                  <span className="text-lg">{info.icon}</span>
                  <span className="text-[8px] text-zinc-500 mt-0.5 text-center leading-tight">
                    {info.name}
                  </span>
                </>
              ) : (
                <span className="text-[10px] text-zinc-700">
                  [{Math.floor(i / 4)},{i % 4}]
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(BUILDING_INFO).map(([key, info]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-2 py-1.5 border border-zinc-800/50 bg-zinc-900/30"
          >
            <span className="text-base">{info.icon}</span>
            <span className="text-[10px] text-zinc-500">{info.name}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 text-center italic mb-4">
        Здания фиксированы по правилам и не меняются
      </p>

      <div className="mt-auto pt-4 border-t border-zinc-800/50">
        <button
          type="button"
          onClick={nextPhase}
          className="w-full py-4 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold border transition-all duration-300 bg-transparent text-zinc-300 border-zinc-600 hover:border-red-600 hover:text-red-400 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)]"
          style={{ minHeight: '52px' }}
        >
          Подтвердить →
        </button>
      </div>
    </div>
  );
};
