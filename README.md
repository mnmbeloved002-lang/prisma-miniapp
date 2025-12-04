# 🚀 Telegram Mini App Platform L5 2026

> Современная платформа разработки для Telegram Mini Apps  
> React 19 • TypeScript 5.6 • Vite 5.4 • Telegram SDK 3.x

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Особенности

- 🎯 **L5 Quality Level 2026** - Промышленный уровень качества
- ⚡️ **React 19** - Последняя версия с новыми возможностями
- 🔐 **Security First** - OSV Scanner, Gitleaks, Semgrep, Snyk
- 🧪 **100% Test Coverage** - Unit, E2E, A11y, Visual, Mutation
- 📱 **Telegram SDK** - Полная интеграция с Mini Apps API
- 🎨 **Tailwind CSS 4** - Современный дизайн
- 🔍 **Biome** - Строгий линтинг и форматирование
- 📦 **Bundle Size** - JS: 95KB (gzip), CSS: 4.6KB (gzip)

## 🛠 Технологический стек

### Core
- **React 19.2.1** - UI библиотека
- **TypeScript 5.6.3** - Типизация
- **Vite 5.4** - Сборщик
- **Zustand 5.0** - State management
- **Zod 4.1** - Schema validation

### Telegram
- **@telegram-apps/sdk-react 3.3** - Telegram SDK
- **@telegram-apps/telegram-ui 2.1** - UI компоненты

### Quality Tools
- **Biome 2.3** - Linter & Formatter
- **Vitest 4.0** - Unit тесты
- **Playwright 1.57** - E2E тесты
- **Stryker 9.3** - Mutation тесты
- **Size Limit 12.0** - Bundle size контроль

### Security
- **OSV Scanner** - Vulnerability scanning
- **Gitleaks** - Secret detection
- **Semgrep** - SAST анализ
- **Snyk** - Dependency audit

## 📦 Установка
```bash
# Установка зависимостей
pnpm install

# Разработка
pnpm dev

# Сборка
pnpm build

# Тесты
pnpm test

# Линтинг
pnpm lint

# Форматирование
pnpm format
```

## 🧪 Качество кода
```bash
# Полная проверка качества
pnpm quality:full

# Быстрая проверка
pnpm ci:fast

# Мутационное тестирование
pnpm mutation

# E2E тесты
pnpm e2e:quick

# Security аудит
pnpm check:security
```

## 📁 Структура проекта
```
src/
├── application/        # Бизнес-логика
│   ├── api/           # API клиенты
│   └── *-store.ts     # Zustand stores
├── domain/            # Доменные модели
├── infrastructure/    # Внешние сервисы
│   ├── sentry.ts      # Error tracking
│   ├── telegram.ts    # Telegram SDK
│   └── useTelegram.ts # React хуки
└── ui/                # React компоненты
    ├── AppShell.tsx
    ├── TelegramWelcome.tsx
    └── ErrorBoundary.tsx
```

## 🎯 Скрипты

### Разработка
- `pnpm dev` - Локальный сервер
- `pnpm dev:host` - Сервер с доступом по сети
- `pnpm dev:tunnel` - Туннель для Telegram

### Сборка
- `pnpm build` - Production сборка
- `pnpm preview` - Просмотр сборки
- `pnpm analyze` - Анализ бандла

### Тестирование
- `pnpm test` - Unit тесты
- `pnpm test:cov` - С покрытием
- `pnpm e2e` - E2E тесты
- `pnpm mutation` - Mutation тесты

### Качество
- `pnpm lint` - Проверка кода
- `pnpm format` - Форматирование
- `pnpm typecheck` - Проверка типов
- `pnpm verify` - Полная проверка

## 🔐 Безопасность

- **Gitleaks** - Детекция секретов в коде
- **OSV Scanner** - Проверка уязвимостей
- **Semgrep** - Статический анализ
- **Snyk** - Аудит зависимостей
- **Content Security Policy** - Защита от XSS

## 📊 Метрики качества

- ✅ **100% Type Coverage** - Полная типизация
- ✅ **Mutation Score > 80%** - Stryker mutation testing
- ✅ **Accessibility** - WCAG 2.1 AA
- ✅ **Performance** - Lighthouse 90+
- ✅ **Bundle Size** - < 130KB JS, < 30KB CSS

## 🚀 Деплой

Проект готов к деплою на:
- **Vercel** (рекомендуется)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 🤝 Вклад

Приветствуются Pull Requests! Следуйте правилам:
1. Используйте Conventional Commits
2. Проходите `pnpm verify` перед коммитом
3. Покрывайте тестами новый код
4. Обновляйте документацию

---

**Made with ❤️ for Telegram Mini Apps**
