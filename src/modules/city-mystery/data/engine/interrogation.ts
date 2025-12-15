/**
 * Логика допроса жителей
 *
 * Правила:
 * - Детектив задаёт вопрос о характеристике убийцы
 * - Житель отвечает ЧЕСТНО, кроме:
 *   - Сам убийца — может лгать
 *   - Фигурант — может лгать
 *   - Союзник (та же фракция) — может лгать
 */

import type { Citizen } from '../citizens';
import type { GameState, QuestionType } from '../gameTypes';

export interface InterrogationResult {
  answer: boolean;
  canLie: boolean;
  isLying: boolean;
  reason?: string;
}

/**
 * Проверить, может ли житель лгать
 */
export function canResidentLie(
  resident: Citizen,
  gameState: GameState,
): { canLie: boolean; reason?: string } {
  const { killer } = gameState;

  // Сам убийца
  if (resident.id === killer.identity.id) {
    return { canLie: true, reason: 'Это убийца' };
  }

  // Фигурант дела
  if (killer.figure && resident.id === killer.figure.id) {
    return { canLie: true, reason: 'Это фигурант' };
  }

  // Союзник (та же фракция)
  if (killer.allies && resident.faction === killer.allies) {
    return { canLie: true, reason: 'Это союзник убийцы' };
  }

  return { canLie: false };
}

/**
 * Получить правдивый ответ на вопрос о характеристике убийцы
 */
export function getTruthfulAnswer(
  question: QuestionType,
  value: string,
  killerIdentity: Citizen,
): boolean {
  switch (question) {
    case 'GENDER':
      return killerIdentity.gender === value;
    case 'AGE':
      return killerIdentity.age === value;
    case 'BUILD':
      return killerIdentity.build === value;
    case 'HEIGHT':
      return killerIdentity.height === value;
    case 'FACTION':
      return killerIdentity.faction === value;
    default:
      return false;
  }
}

/**
 * Выполнить допрос жителя
 *
 * @param resident - допрашиваемый житель
 * @param question - тип вопроса (GENDER, AGE, BUILD, HEIGHT)
 * @param value - значение для проверки ("MALE", "YOUNG", etc.)
 * @param gameState - состояние игры
 * @param chooseLie - убийца решает солгать (если может)
 */
export function interrogate(
  resident: Citizen,
  question: QuestionType,
  value: string,
  gameState: GameState,
  chooseLie: boolean = false,
): InterrogationResult {
  const { canLie, reason } = canResidentLie(resident, gameState);
  const truthfulAnswer = getTruthfulAnswer(question, value, gameState.killer.identity);

  // Если не может лгать — всегда правда
  if (!canLie) {
    return {
      answer: truthfulAnswer,
      canLie: false,
      isLying: false,
    };
  }

  // Может лгать — решение за убийцей
  if (chooseLie) {
    return {
      answer: !truthfulAnswer,
      canLie: true,
      isLying: true,
      reason,
    };
  }

  // Может лгать, но решил сказать правду
  return {
    answer: truthfulAnswer,
    canLie: true,
    isLying: false,
    reason,
  };
}

/**
 * Список доступных вопросов
 */
export const AVAILABLE_QUESTIONS: {
  type: QuestionType;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    type: 'GENDER',
    label: 'Пол убийцы',
    options: [
      { value: 'MALE', label: 'Мужчина?' },
      { value: 'FEMALE', label: 'Женщина?' },
    ],
  },
  {
    type: 'AGE',
    label: 'Возраст убийцы',
    options: [
      { value: 'YOUNG', label: 'Молодой?' },
      { value: 'ADULT', label: 'Взрослый?' },
      { value: 'OLD', label: 'Старый?' },
    ],
  },
  {
    type: 'BUILD',
    label: 'Телосложение убийцы',
    options: [
      { value: 'SLIM', label: 'Худой?' },
      { value: 'MEDIUM', label: 'Среднего?' },
      { value: 'LARGE', label: 'Крепкий?' },
    ],
  },
  {
    type: 'HEIGHT',
    label: 'Рост убийцы',
    options: [
      { value: 'SHORT', label: 'Низкий?' },
      { value: 'MEDIUM', label: 'Среднего?' },
      { value: 'TALL', label: 'Высокий?' },
    ],
  },
];
