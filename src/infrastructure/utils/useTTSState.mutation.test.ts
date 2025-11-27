import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const isSupportedMock = vi.fn<[], boolean>();
const speakFromHtmlMock = vi.fn<[string, string], Promise<void>>();
const stopMock = vi.fn<[], void>();

vi.mock('../tts', () => ({
  isSupported: isSupportedMock,
  speakFromHtml: speakFromHtmlMock,
  stop: stopMock,
}));

describe('useTTSState mutation', () => {
  beforeEach(() => {
    isSupportedMock.mockReset();
    speakFromHtmlMock.mockReset();
    stopMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports canTTS false when TTS is not supported', async () => {
    isSupportedMock.mockReturnValue(false);
    const { useTTSState } = await import('./useTTSState');

    const { result } = renderHook(() => useTTSState());

    expect(result.current.canTTS).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
  });

  it('start delegates to speakFromHtml when supported and resets isSpeaking after completion', async () => {
    isSupportedMock.mockReturnValue(true);
    speakFromHtmlMock.mockResolvedValue(undefined);

    const { useTTSState } = await import('./useTTSState');
    const { result } = renderHook(() => useTTSState());

    expect(result.current.canTTS).toBe(true);
    expect(result.current.isSpeaking).toBe(false);

    await act(async () => {
      await result.current.start('Title', '<p>Body</p>');
    });

    expect(speakFromHtmlMock).toHaveBeenCalledWith('Title', '<p>Body</p>');
    expect(result.current.isSpeaking).toBe(false);
  });

  // [UEC ADDITION]: Тест проверяет состояние ВО ВРЕМЯ выполнения, убивая мутанта setIsSpeaking(true -> false)
  it('sets isSpeaking to true while speaking', async () => {
    isSupportedMock.mockReturnValue(true);
    let finishSpeak: () => void;
    const speakPromise = new Promise<void>((resolve) => {
      finishSpeak = resolve;
    });
    speakFromHtmlMock.mockReturnValue(speakPromise);

    const { useTTSState } = await import('./useTTSState');
    const { result } = renderHook(() => useTTSState());

    expect(result.current.isSpeaking).toBe(false);

    let promise: Promise<void>;
    await act(async () => {
      promise = result.current.start('Title', 'Text');
    });

    // В этот момент промис еще висит, состояние должно быть true
    expect(result.current.isSpeaking).toBe(true);

    await act(async () => {
      finishSpeak();
      await promise;
    });

    expect(result.current.isSpeaking).toBe(false);
  });

  // [UEC ADDITION]: Убивает мутанта, удаляющего if (!canTTS) return
  it('start does not update state or call speak if canTTS is false', async () => {
    isSupportedMock.mockReturnValue(false);
    const { useTTSState } = await import('./useTTSState');
    const { result } = renderHook(() => useTTSState());

    // Пытаемся запустить
    await act(async () => {
      await result.current.start('Title', 'Text');
    });

    // Если бы проверка !canTTS была удалена, состояние переключилось бы (или упало)
    expect(result.current.isSpeaking).toBe(false);
    expect(speakFromHtmlMock).not.toHaveBeenCalled();
  });

  it('halt and unmount call stop to ensure playback is halted', async () => {
    isSupportedMock.mockReturnValue(true);

    const { useTTSState } = await import('./useTTSState');
    const { result, unmount } = renderHook(() => useTTSState());

    await act(async () => {
      await result.current.start('Title', '<p>Body</p>');
    });

    act(() => {
      result.current.halt();
    });

    const callsAfterHalt = stopMock.mock.calls.length;
    expect(callsAfterHalt).toBeGreaterThan(0);
    expect(result.current.isSpeaking).toBe(false);

    unmount();

    expect(stopMock.mock.calls.length).toBeGreaterThan(callsAfterHalt);
  });
});

it('re-evaluates canTTS when isSupported changes (kills [canTTS] -> [] mutation)', async () => {
  // Сначала TTS не поддерживается
  isSupportedMock.mockReturnValue(false);

  const { useTTSState } = await import('./useTTSState');
  const { result, rerender } = renderHook(() => useTTSState());

  expect(result.current.canTTS).toBe(false);

  // Меняем mock - теперь TTS поддерживается
  isSupportedMock.mockReturnValue(true);

  // Re-render хука
  rerender();

  // Критично: canTTS должен обновиться на true
  // Если dependency array пустой ([]), это не сработает
  expect(result.current.canTTS).toBe(true);
});

it('cleanup effect calls stop on unmount regardless of dependencies (kills dependency mutation)', async () => {
  isSupportedMock.mockReturnValue(true);
  speakFromHtmlMock.mockResolvedValue(undefined);

  const { useTTSState } = await import('./useTTSState');
  const { result, unmount } = renderHook(() => useTTSState());

  // Запускаем TTS
  await act(async () => {
    await result.current.start('Title', 'Text');
  });

  const stopCallsBefore = stopMock.mock.calls.length;

  // Размонтируем компонент
  unmount();

  // Критично: stop должен быть вызван cleanup-функцией
  // Мутация dependency array ["Stryker"] не должна ломать это поведение
  expect(stopMock.mock.calls.length).toBeGreaterThan(stopCallsBefore);
});
