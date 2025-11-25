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
