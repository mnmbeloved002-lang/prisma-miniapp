import { describe, test, expect } from 'vitest';
import { createGame } from './init';
import { makeAccusation } from './detective';

describe('Detective: Финальное обвинение', () => {
  test('детектив побеждает при правильном обвинении', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    // Переходим в фазу детектива
    state.phase = 'DETECTIVE';
    
    // Правильное обвинение
    const result = makeAccusation(
      state,
      state.killer.identity.id,
      state.killer.motive
    );
    
    expect(result.isValid).toBe(true);
    expect(result.state!.isGameOver).toBe(true);
    expect(result.state!.winner).toBe('DETECTIVE');
    expect(result.data.correctKiller).toBe(true);
    expect(result.data.correctMotive).toBe(true);
  });

  test('убийца побеждает при неправильном убийце', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'DETECTIVE';
    
    // Находим невиновного
    const innocent = state.grid.flat().find(c => c.id !== state.killer.identity.id);
    
    const result = makeAccusation(
      state,
      innocent!.id,
      state.killer.motive // Правильный мотив
    );
    
    expect(result.isValid).toBe(true);
    expect(result.state!.isGameOver).toBe(true);
    expect(result.state!.winner).toBe('KILLER');
    expect(result.data.correctKiller).toBe(false);
    expect(result.data.correctMotive).toBe(true);
  });

  test('убийца побеждает при неправильном мотиве', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'DETECTIVE';
    state.availableMotives = ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'];
    
    // Находим неправильный мотив
    const wrongMotive = state.availableMotives.find(m => m !== state.killer.motive);
    
    const result = makeAccusation(
      state,
      state.killer.identity.id, // Правильный убийца
      wrongMotive!
    );
    
    expect(result.isValid).toBe(true);
    expect(result.state!.isGameOver).toBe(true);
    expect(result.state!.winner).toBe('KILLER');
    expect(result.data.correctKiller).toBe(true);
    expect(result.data.correctMotive).toBe(false);
  });

  test('убийца побеждает при обоих неправильных', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'DETECTIVE';
    state.availableMotives = ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'];
    
    const innocent = state.grid.flat().find(c => c.id !== state.killer.identity.id);
    const wrongMotive = state.availableMotives.find(m => m !== state.killer.motive);
    
    const result = makeAccusation(
      state,
      innocent!.id,
      wrongMotive!
    );
    
    expect(result.isValid).toBe(true);
    expect(result.state!.winner).toBe('KILLER');
    expect(result.data.correctKiller).toBe(false);
    expect(result.data.correctMotive).toBe(false);
  });

  test('нельзя обвинить не в фазе детектива', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    // Фаза убийцы
    state.phase = 'KILLER';
    
    const result = makeAccusation(
      state,
      state.killer.identity.id,
      state.killer.motive
    );
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('фазе детектива');
  });

  test('нельзя обвинить несуществующего жителя', () => {
    let state = createGame({
      mode: 'LOGIC',
      includeFigure: false,
      selectedMotives: ['MANIAC', 'SADIST', 'HEADHUNTER', 'VIGILANTE', 'KILLER', 'TERRORIST'],
    });
    
    state.phase = 'DETECTIVE';
    
    const result = makeAccusation(
      state,
      'non-existent-id',
      state.killer.motive
    );
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('не найден');
  });
});
