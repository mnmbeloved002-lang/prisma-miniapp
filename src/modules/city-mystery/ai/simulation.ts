/**
 * Симуляция игры AI vs AI
 * Путь: src/modules/city-mystery/ai/simulation.ts
 *
 * Запуск: npx tsx src/modules/city-mystery/ai/simulation.ts
 */

import type { Citizen, Faction } from '../data/citizens';
import { allCitizens } from '../data/citizens';
import {
  CENTRAL_DISTRICTS,
  CORNER_DISTRICTS,
  getAdjacentDistricts,
  MOTIVE_CARDS,
} from '../data/gameConstants';
import type { BuildingType, GameState, Motive } from '../data/gameTypes';
import { DetectiveAI } from './DetectiveAI';
import { KillerAI } from './KillerAI';

// ============== УТИЛИТЫ ==============

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

// ============== ЛОГГЕР ==============

class GameLogger {
  private lines: string[] = [];

  section(title: string): void {
    this.lines.push('');
    this.lines.push('═'.repeat(60));
    this.lines.push(`  ${title}`);
    this.lines.push('═'.repeat(60));
  }

  round(n: number): void {
    this.lines.push('');
    this.lines.push('━'.repeat(60));
    this.lines.push(`🔄 РАУНД ${n}`);
    this.lines.push('━'.repeat(60));
  }

  phase(name: string): void {
    this.lines.push('');
    this.lines.push(`📍 ${name}`);
    this.lines.push('─'.repeat(40));
  }

  action(icon: string, text: string): void {
    this.lines.push(`${icon} ${text}`);
  }

  detail(text: string): void {
    this.lines.push(`   └─ ${text}`);
  }

  error(text: string): void {
    this.lines.push(`❌ ОШИБКА: ${text}`);
  }

  success(text: string): void {
    this.lines.push(`✅ ${text}`);
  }

  warning(text: string): void {
    this.lines.push(`⚠️ ${text}`);
  }

  info(text: string): void {
    this.lines.push(`ℹ️ ${text}`);
  }

  raw(text: string): void {
    this.lines.push(text);
  }

  aiLog(lines: string[]): void {
    lines.forEach((line) => this.lines.push(`   ${line}`));
  }

  print(): void {
    console.log(this.lines.join('\n'));
  }

  getOutput(): string {
    return this.lines.join('\n');
  }
}

// ============== СОЗДАНИЕ ИГРЫ ==============

function createInitialState(): GameState {
  // Выбираем 20 жителей
  const citizens = pickRandom(allCitizens, 20);

  // Создаём сетку 4x4
  const grid: Citizen[][] = Array.from({ length: 16 }, () => []);

  // Расставляем: углы по 2, остальные по 1
  let idx = 0;
  for (const corner of CORNER_DISTRICTS) {
    grid[corner].push(citizens[idx++]);
    grid[corner].push(citizens[idx++]);
  }
  for (let i = 0; i < 16; i++) {
    if (!CORNER_DISTRICTS.includes(i) && idx < 20) {
      grid[i].push(citizens[idx++]);
    }
  }

  // Выбираем убийцу
  const killer = pickRandom(citizens, 1)[0];

  // Выбираем мотив
  const availableMotives: Motive[] = [
    'MANIAC',
    'SADIST',
    'HEADHUNTER',
    'VIGILANTE',
    'KILLER',
    'TERRORIST',
  ];
  const selectedMotive = pickRandom(availableMotives, 1)[0];

  // Союзники: фракция убийцы + 2 случайные
  const allFactions: Faction[] = [
    'LAW',
    'MEDICINE',
    'CRIME',
    'WORKERS',
    'BOHEMIA',
    'PRESS',
    'POWER',
    'MARGINALS',
    'MIGRANTS',
  ];
  const otherFactions = allFactions.filter((f) => f !== killer.faction);
  const allies: Faction[] = [killer.faction, ...pickRandom(otherFactions, 2)];

  // Здания (по правилам)
  const buildings = [
    { type: 'FIRE_STATION' as BuildingType, position: 0, usedThisRound: false },
    { type: 'HOSPITAL' as BuildingType, position: 2, usedThisRound: false },
    { type: 'POLICE' as BuildingType, position: 5, usedThisRound: false },
    { type: 'DINER' as BuildingType, position: 7, usedThisRound: false },
    { type: 'DINER' as BuildingType, position: 9, usedThisRound: false },
    { type: 'HOSPITAL' as BuildingType, position: 11, usedThisRound: false },
    { type: 'FIRE_STATION' as BuildingType, position: 12, usedThisRound: false },
    { type: 'POLICE' as BuildingType, position: 14, usedThisRound: false },
  ];

  // Позиция детектива (случайная)
  const detectivePos = pickRandom([...Array(16).keys()], 1)[0];

  return {
    round: 1,
    maxRounds: 5,
    phase: 'KILLER',
    step: 'FRIGHTEN',
    grid,
    buildings,
    crimeScenes: [],
    frightenedResidents: [],
    detective: {
      position: detectivePos,
      actionsLeft: 2,
      movementPoints: 2,
      trackingToken: { residentId: null, districtIndex: null },
      usedActionTypes: [],
    },
    killer: {
      identity: killer,
      motive: selectedMotive,
      allies,
      skippedKill: false,
      frightenedThisRound: [],
    },
    victims: [],
    availableMotives,
    isGameOver: false,
  };
}

