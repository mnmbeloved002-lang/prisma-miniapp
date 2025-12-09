// Экспортируем всё из подмодулей
export * from './utils';
export * from './setup';
export * from './killer';
export * from './detective';
export * from './phases';
export * from './city';
export * from './init';

// Импортируем функции для объекта совместимости
import { createGame } from './init';
import { frightenResidents, killResident, passKill } from './killer';
import { moveDetective, interrogateResident, useBuilding, trackResident, makeAccusation } from './detective';
import { nextPhase, urgentCall } from './phases';
import { 
  createSetupState,
  selectMode,
  selectRole,
  toggleMotive,
  autoSelectMotives,
  placeCitizen,
  removeCitizen,
  autoPlaceCitizens,
  placeBuilding,
  removeBuilding,
  autoPlaceBuildings,
  placeDetective,
  autoPlaceDetective,
  selectKillerIdentity,
  selectKillerMotive,
  nextSetupPhase,
  prevSetupPhase,
  autoSetup,
  setupToGameState,
} from './setup';

// Единый объект для GameStore
export const gameRules = {
  // Старый API (для совместимости)
  createGame,
  frightenResidents,
  killResident,
  passKill,
  moveDetective,
  interrogateResident,
  useBuilding,
  trackResident,
  makeAccusation,
  urgentCall,
  nextPhase,
  
  // Новый Setup API
  createSetupState,
  selectMode,
  selectRole,
  toggleMotive,
  autoSelectMotives,
  placeCitizen,
  removeCitizen,
  autoPlaceCitizens,
  placeBuilding,
  removeBuilding,
  autoPlaceBuildings,
  placeDetective,
  autoPlaceDetective,
  selectKillerIdentity,
  selectKillerMotive,
  nextSetupPhase,
  prevSetupPhase,
  autoSetup,
  setupToGameState,
};
