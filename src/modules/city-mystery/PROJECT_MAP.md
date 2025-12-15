# City Mystery — Полная карта проекта

## Структура `/src/modules/city-mystery/`

---

### 📁 `ai/` — Искусственный интеллект

| Файл | Описание |
|------|----------|
| `index.ts` | Экспорты AI модулей |
| `KillerAI.ts` | AI логика убийцы (выбор жертв, запугивание) |
| `DetectiveAI.ts` | AI логика детектива (допросы, перемещение) |
| `simulation.ts` | Симуляция игры AI vs AI для тестирования правил |

---

### 📁 `data/` — Данные и типы

| Файл | Описание |
|------|----------|
| `gameTypes.ts` | **Главный!** Все TypeScript типы: SetupState, GameState, Motive, Faction, PlayerRole, SetupPhase |
| `gameConstants.ts` | Константы: MOTIVE_CARDS (12), DEFAULT_BUILDINGS (8), CENTRAL_DISTRICTS, ALL_MOTIVES |
| `citizens.ts` | Массив `allCitizens` — все жители с характеристиками (role, gender, age, build, height, faction) |
| `districts.ts` | Данные о кварталах (позиции, соседи) |
| `gameRules.ts` | Дополнительные правила игры |
| `gameRules.test.ts` | Тесты правил |
| `gameHelpers.test.ts` | Тесты хелперов |
| `motiveConditions.test.ts` | Тесты условий мотивов |

---

### 📁 `data/rules/` — Игровая логика (чистые функции)

| Файл | Описание |
|------|----------|
| `index.ts` | Экспорты всех правил |
| `setup.ts` | **Главный!** Настройка игры: createSetupState, selectMode/Role, placeCitizen, selectKillerIdentity, nextSetupPhase, setupToGameState |
| `setup.test.ts` | Тесты настройки (31 тест) |
| `init.ts` | Инициализация GameState |
| `killer.ts` | Логика убийцы: frighten, kill, разбегание жителей |
| `killer.test.ts` | Тесты убийцы |
| `detective.ts` | Логика детектива: interrogate, useBuilding, move, finalAccusation |
| `detective.test.ts` | Тесты детектива |
| `city.ts` | Фаза города: миграция жителей по соцгруппам |
| `city.test.ts` | Тесты фазы города |
| `phases.ts` | Переходы между фазами KILLER → DETECTIVE → CITY |
| `utils.ts` | Утилиты: shuffle, pickRandom, generateId |

---

### 📁 `data/engine/` — Игровые подсистемы

| Файл | Описание |
|------|----------|
| `index.ts` | Экспорты |
| `interrogation.ts` | Система допросов (вопросы, ответы) |
| `interrogation.test.ts` | Тесты допросов |
| `tracking.ts` | Система слежки (полиция) |
| `tracking.test.ts` | Тесты слежки |

---

### 📁 `application/` — Zustand Stores

| Файл | Описание |
|------|----------|
| `setupStore.ts` | Store настройки: setupState, actions (selectMode, placeCitizen, nextPhase, selectKillerAllies...) |
| `gameStore.ts` | Store игры: gameState, playerRole, setGameState, actions игрового процесса |
| `gameStore.test.ts` | Тесты store |

---

### 📁 `hooks/` — React хуки

| Файл | Описание |
|------|----------|
| `useTelegramApp.ts` | Инициализация Telegram Mini App SDK |

---

### 📁 `ui/` — React компоненты (корень)

| Файл | Описание | Стиль |
|------|----------|-------|
| `CityMysteryPage.tsx` | **Главная страница** — роутинг WELCOME/SETUP/GAME/GAME_OVER | — |
| `CityMysteryPage.test.tsx` | Тесты страницы | — |
| `WelcomeScreen.tsx` | Стартовый экран (дождь Canvas, молнии, нуар) | ✅ Нуар |
| `CityMap.tsx` | Игровое поле 4×4 с кварталами | ⚠️ |
| `CityGrid.tsx` | Сетка кварталов | ⚠️ |
| `CitizenCard.tsx` | Карточка жителя | ⚠️ |
| `DistrictDetailsPanel.tsx` | Панель деталей квартала | ⚠️ |
| `GameBoard.tsx` | Игровая доска | ⚠️ |
| `GameBoard.test.tsx` | Тесты доски | — |
| `GameLog.tsx` | Лог событий | ⚠️ |
| `GameLog.test.tsx` | Тесты лога | — |
| `GameOverScreen.tsx` | Экран конца игры | ⚠️ |
| `LobbyScreen.tsx` | Лобби (устаревший?) | ❌ |
| `MotiveGrid.tsx` | Сетка мотивов | ⚠️ |
| `MotiveGrid.test.tsx` | Тесты | — |
| `CityMysteryDebugBoard.tsx` | Дебаг-доска для разработки | — |

---

### 📁 `ui/Setup/` — Wizard настройки игры

