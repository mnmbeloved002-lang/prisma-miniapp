// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NewsCard, NewsCardSkeleton } from './NewsCard';
import * as bookmarks from '../application/bookmarks';
import type { NewsItem } from '../domain/types';

vi.mock('../application/bookmarks', () => ({
  has: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
}));

const mockedBookmarks = vi.mocked(bookmarks);

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
    expect(screen.getByText(/Nov 03|03 нояб\./i)).toBeInTheDocument();
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

    const button = screen.getByTitle(/В закладки/i);
    expect(button).toHaveTextContent('☆');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);
    expect(mockedBookmarks.add).toHaveBeenCalledTimes(1);
    expect(mockedBookmarks.add).toHaveBeenCalledWith(mockItem);
    expect(mockedBookmarks.remove).not.toHaveBeenCalled();
  });

  it('should show "★" (remove) when item IS bookmarked', async () => {
    mockedBookmarks.has.mockReturnValue(true);
    render(<NewsCard item={mockItem} />);

    const button = screen.getByTitle(/Удалить из закладок/i);
    expect(button).toHaveTextContent('★');
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);
    expect(mockedBookmarks.remove).toHaveBeenCalledTimes(1);
    expect(mockedBookmarks.remove).toHaveBeenCalledWith(mockItem.id);
    expect(mockedBookmarks.add).not.toHaveBeenCalled();
  });

  it('uses eager/high when priority=true', () => {
    mockedBookmarks.has.mockReturnValue(false);
    render(<NewsCard item={mockItem} priority />);

    const img = screen.getByRole('img', { name: /Новость о Витесте/i }) as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });

  it('uses lazy/auto when priority is not provided', () => {
    mockedBookmarks.has.mockReturnValue(false);
    render(<NewsCard item={mockItem} />);
    const img = screen.getByRole('img', { name: /Новость о Витесте/i }) as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('fetchpriority')).toBe('auto');
  });

  describe('Image error handling', () => {
    it('should switch to SVG fallback on image load error', () => {
      mockedBookmarks.has.mockReturnValue(false);
      render(<NewsCard item={mockItem} />);

      const img = screen.getByAltText(mockItem.title);
      expect(img).not.toHaveAttribute('data-fallback');

      fireEvent.error(img);

      expect(img.getAttribute('src')).toContain('data:image/svg+xml');
      expect(img).toHaveAttribute('data-fallback', '1');
    });

    it('should not switch to fallback again if already in fallback state', () => {
      mockedBookmarks.has.mockReturnValue(false);
      render(<NewsCard item={mockItem} />);

      const img = screen.getByAltText(mockItem.title);
      
      fireEvent.error(img);
      const firstSrc = img.getAttribute('src');

      fireEvent.error(img);
      expect(img.getAttribute('src')).toBe(firstSrc);
    });

    it('should generate fallback SVG with truncated title for long titles', () => {
      const longTitle = 'Очень длинное название новости которое должно быть обрезано до тридцати двух символов';
      const longTitleItem = {
        ...mockItem,
        title: longTitle
      };
      
      render(<NewsCard item={longTitleItem} />);
      const img = screen.getByAltText(longTitleItem.title);
      
      fireEvent.error(img);
      
      // Проверяем что заголовок обрезан до 32 символов
      const truncatedTitle = longTitle.slice(0, 32);
      expect(img.getAttribute('src')).toContain(encodeURIComponent(truncatedTitle));
    });

    // ДОБАВЛЕННЫЙ ТЕСТ для покрытия ветки с пустым заголовком
    it('should use "Новость" as fallback for empty title', () => {
      const emptyTitleItem = {
        ...mockItem,
        title: ''
      };
      
      render(<NewsCard item={emptyTitleItem} />);
      const img = screen.getByAltText('');
      
      fireEvent.error(img);
      
      // Проверяем что используется fallback текст "Новость"
      expect(img.getAttribute('src')).toContain(encodeURIComponent('Новость'));
    });
  });
});

describe('NewsCardSkeleton', () => {
  it('should render a skeleton structure', () => {
    const { container } = render(<NewsCardSkeleton />);
    expect(container.querySelector('.aspect-\\[16\\/9\\]')).toBeInTheDocument();
  });
});
