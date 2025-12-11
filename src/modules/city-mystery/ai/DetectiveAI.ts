/**
 * AI Детектива для симуляции игры
 * Путь: src/modules/city-mystery/ai/DetectiveAI.ts
 */

import type { GameState, QuestionType, Motive, BuildingType } from '../data/gameTypes';
import type { Citizen, Faction } from '../data/citizens';
import { getDistrictForResident, getAdjacentDistricts, MOTIVE_CARDS } from '../data/gameConstants';

export interface DetectiveDecision {
  action: string;
  target?: string | number;
  question?: QuestionType;
  value?: string;
  reasoning: string;
}

interface SuspectProfile {
  gender?: { value: string; confidence: number };
  age?: { value: string; confidence: number };
  build?: { value: string; confidence: number };
  height?: { value: string; confidence: number };
  faction?: { value: string; confidence: number };
  excludedIds: string[];
  possibleMotives: Motive[];
}

export class DetectiveAI {
  private log: string[] = [];
  private profile: SuspectProfile = {
    excludedIds: [],
    possibleMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
  };
  private interrogationHistory: Map<string, { question: QuestionType; answer: boolean; trusted: boolean }[]> = new Map();

  /**
   * Решает, что делать на фазе расследования
   */
  decideAction(state: GameState): DetectiveDecision {
    const currentDistrict = state.detective.position;
    const actionsLeft = state.detective.actionsLeft;
    const movementLeft = state.detective.movementPoints;

    this.log.push(`[DETECTIVE] === Принятие решения ===`);
    this.log.push(`[DETECTIVE] Позиция: квартал ${currentDistrict}`);
    this.log.push(`[DETECTIVE] Действий: ${actionsLeft}, Движения: ${movementLeft}`);

    // Если нет действий и движения - пропуск
    if (actionsLeft === 0 && movementLeft === 0) {
      return { action: 'PASS', reasoning: 'Нет действий и движения' };
    }
    const usedActions = state.detective.usedActionTypes || [];
    
    // Приоритет 1: Допросить жителей в текущем квартале
    if (actionsLeft > 0 && !usedActions.includes('INTERROGATE')) {
      const residentsHere = state.grid[currentDistrict];
      const canInterrogate = residentsHere.filter((r) => !state.frightenedResidents.includes(r.id));
      if (canInterrogate.length > 0) {
        const decision = this.decideInterrogation(state, canInterrogate);
        if (decision) return decision;
      }
    }
    // Приоритет 2: Использовать здание
    if (actionsLeft > 0) {
      const buildingHere = state.buildings.find(
        (b) => b.position === currentDistrict && !b.usedThisRound,
      );
      if (buildingHere && !usedActions.includes(`BUILDING_${buildingHere.type}`)) {
        const decision = this.decideBuildingUse(state, buildingHere.type);
        if (decision) return decision;
      }
    }
    // Приоритет 3: Переместиться к жителям
    if (movementLeft > 0) {
      const decision = this.decideMovement(state);
      if (decision) return decision;
    }

    return { action: 'PASS', reasoning: 'Нет полезных действий' };
  }

  /**
   * Решает, кого и о чём допросить
   */
  private decideInterrogation(state: GameState, candidates: Citizen[]): DetectiveDecision | null {
    const leastInterrogated = candidates.sort((a, b) => {
      const aCount = this.interrogationHistory.get(a.id)?.length || 0;
      const bCount = this.interrogationHistory.get(b.id)?.length || 0;
      return aCount - bCount;
    })[0];

    const inDiner = state.buildings.some(
      (b) => b.type === 'DINER' && b.position === state.detective.position,
    );

    const questions: QuestionType[] = ['GENDER', 'AGE', 'BUILD', 'HEIGHT', 'FACTION'];
    const askedQuestions =
      this.interrogationHistory.get(leastInterrogated.id)?.map((h) => h.question) || [];
    const unasked = questions.filter((q) => !askedQuestions.includes(q));

    if (unasked.length === 0) {
      this.log.push(`[DETECTIVE] ${leastInterrogated.role} уже допрошен по всем вопросам`);
      return null;
    }

    let chosenQuestion: QuestionType;
    let chosenValue: string;

    if (!this.profile.gender && unasked.includes('GENDER')) {
      chosenQuestion = 'GENDER';
      chosenValue = 'MALE';
    } else if (!this.profile.faction && unasked.includes('FACTION')) {
      chosenQuestion = 'FACTION';
      const factionCounts = this.countFactionResidents(state);
      chosenValue = factionCounts[0]?.faction || 'LAW';
    } else {
      chosenQuestion = unasked[0];
      chosenValue = this.getDefaultValueForQuestion(chosenQuestion);
    }

    this.log.push(
      `[DETECTIVE] Допрашиваю: ${leastInterrogated.role} (${leastInterrogated.faction})`,
    );
    this.log.push(`[DETECTIVE] Вопрос: "${chosenQuestion}" = "${chosenValue}"?`);
    this.log.push(`[DETECTIVE] В закусочной: ${inDiner ? 'ДА (правдивый ответ)' : 'НЕТ'}`);

    return {
      action: 'INTERROGATE',
      target: leastInterrogated.id,
      question: chosenQuestion,
      value: chosenValue,
      reasoning: `Допрос ${leastInterrogated.role}: ${chosenQuestion}=${chosenValue}?`,
    };
  }

