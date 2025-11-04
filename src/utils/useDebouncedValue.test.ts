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
});
