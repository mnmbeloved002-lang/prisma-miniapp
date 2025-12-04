import { useEffect } from 'react';
import { useRitualStore } from '../application/ritual-store';
import { RitualCard } from './RitualCard';

export function RitualView(): JSX.Element {
  const { ritualItem, loading, error, fetchRitual } = useRitualStore();

  useEffect(() => {
    void fetchRitual();
  }, [fetchRitual]);

  return (
    <>
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
    </>
  );
}
