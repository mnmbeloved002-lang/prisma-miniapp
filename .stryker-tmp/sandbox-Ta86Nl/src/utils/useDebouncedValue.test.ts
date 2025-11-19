// @ts-nocheck
// src/utils/useDebouncedValue.test.ts
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    // Меняем 'a' на 'b'
    rerender({ value: 'b', delay: 500 });
    
    // Проматываем 499мс
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // Значение все еще 'a'
    expect(result.current).toBe('a');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'a', delay: 500 } }
    );

    // Меняем 'a' на 'b'
    rerender({ value: 'b', delay: 500 });

    // Проматываем 500мс
  	act(() => {
  	  vi.advanceTimersByTime(500);
  	});

  	// Значение стало 'b'
  	expect(result.current).toBe('b');
  });

  // --- (НАЧАЛО НОВОГО ТЕСТА ДЛЯ ПОКРЫТИЯ) ---
  /**
   * ЦЕЛЬ: Покрыть "ветку" (branch) delay = 300 по умолчанию.
   * Мы вызываем хук БЕЗ указания 'delay'.
   */
  it('should use the default delay (300ms) if not provided', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value), // ВЫЗОВ БЕЗ 'delay'
      { initialProps: { value: 'a' } }
    );

    // Меняем 'a' на 'b'
    rerender({ value: 'b' });

    // Проматываем 299мс (недостаточно)
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a'); // Все еще 'a'

    // Проматываем еще 1мс (теперь 300мс)
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('b'); // Стало 'b'
  });
  // --- (КОНЕЦ НОВОГО ТЕСТА) ---
});
