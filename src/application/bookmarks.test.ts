// src/application/bookmarks.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { add, remove, has, list, getList, toggle, __unsafe__resetForTests } from './bookmarks';
import { storage } from '../infrastructure/storage'; // named import
import type { NewsItem } from '../domain/types';

// Мокируем модуль storage
vi.mock('../infrastructure/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

// Приводим "мокированный" storage к типу
const mockedStorage = vi.mocked(storage);

// Типизированный мок новости
const createMockItem = (id: string): NewsItem =>
  ({
    id,
    title: `Test ${id}`,
    summary: '...',
    image: '...',
    source: '...',
    canonicalUrl: '...',
    publishedAt: '...',
    category: [],
    previewHtml: '...',
  }) as NewsItem;

const item1 = createMockItem('1');
const item2 = createMockItem('2');

describe('Bookmarks Application Logic', () => {
  // Сбрасываем все моки и состояние перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks();
    __unsafe__resetForTests(); // Сбрасываем внутреннее состояние bookmarks
    // Имитируем пустой localStorage по умолчанию
    mockedStorage.get.mockReturnValue(null);
  });

  it('should add an item to empty list', () => {
    mockedStorage.get.mockReturnValue(null); // Пусто
    add(item1);
    // Ожидаем, что в storage сохранился массив с одним элементом
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', [item1]);
  });

  it('should add an item to an existing list', () => {
    mockedStorage.get.mockReturnValue([item1]); // Уже есть item1
    add(item2);
    // Ожидаем, что в storage сохранился массив с двумя элементами (новый в начале)
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', [item2, item1]);
  });

  it('should not add a duplicate item', () => {
    mockedStorage.get.mockReturnValue([item1]);
    add(item1); // Попытка добавить дубликат
    // set не должен быть вызван, т.к. ничего не изменилось
    expect(mockedStorage.set).not.toHaveBeenCalled();
  });

  it('should remove an item', () => {
    mockedStorage.get.mockReturnValue([item1, item2]);
    remove('1'); // Удаляем item1
    // Ожидаем, что в storage сохранился массив только с item2
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', [item2]);
  });

  it('should do nothing if removing non-existent item', () => {
    mockedStorage.get.mockReturnValue([item1]);
    remove('999'); // Такого ID нет
    expect(mockedStorage.set).not.toHaveBeenCalled();
  });

  it('should check "has" correctly', () => {
    mockedStorage.get.mockReturnValue([item1]);
    expect(has('1')).toBe(true);
    expect(has('2')).toBe(false);
  });

  it('should return the full list', () => {
    mockedStorage.get.mockReturnValue([item1, item2]);
    expect(list()).toEqual([item1, item2]);
    expect(getList()).toEqual([item1, item2]); // Добавлен вызов getList для покрытия
  });

  it('should return empty list if storage is empty', () => {
    mockedStorage.get.mockReturnValue(null);
    expect(list()).toEqual([]);
  });

  it('should toggle "add" when item is missing', () => {
    mockedStorage.get.mockReturnValue(null); // Пусто
    toggle(item1);
    // Должен вызвать add
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', [item1]);
  });

  it('should toggle "remove" when item exists', () => {
    mockedStorage.get.mockReturnValue([item1]);
    toggle(item1);
    // Должен вызвать remove
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', []);
  });

  // Новые тесты для улучшений

  it('should read from storage only once', () => {
    mockedStorage.get.mockReturnValue([item1, item2]);

    // Первый вызов - должен прочитать из storage
    list();
    expect(mockedStorage.get).toHaveBeenCalledTimes(1);

    // Последующие вызовы - не должны читать из storage
    has('1');
    list();
    add(item1); // дубликат - не должен вызывать запись
    remove('999'); // не существующий - не должен вызывать запись

    expect(mockedStorage.get).toHaveBeenCalledTimes(1); // Все еще 1 вызов!
  });

  it('should reset cache on storage event from other tabs', () => {
    // Имитируем начальное состояние
    mockedStorage.get.mockReturnValue([item1]);
    expect(has('1')).toBe(true);
    expect(mockedStorage.get).toHaveBeenCalledTimes(1);

    // Имитируем событие storage из другой вкладки
    const storageEvent = new StorageEvent('storage', {
      key: 'bookmarks-v1',
      oldValue: JSON.stringify([item1]),
      newValue: JSON.stringify([item2]),
      url: window.location.href,
      storageArea: localStorage,
    });
    
    window.dispatchEvent(storageEvent);

    // После события storage кэш должен сброситься
    // и при следующем вызове снова прочитать из storage
    mockedStorage.get.mockReturnValue([item2]); // Другая вкладка изменила данные
    expect(has('1')).toBe(false); // Теперь item1 нет
    expect(has('2')).toBe(true); // Теперь есть item2
    expect(mockedStorage.get).toHaveBeenCalledTimes(2); // Был вызван повторно
  });

  it('should ignore storage events for other keys', () => {
    mockedStorage.get.mockReturnValue([item1]);
    expect(has('1')).toBe(true);
    expect(mockedStorage.get).toHaveBeenCalledTimes(1);

    // Событие storage для другого ключа
    const storageEvent = new StorageEvent('storage', {
      key: 'other-key',
      oldValue: 'old',
      newValue: 'new',
      url: window.location.href,
      storageArea: localStorage,
    });
    
    window.dispatchEvent(storageEvent);

    // Кэш не должен сброситься для другого ключа
    expect(has('1')).toBe(true);
    expect(mockedStorage.get).toHaveBeenCalledTimes(1); // Не вызывался повторно
  });

  describe('__unsafe__resetForTests', () => {
    it('should completely reset state when called without seed', () => {
      // Сначала установим некоторое состояние
      mockedStorage.get.mockReturnValue([item1, item2]);
      add(item1); // Не добавится, но ensureLoaded вызовется
      
      // Сбрасываем
      __unsafe__resetForTests();
      
      // Проверяем, что storage был очищен
      expect(mockedStorage.del).toHaveBeenCalledWith('bookmarks-v1');
      
      // Проверяем, что состояние сброшено
      mockedStorage.get.mockReturnValue(null);
      expect(list()).toEqual([]);
    });

    it('should initialize with seed data when provided', () => {
      const seedData = [item1, item2];
      
      // Сбрасываем с seed
      __unsafe__resetForTests(seedData);
      
      // Проверяем, что seed записан в storage
      expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', seedData);
      
      // Проверяем, что состояние инициализировано
      expect(list()).toEqual(seedData);
      expect(has('1')).toBe(true);
      expect(has('2')).toBe(true);
    });

    it('should handle empty seed array', () => {
      __unsafe__resetForTests([]);
      
      expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', []);
      expect(list()).toEqual([]);
    });
  });

  it('should maintain consistent state across multiple operations', () => {
    mockedStorage.get.mockReturnValue(null);
    
    // Серия операций
    add(item1);
    add(item2);
    expect(list()).toEqual([item2, item1]);
    
    remove('1');
    expect(list()).toEqual([item2]);
    
    toggle(item1); // Добавить
    expect(list()).toEqual([item1, item2]);
    
    toggle(item1); // Удалить
    expect(list()).toEqual([item2]);
    
    // Исправлено: ожидаем 5 вызовов (add×2, remove×1, toggle×2)
    expect(mockedStorage.set).toHaveBeenCalledTimes(5);
    
    // Дополнительная проверка - убеждаемся что все вызовы были с правильными данными
    expect(mockedStorage.set).toHaveBeenNthCalledWith(1, 'bookmarks-v1', [item1]);
    expect(mockedStorage.set).toHaveBeenNthCalledWith(2, 'bookmarks-v1', [item2, item1]);
    expect(mockedStorage.set).toHaveBeenNthCalledWith(3, 'bookmarks-v1', [item2]);
    expect(mockedStorage.set).toHaveBeenNthCalledWith(4, 'bookmarks-v1', [item1, item2]);
    expect(mockedStorage.set).toHaveBeenNthCalledWith(5, 'bookmarks-v1', [item2]);
  });
});
