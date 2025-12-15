// biome-ignore assist/source/organizeImports: keep React import for JSX runtime
import React from 'react';
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameLog } from './GameLog';
import { useGameStore } from '../application/gameStore';

void React;

describe('city-mystery GameLog', () => {
  beforeEach(() => {
    const state = useGameStore.getState();
    useGameStore.setState({
      ...state,
      gameLog: [],
    } as any);
  });

  it('рендерит заголовок журнала событий', () => {
    render(<GameLog />);

    expect(screen.getByText(/Журнал событий/i)).toBeInTheDocument();
  });

  it('показывает заглушку, если лог пустой', () => {
    render(<GameLog />);

    expect(screen.getByText(/Действий пока нет/i)).toBeInTheDocument();
  });

  it('отображает записи из gameLog стора', () => {
    const state = useGameStore.getState();
    useGameStore.setState({
      ...state,
      gameLog: ['[10:00:00] 🎮 Игра началась', '[10:01:00] 🔪 Убийца сделал ход'],
    } as any);

    render(<GameLog />);

    expect(screen.getByText(/Игра началась/i)).toBeInTheDocument();
    expect(screen.getByText(/Убийца сделал ход/i)).toBeInTheDocument();
  });
});
