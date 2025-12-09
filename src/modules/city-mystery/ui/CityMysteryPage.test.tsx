// biome-ignore assist/source/organizeImports: keep React import first
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;

// === МОКИ ХУКОВ TELEGRAM ===
vi.mock('../../../application/useTelegram', () => ({
  useTelegramUser: vi.fn(() => ({
    id: 1,
    firstName: 'TestUser',
  })),
}));

// === МОКИ ДЕТАЛЬНЫХ UI-КОМПОНЕНТОВ, ЧТОБЫ НЕ ТАЩИТЬ ВЕСЬ UI ===
const lobbySpy = vi.fn();

vi.mock('./LobbyScreen', () => ({
  LobbyScreen: (props: {
    onSelectRole: (role: 'KILLER' | 'DETECTIVE') => void;
    onStartTutorial: () => void;
    userName?: string;
  }) => {
    lobbySpy(props);
    return (
      <div data-testid="lobby-screen">
        LOBBY_SCREEN
        <button type="button" onClick={() => props.onSelectRole('KILLER')}>
          select-killer
        </button>
        <button type="button" onClick={() => props.onSelectRole('DETECTIVE')}>
          select-detective
        </button>
        <button type="button" onClick={props.onStartTutorial}>
          start-tutorial
        </button>
        {props.userName && <span data-testid="lobby-user-name">{props.userName}</span>}
      </div>
    );
  },
}));

vi.mock('./GameBoard', () => ({
  GameBoard: () => <div data-testid="game-board">GAME_BOARD</div>,
}));

vi.mock('./ActionPanel', () => ({
  ActionPanel: () => <div data-testid="action-panel">ACTION_PANEL</div>,
}));

vi.mock('./MotiveGrid', () => ({
  MotiveGrid: () => <div data-testid="motive-grid">MOTIVE_GRID</div>,
}));

vi.mock('./GameLog', () => ({
  GameLog: () => <div data-testid="game-log">GAME_LOG</div>,
}));

vi.mock('./GameOverScreen', () => ({
  GameOverScreen: (props: { onRestart: () => void }) => (
    <div data-testid="game-over-screen">
      GAME_OVER
      <button type="button" onClick={props.onRestart}>
        restart
      </button>
    </div>
  ),
}));

// === ИМПОРТ СТОРА И СТРАНИЦЫ ПОСЛЕ МОКОВ ===
import { useGameStore } from '../application/gameStore';
import { CityMysteryPage } from './CityMysteryPage';

describe('CityMysteryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Жёсткий сброс Zustand-стора перед каждым тестом
    const state = useGameStore.getState();
    if (state.resetGame) {
      state.resetGame();
    }
    if (state.clearError) {
      state.clearError();
    }
  });

  it.skip('рендерит LobbyScreen, если игра не инициализирована или роль не выбрана', () => {
    render(<CityMysteryPage />);

    // На первом экране всегда показываем лобби
    expect(screen.getByTestId('lobby-screen')).toBeInTheDocument();
    expect(lobbySpy).toHaveBeenCalled();
  });

  it.skip('после выбора роли показывает основное игровое поле и панель действий', async () => {
    render(<CityMysteryPage />);

    // Имитируем выбор роли Убийцы в лобби
    fireEvent.click(screen.getByText('select-killer'));

    // Ждём, пока страница переключится в основной режим (после init + setPlayerRole)
    const board = await screen.findByTestId('game-board');
    const panel = await screen.findByTestId('action-panel');

    expect(board).toBeInTheDocument();
    expect(panel).toBeInTheDocument();

    // Дополнительно проверяем, что вспомогательные блоки тоже присутствуют
    expect(screen.getByTestId('motive-grid')).toBeInTheDocument();
    expect(screen.getByTestId('game-log')).toBeInTheDocument();
  });

  it.skip('показывает имя игрока из Telegram в шапке после выбора роли', async () => {
    render(<CityMysteryPage />);

    // Выбираем роль, чтобы выйти из лобби и увидеть основной UI
    fireEvent.click(screen.getByText('select-killer'));

    // Имя игрока берётся из useTelegramUser (замокано как TestUser)
    const userName = await screen.findByText('TestUser');

    expect(userName).toBeInTheDocument();
  });
});