  processInterrogationResult(
    residentId: string,
    question: QuestionType,
    answer: boolean,
    trusted: boolean,
  ): void {
    if (!this.interrogationHistory.has(residentId)) {
      this.interrogationHistory.set(residentId, []);
    }
    this.interrogationHistory.get(residentId)!.push({ question, answer, trusted });

    this.log.push(
      `[DETECTIVE] Ответ: ${answer ? 'ДА' : 'НЕТ'} (${trusted ? 'доверяем' : 'может врать'})`,
    );

    if (trusted) {
      // TODO: обновить профиль подозреваемого
    }
  }

  private decideBuildingUse(
    state: GameState,
    buildingType: BuildingType,
  ): DetectiveDecision | null {
    switch (buildingType) {
      case 'POLICE':
        if (state.detective.trackingToken.residentId === null) {
          const suspect = this.chooseSurveillanceTarget(state);
          if (suspect) {
            this.log.push(`[DETECTIVE] Использую Полицейский участок: слежка за ${suspect.role}`);
            return {
              action: 'USE_BUILDING_POLICE',
              target: suspect.id,
              reasoning: `Слежка за ${suspect.role}`,
            };
          }
        }
        break;

      case 'FIRE_STATION':
        this.log.push(`[DETECTIVE] Использую Пожарную: тяну жетон соцгруппы`);
        return {
          action: 'USE_BUILDING_FIRE',
          reasoning: 'Тяну жетон соцгруппы для перемещения жителей',
        };

      case 'HOSPITAL':
        const frightenedNearby = this.findFrightenedNearby(state);
        if (frightenedNearby) {
          this.log.push(`[DETECTIVE] Использую Больницу: успокаиваю ${frightenedNearby.role}`);
          return {
            action: 'USE_BUILDING_HOSPITAL',
            target: frightenedNearby.id,
            reasoning: `Успокаиваю ${frightenedNearby.role}`,
          };
        }
        break;

      case 'DINER':
        const targetForDiner = this.findDinerTarget(state);
        if (targetForDiner) {
          this.log.push(`[DETECTIVE] Использую Закусочную: допрос ${targetForDiner.role}`);
          return {
            action: 'USE_BUILDING_DINER',
            target: targetForDiner.id,
            reasoning: `Допрос в закусочной ${targetForDiner.role}`,
          };
        }
        break;
    }

    return null;
  }

  private findFrightenedNearby(state: GameState): Citizen | null {
    const currentPos = state.detective.position;
    const adjacent = getAdjacentDistricts(currentPos);
    const nearbyDistricts = [currentPos, ...adjacent];
    
    for (const district of nearbyDistricts) {
      for (const resident of state.grid[district]) {
        if (state.frightenedResidents.includes(resident.id)) {
          return resident;
        }
      }
    }
    return null;
  }

  private findDinerTarget(state: GameState): Citizen | null {
    const currentPos = state.detective.position;
    const adjacent = getAdjacentDistricts(currentPos);
    const nearbyDistricts = [currentPos, ...adjacent];
    
    for (const district of nearbyDistricts) {
      for (const resident of state.grid[district]) {
        if (!state.frightenedResidents.includes(resident.id)) {
          const asked = this.interrogationHistory.get(resident.id)?.length || 0;
          if (asked < 5) return resident;
        }
      }
    }
    return null;
  }

