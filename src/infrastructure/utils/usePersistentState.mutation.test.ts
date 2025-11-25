import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePersistentState } from './usePersistentState';

const KEY = 'ritual:persistent';

describe('usePersistentState mutation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('reads JSON value from localStorage', () => {
    localStorage.setItem(KEY, JSON.stringify('saved'));
    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));
    expect(result.current[0]).toBe('saved');
  });

  it('falls back to initial when JSON parse fails', () => {
    localStorage.setItem(KEY, 'not-json');
    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('writes updated value to localStorage', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');

    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));

    act(() => {
      const [, setValue] = result.current;
      setValue('updated');
    });

    expect(setItemSpy).toHaveBeenCalledWith(KEY, JSON.stringify('updated'));
  });

  it('handles getItem errors and still uses initial', () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('read-fail');
    });

    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });

  it('swallows setItem errors in effect', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('write-fail');
    });

    const { result } = renderHook(() => usePersistentState(KEY, 'initial'));

    act(() => {
      const [, setValue] = result.current;
      setValue('next');
    });

    expect(setItemSpy).toHaveBeenCalled();
  });
});
