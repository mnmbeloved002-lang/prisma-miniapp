# 🎮 Городской Убийца — Telegram Mini App

> Пошаговая детективная игра на двоих  
> React 19 • TypeScript 5.6 • Vite 5.4 • Telegram SDK 3.x

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 О игре

**Городской убийца** — адаптация настольной детективной игры для Telegram Mini App.

### Роли
- **🔪 Убийца** — совершает убийства по тайному мотиву, запугивает свидетелей
- **🕵️ Детектив** — расследует преступления, допрашивает жителей, ищет улики

### Механики
- 16 кварталов (4×4), 20 жителей, 4 типа зданий
- Система мотивов (жадность, зависть, месть и др.)
- Допросы с логикой правды/лжи
- Слежка и запугивание

## 🛠 Технологический стек

### Core
- **React 19** — UI библиотека
- **TypeScript 5.6** — Типизация
- **Vite 5.4** — Сборщик
- **Zustand 5** — State management
- **Tailwind CSS 4** — Стили

### Telegram
- **@telegram-apps/sdk-react** — Telegram SDK
- **@telegram-apps/telegram-ui** — UI компоненты

### Quality Tools
- **Biome** — Linter & Formatter
- **Vitest** — Unit тесты
- **Playwright** — E2E тесты

## 📦 Установка
```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Тесты
npm test
```

## �� Качество кода
```bash
# Unit тесты
npm test

# С покрытием
npm run test:cov

# Линтинг
npm run lint

# Проверка типов
npm run typecheck

# Полная проверка
npm run verify
```

## 📁 Структура проекта
```
src/
├── modules/city-mystery/     # 🎮 ИГРА
│   ├── application/          # Zustand store
│   ├── data/                 # Движок, типы, константы
│   │   └── engine/           # Логика допроса, слежки
│   └── ui/                   # React компоненты
│       ├── ActionPanel/
│       ├── InterrogationModal/
│       ├── GameBoard.tsx
│       └── ...
├── ui/                       # Общие UI компоненты
├── infrastructure/           # Telegram SDK, Sentry
└── App.tsx                   # Точка входа
```

## 📊 Статус разработки

| Метрика | Значение |
|---------|----------|
| Тестов | 59 ✅ |
| Строк кода | ~5,500 |
| Bundle JS | 95KB (gzip) |
| Bundle CSS | 8.5KB (gzip) |

### ✅ Реализовано
- Игровой движок с фазами (Убийца → Детектив → Город)
- Система мотивов и проверка убийств
- Допросы с логикой правды/лжи
- Слежка ("можешь ли убить?")
- Запугивание жителей
- 4 типа зданий (полиция, больница, закусочная, пожарная)
- Перемещение детектива

### 🚧 В разработке
- Фаза города (перемещение по фракциям)
- Финальное обвинение
- Мультиплеер

## 🚀 Деплой

Проект готов к деплою на:
- **Vercel** (рекомендуется)
- **Netlify**
- **Cloudflare Pages**

## 📝 Лицензия

MIT License

---

**Made with ❤️ for Telegram Mini Apps**
