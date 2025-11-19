# STATE MANAGEMENT — PRISMA RITUAL AI ECOSYSTEM (ERL-39 MUST)

Выбран единый глобальный стор: **Zustand 4.5.5** + persist middleware + encrypt

## Почему Zustand
- Zero-cost (0 KB gzipped)
- Нет boilerplate (в отличие от Redux)
- Полная типизация TS
- persist + encrypt (для закладок и фильтров в Telegram CloudStorage)
- Идеально для Miniapp (быстрый, лёгкий)

## Структура стора
src/application/store/appStore.ts

- UI-стейт: фильтры, режимы, модалки
- Data-кэш: React Query / SWR (отдельный слой)
- Локальный стейт компонентов — useState (модалки)

## Запрещено
- Redux / MobX / Context API для глобального состояния
- useState для данных, которые живут дольше компонента

Обновлено: 2025-11-20

## Глобальный UI-стейт (ERL-41 MUST)
В Zustand хранятся только ключевые флаги:
- filters, sortOrder, viewMode
- showBookmarks
- ttsEnabled, darkMode
- selectedNewsId и т.д.

Локальный стейт (useState) — только для модалок и временных вещей.

## Данные контента (ERL-42 MUST)
- news.json / rituals.json / любой модуль-контент — только в infrastructure → domain → application/store
- Запрещено useState для данных контента в UI-компонентах
- Допустимо только селекторы из Zustand

## Локальный стейт (ERL-43 SHOULD)
- useState используется ТОЛЬКО для локальных UI-деталей:
  - модалки
  - раскрытие/свёртывание
  - формы ввода
  - анимации
  - scroll-position
- Запрещено useState для данных контента, фильтров, закладок, TTS и т.д.
