import React from 'react';
import { useGameStore } from '../application/gameStore';
import { CitizenCard } from './CitizenCard';
import { BUILDING_ICONS } from '../data/gameConstants';

interface DistrictDetailsPanelProps {
  selectedDistrict: number | null;
  onClose: () => void;
}

function getCoordinates(index: number): { x: number; y: number } {
  return {
    x: index % 4,
    y: Math.floor(index / 4),
  };
}

function getBuildingName(type: string): string {
  switch (type) {
    case 'POLICE':
      return 'Полиция';
    case 'DINER':
      return 'Закусочная';
    case 'HOSPITAL':
      return 'Больница';
    case 'FIRE_STATION':
      return 'Пожарная';
    default:
      return 'Здание';
  }
}

/**
 * Детальная карточка квартала:
 * — координаты
 * — здание
 * — жители (до 3)
 * — метки: детектив, место преступления
 */
export const DistrictDetailsPanel: React.FC<DistrictDetailsPanelProps> = ({
  selectedDistrict,
  onClose,
}) => {
  const { gameState, selectedResidents, selectResident } = useGameStore();

  if (!gameState || selectedDistrict === null) return null;

  const { x, y } = getCoordinates(selectedDistrict);
  const residents = gameState.grid[selectedDistrict] ?? [];
  const building = gameState.buildings.find((b) => b.position === selectedDistrict) ?? null;
  const isCrimeScene = gameState.crimeScenes.includes(selectedDistrict);
  const detectiveHere = gameState.detective.position === selectedDistrict;

  return (
    <div className="fixed inset-0 z-40 flex items-end lg:items-center justify-center bg-black/60">
      <div className="w-full lg:max-w-xl bg-gray-900 rounded-t-3xl lg:rounded-3xl border border-gray-700 shadow-xl p-4 lg:p-6 max-h-[90vh] overflow-y-auto">
        {/* Хедер */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Квартал [{y},{x}]</div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              🏙️ Детали квартала
              {detectiveHere && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-200 border border-blue-500/60">
                  Детектив здесь
                </span>
              )}
              {isCrimeScene && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-200 border border-red-500/60">
                  Место преступления
                </span>
              )}
            </h2>
            {building && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                <span className="text-2xl">{BUILDING_ICONS[building.type]}</span>
                <span>{getBuildingName(building.type)}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-white text-xl leading-none px-2"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Жители квартала */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Жители квартала</h3>

          {residents.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-700 rounded-xl bg-gray-900/40">
              В этом квартале сейчас нет жителей.
            </div>
          ) : (
            <div className="space-y-2">
              {residents.map((citizen) => (
                <CitizenCard
                  key={citizen.id}
                  citizen={citizen}
                  isFrightened={gameState.frightenedResidents.includes(citizen.id)}
                  isSelected={selectedResidents.includes(citizen.id)}
                  onClick={() => selectResident(citizen.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Доп. статус */}
        <div className="mt-4 text-xs text-gray-500 border-t border-gray-800 pt-3">
          <p>
            Раунд: <span className="text-gray-200">{gameState.round}</span> /{' '}
            <span className="text-gray-400">{gameState.maxRounds}</span>
          </p>
          <p className="mt-1">
            Фаза:{' '}
            <span className="text-gray-200">
              {gameState.phase === 'KILLER'
                ? 'Убийца'
                : gameState.phase === 'DETECTIVE'
                  ? 'Детектив'
                  : 'Город'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
