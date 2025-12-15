import { describe, expect, it } from 'vitest';
import {
  areDistrictsAdjacent,
  CENTRAL_DISTRICTS,
  CORNER_DISTRICTS,
  GRID_SIZE,
  getAdjacentDistricts,
  getCoordinates,
  getDistrictIndex,
  TOTAL_DISTRICTS,
} from './gameConstants';

describe('City Mystery helpers: grid geometry', () => {
  it('GRID_SIZE and TOTAL_DISTRICTS should be consistent', () => {
    expect(GRID_SIZE).toBe(4);
    expect(TOTAL_DISTRICTS).toBe(GRID_SIZE * GRID_SIZE);
  });

  it('getDistrictIndex and getCoordinates should be inverse operations', () => {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = getDistrictIndex(x, y);
        const { x: rx, y: ry } = getCoordinates(index);

        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(TOTAL_DISTRICTS);
        expect(rx).toBe(x);
        expect(ry).toBe(y);
      }
    }
  });

  it('areDistrictsAdjacent should detect neighbors correctly (4-neighborhood)', () => {
    // проверяем центр поля (1,1) -> индекс 5
    const centerIndex = getDistrictIndex(1, 1);
    const up = getDistrictIndex(1, 0);
    const down = getDistrictIndex(1, 2);
    const left = getDistrictIndex(0, 1);
    const right = getDistrictIndex(2, 1);

    expect(areDistrictsAdjacent(centerIndex, up)).toBe(true);
    expect(areDistrictsAdjacent(centerIndex, down)).toBe(true);
    expect(areDistrictsAdjacent(centerIndex, left)).toBe(true);
    expect(areDistrictsAdjacent(centerIndex, right)).toBe(true);

    // диагонали не считаются соседями
    const diag1 = getDistrictIndex(0, 0);
    const diag2 = getDistrictIndex(2, 0);
    const diag3 = getDistrictIndex(0, 2);
    const diag4 = getDistrictIndex(2, 2);

    expect(areDistrictsAdjacent(centerIndex, diag1)).toBe(false);
    expect(areDistrictsAdjacent(centerIndex, diag2)).toBe(false);
    expect(areDistrictsAdjacent(centerIndex, diag3)).toBe(false);
    expect(areDistrictsAdjacent(centerIndex, diag4)).toBe(false);
  });

  it('getAdjacentDistricts should return only valid neighbors inside grid', () => {
    // центр: 4 соседа
    const center = getDistrictIndex(1, 1);
    const centerNeighbors = getAdjacentDistricts(center).sort((a, b) => a - b);
    const expectedCenterNeighbors = [
      getDistrictIndex(1, 0), // up
      getDistrictIndex(1, 2), // down
      getDistrictIndex(0, 1), // left
      getDistrictIndex(2, 1), // right
    ].sort((a, b) => a - b);

    expect(centerNeighbors).toEqual(expectedCenterNeighbors);

    // угол: только 2 соседа
    const topLeft = getDistrictIndex(0, 0);
    const topLeftNeighbors = getAdjacentDistricts(topLeft).sort((a, b) => a - b);
    const expectedTopLeftNeighbors = [getDistrictIndex(1, 0), getDistrictIndex(0, 1)].sort(
      (a, b) => a - b,
    );

    expect(topLeftNeighbors).toEqual(expectedTopLeftNeighbors);
  });

  it('CENTRAL_DISTRICTS and CORNER_DISTRICTS should refer to valid cells', () => {
    CENTRAL_DISTRICTS.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(TOTAL_DISTRICTS);
    });

    CORNER_DISTRICTS.forEach((idx) => {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(TOTAL_DISTRICTS);
    });
  });
});
