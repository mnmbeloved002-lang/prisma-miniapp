// biome-ignore assist/source/organizeImports: keep React import for JSX runtime
import React from 'react';
import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MotiveGrid } from './MotiveGrid';
import { useGameStore } from '../application/gameStore';

void React;

describe('city-mystery MotiveGrid', () => {
  beforeEach(() => {
    const state = useGameStore.getState();
    useGameStore.setState({
      ...state,
      gameState: null,
      selectedMotive: null,
    } as any);
  });

  it('рендерит заголовок блока мотивов', () => {
    render(<MotiveGrid />);

    // Явно проверяем именно заголовок (role="heading")
    const heading = screen.getByRole('heading', { name: /Мотивы/i });
    expect(heading).toBeInTheDocument();
  });

  it('показывает заглушку, если мотивы недоступны', () => {
    render(<MotiveGrid />);

    expect(
      screen.getByText(/Мотивы пока недоступны/i),
    ).toBeInTheDocument();
  });

  it('отображает мотивы из gameState.availableMotives', () => {
    const state = useGameStore.getState();

    useGameStore.setState({
      ...state,
      gameState: {
        ...(state.gameState ?? ({} as any)),
        availableMotives: [
          { id: 'motive_jealousy', name: 'Ревность' } as any,
          { id: 'motive_revenge', name: 'Месть' } as any,
        ],
      } as any,
    });

    render(<MotiveGrid />);

    expect(screen.getByText(/Ревность/i)).toBeInTheDocument();
    expect(screen.getByText(/Месть/i)).toBeInTheDocument();
  });
});
