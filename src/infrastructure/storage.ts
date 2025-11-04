export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null; // parse/JSON/localStorage error → тихий фолбэк
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      void 0; // quota/offline — игнорируем
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      void 0; // приватный режим/ограничения — игнорируем
    }
  },
};
