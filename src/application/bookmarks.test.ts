// src/application/bookmarks.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { add, remove, has, list, toggle } from './bookmarks';
import { storage } from '../infrastructure/storage';
import type { NewsItem } from '../domain/types';

// Мокируем модуль storage, чтобы он не лез в настоящий localStorage
vi.mock('../infrastructure/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

// Приводим "мокированный" storage к типу, чтобы TS не ругался
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
  // Сбрасываем все моки перед каждым тестом
  beforeEach(() => {
    vi.clearAllMocks();
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
    // Ожидаем, что в storage сохранился массив с двумя элементами
    expect(mockedStorage.set).toHaveBeenCalledWith('bookmarks-v1', [item1, item2]);
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
});
