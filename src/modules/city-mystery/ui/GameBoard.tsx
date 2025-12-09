import React from 'react';
import { useGameStore } from '../application/gameStore';
import { CityMap } from './CityMap';

export const GameBoard: React.FC = () => {
  const {
    gameState,
    playerRole,
    selectedResidents,
    moveDetective,
    selectResident,
  } = useGameStore();

  if (!gameState) return null;

  return (
    <CityMap
      gameState={gameState}
      selectedResidents={selectedResidents}
      playerRole={playerRole || 'DETECTIVE'}
      onDistrictClick={(index) => {
        // Детектив кликает по кварталу -> движение
        moveDetective(index);
      }}
      onResidentClick={(id) => {
        // Клик по жителю -> выбор
        selectResident(id);
      }}
    />
  );
};