| Файл | Описание | Стиль |
|------|----------|-------|
| `index.ts` | Экспорты | — |
| `SetupWizard.tsx` | **Оркестратор** — KILLER_PHASES / DETECTIVE_PHASES, renderStep() | ✅ |
| `SetupLayout.tsx` | Общий layout (текстура, виньетка, заголовок, footer) | ✅ |
| `SelectModeStep.tsx` | Логика / Интуиция | ✅ Нуар |
| `SelectPlayModeStep.tsx` | PvE / PvP | ✅ Нуар |
| `SelectRoleStep.tsx` | Убийца / Детектив + сложность AI | ✅ Нуар |
| `SelectMotivesStep.tsx` | Выбор 6 мотивов из 12 (сетка 4×3) | ✅ Нуар |
| `PopulationStep.tsx` | Инфо: 20 жителей в колоде | ✅ Нуар |
| `InfrastructureStep.tsx` | Инфо: расположение 8 зданий | ✅ Нуар (TODO: убрать легенду) |
| `WaitingDetectiveStep.tsx` | Ожидание AI-детектива | ✅ Нуар |
| `SelectKillerStep.tsx` | Выбор личности (20 карт) | ⚠️ Переделать! |
| `SelectKillerMotiveStep.tsx` | Выбор мотива из 6 | ✅ Нуар |
| `SelectAlliesStep.tsx` | Выбор союзников (3→1) | ✅ Нуар |
| `KillerNotebookStep.tsx` | Финальное досье → Старт! | ✅ Нуар |
| `PlaceCitizensStep.tsx` | Детектив расставляет 20 жителей | ⚠️ Проверить |
| `PlaceBuildingsStep.tsx` | Расстановка зданий (не используется?) | ❓ |
| `PlaceDetectiveStep.tsx` | Детектив ставит фишку | ⚠️ Проверить |
| `SetupReadyStep.tsx` | Готовность детектива → Старт! | ⚠️ Проверить |
| `CitizenBadge.tsx` | Компактный бейдж жителя | ⚠️ |

---

### 📁 `ui/ActionPanel/` — Панель действий в игре

| Файл | Описание |
|------|----------|
| `index.tsx` | Главный компонент панели |
| `index.test.tsx` | Тесты |
| `KillerActions.tsx` | Действия убийцы (запугать, убить) |
| `DetectiveActions.tsx` | Действия детектива (допрос, здание, движение) |
| `GameStats.tsx` | Статистика игры (раунд, жертвы) |
| `PhaseInfo.tsx` | Информация о текущей фазе |

---

### 📁 `ui/InterrogationModal/` — Модалка допроса

| Файл | Описание |
|------|----------|
| `index.tsx` | Главный компонент модалки |
| `QuestionSelector.tsx` | Выбор вопроса для допроса |

---

## Флоу настройки (Setup Phases)

### Убийца (KILLER_PHASES) — 11 шагов:
```
SELECT_MODE → SELECT_PLAY_MODE → SELECT_ROLE → SELECT_MOTIVES → 
POPULATION → INFRASTRUCTURE → WAITING_DETECTIVE → SELECT_KILLER → 
SELECT_MOTIVE → SELECT_ALLIES → KILLER_NOTEBOOK
```

### Детектив (DETECTIVE_PHASES) — 9 шагов:
```
SELECT_MODE → SELECT_PLAY_MODE → SELECT_ROLE → SELECT_MOTIVES → 
POPULATION → INFRASTRUCTURE → PLACE_CITIZENS → PLACE_DETECTIVE → READY
```

---

## Ключевые типы (gameTypes.ts)
```typescript
type GameMode = 'LOGIC' | 'INTUITION';
type PlayMode = 'PVE' | 'PVP';
type PlayerRole = 'KILLER' | 'DETECTIVE';
type AIDifficulty = 'EASY' | 'NORMAL' | 'HARD';

type SetupPhase = 'SELECT_MODE' | 'SELECT_PLAY_MODE' | 'SELECT_ROLE' | 
  'SELECT_MOTIVES' | 'POPULATION' | 'INFRASTRUCTURE' | 'WAITING_DETECTIVE' |
  'SELECT_KILLER' | 'SELECT_MOTIVE' | 'SELECT_ALLIES' | 'KILLER_NOTEBOOK' |
  'PLACE_CITIZENS' | 'PLACE_DETECTIVE' | 'READY';

type Motive = 'MANIAC' | 'SADIST' | 'HEADHUNTER' | 'VIGILANTE' | 'KILLER' | 
  'TERRORIST' | 'PSYCHOPATH' | 'CANNIBAL' | 'RADICAL' | 'ROBBER' | 'SPY' | 'CULTIST';

type Faction = 'WORKERS' | 'LAW' | 'CRIME' | 'PRESS' | 'MEDICINE' | 
  'MIGRANTS' | 'POWER' | 'BOHEMIA' | 'MARGINALS' | 'OFFICIALS' | 
  'CIVILIANS' | 'CRIMINALS' | 'CLERGY' | 'OUTSIDERS' | 'BOURGEOIS' | 'INTELLIGENTSIA';
```

---

## Баги / TODO

### Высокий приоритет:
- [ ] SelectKillerStep — переделать стиль под нуар (20 карточек, много скролла)
- [ ] Игровое поле — сделать отдельным модульным компонентом
- [ ] Флоу детектива — полностью не тестировался

### Средний приоритет:
- [ ] InfrastructureStep — убрать дублирующую легенду снизу
- [ ] MARGINALS → перевести на "Маргиналы" в citizens.ts
- [ ] Фракции в citizens.ts не совпадают с Faction type (разные наборы)

### Низкий приоритет:
- [ ] LobbyScreen.tsx — удалить если не используется
- [ ] PlaceBuildingsStep.tsx — проверить нужен ли

---

## Стек технологий

- **React 18** + TypeScript
- **Zustand** — state management
- **Tailwind CSS** — стили
- **Vite** — сборка
- **Vitest** — тесты
- **Telegram Mini App SDK** — интеграция

---

## Полезные команды
```bash
npm run dev              # Dev сервер
npm run build            # Сборка
npm test -- --run src/modules/city-mystery  # Тесты модуля
git commit -m "..." --no-verify  # Коммит без линтера
```
