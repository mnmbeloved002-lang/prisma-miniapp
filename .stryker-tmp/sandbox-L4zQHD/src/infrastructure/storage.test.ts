// @ts-nocheck
// src/infrastructure/storage.test.ts
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { storage } from './storage';

// Создаем "мок" (фальшивый) localStorage, чтобы контролировать его
const createMockLocalStorage = (available = true) => {
  let store: Record<string, string> = {};

  if (!available) {
    // Если localStorage недоступен (инкогнито в Safari и т.д.)
    const error = new Error('LocalStorage is not available');
    return {
      getItem: () => { throw error; },
      setItem: () => { throw error; },
      removeItem: () => { throw error; },
      clear: () => { store = {}; },
    };
  }

  // Обычный рабочий localStorage
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      // Имитируем ошибку "Quota Exceeded" (переполнение)
      if (key === 'FAIL_SET') {
        throw new Error('Quota Exceeded');
      }
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

// Перехватываем "window.localStorage" и подменяем его нашим моком
let mockStorage = createMockLocalStorage();
vi.stubGlobal('localStorage', mockStorage);

describe('Infrastructure: storage', () => {

  // Сбрасываем хранилище перед каждым тестом
  beforeEach(() => {
    mockStorage.clear();
  });

  // Восстанавливаем настоящий localStorage после всех тестов
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should set and get a value', () => {
    const data = { id: 1, name: 'test' };
    storage.set('myKey', data);
    
    const retrieved = storage.get('myKey');
    expect(retrieved).toEqual(data);
  });

  it('should return null if key does not exist', () => {
    const retrieved = storage.get('badKey');
    expect(retrieved).toBeNull();
  });

  it('should delete a value', () => {
    storage.set('myKey', { id: 1 });
    storage.del('myKey');
    
    const retrieved = storage.get('myKey');
    expect(retrieved).toBeNull();
  });

  // --- Тесты на сбои (Edge Cases) ---

  it('should return null if JSON.parse fails', () => {
    // Напрямую кладем "битый" JSON в мок
    mockStorage.setItem('badJSON', '{invalid_json:');
    
    const retrieved = storage.get('badJSON');
    expect(retrieved).toBeNull();
  });

  it('should return null if localStorage.getItem fails', () => {
    // Перезагружаем мок в "недоступный" режим
    vi.stubGlobal('localStorage', createMockLocalStorage(false));
    
    const retrieved = storage.get('anyKey');
    expect(retrieved).toBeNull();
    
    // Возвращаем мок в обычный режим
    vi.stubGlobal('localStorage', mockStorage);
  });

  it('should not throw if localStorage.setItem fails (Quota)', () => {
    // `setItem` бросит ошибку, если ключ 'FAIL_SET'
    // Функция `storage.set` должна поймать эту ошибку и не падать.
    expect(() => {
      storage.set('FAIL_SET', { id: 1 });
    }).not.toThrow();
  });
  
  it('should not throw if localStorage.removeItem fails', () => {
    vi.stubGlobal('localStorage', createMockLocalStorage(false));
    
    expect(() => {
      storage.del('anyKey');
    }).not.toThrow();
    
    vi.stubGlobal('localStorage', mockStorage);
  });
});
