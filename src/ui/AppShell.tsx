import { useEffect } from 'react';
import { useRitualStore } from '../application/ritual-store';
import { Header } from './Header';
import { RitualCard } from './RitualCard';

export function AppShell(): JSX.Element {
  const { ritualItem, loading, error, fetchRitual } = useRitualStore();

  useEffect(() => {
    // При первом монтировании сразу тянем данные ритуала
    void fetchRitual();
  }, [fetchRitual]);

  return (
    <div className="app-shell">
      <Header />
      <main>
        {loading && <p aria-busy="true">Загрузка...</p>}

        {error && (
          <div role="alert">
            <p>Ошибка: {error}</p>
            <button
              type="button"
              onClick={() => {
                void fetchRitual();
              }}
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && ritualItem && <RitualCard item={ritualItem} />}
      </main>
    </div>
  );
}

// biome-ignore lint/style/noDefaultExport: оставляем default-экспорт для совместимости с существующими импортами и тестами
export default AppShell;
