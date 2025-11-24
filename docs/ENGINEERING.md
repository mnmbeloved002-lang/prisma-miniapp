# Prisma Ritual AI — ENGINEERING GUIDE (L4 PLATFORM)

## 1. Environment & Tooling

- Devcontainer:
  - Image: `mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye`
- Node:
  - Runtime: `v22.16.0`
- Package Manager:
  - pnpm: `10.20.0`
- Tooling (dev/test):
  - Biome: `2.3.7`
  - TypeScript (tsc): `5.9.3`
  - Vitest: `4.0.4`
  - Playwright: `1.56.1`
- Browser & Security:
  - Chromium: `120.0.6099.224` (Debian 11)
  - osv-scanner: `2.3.0`

## 2. Core NPM scripts

- Lint:
  - `pnpm lint` → Biome (`biome check ./src api`)
- Typecheck:
  - `pnpm typecheck` → `tsc --noEmit`
- Unit / integration tests:
  - `pnpm test:ci` → Vitest + coverage
- E2E:
  - `pnpm e2e:smoke` → Playwright smoke
  - `pnpm e2e:a11y` → Playwright + axe (a11y)
  - `pnpm e2e:visual` → визуальные снапшоты
- Size:
  - `pnpm size` → size-limit (bundle size)
- Aggregate gate:
  - `pnpm validate:all` →  
    `pnpm lint && pnpm typecheck && pnpm test:ci && pnpm e2e:smoke && pnpm e2e:a11y && pnpm size`

## 3. Local Workflow (before PR)

Для любого PR в `dev` (и тем более в `main`):

1. Обновить зависимости при необходимости:
   - `pnpm install`
2. Запустить единый gate:
   - `pnpm validate:all`
3. Убедиться, что:
   - lint / typecheck / tests / e2e / a11y / size проходят без ошибок;
   - покрытие тестов соответствует целевым порогам (см. CI-репорт).
4. Только после этого:
   - коммит с осмысленным сообщением;
   - PR → `dev` / `main`.

## 4. Pre-commit hooks

- Husky:
  - `.husky/pre-commit` → запускает `lint-staged`.
- lint-staged:
  - `*.{ts,tsx,js,jsx,json,md,yml,yaml,css}` → `biome check --write`.

