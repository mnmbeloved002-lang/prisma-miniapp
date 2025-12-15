/**
 * Zustand store для настройки игры
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AIDifficulty,
  BuildingType,
  GameMode,
  GameState,
  Motive,
  PlayerRole,
  PlayMode,
  SetupState,
} from '../data/gameTypes';
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
  selectKillerAllies,
  selectKillerIdentity,
  selectKillerMotive,
  selectMode,
  selectPlayMode,
  selectRole,
  setAIDifficulty as setAIDifficultyRule,
  setupToGameState,
  toggleMotive,
} from '../data/rules/setup';

interface SetupStoreState {
  // Состояние настройки
  setupState: SetupState;

  // UI состояние
  error: string | null;

  // Действия — режим и роль
  selectMode: (mode: GameMode) => void;
  selectRole: (role: PlayerRole) => void;

  // Действия — формат и сложность
  setPlayMode: (mode: PlayMode) => void;
  setAIDifficulty: (difficulty: AIDifficulty) => void;

  // Действия — мотивы
  toggleMotive: (motive: Motive) => void;
  autoSelectMotives: () => void;

  // Действия — жители
  placeCitizen: (citizenId: string, districtIndex: number) => void;
  removeCitizen: (citizenId: string) => void;
  autoPlaceCitizens: () => void;

  // Действия — здания
  placeBuilding: (buildingType: BuildingType, position: number) => void;
  removeBuilding: (position: number) => void;
  autoPlaceBuildings: () => void;

  // Действия — детектив
  placeDetective: (position: number) => void;
  autoPlaceDetective: () => void;

  // Действия — убийца
  selectKillerIdentity: (citizenId: string) => void;
  selectKillerMotive: (motive: Motive) => void;
  selectKillerAllies: (faction: string) => void;

  // Навигация
  nextPhase: () => void;
  prevPhase: () => void;

  // Быстрая настройка
  autoSetup: (mode: GameMode, role: PlayerRole) => void;

  // Финализация
  finishSetup: () => GameState | null;

  // Сброс
  reset: () => void;
}

export const useSetupStore = create<SetupStoreState>()(
  devtools(
    (set, get) => ({
      setupState: createSetupState(),
      error: null,

      // Режим и роль
      selectMode: (mode) => {
        set({
          setupState: selectMode(get().setupState, mode),
          error: null,
        });
      },

      selectRole: (role) => {
        set({
          setupState: selectRole(get().setupState, role),
          error: null,
        });
      },

      // Формат и сложность
      setPlayMode: (mode) => {
        set({
          setupState: selectPlayMode(get().setupState, mode),
          error: null,
        });
      },

      setAIDifficulty: (difficulty) => {
        set({
          setupState: setAIDifficultyRule(get().setupState, difficulty),
          error: null,
        });
      },

      // Мотивы
      toggleMotive: (motive) => {
        const result = toggleMotive(get().setupState, motive);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      autoSelectMotives: () => {
        set({
          setupState: autoSelectMotives(get().setupState),
          error: null,
        });
      },

      // Жители
      placeCitizen: (citizenId, districtIndex) => {
        const result = placeCitizen(get().setupState, citizenId, districtIndex);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      removeCitizen: (citizenId) => {
        set({
          setupState: removeCitizen(get().setupState, citizenId),
          error: null,
        });
      },

      autoPlaceCitizens: () => {
        set({
          setupState: autoPlaceCitizens(get().setupState),
          error: null,
        });
      },

      // Здания
      placeBuilding: (buildingType, position) => {
        const result = placeBuilding(get().setupState, buildingType, position);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      removeBuilding: (position) => {
        set({
          setupState: removeBuilding(get().setupState, position),
          error: null,
        });
      },

      autoPlaceBuildings: () => {
        set({
          setupState: autoPlaceBuildings(get().setupState),
          error: null,
        });
      },

      // Детектив
      placeDetective: (position) => {
        const result = placeDetective(get().setupState, position);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      autoPlaceDetective: () => {
        set({
          setupState: autoPlaceDetective(get().setupState),
          error: null,
        });
      },

      // Убийца
      selectKillerIdentity: (citizenId) => {
        const result = selectKillerIdentity(get().setupState, citizenId);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      selectKillerMotive: (motive) => {
        const result = selectKillerMotive(get().setupState, motive);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      selectKillerAllies: (faction) => {
        const result = selectKillerAllies(get().setupState, faction);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      // Навигация
      nextPhase: () => {
        const result = nextSetupPhase(get().setupState);
        set({
          setupState: result.state,
          error: result.error || null,
        });
      },

      prevPhase: () => {
        set({
          setupState: prevSetupPhase(get().setupState),
          error: null,
        });
      },

      // Быстрая настройка
      autoSetup: (mode, role) => {
        set({
          setupState: autoSetup(mode, role),
          error: null,
        });
      },

      // Финализация
      finishSetup: () => {
        const result = setupToGameState(get().setupState);
        if ('error' in result) {
          set({ error: result.error });
          return null;
        }
        return result;
      },

      // Сброс
      reset: () => {
        set({
          setupState: createSetupState(),
          error: null,
        });
      },
    }),
    { name: 'setup-store' },
  ),
);
