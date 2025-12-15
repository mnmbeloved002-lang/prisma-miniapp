/**
 * AI Убийцы для симуляции игры
 * Путь: src/modules/city-mystery/ai/KillerAI.ts
 */

import type { Citizen } from '../data/citizens';
import { MOTIVE_CARDS } from '../data/gameConstants';
import type { GameState } from '../data/gameTypes';

export interface KillerDecision {
  action: string;
  targets?: string[];
  victim?: Citizen;
  district?: number;
  reasoning: string;
}

export class KillerAI {
  private log: string[] = [];

  /**
   * Выбирает 2 жителей для запугивания
   * Правила:
   * - НЕ в квартале с детективом
   * - НЕ себя (убийцу)
   * - Стратегия: запугать тех, кто может дать показания против убийцы
   */
  selectFrightenTargets(state: GameState): KillerDecision {
    const detectivePos = state.detective.position;
    const killerId = state.killer.identity.id;

    // Собираем всех доступных жителей
    const available: { citizen: Citizen; district: number }[] = [];

    state.grid.forEach((district, idx) => {
      if (idx === detectivePos) {
        this.log.push(`[FRIGHTEN] Пропускаю квартал ${idx} - там детектив`);
        return;
      }

      district.forEach((citizen) => {
        if (citizen.id === killerId) {
          this.log.push(`[FRIGHTEN] Пропускаю ${citizen.role} - это я (убийца)`);
          return;
        }
        if (state.frightenedResidents.includes(citizen.id)) {
          this.log.push(`[FRIGHTEN] Пропускаю ${citizen.role} - уже запуган`);
          return;
        }
        available.push({ citizen, district: idx });
      });
    });

    this.log.push(`[FRIGHTEN] Доступно для запугивания: ${available.length} жителей`);

    if (available.length < 2) {
      return {
        action: 'FRIGHTEN_FAILED',
        reasoning: `Недостаточно жителей для запугивания (${available.length} < 2)`,
      };
    }

    // Стратегия: запугать жителей НЕ из союзных фракций (они и так врут)
    const nonAllies = available.filter((a) => !state.killer.allies.includes(a.citizen.faction));
    const allies = available.filter((a) => state.killer.allies.includes(a.citizen.faction));

    let targets: typeof available = [];

    // Предпочитаем НЕ-союзников (они говорят правду, их надо заткнуть)
    if (nonAllies.length >= 2) {
      targets = this.shuffle(nonAllies).slice(0, 2);
      this.log.push(
        `[FRIGHTEN] Выбираю не-союзников: ${targets.map((t) => t.citizen.role).join(', ')}`,
      );
    } else if (nonAllies.length === 1) {
      targets = [nonAllies[0], this.shuffle(allies)[0]];
      this.log.push(`[FRIGHTEN] Один не-союзник + один союзник`);
    } else {
      targets = this.shuffle(allies).slice(0, 2);
      this.log.push(`[FRIGHTEN] Только союзники доступны`);
    }

    return {
      action: 'FRIGHTEN',
      targets: targets.map((t) => t.citizen.id),
      reasoning: `Запугиваю: ${targets.map((t) => `${t.citizen.role} (${t.citizen.faction}, квартал ${t.district})`).join(', ')}`,
    };
  }

  /**
   * Выбирает жертву для убийства
   * Правила:
   * - НЕ в квартале с детективом
   * - НЕ в квартале с больницей
   * - НЕ себя
   * - Соответствует мотиву
   */
  selectVictim(state: GameState): KillerDecision {
    const detectivePos = state.detective.position;
    const killerId = state.killer.identity.id;
    const motive = state.killer.motive;
    const motiveCard = MOTIVE_CARDS[motive];

    this.log.push(`[KILL] === Выбор жертвы ===`);
    this.log.push(`[KILL] Мой мотив: ${motiveCard.name} - ${motiveCard.description}`);
    this.log.push(`[KILL] Позиция детектива: квартал ${detectivePos}`);
    this.log.push(
      `[KILL] Уже убито: ${state.victims.length} (${state.victims.map((v) => v.role).join(', ') || 'никого'})`,
    );

    const hospitalDistricts = state.buildings
      .filter((b) => b.type === 'HOSPITAL')
      .map((b) => b.position);

    this.log.push(`[KILL] Больницы в кварталах: ${hospitalDistricts.join(', ')}`);

    const candidates: { citizen: Citizen; district: number; reason: string }[] = [];
    const rejected: { citizen: Citizen; district: number; reason: string }[] = [];

    state.grid.forEach((district, idx) => {
      district.forEach((citizen) => {
        // Проверка: не себя
        if (citizen.id === killerId) {
          rejected.push({ citizen, district: idx, reason: 'Это я (убийца)' });
          return;
        }

        // Проверка: не в квартале с детективом
        if (idx === detectivePos) {
          rejected.push({ citizen, district: idx, reason: 'В квартале детектив' });
          return;
        }

        // Проверка: не в больнице
        if (hospitalDistricts.includes(idx)) {
          rejected.push({ citizen, district: idx, reason: 'В квартале больница' });
          return;
        }

        // Проверка: мотив
        const motiveOk = motiveCard.condition(citizen, state);
        if (!motiveOk) {
          rejected.push({
            citizen,
            district: idx,
            reason: `Не соответствует мотиву "${motiveCard.name}"`,
          });
          return;
        }

        candidates.push({ citizen, district: idx, reason: 'Подходит' });
      });
    });

    // Логируем отклонённых
    rejected.forEach((r) => {
      this.log.push(
        `[KILL] ❌ ${r.citizen.role} (${r.citizen.faction}, кв.${r.district}): ${r.reason}`,
      );
    });

    // Логируем кандидатов
    candidates.forEach((c) => {
      this.log.push(
        `[KILL] ✅ ${c.citizen.role} (${c.citizen.faction}, кв.${c.district}): ${c.reason}`,
      );
    });

    if (candidates.length === 0) {
      this.log.push(`[KILL] ⚠️ Нет подходящих жертв!`);
      return {
        action: 'NO_VALID_TARGET',
        reasoning: 'Нет жертв, соответствующих мотиву и правилам',
      };
    }

    // Стратегия выбора:
    // 1. Предпочитаем жертв в кварталах с 1 жителем (меньше свидетелей)
    // 2. Предпочитаем НЕ-союзников (их могут допросить)
    const sorted = candidates.sort((a, b) => {
      const aAlone = state.grid[a.district].length === 1 ? 0 : 1;
      const bAlone = state.grid[b.district].length === 1 ? 0 : 1;
      if (aAlone !== bAlone) {
        return aAlone - bAlone;
      }

      const aAlly = state.killer.allies.includes(a.citizen.faction) ? 1 : 0;
      const bAlly = state.killer.allies.includes(b.citizen.faction) ? 1 : 0;
      return aAlly - bAlly;
    });

    const chosen = sorted[0];

    this.log.push(
      `[KILL] 🎯 Выбрана жертва: ${chosen.citizen.role} (${chosen.citizen.faction}, ${chosen.citizen.gender}, кв.${chosen.district})`,
    );

    return {
      action: 'KILL',
      victim: chosen.citizen,
      district: chosen.district,
      reasoning: `Убиваю: ${chosen.citizen.role} в квартале ${chosen.district}`,
    };
  }

  getLog(): string[] {
    return [...this.log];
  }

  clearLog(): void {
    this.log = [];
  }

  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
