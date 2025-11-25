import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue hook', () => {
  it('returns the initial value immediately', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    expect(result.current).toBe('initial');

    vi.useRealTimers();
  });

  it('does not update value before the delay passes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    rerender({ value: 'updated', delay: 300 });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial');

    vi.useRealTimers();
  });

  it('updates value after the delay passes', () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    rerender({ value: 'updated', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('cleans up the timer on unmount', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    unmount();

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
    vi.useRealTimers();
  });
});
