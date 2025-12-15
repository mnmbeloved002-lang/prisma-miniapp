// Экспортируем всё из подмодулей

export * from './city';
export * from './detective';
export * from './init';
export * from './killer';
export * from './phases';
export * from './setup';
export * from './utils';

import {
  interrogateResident,
  makeAccusation,
  moveDetective,
  trackResident,
  useBuilding,
} from './detective';
// Импортируем функции для объекта совместимости
import { createGame } from './init';
import { frightenResidents, killResident, passKill } from './killer';
import { nextPhase, urgentCall } from './phases';
import {
  autoPlaceBuildings,
  autoPlaceCitizens,
  autoPlaceDetective,
  autoSelectMotives,
  autoSetup,
  createSetupState,
  nextSetupPhase,
  placeBuilding,
  placeCitizen,
  placeDetective,
  prevSetupPhase,
  removeBuilding,
  removeCitizen,
  selectKillerIdentity,
  selectKillerMotive,
  selectMode,
  selectRole,
  setupToGameState,
  toggleMotive,
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
