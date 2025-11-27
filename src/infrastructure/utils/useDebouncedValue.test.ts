import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue hook', () => {
  it('returns the initial value immediately (kills useState mutation)', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    // Critical: must return initial value, not undefined
    expect(result.current).toBe('initial');
    expect(result.current).not.toBeUndefined();

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

  it('updates value after the delay passes (kills setTimeout/delay mutations)', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'initial', delay: 300 },
    });

    rerender({ value: 'updated', delay: 300 });

    // Should NOT update before delay
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should update after exact delay
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('reacts to delay changes (kills dependency array mutation)', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'v1', delay: 500 },
    });

    // Change value and delay
    rerender({ value: 'v2', delay: 200 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should update with new delay (200ms, not old 500ms)
    expect(result.current).toBe('v2');

    vi.useRealTimers();
  });

  it('cleans up the timer on unmount (kills cleanup mutation)', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 300 } },
    );

    // Trigger timer creation
    rerender({ value: 'updated', delay: 300 });

    const callsBefore = clearSpy.mock.calls.length;

    unmount();

    // Critical: clearTimeout must be called MORE times after unmount
    expect(clearSpy.mock.calls.length).toBeGreaterThan(callsBefore);

    clearSpy.mockRestore();
    vi.useRealTimers();
  });

  it('updates multiple times correctly', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebouncedValue(value, delay), {
      initialProps: { value: 'v1', delay: 300 },
    });

    // First update
    rerender({ value: 'v2', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('v2');

    // Second update
    rerender({ value: 'v3', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('v3');

    vi.useRealTimers();
  });
});
