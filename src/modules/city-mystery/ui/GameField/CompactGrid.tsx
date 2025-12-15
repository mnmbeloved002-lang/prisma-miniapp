import type React from 'react';
import type { Citizen } from '../../data/citizens';
import type { BuildingType } from '../../data/gameTypes';

interface Building {
  type: BuildingType;
  position: number;
}

interface CompactGridProps {
  grid: Citizen[][];
  buildings: Building[];
  detectivePosition: number;
  crimeScenes: number[];
  frightenedResidents: string[];
  selectedDistrict: number | null;
  onSelectDistrict: (index: number) => void;
}

const BUILDING_ICON: Record<BuildingType, string> = {
  POLICE: '🚔',
  HOSPITAL: '🏥',
  DINER: '🍽',
  FIRE_STATION: '🚒',
};

export const CompactGrid: React.FC<CompactGridProps> = ({
  grid,
  buildings,
  detectivePosition,
  crimeScenes,
  frightenedResidents,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const getBuilding = (index: number) => buildings.find((b) => b.position === index);
  const hasCrimeScene = (index: number) => crimeScenes.includes(index);
  const hasFrightened = (index: number) =>
    grid[index]?.some((c) => frightenedResidents.includes(c.id));

  return (
    <div className="grid grid-cols-4 gap-1 w-full max-w-xs">
      {grid.map((citizens, index) => {
        const building = getBuilding(index);
        const isSelected = selectedDistrict === index;
        const isCrime = hasCrimeScene(index);
        const hasDetective = detectivePosition === index;
        const frightened = hasFrightened(index);

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelectDistrict(index)}
            className={`
              aspect-square border-2 transition-all duration-200 relative
              flex flex-col items-center justify-center p-1
              ${
                isSelected
                  ? 'border-red-600 bg-red-950/40 scale-105 z-10'
                  : isCrime
                    ? 'border-red-800/60 bg-red-950/30'
                    : 'border-zinc-700/60 bg-zinc-900/60 hover:border-zinc-600'
              }
            `}
          >
            {/* Количество жителей */}
            <span
              className={`
              text-lg font-bold
              ${citizens.length === 0 ? 'text-zinc-700' : 'text-zinc-300'}
              ${isCrime ? 'text-red-400' : ''}
            `}
            >
              {citizens.length}
            </span>

            {/* Здание */}
            {building && (
              <span className="text-xs absolute top-0.5 right-0.5">
                {BUILDING_ICON[building.type]}
              </span>
            )}

            {/* Детектив */}
            {hasDetective && <span className="text-sm absolute bottom-0.5 left-0.5">🔍</span>}

            {/* Труп */}
            {isCrime && <span className="text-xs absolute top-0.5 left-0.5">💀</span>}

            {/* Запуганные */}
            {frightened && !isCrime && (
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            )}

            {/* Координаты */}
            <span className="text-[8px] text-zinc-600 absolute bottom-0 right-0.5">
              {Math.floor(index / 4)},{index % 4}
            </span>
          </button>
        );
      })}
    </div>
  );
};
