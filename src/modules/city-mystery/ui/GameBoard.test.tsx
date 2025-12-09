// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;

import { GameBoard } from './GameBoard';
import { BUILDING_ICONS } from '../data/gameConstants';

// ==================== МОКИ ====================

// Будем подменять useGameStore так, чтобы он возвращал наш mockStoreState
let mockStoreState: any;

vi.mock('../application/gameStore', () => ({
  useGameStore: () => mockStoreState,
}));

// Мокаем CitizenCard, чтобы контролировать пропсы и не зависеть от его внутренней разметки
const mockCitizenCard = vi.fn((props: any) => (
  <div data-testid={`citizen-${props.citizen.id}`}>{props.citizen.role}</div>
));

vi.mock('./CitizenCard', () => ({
  CitizenCard: (props: any) => mockCitizenCard(props),
}));

// ==================== ВСПОМОГАТЕЛЬНЫЕ ДАННЫЕ ====================

function createMockStoreState() {
  const citizen1 = {
    id: 'c1',
    role: 'Свидетель',
  };

  const citizen2 = {
    id: 'c2',
    role: 'Подозреваемый',
  };

  const gameState = {
    // 4×4 сетка кварталов
    grid: [
      [citizen1],
      [],
      [],
      [],
      [citizen2],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    // Одно здание в квартале 0
    buildings: [
      {
        type: 'POLICE',
        position: 0,
      },
    ],
    // Детектив в квартале 0
    detective: {
      position: 0,
      trackingToken: null,
    },
    // Место преступления в квартале 4
    crimeScenes: [4],
    // Запуган только второй житель
    frightenedResidents: ['c2'],
    victims: [],
    round: 1,
    maxRounds: 5,
    phase: 'KILLER',
    step: 'FRIGHTEN',
    mode: 'LOGIC',
    isGameOver: false,
  } as any; // Остальные поля GameState нас в этом тесте не интересуют

  const selectResidentMock = vi.fn();

  const storeState = {
    gameState,
    playerRole: 'KILLER',
    selectedResidents: ['c2'],
    selectResident: selectResidentMock,
  };

  return { storeState, selectResidentMock };
}

// ==================== ТЕСТЫ ====================

describe('GameBoard', () => {
  let selectResidentMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCitizenCard.mockClear();

    const { storeState, selectResidentMock: selMock } = createMockStoreState();
    mockStoreState = storeState;
    selectResidentMock = selMock;
  });

  it.skip('рендерит заголовок и счётчики жителей/зданий', () => {
    render(<GameBoard />);

    // Заголовок без эмодзи, только текст
    expect(screen.getByText(/Город \(4×4 квартала\)/)).toBeInTheDocument();

    // 2 жителя и 1 здание по нашему mockState
    expect(screen.getByText('2 жителей • 1 зданий')).toBeInTheDocument();
  });

  it.skip('рендерит поле 4×4 с координатами кварталов', () => {
    render(<GameBoard />);

    // В каждом квартале выводится метка вида [y,x]
    const coords = screen.getAllByText(/^\[\d,\d\]$/);
    expect(coords).toHaveLength(16);
  });

  it('показывает детектива и место преступления на поле', () => {
    render(<GameBoard />);

    // Детектив (🕵️) должен быть на поле
    expect(screen.getByText('🕵️')).toBeInTheDocument();

    // Место преступления (💀) также должно быть
    expect(screen.getByText('💀')).toBeInTheDocument();
  });

  it('рендерит здание с иконкой из BUILDING_ICONS', () => {
    render(<GameBoard />);

    const policeIcon = BUILDING_ICONS.POLICE;
    expect(screen.getByText(policeIcon)).toBeInTheDocument();
  });

  it('передаёт в CitizenCard правильные флаги isFrightened / isSelected и обработчик onClick', () => {
    render(<GameBoard />);

    // У нас два вызова CitizenCard — по одному на каждого жителя
    expect(mockCitizenCard).toHaveBeenCalledTimes(2);

    const calls = mockCitizenCard.mock.calls;

    const callForC2 = calls.find(([props]) => props.citizen.id === 'c2');
    expect(callForC2).toBeDefined();

    const propsForC2 = callForC2![0];

    // Житель c2 запуган и выбран (см. mockStoreState)
    expect(propsForC2.isFrightened).toBe(true);
    expect(propsForC2.isSelected).toBe(true);
    expect(typeof propsForC2.onClick).toBe('function');

    // Эмулируем клик по карточке и проверяем, что дернулся selectResident из стора
    propsForC2.onClick();
    expect(selectResidentMock).toHaveBeenCalledWith('c2');
  });

  it('возвращает null, если gameState отсутствует', () => {
    mockStoreState = {
      gameState: null,
      playerRole: 'KILLER',
      selectedResidents: [],
      selectResident: vi.fn(),
    };

    render(<GameBoard />);

    // Никакого заголовка и счётчика быть не должно
    expect(screen.queryByText(/Город \(4×4 квартала\)/)).toBeNull();
  });
});
