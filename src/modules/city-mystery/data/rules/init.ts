import { allCitizens, type Citizen, type Faction } from '../citizens';
import { BASE_MOTIVES, DEFAULT_BUILDINGS } from '../gameConstants';
import type { GameState, NewGameConfig } from '../gameTypes';
import { generateId, pickRandom, shuffle } from './utils';

function distributeCitizens(citizens: Citizen[]): Citizen[][] {
  const grid: Citizen[][] = Array.from({ length: 16 }, () => []);
  const shuffled = shuffle(citizens);

  shuffled.forEach((citizen) => {
    for (let i = 0; i < 16; i++) {
      const districtIndex = (Math.floor(Math.random() * 16) + i) % 16;
      if (grid[districtIndex].length < 3) {
        grid[districtIndex].push(citizen);
        break;
      }
    }
  });

  return grid;
}

export function createGame(
  config: NewGameConfig = {
    mode: 'LOGIC',
    includeFigure: false,
    selectedMotives: BASE_MOTIVES,
  },
): GameState {
  const selectedCitizens = pickRandom(allCitizens, 20);
  const killer = pickRandom(selectedCitizens, 1)[0];

  const figure = config.includeFigure
    ? pickRandom(
        selectedCitizens.filter((c) => c.id !== killer.id),
        1,
      )[0]
    : null;

  const availableMotives =
    config.selectedMotives.length > 0 ? config.selectedMotives : BASE_MOTIVES;
  const motive = pickRandom(availableMotives, 1)[0];

  const factions = [...new Set(allCitizens.map((c) => c.faction))] as Faction[];
  const allies = pickRandom(factions, 1)[0];

  const grid = distributeCitizens(selectedCitizens);

  return {
    id: generateId('game-'),
    mode: config.mode,
    phase: 'KILLER',
    step: 'FRIGHTEN',
    round: 1,
    maxRounds: 5,
    grid,
    buildings: DEFAULT_BUILDINGS.map((b) => ({ ...b, usedThisRound: false })),
    crimeScenes: [],
    frightenedResidents: [],
    detective: {
      position: 0,
      actionsLeft: 2,
      movementPoints: 2,
      trackingToken: { residentId: null, districtIndex: null },
      collectedEvidence: [],
      availableCards: [],
    },
    killer: {
      identity: killer,
      motive,
      allies,
      figure,
      frightenedThisRound: [],
      usedAbilities: [],
    },
    victims: [],
    availableMotives: availableMotives,
    discardedMotives: [],
    isGameOver: false,
    history: [],
  };
}
