// src/ui/AppShell.test.tsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AppShell from './AppShell';

// Мокируем зависимости
vi.mock('../infrastructure/api-client');
vi.mock('../application/bookmarks');

// Мок ReaderPreview (со всеми 3 кнопками)
vi.mock('./ReaderPreview', () => ({
  default: ({ onOpenSource, onBookmark, onClose }: 
    { onOpenSource: () => void; onBookmark: () => void; onClose: () => void }
  ) => (
    <div data-testid="reader-preview">
      <button onClick={onOpenSource}>Open Source</button>
      <button onClick={onBookmark}>Bookmark</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// Импортируем моки (добавляем bmHas, bmAdd, bmRemove)
import { getNewsCached } from '../infrastructure/api-client';
import { list as bmList, has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks';

const mockedGetNewsCached = vi.mocked(getNewsCached);
const mockedBmList = vi.mocked(bmList);
const mockedBmHas = vi.mocked(bmHas);
const mockedBmAdd = vi.mocked(bmAdd);
const mockedBmRemove = vi.mocked(bmRemove);


// Мок IntersectionObserver (нужен для framer-motion)
beforeEach(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

const mockNews = [
  { id: '1', title: 'Новость про Политику', category: ['политика'], canonicalUrl: 'http://policy.com' },
  { id: '2', title: 'Новость про Спорт', category: ['спорт'], canonicalUrl: 'http://sport.com' },
] as any;

// ЕДИНАЯ ГРУППА ТЕСТОВ С РЕАЛЬНЫМ ВРЕМЕНЕМ
describe('AppShell (Integration Test)', () => {
  const user = userEvent.setup();

  // --- НОВЫЙ ТЕСТ ДЛЯ ПОКРЫТИЯ СТРОКИ 55 ---
  it('should render skeletons while items are null (covers line 55)', () => {
    // 1. Создаем promise, который НИКОГДА не будет выполнен
    const pendingPromise = new Promise(() => {});
    mockedGetNewsCached.mockReturnValue(pendingPromise as any);

    render(<AppShell />);
    
    // 2. Проверяем, что скелетоны 100% видны, т.к. items === null
    expect(screen.getAllByTestId('news-card-skeleton').length).toBeGreaterThan(0);
    
    // 3. Проверяем, что данные НЕ появились
    expect(screen.queryByRole('heading', { name: /Новость/i })).toBeNull();
  });

  it('should render skeletons, then data', async () => {
    // 1. Создаем promise, которым мы управляем
    let resolveGetNews: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolveGetNews = resolve;
    });
    mockedGetNewsCached.mockReturnValue(promise as any);

    render(<AppShell />);
    
    // 2. Скелетоны видны
    expect(screen.getAllByTestId('news-card-skeleton').length).toBeGreaterThan(0);

    // 3. "Отдаем" данные
    await act(async () => {
      resolveGetNews(mockNews);
      await promise; // Ждем, пока promise зарезолвится
    });

    // 4. Скелетоны исчезли
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
    expect(screen.queryByRole('heading', { name: /Новость про Политику/i })).toBeNull();
  });

  it('should show bookmarks when toggled', async () => {
    mockedGetNewsCached.mockResolvedValue(mockNews);
    const bookmarkItem = { id: '3', title: 'Закладка', category: ['культура'] } as any;
    mockedBmList.mockReturnValue([bookmarkItem]);
    render(<AppShell />);
    await screen.findByText('Найдено: 2');
    const toggleButton = screen.getByRole('button', { name: '☆ Закладки' });
    await user.click(toggleButton);
    await screen.findByText('Найдено: 1');
    expect(screen.getByRole('heading', { name: /Закладка/i })).toBeInTheDocument();
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
    expect(screen.queryByRole('heading', { name: /Новость про Политику/i })).toBeNull();
  });

  it('should handle onOpenSource from ReaderPreview (lines 65-68)', async () => {
    vi.stubGlobal('open', vi.fn());
    mockedGetNewsCached.mockResolvedValue(mockNews);
    render(<AppShell />);
    await screen.findByText('Найдено: 2');
    await userEvent.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await userEvent.click(await screen.findByRole('button', { name: 'Open Source' }));
    expect(vi.mocked(window.open)).toHaveBeenCalledWith(mockNews[0].canonicalUrl, '_blank', 'noopener,noreferrer');
  });

  it('should handle onOpenSource fallback if window.open fails (line 69)', async () => {
    vi.stubGlobal('open', vi.fn(() => { throw new Error('Popup blocked'); }));
    vi.stubGlobal('location', { assign: vi.fn() });
    mockedGetNewsCached.mockResolvedValue(mockNews);
    render(<AppShell />);
    await screen.findByText('Найдено: 2');
    await userEvent.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await userEvent.click(await screen.findByRole('button', { name: 'Open Source' }));
    expect(vi.mocked(window.location.assign)).toHaveBeenCalledWith(mockNews[0].canonicalUrl);
  });

  it('should handle onBookmark (add) from ReaderPreview (line 74)', async () => {
    mockedBmHas.mockReturnValue(false); // Закладки нет
    mockedGetNewsCached.mockResolvedValue(mockNews);
    render(<AppShell />);
    await screen.findByText('Найдено: 2');
    await userEvent.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await userEvent.click(await screen.findByRole('button', { name: 'Bookmark' }));
    expect(mockedBmAdd).toHaveBeenCalledWith(mockNews[0]);
  });

  it('should handle onBookmark (remove) from ReaderPreview (line 73)', async () => {
    mockedBmHas.mockReturnValue(true); // Закладка УЖЕ ЕСТЬ
    mockedGetNewsCached.mockResolvedValue(mockNews);
    render(<AppShell />);
    await screen.findByText('Найдено: 2');
    await userEvent.click(screen.getAllByRole('button', { name: /Открыть/i })[0]);
    await userEvent.click(await screen.findByRole('button', { name: 'Bookmark' }));
    expect(mockedBmRemove).toHaveBeenCalledWith(mockNews[0].id);
  });
});
