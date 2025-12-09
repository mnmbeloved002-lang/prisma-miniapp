import React from 'react';
import { Citizen } from '../data/citizens';

interface CityGridProps {
  grid: Citizen[][]; // 16 клеток
  detectivePos: number; // Где стоит детектив (0-15)
}

export const CityGrid: React.FC<CityGridProps> = ({ grid, detectivePos }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-gray-900 rounded-lg max-w-md mx-auto aspect-square">
      {grid.map((citizens, cellIndex) => {
        const isDetectiveHere = cellIndex === detectivePos;
        
        return (
          <div 
            key={cellIndex}
            className={`
              relative border-2 rounded p-1 flex flex-col items-center justify-center text-xs
              ${isDetectiveHere ? 'border-blue-500 bg-blue-900/30' : 'border-gray-700 bg-gray-800'}
              hover:border-yellow-500 cursor-pointer transition-colors
            `}
            style={{ minHeight: '80px' }}
          >
            {/* Номер квартала (для отладки) */}
            <span className="absolute top-0 left-1 text-[10px] text-gray-600 font-mono">
              {cellIndex}
            </span>

            {/* Фишка Детектива */}
            {isDetectiveHere && (
              <div className="absolute -top-2 -right-2 text-2xl z-10 animate-bounce">
                🕵️‍♂️
              </div>
            )}

            {/* Жители в квартале */}
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {citizens.map((citizen) => (
                <div 
                  key={citizen.id}
                  className="bg-gray-700 text-gray-200 px-1 rounded shadow-sm border border-gray-600 text-[10px] truncate w-full text-center"
                  title={`${citizen.role} (${citizen.faction})`}
                >
                  {citizen.role}
                </div>
              ))}
              
              {/* Если пусто */}
              {citizens.length === 0 && !isDetectiveHere && (
                <span className="text-gray-600">-</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