  private decideMovement(state: GameState): DetectiveDecision | null {
    const currentPos = state.detective.position;
    const adjacent = getAdjacentDistricts(currentPos);

    const valid = adjacent.filter((d) => !state.crimeScenes.includes(d));

    if (valid.length === 0) {
      this.log.push(`[DETECTIVE] Некуда идти - все соседние кварталы заблокированы`);
      return null;
    }

    const scored = valid
      .map((d) => ({
        district: d,
        residents: state.grid[d].filter((r) => !state.frightenedResidents.includes(r.id)).length,
        hasBuilding: state.buildings.some((b) => b.position === d && !b.usedThisRound),
      }))
      .sort((a, b) => {
        if (b.residents !== a.residents) return b.residents - a.residents;
        return (b.hasBuilding ? 1 : 0) - (a.hasBuilding ? 1 : 0);
      });

    const best = scored[0];

    this.log.push(
      `[DETECTIVE] Перемещаюсь в квартал ${best.district} (жителей: ${best.residents})`,
    );

    return {
      action: 'MOVE',
      target: best.district,
      reasoning: `Иду в квартал ${best.district} (${best.residents} жителей)`,
    };
  }

  makeAccusation(state: GameState): { suspectId: string; motive: Motive; reasoning: string } {
    this.log.push(`[DETECTIVE] === ФИНАЛЬНОЕ ОБВИНЕНИЕ ===`);

    const allResidents = state.grid.flat();
    const notExcluded = allResidents.filter((r) => !this.profile.excludedIds.includes(r.id));

    this.log.push(`[DETECTIVE] Кандидатов: ${notExcluded.length}`);
    this.log.push(`[DETECTIVE] Возможные мотивы: ${this.profile.possibleMotives.join(', ')}`);

    const suspect = notExcluded[Math.floor(Math.random() * notExcluded.length)] || allResidents[0];
    const motive =
      this.profile.possibleMotives[Math.floor(Math.random() * this.profile.possibleMotives.length)];

    this.log.push(`[DETECTIVE] Обвиняю: ${suspect.role} (${suspect.faction})`);
    this.log.push(`[DETECTIVE] Мотив: ${motive}`);

    return {
      suspectId: suspect.id,
      motive,
      reasoning: `Обвиняю ${suspect.role} в убийствах с мотивом "${motive}"`,
    };
  }

  analyzeKillings(state: GameState): void {
    const victims = state.victims;
    if (victims.length === 0) return;

    this.log.push(`[DETECTIVE] Анализ ${victims.length} убийств...`);

    const genders = new Set(victims.map((v) => v.gender));
    if (genders.size > 1) {
      this.excludeMotive('MANIAC', 'Жертвы разного пола');
    }

    const factions = new Set(victims.map((v) => v.faction));
    if (factions.size < victims.length) {
      this.excludeMotive('TERRORIST', 'Есть жертвы одной фракции');
    }

    const ages = new Set(victims.map((v) => v.age));
    if (ages.size > 2) {
      this.excludeMotive('PSYCHOPATH', 'Более 2 возрастов среди жертв');
    }
  }

  private excludeMotive(motive: Motive, reason: string): void {
    const idx = this.profile.possibleMotives.indexOf(motive);
    if (idx !== -1) {
      this.profile.possibleMotives.splice(idx, 1);
      this.log.push(`[DETECTIVE] Исключён мотив ${motive}: ${reason}`);
    }
  }

  private chooseSurveillanceTarget(state: GameState): Citizen | null {
    const allResidents = state.grid.flat();
    const notExcluded = allResidents.filter((r) => !this.profile.excludedIds.includes(r.id));
    return notExcluded[0] || null;
  }

  private countFactionResidents(state: GameState): { faction: Faction; count: number }[] {
    const counts: Record<string, number> = {};
    state.grid.flat().forEach((r) => {
      counts[r.faction] = (counts[r.faction] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([faction, count]) => ({ faction: faction as Faction, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getDefaultValueForQuestion(question: QuestionType): string {
    switch (question) {
      case 'GENDER':
        return 'MALE';
      case 'AGE':
        return 'ADULT';
      case 'BUILD':
        return 'MEDIUM';
      case 'HEIGHT':
        return 'MEDIUM';
      case 'FACTION':
        return 'LAW';
    }
  }

  getLog(): string[] {
    return [...this.log];
  }

  clearLog(): void {
    this.log = [];
  }
}