// ============== ВЫПОЛНЕНИЕ ДЕЙСТВИЙ ==============

function executeFrighten(state: GameState, residentIds: string[]): GameState {
  const newState = cloneState(state);
  residentIds.forEach((id) => {
    if (!newState.frightenedResidents.includes(id)) {
      newState.frightenedResidents.push(id);
    }
  });
  newState.step = 'KILL';
  return newState;
}

function executeKill(state: GameState, victimId: string, districtIndex: number): GameState {
  const newState = cloneState(state);

  // Находим жертву
  const victim = newState.grid[districtIndex].find((c) => c.id === victimId);
  if (!victim) {
    return state;
  }

  // Добавляем в жертвы
  newState.victims.push(victim);

  // Удаляем из квартала
  newState.grid[districtIndex] = newState.grid[districtIndex].filter((c) => c.id !== victimId);

  // Разбегание остальных жителей
  const fleeing = [...newState.grid[districtIndex]];
  newState.grid[districtIndex] = [];

  // Помечаем место преступления
  newState.crimeScenes.push(districtIndex);

  // Распределяем убежавших по соседним кварталам
  const adjacent = getAdjacentDistricts(districtIndex);
  for (const resident of fleeing) {
    const validTargets = adjacent.filter(
      (d) => !newState.crimeScenes.includes(d) && newState.grid[d].length < 3,
    );
    if (validTargets.length > 0) {
      const target = validTargets[Math.floor(Math.random() * validTargets.length)];
      newState.grid[target].push(resident);
    }
  }

  return newState;
}

function executeDetectiveMove(state: GameState, toDistrict: number): GameState {
  const newState = cloneState(state);
  newState.detective.position = toDistrict;
  newState.detective.movementPoints--;
  return newState;
}

function executeUrgentCall(state: GameState, crimeScene: number): GameState {
  const newState = cloneState(state);
  newState.detective.position = crimeScene;
  return newState;
}

// ============== ГЛАВНАЯ СИМУЛЯЦИЯ ==============

