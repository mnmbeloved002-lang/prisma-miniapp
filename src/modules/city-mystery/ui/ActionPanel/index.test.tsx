import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActionPanel } from './index';
import { useGameStore } from '../../application/gameStore';

const TEST_CONFIG = {
  mode: 'LOGIC' as const,
  includeFigure: false,
  selectedMotives: [],
};

describe('city-mystery ActionPanel', () => {
  beforeEach(() => {
    useGameStore.setState(() => ({} as any));
  });

  it('рендерит заголовок панели действий', () => {
    render(<ActionPanel />);
    expect(screen.getByText(/Панель действий/i)).toBeInTheDocument();
  });

  it('показывает заглушку, если игра не инициализирована', () => {
    render(<ActionPanel />);
    expect(
      screen.getByText(/Игра не инициализирована/i),
    ).toBeInTheDocument();
  });

  it('показывает кнопку запугивания для убийцы', () => {
    const store = useGameStore.getState();
    store.initializeGame(TEST_CONFIG);
    store.setPlayerRole('KILLER');
    render(<ActionPanel />);
    expect(screen.getByText(/Запугать выбранных/i)).toBeInTheDocument();
  });
});
