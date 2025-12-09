import React, { useState } from 'react';
import { useSetupStore } from '../../application/setupStore';
import type { Citizen } from '../../data/citizens';

const CORNER_DISTRICTS = [0, 3, 12, 15];
const MAX_IN_CORNER = 2;
const MAX_IN_OTHER = 3;

export const PlaceCitizensStep: React.FC = () => {
  const { setupState, placeCitizen, removeCitizen, autoPlaceCitizens, nextPhase, prevPhase } = useSetupStore();
  const [selectedCitizen, setSelectedCitizen] = useState<string | null>(null);
  
  const placedCount = setupState.placedCitizens.length;
  const totalCitizens = setupState.availableCitizens.length;
  
  // Жители без места
  const unplacedCitizens = setupState.availableCitizens.filter(
    c => !setupState.placedCitizens.some(p => p.citizenId === c.id)
  );
  
  // Жители в квартале
  const getCitizensInDistrict = (districtIndex: number): Citizen[] => {
    const citizenIds = setupState.placedCitizens
      .filter(p => p.districtIndex === districtIndex)
      .map(p => p.citizenId);
    return setupState.availableCitizens.filter(c => citizenIds.includes(c.id));
  };
  
  // Максимум жителей в квартале
  const getMaxInDistrict = (districtIndex: number) => {
    return CORNER_DISTRICTS.includes(districtIndex) ? MAX_IN_CORNER : MAX_IN_OTHER;
  };
  
  // Проверка готовности к переходу
  const isReadyToNext = () => {
    // Все 20 размещены
    if (placedCount !== totalCitizens) return false;
    
    // В каждом углу ровно 2
    for (const corner of CORNER_DISTRICTS) {
      const count = getCitizensInDistrict(corner).length;
      if (count !== MAX_IN_CORNER) return false;
    }
    
    return true;
  };
  
  // Сообщение об ошибке
  const getValidationMessage = () => {
    if (placedCount !== totalCitizens) {
      return `Разместите всех жителей (${placedCount}/${totalCitizens})`;
    }
    
    for (const corner of CORNER_DISTRICTS) {
      const count = getCitizensInDistrict(corner).length;
      if (count !== MAX_IN_CORNER) {
        const [y, x] = [Math.floor(corner / 4), corner % 4];
        return `В угловом квартале [${y},${x}] должно быть ровно 2 жителя (сейчас ${count})`;
      }
    }
    
    return null;
  };
  
  const handleDistrictClick = (districtIndex: number) => {
    const citizens = getCitizensInDistrict(districtIndex);
    const max = getMaxInDistrict(districtIndex);
    
    if (selectedCitizen && citizens.length < max) {
      placeCitizen(selectedCitizen, districtIndex);
      setSelectedCitizen(null);
    }
  };
  
  const handleCitizenRemove = (citizenId: string) => {
    removeCitizen(citizenId);
  };
  
  const validationMessage = getValidationMessage();
  const ready = isReadyToNext();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">👥 Расстановка жителей</h1>
      <p className="text-gray-400 text-center mb-1">
        Углы: строго 2 | Остальные: до 3
      </p>
      <p className="text-center mb-4">
        <span className={ready ? 'text-green-400' : 'text-yellow-400'}>
          {placedCount}/{totalCitizens} размещено
        </span>
      </p>
      
      <div className="flex gap-4">
        {/* Поле */}
        <div className="flex-1">
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 16 }).map((_, i) => {
              const citizens = getCitizensInDistrict(i);
              const max = getMaxInDistrict(i);
              const isCorner = CORNER_DISTRICTS.includes(i);
              const canPlace = selectedCitizen && citizens.length < max;
              const cornerValid = !isCorner || citizens.length === MAX_IN_CORNER;
              
              return (
                <div
                  key={i}
                  onClick={() => handleDistrictClick(i)}
                  className={`
                    min-h-[70px] p-1 rounded border-2 transition-all cursor-pointer
                    ${canPlace
                      ? 'border-yellow-500 bg-yellow-500/20'
                      : isCorner 
                        ? cornerValid
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                        : 'border-gray-600 bg-gray-800'}
                    hover:border-gray-400
                  `}
                >
                  <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                    <span>[{Math.floor(i/4)},{i%4}]</span>
                    <span className={isCorner && citizens.length !== MAX_IN_CORNER ? 'text-red-400' : ''}>
                      {citizens.length}/{max}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {citizens.map(c => (
                      <div 
                        key={c.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCitizenRemove(c.id);
                        }}
                        className="text-[10px] truncate flex items-center gap-0.5 hover:bg-red-500/30 rounded cursor-pointer"
                        title={`${c.role} — клик чтобы убрать`}
                      >
                        <span>{c.gender === 'MALE' ? '👨' : '👩'}</span>
                        <span className="truncate">{c.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Легенда */}
          <div className="flex justify-center gap-4 text-xs text-gray-400 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50"></span>
              Угол (ровно 2) ✓
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50"></span>
              Угол (нужно 2)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-800 border border-gray-600"></span>
              Обычный (0-3)
            </span>
          </div>
        </div>
        
        {/* Список нераспределённых жителей */}
        <div className="w-48">
          <div className="text-sm text-gray-400 mb-2">
            Не размещены ({unplacedCitizens.length}):
          </div>
          <div className="h-72 overflow-y-auto space-y-1 pr-1">
            {unplacedCitizens.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">
                Все жители размещены ✓
              </div>
            ) : (
              unplacedCitizens.map(citizen => (
                <button
                  key={citizen.id}
                  onClick={() => setSelectedCitizen(
                    citizen.id === selectedCitizen ? null : citizen.id
                  )}
                  className={`
                    w-full p-1.5 rounded text-xs text-left transition-all
                    ${selectedCitizen === citizen.id
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 hover:bg-gray-600'}
                  `}
                >
                  <span>{citizen.gender === 'MALE' ? '👨' : '👩'}</span>
                  <span className="ml-1">{citizen.role}</span>
                  <div className="text-[10px] opacity-70 truncate">
                    {citizen.faction}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      {selectedCitizen && (
        <p className="text-center text-yellow-400 text-sm mt-2">
          Кликните на квартал чтобы разместить жителя
        </p>
      )}
      
      {validationMessage && !selectedCitizen && (
        <p className="text-center text-red-400 text-sm mt-2">
          ⚠️ {validationMessage}
        </p>
      )}
      
      <button
        onClick={autoPlaceCitizens}
        className="w-full py-2 mt-4 mb-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-sm"
      >
        🎲 Авто-расстановка по правилам
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
          disabled={!ready}
          className={`
            flex-1 py-3 rounded-lg font-bold transition-all
            ${ready
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          Далее →
        </button>
      </div>
    </div>
  );
};
