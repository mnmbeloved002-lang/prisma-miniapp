import type React from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Citizen } from '../../data/citizens';

export const PlaceDetectiveStep: React.FC = () => {
  const { setupState, placeDetective, autoPlaceDetective, nextPhase, prevPhase } = useSetupStore();

  // Жители в квартале
  const getCitizensInDistrict = (districtIndex: number): Citizen[] => {
    const citizenIds = setupState.placedCitizens
      .filter((p) => p.districtIndex === districtIndex)
      .map((p) => p.citizenId);
    return setupState.availableCitizens.filter((c) => citizenIds.includes(c.id));
  };

  // Здание в квартале
  const getBuildingInDistrict = (districtIndex: number) => {
    return setupState.availableBuildings.find((b) => b.placed && b.position === districtIndex);
  };

  const BUILDING_ICONS: Record<string, string> = {
    POLICE: '🚔',
    DINER: '🍔',
    HOSPITAL: '🏥',
    FIRE_STATION: '🚒',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Разместите детектива</h1>
      <p className="text-gray-400 text-center mb-6">Выберите начальный квартал для детектива 🔍</p>

      {/* Поле */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array.from({ length: 16 }).map((_, i) => {
          const citizens = getCitizensInDistrict(i);
          const building = getBuildingInDistrict(i);
          const isSelected = setupState.detectivePosition === i;

          return (
            <div
              key={i}
              onClick={() => placeDetective(i)}
              className={`
                aspect-square p-1.5 rounded-lg border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/30'
                    : 'border-gray-600 bg-gray-800 hover:border-blue-400'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-500">
                  [{Math.floor(i / 4)},{i % 4}]
                </span>
                {building && <span className="text-sm">{BUILDING_ICONS[building.type]}</span>}
              </div>

              <div className="flex flex-wrap gap-0.5 mt-1">
                {citizens.slice(0, 3).map((c) => (
                  <span key={c.id} className="text-xs">
                    {c.gender === 'MALE' ? '👨' : '👩'}
                  </span>
                ))}
              </div>

              {isSelected && (
                <div className="text-center mt-1">
                  <span className="text-xl">🔍</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={autoPlaceDetective}
        className="w-full py-2 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-sm"
      >
        🎲 Выбрать случайно
      </button>

      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={setupState.detectivePosition === null}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${
              setupState.detectivePosition !== null
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};
