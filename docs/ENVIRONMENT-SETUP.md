# ENVIRONMENT SETUP — PRISMA RITUAL AI ECOSYSTEM
Версия: 1.0 • Дата фиксации: 2025-11-19 23:35 CET • Хэш коммита: <будет после коммита>

## 1. Хост-система (SOLO_DEVELOPER)
- ОС: Windows 11 Pro 24H2 (build 26100.xxx)
- Подсистема: WSL2 + Ubuntu 24.04 LTS (kernel 5.15.153.1-microsoft-standard-WSL2)
- Docker Desktop for Windows 4.36.0 (WSL2 backend)

## 2. Контейнер (Dockerfile в корне репозитория)
FROM node:20.18.0-bookworm-slim
RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

## 3. Версии ПО внутри контейнера (фиксированы навсегда)
- Node.js            20.18.0
- pnpm               9.11.0
- React              18.3.1
- Vite               5.4.8
- TypeScript         5.6.2
- Zod                3.23.8
- Zustand            4.5.5
- TailwindCSS        3.4.14 / 4.0-preview
- Playwright         1.48.0
- Vitest             2.1.2
- Telegraf           4.16.3 (для бота)
- Grok/Claude API    free-tier 2025 (1M+ токенов/день)

## 4. Запуск проекта (3 команды)
git clone https://github.com/mnmbeloved002-lang/prisma-miniapp.git
cd prisma-miniapp
docker build -t prisma-ritual:latest . && docker run -d -p 3000:3000 --name prisma-ritual prisma-ritual:latest
# Miniapp → http://localhost:3000

## 5. CI/CD
GitHub Actions ubuntu-24.04 • Node.js 20.x • pnpm 9 • L0-L2 контуры

## 6. Деплой
Vercel.com (free tier) — автоматический из main

Этот файл обновляется только через ADR при смене мажорных версий.
