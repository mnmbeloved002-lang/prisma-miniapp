import { describe, expect, it } from 'vitest';
import { applyGroupMoveOneStep, listLegalDestinations } from '../../rules/applyMove';
import type { GameState, Resident } from '../../rules/types';

function mkResident(id: string, socialGroup = 'G1'): Resident {
  return {
    id,
    profession: `P_${id}`,
    socialGroup,
    gender: 'M',
    age: 'ADULT',
    body: 'AVERAGE',
    height: 'MEDIUM',
    intimidated: false,
    role: 'CIVILIAN',
  };
}

function mustFindDistrict(districts: GameState['districts'], x: number, y: number) {
  const d = districts.find((dd) => dd.coord.x === x && dd.coord.y === y);
  if (!d) {
    throw new Error(`District not found at (${x},${y})`);
  }
  return d;
}

function mkState(): GameState {
  const districts: GameState['districts'] = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      districts.push({ coord: { x, y }, residentIds: [] as string[] });
    }
  }

  const residents: Record<string, Resident> = {
    A: mkResident('A', 'G1'),
    B: mkResident('B', 'G1'),
    C: mkResident('C', 'G2'),
  };

  // Place A at (1,1), B at (1,2), C at (0,0)
  mustFindDistrict(districts, 1, 1).residentIds.push('A');
  mustFindDistrict(districts, 1, 2).residentIds.push('B');
  mustFindDistrict(districts, 0, 0).residentIds.push('C');

  return {
    gridSize: 4,
    maxResidentsPerDistrict: 3,
    crimeTarget: 5,
    round: 1,
    motive: 'THUG',
    detectiveCoord: { x: 3, y: 3 },
    residents,
    districts,
    victims: [],
  };
}

describe('SSOT applyMove - golden', () => {
  it('listLegalDestinations excludes crime scenes and full districts', () => {
    const state = mkState();

    // mark crime scene at (1,0)
    state.victims.push({ victimId: 'Z', crimeNo: 1, crimeCoord: { x: 1, y: 0 } });

    // fill (2,1) with 3 dummy residents (simulate full)
    const dFull = mustFindDistrict(state.districts, 2, 1);
    dFull.residentIds.push('X1', 'X2', 'X3');

    const legal = listLegalDestinations(state, 'A'); // A is at (1,1)
    // Adjacent coords are (0,1)(2,1)(1,0)(1,2)
    // (2,1) full, (1,0) crime, so must not be present
    expect(legal).toEqual(
      expect.arrayContaining([
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ]),
    );
    expect(legal).not.toEqual(
      expect.arrayContaining([
        { x: 2, y: 1 },
        { x: 1, y: 0 },
      ]),
    );
  });

  it('applyGroupMoveOneStep moves each member of social group exactly once', () => {
    const state = mkState();

    // Plan: move A from (1,1) -> (0,1), move B from (1,2) -> (1,3)
    const next = applyGroupMoveOneStep(state, 'G1', [
      { residentId: 'A', to: { x: 0, y: 1 } },
      { residentId: 'B', to: { x: 1, y: 3 } },
    ]);

    const d01 = mustFindDistrict(next.districts, 0, 1);
    const d13 = mustFindDistrict(next.districts, 1, 3);

    expect(d01.residentIds).toContain('A');
    expect(d13.residentIds).toContain('B');
  });
});
