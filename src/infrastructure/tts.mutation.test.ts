import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function setupSpeechSynthesis() {
  const cancel = vi.fn();
  const speak = vi.fn();

  class FakeUtterance {
    text: string;

    constructor(text: string) {
      this.text = text;
    }
  }

  (window as unknown as { speechSynthesis?: unknown }).speechSynthesis = {
    cancel,
    speak,
  };
  (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance =
    FakeUtterance as unknown;

  return { cancel, speak, FakeUtterance };
}

function clearSpeechSynthesis() {
  delete (window as { speechSynthesis?: unknown }).speechSynthesis;
  delete (window as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance;
}

describe('application TTS integration (mutation)', () => {
  beforeEach(() => {
    vi.resetModules();
    clearSpeechSynthesis();
  });

  afterEach(() => {
    clearSpeechSynthesis();
    vi.restoreAllMocks();
  });

  it('returns false and stays safe when speech synthesis is unavailable', async () => {
    const { isSupported, stop, speakFromHtml } = await import('./tts');

    expect(isSupported()).toBe(false);
    await expect(speakFromHtml('Title', '<p>Body</p>')).resolves.toBeUndefined();
    expect(() => stop()).not.toThrow();
  });

  it('uses window.speechSynthesis and builds correct utterance text', async () => {
    const { cancel, speak, FakeUtterance } = setupSpeechSynthesis();
    const tts = await import('./tts');

    expect(tts.isSupported()).toBe(true);

    await tts.speakFromHtml('Ritual title', '<p>Hello <strong>world</strong></p>');

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);

    const utterArg = speak.mock.calls[0][0] as InstanceType<typeof FakeUtterance>;
    expect(utterArg).toBeInstanceOf(FakeUtterance);
    expect(utterArg.text).toBe('Ritual title. Hello world');
  });

  it('does not call speak when cleaned text is empty', async () => {
    const { speak } = setupSpeechSynthesis();
    const tts = await import('./tts');

    await tts.speakFromHtml('', '   <div>   </div>  ');

    expect(speak).not.toHaveBeenCalled();
  });

  it('swallows cancel/speak errors and logs them', async () => {
    const cancel = vi.fn(() => {
      throw new Error('cancel-fail');
    });
    const speak = vi.fn(() => {
      throw new Error('speak-fail');
    });

    class FakeUtterance {
      text: string;

      constructor(text: string) {
        this.text = text;
      }
    }

    (window as unknown as { speechSynthesis?: unknown }).speechSynthesis = {
      cancel,
      speak,
    };
    (window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance =
      FakeUtterance as unknown;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const tts = await import('./tts');
    await tts.stop();
    await tts.speakFromHtml('Title', '<p>Body</p>');

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
