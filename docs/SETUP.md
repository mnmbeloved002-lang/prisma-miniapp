# SETUP — Dev Environment (Devcontainer)

## 1. Требования

- VS Code
- Расширение "Dev Containers"
- Docker (WSL2 на Windows 11)

## 2. Первый запуск

1. Клонировать репозиторий:

   ```bash
   git clone git@github.com:<your-org>/prisma-miniapp.git
   cd prisma-miniapp
Открыть папку в VS Code и выполнить:

Dev Containers: Reopen in Container

Дождаться выполнения postCreateCommand:

глобальный pnpm

установка chromium

установка osv-scanner

установка браузера для Playwright

3. Базовые команды
Внутри контейнера:

bash
Копировать код
pnpm install
pnpm dev           # локальный дев-сервер
pnpm validate:all  # полный L4 quality gate перед любым PR
Все остальные команды описаны в docs/ENGINEERING.md.
