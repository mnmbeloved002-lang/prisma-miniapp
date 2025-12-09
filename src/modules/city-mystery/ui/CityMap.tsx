import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CitizenCard } from './CitizenCard';
import { BUILDING_ICONS } from '../data/gameConstants';
import type { GameState } from '../data/gameTypes';

interface CityMapProps {
  gameState: GameState;
  selectedResidents: string[];
  playerRole: 'KILLER' | 'DETECTIVE';
  onDistrictClick: (index: number) => void;
  onResidentClick: (id: string) => void;
}

export const CityMap: React.FC<CityMapProps> = ({
  gameState,
  selectedResidents,
  playerRole,
  onDistrictClick,
  onResidentClick,
}) => {
  
  const isMoveable = (index: number) => {
    return (
      playerRole === 'DETECTIVE' &&
      gameState.phase === 'DETECTIVE' &&
      gameState.step === 'INVESTIGATE' &&
      gameState.detective.movementPoints > 0 &&
      index !== gameState.detective.position &&
      !gameState.crimeScenes.includes(index)
    );
  };

  return (
    // КОНТЕЙНЕР: w-fit, чтобы обтянуть жесткую сетку
    <div className="w-fit mx-auto">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Карта
        </h2>
        <div className="text-xs text-gray-500 font-mono">
          Fixed 220px
        </div>
      </div>

      {/* СЕТКА: gap-2 (8px ~ 2mm) */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-black/40 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
        {gameState.grid.map((residents, index) => {
          const building = gameState.buildings.find(b => b.position === index);
          const isCrimeScene = gameState.crimeScenes.includes(index);
          const isDetectiveHere = gameState.detective.position === index;
          const canMove = isMoveable(index);
          
          const x = index % 4;
          const y = Math.floor(index / 4);

          return (
            <motion.div
              key={index}
              onClick={() => canMove && onDistrictClick(index)}
              className={`
                relative w-[220px] h-[220px] rounded-xl border p-2 flex flex-col
                transition-all duration-200 overflow-hidden
                ${isCrimeScene ? 'bg-red-900/20 border-red-500/50' : 'bg-gray-900/60 border-white/5'}
                ${canMove ? 'cursor-pointer hover:bg-blue-900/20 hover:border-blue-500/50' : ''}
                ${isDetectiveHere ? 'ring-2 ring-blue-500 shadow-lg' : ''}
              `}
            >
              {/* 1. ВЕРХ: Координаты и Здание */}
              <div className="flex justify-between items-start mb-2 h-6">
                <span className="text-[10px] font-mono text-gray-500">
                  [{y}, {x}]
                </span>
                {building && (
                  <span className="text-xl leading-none" title={building.type}>
                    {BUILDING_ICONS[building.type]}
                  </span>
                )}
              </div>

              {/* 2. ЦЕНТР: Сетка жителей (занимает всё свободное место) */}
              <div className="flex-1 flex flex-col gap-1 min-h-0">
                {[0, 1, 2].map((slot) => {
                  const citizen = residents[slot];
                  // Пустой слот
                  if (!citizen) {
                     return <div key={`empty-${slot}`} className="flex-1 rounded bg-white/5 border border-white/5" />;
                  }
                  // Карточка жителя
                  return (
                    <div key={citizen.id} className="flex-1 min-h-0 relative z-10">
                      <CitizenCard
                        citizen={citizen}
                        isFrightened={gameState.frightenedResidents.includes(citizen.id)}
                        isSelected={selectedResidents.includes(citizen.id)}
                        onClick={() => onResidentClick(citizen.id)}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 3. СЛОИ: Детектив и Место преступления (абсолютное позиционирование) */}
              
              {/* Детектив (справа внизу, поверх всего) */}
              {isDetectiveHere && (
                <motion.div 
                  layoutId="detective-token"
                  className="absolute bottom-1 right-1 text-3xl z-20 drop-shadow-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  🕵️
                </motion.div>
              )}

              {/* Место преступления (на фоне, большой череп) */}
              {isCrimeScene && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-6xl opacity-10 grayscale grayscale-0">💀</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
