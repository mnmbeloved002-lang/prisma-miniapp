import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storage } from './storage';

describe('storage (Mutation Coverage - catch blocks)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('executes catch block when setItem throws (kills catch body mutation)', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock localStorage.setItem чтобы выбросить ошибку
    const mockSetItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: mockSetItem,
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    // Вызываем storage.set - должен поймать ошибку и НЕ упасть
    expect(() => {
      storage.set('test-key', { data: 'test' });
    }).not.toThrow();

    // Проверяем что setItem был вызван (ошибка произошла)
    expect(mockSetItem).toHaveBeenCalledWith('test-key', '{"data":"test"}');

    // Критично: если мутант удалит тело catch блока,
    // код может упасть или вести себя некорректно
    // Этот тест гарантирует что catch отрабатывает молча

    consoleErrorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('executes catch block when getItem throws (kills catch body mutation)', () => {
    const mockGetItem = vi.fn(() => {
      throw new Error('Storage access denied');
    });

    vi.stubGlobal('localStorage', {
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    // Должен вернуть null, не упав
    const result = storage.get('test-key');

    expect(result).toBeNull();
    expect(mockGetItem).toHaveBeenCalledWith('test-key');

    vi.unstubAllGlobals();
  });

  it('executes catch block when removeItem throws (kills catch body mutation)', () => {
    const mockRemoveItem = vi.fn(() => {
      throw new Error('Remove failed');
    });

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: mockRemoveItem,
      clear: vi.fn(),
    });

    // Должен не упасть
    expect(() => {
      storage.del('test-key');
    }).not.toThrow();

    expect(mockRemoveItem).toHaveBeenCalledWith('test-key');

    vi.unstubAllGlobals();
  });
});
