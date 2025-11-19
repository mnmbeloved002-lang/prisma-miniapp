// @ts-nocheck
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppShell from './AppShell';
import { getNewsCached } from '../infrastructure/api-client';
import {
  list as bmList,
  has as bmHas,
  add as bmAdd,
  remove as bmRemove,
} from '../application/bookmarks';
import { openLink } from '../utils/nav';
import { useAppStore } from '../store/appStore';

// Мокаем зависимости
vi.mock('../infrastructure/api-client');
vi.mock('../application/bookmarks');
vi.mock('../utils/nav');

// Мок ReaderPreview (со всеми 3 кнопками)
vi.mock('./ReaderPreview', () => ({
  default: ({
    onOpenSource,
    onBookmark,
    onClose,
  }: {
    onOpenSource: () => void;
    onBookmark: () => void;
    onClose: () => void;
  }) => (
    <div data-testid="reader-preview">
      <button onClick={onOpenSource}>Open Source</button>
      <button onClick={onBookmark}>Bookmark</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Импортируем и типизируем моки
const mockedGetNewsCached = vi.mocked(getNewsCached);
const mockedBmList = vi.mocked(bmList);
const mockedBmHas = vi.mocked(bmHas);
const mockedBmAdd = vi.mocked(bmAdd);
const mockedBmRemove = vi.mocked(bmRemove);
const mockedOpenLink = vi.mocked(openLink);

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  // новый userEvent-инстанс на каждый тест
  user = userEvent.setup();

  // жёсткий сброс Zustand-стора между тестами
  useAppStore.getState().reset();

  // Мок IntersectionObserver (для framer-motion/анимаций)
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  //  jsdom не знает про IntersectionObserver в рантайме
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

const mockNews = [
  {
    id: '1',
    title: 'Новость про Политику',
    summary: 'Политическое событие',
    category: ['политика'],
    canonicalUrl: 'http://policy.com',
    image: 'test1.jpg',
    publishedAt: new Date().toISOString(),
    source: 'RBC',
    previewHtml: '<p>Test</p>',
  },
  {
    id: '2',
    title: 'Новость про Спорт',
    summary: 'Спортивное событие',
    category: ['спорт'],
    canonicalUrl: 'http://sport.com',
    image: 'test2.jpg',
    publishedAt: new Date().toISOString(),
    source: 'RBC',
    previewHtml: '<p>Test</p>',
  },
] as any;

describe('AppShell (Integration Test)', () => {
  // 1) skeleton-only путь (items === null, промис не резолвится)
  it('should render skeletons while items are null (covers line 55)', () => {
    const pendingPromise = new Promise(() => {});
    mockedGetNewsCached.mockReturnValue(pendingPromise as any);

    render(<AppShell />);

    expect(screen.getAllByTestId('news-card-skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { name: /Новость/i })).toBeNull();
  });

  it('should render skeletons, then data', async () => {
    let resolveGetNews: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolveGetNews = resolve;
    });
    mockedGetNewsCached.mockReturnValue(promise as any);

    render(<AppShell />);

    expect(screen.getAllByTestId('news-card-skeleton').length).toBeGreaterThan(0);

    await act(async () => {
      resolveGetNews!(mockNews);
      await promise;
    });

    expect(screen.queryByTestId('news-card-skeleton')).toBeNull();
    expect(screen.getByText('Найдено: 2')).toBeInTheDocument();
  });

  it('should filter by category (FilterBar)', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const sportButton = screen.getByRole('button', { name: 'спорт' });
    await user.click(sportButton);

    await screen.findByText('Найдено: 1');
    expect(
      screen.queryByRole('heading', { name: /Новость про Политику/i }),
    ).toBeNull();
  });

  it('should show bookmarks when toggled', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    const bookmarkItem = {
      id: '3',
      title: 'Закладка',
      category: ['культура'],
      summary: 'Тест закладки',
      canonicalUrl: 'http://bookmark.com',
      image: 'test3.jpg',
      publishedAt: new Date().toISOString(),
      source: 'RBC',
      previewHtml: '<p>Test</p>',
    } as any;

    mockedBmList.mockReturnValue([bookmarkItem]);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const toggleButton = screen.getByRole('button', { name: '☆ Закладки' });
    await user.click(toggleButton);

    await screen.findByText('Найдено: 1');
    expect(
      screen.getByRole('heading', { name: /Закладка/i }),
    ).toBeInTheDocument();
  });

  it('should show error banner on API fail and retry', async () => {
    mockedGetNewsCached.mockRejectedValue(new Error('Failed to fetch'));

    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });

    render(<AppShell />);

    const errorBanner = await screen.findByRole('alert');
    expect(errorBanner).toHaveTextContent(/Не удалось загрузить новости/i);

    const retryButton = screen.getByRole('button', { name: /Повторить/i });
    await user.click(retryButton);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should open and close reader preview', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const openButton = screen.getAllByRole('button', { name: /Открыть/i })[0];
    await user.click(openButton);

    await screen.findByTestId('reader-preview');

    const closeButton = screen.getByRole('button', { name: /Close/i });
    await user.click(closeButton);

    expect(screen.queryByTestId('reader-preview')).toBeNull();
  });

  it('should filter by search query (debounced)', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const searchbox = screen.getByRole('searchbox');
    await user.type(searchbox, 'Спорт');

    expect(screen.getByText('Найдено: 2')).toBeInTheDocument();

    await screen.findByText('Найдено: 1');
    expect(
      screen.queryByRole('heading', { name: /Новость про Политику/i }),
    ).toBeNull();
  });

  it('should handle onOpenSource from ReaderPreview (lines 65-68)', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    await user.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await user.click(
      await screen.findByRole('button', { name: 'Open Source' }),
    );

    expect(mockedOpenLink).toHaveBeenCalledWith(mockNews[0].canonicalUrl);
  });

  it('should handle onOpenSource fallback if window.open fails (line 69)', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    await user.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await user.click(
      await screen.findByRole('button', { name: 'Open Source' }),
    );

    expect(mockedOpenLink).toHaveBeenCalledWith(mockNews[0].canonicalUrl);
  });

  it('should handle onBookmark (add) from ReaderPreview (line 74)', async () => {
    mockedBmHas.mockReturnValue(false); // закладки нет
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    await user.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await user.click(
      await screen.findByRole('button', { name: 'Bookmark' }),
    );

    expect(mockedBmAdd).toHaveBeenCalledWith(mockNews[0]);
  });

  it('should handle onBookmark (remove) from ReaderPreview (line 73)', async () => {
    mockedBmHas.mockReturnValue(true); // закладка уже есть
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    await user.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await user.click(
      await screen.findByRole('button', { name: 'Bookmark' }),
    );

    expect(mockedBmRemove).toHaveBeenCalledWith(mockNews[0].id);
  });

  it('should show empty state when category filter matches no items', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const techButton = screen.getByRole('button', { name: 'технологии' });
    await user.click(techButton);

    await screen.findByText('Найдено: 0');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('should show empty state when search query matches no items', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const searchbox = screen.getByRole('searchbox');
    await user.type(searchbox, 'несуществующийзапрос');

    await screen.findByText('Найдено: 0');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('should handle multiple category filters with no matches', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const techButton = screen.getByRole('button', { name: 'технологии' });
    const cultureButton = screen.getByRole('button', { name: 'культура' });

    await user.click(techButton);
    await user.click(cultureButton);

    await screen.findByText('Найдено: 0');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('should handle combination of search and category with no matches', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);

    render(<AppShell />);
    await screen.findByText('Найдено: 2');

    const sportButton = screen.getByRole('button', { name: 'спорт' });
    await user.click(sportButton);

    const searchbox = screen.getByRole('searchbox');
    await user.type(searchbox, 'Политика');

    await screen.findByText('Найдено: 0');
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
