import { type Coord, type District, type GameState, manhattan, sameCoord } from './types';

export interface Move {
  residentId: string;
  to: Coord;
}

/**
 * Residents cannot enter crime scenes (victim districts).
 */
export function isCrimeScene(state: GameState, coord: Coord): boolean {
  return state.victims.some((v) => sameCoord(v.crimeCoord, coord));
}

export function getDistrict(state: GameState, coord: Coord): District | undefined {
  return state.districts.find((d) => sameCoord(d.coord, coord));
}

export function adjacentCoords(coord: Coord, gridSize: number): Coord[] {
  const res: Coord[] = [];
  const cands: Coord[] = [
    { x: coord.x - 1, y: coord.y },
    { x: coord.x + 1, y: coord.y },
    { x: coord.x, y: coord.y - 1 },
    { x: coord.x, y: coord.y + 1 },
  ];

  for (const c of cands) {
    if (c.x >= 0 && c.x < gridSize && c.y >= 0 && c.y < gridSize) {
      res.push(c);
    }
  }

  return res;
}

export function listLegalDestinations(
  state: GameState,
  residentId: string,
  opts?: { requireAdjacency?: boolean },
): Coord[] {
  const from = state.districts.find((d) => d.residentIds.includes(residentId));
  if (!from) {
    return [];
  }

  const requireAdjacency = opts?.requireAdjacency ?? true;
  const candidates = requireAdjacency
    ? adjacentCoords(from.coord, state.gridSize)
    : allCoords(state.gridSize);

  const legal = candidates.filter((c) => {
    if (isCrimeScene(state, c)) {
      return false;
    }
    const d = getDistrict(state, c);
    if (!d) {
      return false;
    }
    if (d.residentIds.length >= state.maxResidentsPerDistrict) {
      return false;
    }
    return true;
  });

  if (legal.length > 0) {
    return legal;
  }

  // Fallback: allow ANY district (no adjacency) with capacity and non-crime
  const anyNonCrimeWithCap = allCoords(state.gridSize).filter((c) => {
    if (isCrimeScene(state, c)) {
      return false;
    }
    const d = getDistrict(state, c);
    if (!d) {
      return false;
    }
    return d.residentIds.length < state.maxResidentsPerDistrict;
  });

  if (anyNonCrimeWithCap.length > 0) {
    return anyNonCrimeWithCap;
  }

  // Fallback 2: allow ANY district not crime scene (ignore cap)
  const anyNonCrime = allCoords(state.gridSize).filter((c) => !isCrimeScene(state, c));
  if (anyNonCrime.length > 0) {
    return anyNonCrime;
  }

  // Ultimate fallback: any coord
  return allCoords(state.gridSize);
}

export function applyMove(state: GameState, move: Move): GameState {
  const from = state.districts.find((d) => d.residentIds.includes(move.residentId));
  if (!from) {
    throw new Error(`applyMove: resident ${move.residentId} not found on board`);
  }

  if (manhattan(from.coord, move.to) !== 1) {
    throw new Error(`applyMove: move must be adjacent by side (N/E/S/W)`);
  }

  if (isCrimeScene(state, move.to)) {
    throw new Error(`applyMove: cannot move resident into crime scene district`);
  }

  const to = getDistrict(state, move.to);
  if (!to) {
    throw new Error(`applyMove: target district not found`);
  }

  if (to.residentIds.length >= state.maxResidentsPerDistrict) {
    throw new Error(`applyMove: target district is full`);
  }

  return applyMoveUnsafe(state, move);
}

/**
 * Applies a move without adjacency/capacity/crime checks.
 * Intended for fallback rules (“if impossible, allow any district”).
 */
export function applyMoveUnsafe(state: GameState, move: Move): GameState {
  const districts = state.districts.map((d) => ({
    ...d,
    residentIds: [...d.residentIds],
  }));

  const from = districts.find((d) => d.residentIds.includes(move.residentId));
  const to = districts.find((d) => sameCoord(d.coord, move.to));
  if (!from || !to) {
    throw new Error(`applyMoveUnsafe: district not found`);
  }

  from.residentIds = from.residentIds.filter((id) => id !== move.residentId);
  to.residentIds.push(move.residentId);

  return { ...state, districts };
}

/**
 * Applies “move each resident of given social group by 1 step”.
 * Caller provides explicit plan (deterministic), engine validates each step with default constraints.
 */
export function applyGroupMoveOneStep(
  state: GameState,
  socialGroup: string,
  plan: Move[],
): GameState {
  const groupResidents = Object.values(state.residents)
    .filter((r) => r.socialGroup === socialGroup)
    .map((r) => r.id);

  // Must move each group resident exactly once
  const moved = new Set(plan.map((p) => p.residentId));

  for (const id of groupResidents) {
    if (!moved.has(id)) {
      throw new Error(`applyGroupMoveOneStep: missing move for resident ${id}`);
    }
  }

  for (const id of moved) {
    if (!groupResidents.includes(id)) {
      throw new Error(`applyGroupMoveOneStep: plan includes non-group resident ${id}`);
    }
  }

  // Apply sequentially (capacity updates after each)
  let s = state;
  for (const mv of plan) {
    const legal = listLegalDestinations(s, mv.residentId, { requireAdjacency: true });
    const isLegal = legal.some((c) => sameCoord(c, mv.to));
    if (!isLegal) {
      throw new Error(`applyGroupMoveOneStep: illegal move for ${mv.residentId}`);
    }
    s = applyMove(s, mv);
  }

  return s;
}

function allCoords(gridSize: number): Coord[] {
  const res: Coord[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      res.push({ x, y });
    }
  }
  return res;
}
