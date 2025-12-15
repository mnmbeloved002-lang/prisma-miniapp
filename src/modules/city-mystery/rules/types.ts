/* eslint-disable @typescript-eslint/consistent-type-definitions */

/**
 * City Murderer rules-engine types (isolated, additive module).
 * Does NOT depend on existing app types to avoid breaking current code.
 */

export type Coord = Readonly<{ x: number; y: number }>;

export type Gender = 'M' | 'F';
export type Age = 'YOUNG' | 'ADULT' | 'ELDER';
export type Body = 'SLIM' | 'AVERAGE' | 'HEAVY';
export type Height = 'SHORT' | 'MEDIUM' | 'TALL';

export type SocialGroupId = string;
export type ProfessionId = string;

export type MotiveId =
  | 'MANIAC'
  | 'SADIST'
  | 'VIGILANTE'
  | 'HITMAN'
  | 'THUG'
  | 'TERRORIST'
  | 'ROBBER'
  | 'RADICAL'
  | 'PSYCHOPATH'
  | 'CANNIBAL'
  | 'SPY'
  | 'CULTIST';

export type RuleId =
  | 'R_BASE_VICTIM_EXISTS'
  | 'R_BASE_VICTIM_ALIVE'
  | 'R_BASE_NOT_KILLER'
  | 'R_BASE_NOT_IN_DETECTIVE_DISTRICT'
  | 'R_MOTIVE_SADIST_NO_INTIMIDATED'
  | 'R_MOTIVE_HITMAN_DISTRICT_MUST_HAVE_EXACTLY_ONE_RESIDENT'
  | 'R_MOTIVE_THUG_NO_CENTRAL_DISTRICTS'
  | 'R_MOTIVE_VIGILANTE_NO_AROUND_DETECTIVE'
  | 'R_MOTIVE_ROBBER_NO_ADJACENT_TO_PREV_CRIME'
  | 'R_MOTIVE_MANIAC_SAME_GENDER'
  | 'R_MOTIVE_TERRORIST_ALL_UNIQUE_SOCIAL_GROUPS'
  | 'R_MOTIVE_PSYCHOPATH_MAX_TWO_AGES'
  | 'R_MOTIVE_RADICAL_MUST_REMAIN_FEASIBLE_FOR_3_SAME_SOCIAL_GROUP'
  | 'R_MOTIVE_CANNIBAL_MUST_REMAIN_FEASIBLE_FOR_ALL_BODY_TYPES'
  | 'R_MOTIVE_SPY_REQUIRES_SUSPECT'
  | 'R_MOTIVE_CULTIST_REQUIRES_SUSPECT'
  | 'R_MOTIVE_SPY_FIRST_VICTIM_DIFF_FROM_SUSPECT_GROUP'
  | 'R_MOTIVE_SPY_MUST_CHANGE_GROUP_EACH_KILL'
  | 'R_MOTIVE_SPY_MUST_KILL_SUSPECT_BY_END'
  | 'R_MOTIVE_CULTIST_CANNOT_KILL_SUSPECT_IN_ROUND_1'
  | 'R_MOTIVE_CULTIST_FORCE_SUSPECT_AT_5TH_KILL';

export type RoleTag = 'KILLER' | 'SUSPECT' | 'CIVILIAN';

export interface Resident {
  id: string;
  profession: ProfessionId;
  socialGroup: SocialGroupId;
  gender: Gender;
  age: Age;
  body: Body;
  height: Height;
  intimidated: boolean;
  role: RoleTag;
}

export interface District {
  coord: Coord;
  residentIds: string[];
  // building, tokens etc. can be added later
}

export interface VictimRecord {
  victimId: string;
  crimeNo: number; // 1..5
  crimeCoord: Coord;
}

export interface GameState {
  gridSize: number; // 4
  maxResidentsPerDistrict: number; // 3
  crimeTarget: number; // 5
  round: number; // starts from 1

  motive: MotiveId;

  // optional (for SPY/CULTIST)
  suspectId?: string;

  detectiveCoord: Coord;

  residents: Record<string, Resident>;
  districts: District[];

  victims: VictimRecord[];
}

export interface RuleReason {
  ruleId: RuleId;
  message: string;
}

export interface RuleDecision {
  ok: boolean;
  reasons: RuleReason[];
}

export function sameCoord(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function chebyshev(a: Coord, b: Coord): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

export function isCentral4x4(c: Coord): boolean {
  // 0-indexed central 2×2 of 4×4: (1,1)(1,2)(2,1)(2,2)
  return (c.x === 1 || c.x === 2) && (c.y === 1 || c.y === 2);
}

export function hasVictim(state: GameState, id: string): boolean {
  return state.victims.some((v) => v.victimId === id);
}

export function getDistrictByResidentId(
  state: GameState,
  residentId: string,
): District | undefined {
  return state.districts.find((d) => d.residentIds.includes(residentId));
}

export function getLastVictim(state: GameState): VictimRecord | undefined {
  if (state.victims.length === 0) {
    return undefined;
  }
  return state.victims[state.victims.length - 1];
}

export function getFirstVictim(state: GameState): VictimRecord | undefined {
  if (state.victims.length === 0) {
    return undefined;
  }
  return state.victims[0];
}

export function remainingKillsAfterThis(state: GameState): number {
  return state.crimeTarget - (state.victims.length + 1);
}

export function countBySocialGroup(state: GameState): Map<SocialGroupId, number> {
  const m = new Map<SocialGroupId, number>();
  for (const v of state.victims) {
    const r = state.residents[v.victimId];
    if (!r) {
      continue;
    }
    m.set(r.socialGroup, (m.get(r.socialGroup) ?? 0) + 1);
  }
  return m;
}

export function countByBody(state: GameState): Map<Body, number> {
  const m = new Map<Body, number>([
    ['SLIM', 0],
    ['AVERAGE', 0],
    ['HEAVY', 0],
  ]);
  for (const v of state.victims) {
    const r = state.residents[v.victimId];
    if (!r) {
      continue;
    }
    m.set(r.body, (m.get(r.body) ?? 0) + 1);
  }
  return m;
}

export function setOfAges(state: GameState): Set<Age> {
  const s = new Set<Age>();
  for (const v of state.victims) {
    const r = state.residents[v.victimId];
    if (!r) {
      continue;
    }
    s.add(r.age);
  }
  return s;
}
