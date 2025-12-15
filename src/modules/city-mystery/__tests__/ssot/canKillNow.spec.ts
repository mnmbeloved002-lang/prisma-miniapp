import { describe, expect, it } from 'vitest';
import { canKillNow } from '../../rules/canKillNow';
import type { GameState, Resident } from '../../rules/types';

function mkResident(partial: Partial<Resident> & { id: string }): Resident {
  return {
    id: partial.id,
    profession: partial.profession ?? `P_${partial.id}`,
    socialGroup: partial.socialGroup ?? 'G1',
    gender: partial.gender ?? 'M',
    age: partial.age ?? 'ADULT',
    body: partial.body ?? 'AVERAGE',
    height: partial.height ?? 'MEDIUM',
    intimidated: partial.intimidated ?? false,
    role: partial.role ?? 'CIVILIAN',
  };
}

function mkEmpty4x4(
  residents: Record<string, Resident>,
  placements: Array<{ id: string; x: number; y: number }>,
): GameState {
  const districts: GameState['districts'] = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      districts.push({ coord: { x, y }, residentIds: [] as string[] });
    }
  }

  for (const p of placements) {
    const d = districts.find((dd) => dd.coord.x === p.x && dd.coord.y === p.y);
    if (!d) {
      throw new Error('bad placement');
    }
    d.residentIds.push(p.id);
  }

  return {
    gridSize: 4,
    maxResidentsPerDistrict: 3,
    crimeTarget: 5,
    round: 1,
    motive: 'THUG',
    detectiveCoord: { x: 0, y: 0 },
    suspectId: undefined,
    residents,
    districts,
    victims: [],
  };
}

