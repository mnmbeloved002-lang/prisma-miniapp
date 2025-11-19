# STATE MANAGEMENT — PRISMA RITUAL AI ECOSYSTEM (ERL-39/41/43/44)

**Единый глобальный стор — Zustand 4.5.5 + persist + encrypt**

## Срезы store под Prisma Ritual AI (ERL-44 SHOULD)

| Ключ              | Тип          | Описание |
|-------------------|--------------|----------|
| filters           | string[]     | Активные теги/категории ритуалов |
| sortOrder         | 'date'|'energy' | Сортировка |
| viewMode          | 'list'|'card' | Режим отображения |
| showBookmarks     | boolean      | Показывать только сохранённые ритуалы |
| ttsEnabled        | boolean      | Глобальный TTS on/off |
| darkMode          | boolean      | Синхрон с Telegram |
| selectedRitualId  | string | null | ID текущего открытого ритуала |
| streak            | number       | Текущий стрик дней (для TON-дропов) |
| userProfile       | { zodiac: string, mood: string } | Профиль для персонализации ритуала |
| dailyRitualId     | string | null | ID ритуала на сегодня (для пуша 8:00) |

**Запрещено**  
- useState для любого из этих ключей в UI  
- Хранение данных ритуалов в store — только в domain/infrastructure

Обновлено: 2025-11-20
