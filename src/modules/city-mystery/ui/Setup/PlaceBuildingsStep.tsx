import type React from 'react';
import { useEffect } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { BuildingType } from '../../data/gameTypes';

const BUILDING_INFO: Record<BuildingType, { icon: string; name: string }> = {
  POLICE: { icon: '🚔', name: 'Полиция' },
  DINER: { icon: '🍔', name: 'Закусочная' },
  HOSPITAL: { icon: '🏥', name: 'Больница' },
  FIRE_STATION: { icon: '🚒', name: 'Пожарная' },
};

export const PlaceBuildingsStep: React.FC = () => {
  const { setupState, autoPlaceBuildings, nextPhase, prevPhase } = useSetupStore();

  const placedCount = setupState.availableBuildings.filter((b) => b.placed).length;

  // Авто-расстановка при входе
  useEffect(() => {
    if (placedCount === 0) {
      autoPlaceBuildings();
    }
  }, [autoPlaceBuildings, placedCount]);

  // Здание в квартале
  const getBuildingInDistrict = (districtIndex: number) => {
    return setupState.availableBuildings.find((b) => b.placed && b.position === districtIndex);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">🏢 Здания</h1>
      <p className="text-gray-400 text-center mb-4">8 зданий расставлены по стандартной схеме</p>

      {/* Легенда зданий */}
      <div className="flex justify-center gap-3 mb-4">
        {(Object.keys(BUILDING_INFO) as BuildingType[]).map((type) => {
          const info = BUILDING_INFO[type];
          return (
            <div key={type} className="flex items-center gap-1 text-sm">
              <span className="text-xl">{info.icon}</span>
              <span className="text-gray-400">{info.name}</span>
            </div>
          );
        })}
      </div>

      {/* Поле */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {Array.from({ length: 16 }).map((_, i) => {
          const building = getBuildingInDistrict(i);
          return (
            <div
              key={i}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all
                flex flex-col items-center justify-center
                ${
                  building ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-gray-600 bg-gray-800'
                }
              `}
            >
              <div className="text-[10px] text-gray-500">
                [{Math.floor(i / 4)},{i % 4}]
              </div>
              {building && (
                <>
                  <span className="text-2xl">{BUILDING_INFO[building.type].icon}</span>
                  <span className="text-[10px] text-gray-400">
                    {BUILDING_INFO[building.type].name}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Описание зданий */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="p-2 bg-gray-800 rounded">
          <span className="text-lg">🚔</span> <b>Полиция</b> — +1 действие детективу
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <span className="text-lg">🍔</span> <b>Закусочная</b> — правдивый ответ
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <span className="text-lg">🏥</span> <b>Больница</b> — защита от убийства
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <span className="text-lg">🚒</span> <b>Пожарная</b> — убрать место преступления
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={prevPhase}
          className="flex-1 py-3 rounded-lg font-bold bg-gray-700 hover:bg-gray-600 transition-all"
        >
          ← Назад
        </button>
        <button
          onClick={nextPhase}
          disabled={placedCount !== 8}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${
              placedCount === 8
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