describe('SSOT canKillNow - golden', () => {
  it('denies killing in detective district (R_BASE_NOT_IN_DETECTIVE_DISTRICT)', () => {
    const r1 = mkResident({ id: 'A' });
    const state = mkEmpty4x4({ A: r1 }, [{ id: 'A', x: 0, y: 0 }]);
    const res = canKillNow(state, 'A');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_BASE_NOT_IN_DETECTIVE_DISTRICT');
  });

  it('denies killing the killer (R_BASE_NOT_KILLER)', () => {
    const killer = mkResident({ id: 'K', role: 'KILLER' });
    const state = mkEmpty4x4({ K: killer }, [{ id: 'K', x: 1, y: 0 }]);
    state.detectiveCoord = { x: 0, y: 0 };
    const res = canKillNow(state, 'K');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_BASE_NOT_KILLER');
  });

  it('THUG denies central districts (R_MOTIVE_THUG_NO_CENTRAL_DISTRICTS)', () => {
    const v = mkResident({ id: 'V' });
    const state = mkEmpty4x4({ V: v }, [{ id: 'V', x: 1, y: 1 }]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'THUG';
    const res = canKillNow(state, 'V');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_MOTIVE_THUG_NO_CENTRAL_DISTRICTS');
  });

  it('HITMAN requires exactly 1 resident in district', () => {
    const v1 = mkResident({ id: 'V1' });
    const v2 = mkResident({ id: 'V2' });
    const state = mkEmpty4x4({ V1: v1, V2: v2 }, [
      { id: 'V1', x: 2, y: 0 },
      { id: 'V2', x: 2, y: 0 },
    ]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'HITMAN';
    const res = canKillNow(state, 'V1');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain(
      'R_MOTIVE_HITMAN_DISTRICT_MUST_HAVE_EXACTLY_ONE_RESIDENT',
    );
  });

  it('VIGILANTE denies kills in 3×3 around detective (incl diagonal)', () => {
    const v = mkResident({ id: 'V' });
    const state = mkEmpty4x4({ V: v }, [{ id: 'V', x: 1, y: 1 }]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'VIGILANTE';
    const res = canKillNow(state, 'V');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_MOTIVE_VIGILANTE_NO_AROUND_DETECTIVE');
  });

  it('MANIAC enforces same gender across victims', () => {
    const v1 = mkResident({ id: 'V1', gender: 'M' });
    const v2 = mkResident({ id: 'V2', gender: 'F' });
    const state = mkEmpty4x4({ V1: v1, V2: v2 }, [
      { id: 'V1', x: 3, y: 3 },
      { id: 'V2', x: 3, y: 2 },
    ]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'MANIAC';
    state.victims.push({ victimId: 'V1', crimeNo: 1, crimeCoord: { x: 3, y: 3 } });
    const res = canKillNow(state, 'V2');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_MOTIVE_MANIAC_SAME_GENDER');
  });

  it('TERRORIST enforces unique social groups across victims', () => {
    const v1 = mkResident({ id: 'V1', socialGroup: 'G1' });
    const v2 = mkResident({ id: 'V2', socialGroup: 'G1' });
    const state = mkEmpty4x4({ V1: v1, V2: v2 }, [
      { id: 'V1', x: 3, y: 3 },
      { id: 'V2', x: 3, y: 2 },
    ]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'TERRORIST';
    state.victims.push({ victimId: 'V1', crimeNo: 1, crimeCoord: { x: 3, y: 3 } });
    const res = canKillNow(state, 'V2');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain(
      'R_MOTIVE_TERRORIST_ALL_UNIQUE_SOCIAL_GROUPS',
    );
  });

  it('ROBBER denies killing adjacent to previous crime scene (side adjacency)', () => {
    const v = mkResident({ id: 'V' });
    const state = mkEmpty4x4({ V: v }, [{ id: 'V', x: 2, y: 2 }]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'ROBBER';
    state.victims.push({ victimId: 'X', crimeNo: 1, crimeCoord: { x: 2, y: 1 } }); // previous crime above
    const res = canKillNow(state, 'V');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain('R_MOTIVE_ROBBER_NO_ADJACENT_TO_PREV_CRIME');
  });

  it('RADICAL feasibility: with 4 different-group victims, 5th kill is impossible to reach 3 same-group', () => {
    const residents = {
      A: mkResident({ id: 'A', socialGroup: 'G1' }),
      B: mkResident({ id: 'B', socialGroup: 'G2' }),
      C: mkResident({ id: 'C', socialGroup: 'G3' }),
      D: mkResident({ id: 'D', socialGroup: 'G4' }),
      E: mkResident({ id: 'E', socialGroup: 'G5' }),
    };
    const state = mkEmpty4x4(residents, [{ id: 'E', x: 3, y: 0 }]);
    state.detectiveCoord = { x: 0, y: 0 };
    state.motive = 'RADICAL';
    state.victims = [
      { victimId: 'A', crimeNo: 1, crimeCoord: { x: 0, y: 3 } },
      { victimId: 'B', crimeNo: 2, crimeCoord: { x: 1, y: 3 } },
      { victimId: 'C', crimeNo: 3, crimeCoord: { x: 2, y: 3 } },
      { victimId: 'D', crimeNo: 4, crimeCoord: { x: 3, y: 3 } },
    ];
    const res = canKillNow(state, 'E');
    expect(res.ok).toBe(false);
    expect(res.reasons.map((r) => r.ruleId)).toContain(
      'R_MOTIVE_RADICAL_MUST_REMAIN_FEASIBLE_FOR_3_SAME_SOCIAL_GROUP',
    );
  });

  it('CANNIBAL feasibility: last kill must cover missing body type', () => {
    const residents = {
      A: mkResident({ id: 'A', body: 'SLIM' }),
      B: mkResident({ id: 'B', body: 'AVERAGE' }),
      C: mkResident({ id: 'C', body: 'SLIM' }),
      D: mkResident({ id: 'D', body: 'AVERAGE' }),
      E: mkResident({ id: 'E', body: 'SLIM' }), // wrong for last
      H: mkResident({ id: 'H', body: 'HEAVY' }), // correct for last
    };
    const stateE = mkEmpty4x4(residents, [{ id: 'E', x: 3, y: 0 }]);
    stateE.detectiveCoord = { x: 0, y: 0 };
    stateE.motive = 'CANNIBAL';
    stateE.victims = [
      { victimId: 'A', crimeNo: 1, crimeCoord: { x: 0, y: 3 } },
      { victimId: 'B', crimeNo: 2, crimeCoord: { x: 1, y: 3 } },
      { victimId: 'C', crimeNo: 3, crimeCoord: { x: 2, y: 3 } },
      { victimId: 'D', crimeNo: 4, crimeCoord: { x: 3, y: 3 } },
    ];
    const denyRes = canKillNow(stateE, 'E');
    expect(denyRes.ok).toBe(false);
    expect(denyRes.reasons.map((r) => r.ruleId)).toContain(
      'R_MOTIVE_CANNIBAL_MUST_REMAIN_FEASIBLE_FOR_ALL_BODY_TYPES',
    );

    const stateH = mkEmpty4x4(residents, [{ id: 'H', x: 3, y: 0 }]);
    stateH.detectiveCoord = { x: 0, y: 0 };
    stateH.motive = 'CANNIBAL';
    stateH.victims = [...stateE.victims];
    const okRes = canKillNow(stateH, 'H');
    expect(okRes.ok).toBe(true);
    expect(okRes.reasons.length).toBe(0);
  });
});
