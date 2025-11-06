// src/ui/NewsCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NewsCard, NewsCardSkeleton } from './NewsCard';
import * as bookmarks from '../application/bookmarks'; // Импорт модуля
import type { NewsItem } from '../domain/types';

// Мокируем ВЕСЬ модуль 'bookmarks' с нужными функциями
vi.mock('../application/bookmarks', () => ({
  has: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}));

const mockedBookmarks = vi.mocked(bookmarks);

// Мок данных для карточки
const mockItem = {
  id: '1',
  title: 'Новость о Витесте',
  summary: 'Тестирование прошло успешно.',
  publishedAt: new Date('2025-11-03T10:00:00Z').toISOString(),
  source: 'RBC',
  image: 'test.png',
} as NewsItem;

describe('NewsCard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all item details correctly', () => {
    mockedBookmarks.has.mockReturnValue(false);
    render(<NewsCard item={mockItem} />);

    expect(screen.getByRole('heading', { name: /Новость о Витесте/i })).toBeInTheDocument();
    expect(screen.getByText(/Тестирование прошло успешно/i)).toBeInTheDocument();
    expect(screen.getByText('RBC')).toBeInTheDocument();

    // ИСПРАВЛЕНИЕ: Проверяем дату без учета локали (Nov 03 или 03 нояб.)
    expect(screen.getByText(/Nov 03|03 нояб./i)).toBeInTheDocument();
  });

  it('should call onOpen callback when "Открыть" is clicked', async () => {
    mockedBookmarks.has.mockReturnValue(false);
    const onOpenMock = vi.fn();
    render(<NewsCard item={mockItem} onOpen={onOpenMock} />);

    await user.click(screen.getByRole('button', { name: /Открыть/i }));

    expect(onOpenMock).toHaveBeenCalledTimes(1);
    expect(onOpenMock).toHaveBeenCalledWith(mockItem);
  });

  it('should show "☆" (add) when item is NOT bookmarked', async () => {
    mockedBookmarks.has.mockReturnValue(false);
    render(<NewsCard item={mockItem} />);

    // ИСПРАВЛЕНИЕ: Ищем кнопку по 'title', а не по 'name'
    const button = screen.getByTitle(/В закладки/i);

    expect(button).toHaveTextContent('☆');
    await user.click(button);
    expect(mockedBookmarks.add).toHaveBeenCalledTimes(1);
    expect(mockedBookmarks.add).toHaveBeenCalledWith(mockItem);
    expect(mockedBookmarks.remove).not.toHaveBeenCalled();
  });

  it('should show "★" (remove) when item IS bookmarked', async () => {
    mockedBookmarks.has.mockReturnValue(true);
    render(<NewsCard item={mockItem} />);

    // ИСПРАВЛЕНИЕ: Ищем кнопку по 'title', а не по 'name'
    const button = screen.getByTitle(/Удалить из закладок/i);

    expect(button).toHaveTextContent('★');
    await user.click(button);
    expect(mockedBookmarks.remove).toHaveBeenCalledTimes(1);
    expect(mockedBookmarks.remove).toHaveBeenCalledWith(mockItem.id);
    expect(mockedBookmarks.add).not.toHaveBeenCalled();
  });

  // --- ДОБАВЛЕНО: покрытие ветки priority=true ---
  it('uses eager/high when priority=true', () => {
    mockedBookmarks.has.mockReturnValue(false);

    render(<NewsCard item={mockItem} onOpen={() => {}} priority />);

    const img = screen.getByRole('img', { name: /Новость о Витесте/i });
    expect(img).toHaveAttribute('loading', 'eager');

    // DOM-атрибут будет в lower-case: fetchpriority
    const fp = img.getAttribute('fetchpriority');
    if (fp !== null) {
      expect(fp).toBe('high');
    }
  });
});

describe('NewsCardSkeleton', () => {
  it('should render a skeleton structure', () => {
    const { container } = render(<NewsCardSkeleton />);
    expect(container.querySelector('.aspect-\\[16\\/9\\]')).toBeInTheDocument();
  });
});
