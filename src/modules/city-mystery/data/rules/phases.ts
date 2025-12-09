import type { GameState } from '../gameTypes';
import type { Citizen } from '../citizens';
import { getAdjacentDistricts } from '../gameConstants';
import { cloneState, pickRandom, type GameRuleResult } from './utils';

function performCityMigration(grid: Citizen[][], crimeScenes: number[]): Citizen[][] {
  const newGrid: Citizen[][] = grid.map(cell => [...cell]);
  
  for (let i = 0; i < 16; i++) {
    if (newGrid[i].length > 0) {
      if (Math.random() > 0.5) {
        const citizenToMove = newGrid[i][0];
        const neighbors = getAdjacentDistricts(i);
        const validNeighbors = neighbors.filter(n => 
           newGrid[n].length < 3 && !crimeScenes.includes(n)
        );
        
        if (validNeighbors.length > 0) {
           const target = pickRandom(validNeighbors, 1)[0];
           newGrid[i].shift();
           newGrid[target].push(citizenToMove);
        }
      }
    }
  }
  return newGrid;
}

export function urgentCall(state: GameState): GameRuleResult {
  if (state.step !== 'URGENT_CALL') return { isValid: false, error: 'Сейчас не срочный вызов' };
  
  const latestCrimeScene = state.crimeScenes[state.crimeScenes.length - 1];
  if (latestCrimeScene === undefined) {
    const newState = cloneState(state);
    newState.step = 'INVESTIGATE';
    return { isValid: true, state: newState };
  }
  
  const newState = cloneState(state);
  newState.detective.position = latestCrimeScene;
  newState.step = 'INVESTIGATE';
  newState.detective.actionsLeft = 2;
  newState.detective.movementPoints = 2;
  
  return { isValid: true, state: newState };
}

export function nextPhase(state: GameState): GameRuleResult {
  const newState = cloneState(state);
  
  switch (state.phase) {
    case 'KILLER':
      newState.phase = 'DETECTIVE';
      newState.step = state.crimeScenes.length > 0 ? 'URGENT_CALL' : 'INVESTIGATE';
      newState.detective.actionsLeft = 2;
      newState.detective.movementPoints = 2;
      break;
      
    case 'DETECTIVE':
      newState.phase = 'CITY';
      newState.step = 'POPULATION';
      break;
      
    case 'CITY':
      newState.grid = performCityMigration(newState.grid, newState.crimeScenes);
      
      newState.phase = 'KILLER';
      newState.step = 'FRIGHTEN';
      newState.round++;
      
      newState.frightenedResidents = [];
      newState.killer.frightenedThisRound = [];
      newState.buildings.forEach(b => { b.usedThisRound = false; });
      
      if (newState.round > newState.maxRounds) {
        newState.isGameOver = true;
        newState.winner = 'DETECTIVE';
        newState.reason = 'Время вышло, убийца не успел';
      }
      break;
  }
  
  return { isValid: true, state: newState };
}