async function runSimulation(): Promise<void> {
  const logger = new GameLogger();
  const killerAI = new KillerAI();
  const detectiveAI = new DetectiveAI();

  let state = createInitialState();

  logger.section('🎮 СИМУЛЯЦИЯ: Городской Убийца - AI vs AI');

  logger.phase('НАЧАЛЬНЫЕ УСЛОВИЯ');
  logger.action('🔪', `Убийца: ${state.killer.identity.role} (${state.killer.identity.faction})`);
  logger.detail(`Пол: ${state.killer.identity.gender}, Возраст: ${state.killer.identity.age}`);
  logger.detail(
    `Телосложение: ${state.killer.identity.build}, Рост: ${state.killer.identity.height}`,
  );
  logger.action('🎯', `Мотив: ${MOTIVE_CARDS[state.killer.motive].name}`);
  logger.detail(MOTIVE_CARDS[state.killer.motive].description);
  logger.action('🤝', `Союзники: ${state.killer.allies.join(', ')}`);
  logger.action('🕵️', `Детектив в квартале: ${state.detective.position}`);
  logger.action('👥', `Жителей на поле: ${state.grid.flat().length}`);

  // Показываем расстановку
  logger.phase('РАССТАНОВКА');
  for (let i = 0; i < 16; i++) {
    const residents = state.grid[i];
    const building = state.buildings.find((b) => b.position === i);
    const buildingIcon = building ? ` [${building.type}]` : '';
    const isCorner = CORNER_DISTRICTS.includes(i) ? ' (угол)' : '';
    const isCenter = CENTRAL_DISTRICTS.includes(i) ? ' (центр)' : '';

    if (residents.length > 0 || building) {
      logger.raw(
        `  Квартал ${i}${buildingIcon}${isCorner}${isCenter}: ${residents.map((r) => r.role).join(', ') || 'пусто'}`,
      );
    }
  }

  // ============== ИГРОВОЙ ЦИКЛ ==============

  while (!state.isGameOver && state.round <= state.maxRounds) {
    logger.round(state.round);

    // ===== ФАЗА УБИЙЦЫ =====
    logger.phase('ФАЗА УБИЙЦЫ');
    state.phase = 'KILLER';

    // Шаг 1: Запугивание
    state.step = 'FRIGHTEN';
    killerAI.clearLog();
    const frightenDecision = killerAI.selectFrightenTargets(state);
    logger.aiLog(killerAI.getLog());

    if (frightenDecision.action === 'FRIGHTEN' && frightenDecision.targets) {
      state = executeFrighten(state, frightenDecision.targets);
      const names = frightenDecision.targets.map((id) => {
        const c = state.grid.flat().find((r) => r.id === id);
        return c ? c.role : id;
      });
      logger.success(`Запуганы: ${names.join(', ')}`);
    } else {
      logger.warning(frightenDecision.reasoning);
    }

    // Шаг 2: Убийство
    state.step = 'KILL';
    killerAI.clearLog();
    const killDecision = killerAI.selectVictim(state);
    logger.aiLog(killerAI.getLog());

    if (
      killDecision.action === 'KILL' &&
      killDecision.victim &&
      killDecision.district !== undefined
    ) {
      state = executeKill(state, killDecision.victim.id, killDecision.district);
      logger.success(`💀 Убийство #${state.victims.length}: ${killDecision.victim.role}`);
      logger.detail(`Квартал ${killDecision.district}, фракция ${killDecision.victim.faction}`);
      logger.detail(
        `${killDecision.victim.gender}, ${killDecision.victim.age}, ${killDecision.victim.build}`,
      );

      // Проверка победы убийцы
      if (state.victims.length >= 5) {
        state.isGameOver = true;
        state.winner = 'KILLER';
        state.reason = '5 убийств совершено';
        logger.section('🔪 ПОБЕДА УБИЙЦЫ!');
        logger.action('💀', `Убито: ${state.victims.length} жителей`);
        logger.action('🎭', `Убийца: ${state.killer.identity.role}`);
        logger.action('🎯', `Мотив: ${MOTIVE_CARDS[state.killer.motive].name}`);
        break;
      }
    } else {
      logger.warning(killDecision.reasoning);
    }

    // ===== ФАЗА ДЕТЕКТИВА =====
    logger.phase('ФАЗА ДЕТЕКТИВА');
    state.phase = 'DETECTIVE';

    // Срочный вызов (телепортация на последнее место преступления)
    if (state.crimeScenes.length > 0) {
      const lastScene = state.crimeScenes[state.crimeScenes.length - 1];
      logger.action('🚨', `Срочный вызов! Телепортация в квартал ${lastScene}`);
      state = executeUrgentCall(state, lastScene);
    }

    // Расследование
    state.step = 'INVESTIGATE';
    state.detective.actionsLeft = 2;
    state.detective.movementPoints = 2;

    // Анализ убийств
    detectiveAI.analyzeKillings(state);

    // 2 действия + 2 движения
    for (let i = 0; i < 4; i++) {
      detectiveAI.clearLog();
      const decision = detectiveAI.decideAction(state);

      if (decision.action === 'PASS') {
        break;
      }
      if (decision.action === 'MOVE' && typeof decision.target === 'number') {
        state = executeDetectiveMove(state, decision.target);
        logger.success(`Перемещение в квартал ${decision.target}`);
      } else if (decision.action === 'INTERROGATE') {
        // Проверка: 2 РАЗНЫХ действия (по правилам)
        if (state.detective.usedActionTypes?.includes('INTERROGATE')) {
          logger.success(`Пропуск: допрос уже использован в этом раунде`);
          break;
        }
        state.detective.actionsLeft--;
        state.detective.usedActionTypes = [
          ...(state.detective.usedActionTypes || []),
          'INTERROGATE',
        ];
        logger.success(`Допрос: ${decision.reasoning}`);
      } else if (decision.action.startsWith('USE_BUILDING_')) {
        // Проверка: 2 РАЗНЫХ действия
        const buildingType = decision.action.replace('USE_BUILDING_', '');
        const buildingAction = `BUILDING_${buildingType}`;
        if (state.detective.usedActionTypes?.includes(buildingAction)) {
          logger.success(`Пропуск: здание ${buildingType} уже использовано`);
          break;
        }
        state.detective.actionsLeft--;
        state.detective.usedActionTypes = [
          ...(state.detective.usedActionTypes || []),
          buildingAction,
        ];
        logger.success(`Использовано здание: ${buildingType} - ${decision.reasoning}`);
      }
    }

    // ===== ФАЗА ГОРОДА =====
    logger.phase('ФАЗА ГОРОДА');
    state.phase = 'CITY';

    // Успокоение запуганных в квартале детектива
    const calmed = state.frightenedResidents.filter((id) => {
      const district = state.grid.findIndex((d) => d.some((c) => c.id === id));
      return district === state.detective.position;
    });

    if (calmed.length > 0) {
      state.frightenedResidents = state.frightenedResidents.filter((id) => !calmed.includes(id));
      logger.success(`Успокоено жителей: ${calmed.length}`);
    }

    // Сброс зданий
    state.buildings.forEach((b) => (b.usedThisRound = false));
    state.detective.usedActionTypes = []; // Сброс использованных действий

    // Следующий раунд
    state.round++;
  }

  // ===== ФИНАЛЬНОЕ ОБВИНЕНИЕ =====
  if (!state.isGameOver) {
    logger.section('⚖️ ФИНАЛЬНОЕ ОБВИНЕНИЕ');

    detectiveAI.clearLog();
    const accusation = detectiveAI.makeAccusation(state);
    logger.aiLog(detectiveAI.getLog());

    const correctKiller = accusation.suspectId === state.killer.identity.id;
    const correctMotive = accusation.motive === state.killer.motive;

    logger.action('🎯', `Обвинение: ${accusation.reasoning}`);
    logger.detail(`Правильный убийца: ${correctKiller ? '✅ ДА' : '❌ НЕТ'}`);
    logger.detail(`Правильный мотив: ${correctMotive ? '✅ ДА' : '❌ НЕТ'}`);

    if (correctKiller && correctMotive) {
      logger.section('🕵️ ПОБЕДА ДЕТЕКТИВА!');
      logger.action('✅', `Убийца найден: ${state.killer.identity.role}`);
      logger.action('✅', `Мотив раскрыт: ${MOTIVE_CARDS[state.killer.motive].name}`);
    } else {
      logger.section('🔪 УБИЙЦА УШЁЛ ОТ ПРАВОСУДИЯ!');
      logger.action(
        '🎭',
        `Настоящий убийца: ${state.killer.identity.role} (${state.killer.identity.faction})`,
      );
      logger.action('🎯', `Настоящий мотив: ${MOTIVE_CARDS[state.killer.motive].name}`);
      if (!correctKiller) {
        const accused = state.grid.flat().find((c) => c.id === accusation.suspectId);
        logger.action('❌', `Обвинён невиновный: ${accused?.role || 'неизвестно'}`);
      }
      if (!correctMotive) {
        logger.action('❌', `Неверный мотив: ${accusation.motive}`);
      }
    }
  }

  // ===== ИТОГИ =====
  logger.section('📊 ИТОГИ СИМУЛЯЦИИ');
  logger.action('🔄', `Раундов сыграно: ${state.round - 1}`);
  logger.action('💀', `Жертв: ${state.victims.length}`);
  logger.action('🏛️', `Мест преступлений: ${state.crimeScenes.length}`);
  logger.action('👥', `Жителей осталось: ${state.grid.flat().length}`);

  // Список жертв
  if (state.victims.length > 0) {
    logger.raw('');
    logger.raw('Жертвы:');
    state.victims.forEach((v, i) => {
      logger.raw(`  ${i + 1}. ${v.role} (${v.faction}, ${v.gender}, ${v.age})`);
    });
  }

  logger.print();
}

// Запуск
runSimulation().catch(console.error);
