# CONTAINER EXECUTION LOG (PRISMA RITUAL / UEC)

> Единый журнал работ внутри контейнера:
> - что делали;
> - какие команды запускали;
> - какой результат получили (включая ошибки);
> - как исправили.

---

## 0. МЕТА

- Проект: PRISMA RITUAL (Mini App)
- Контейнер: <КРАТКОЕ ОПИСАНИЕ / ИМЯ ИМЕДЖА>
- Ответственный: <ИМЯ>
- Основная ветка: `DEV` (рабочая), `MAIN`/`PROD` (стабильная)

---

## ШАБЛОН ЗАПИСИ

Каждое действие внутри контейнера фиксируем как отдельный блок.

```text
### [ID] <Краткое название операции>

- Дата/время (UTC/локальное):
- Контекст:
  - Ветка Git:
  - Коммит (hash): 
  - Каталог: 
- Цель:
  - Что хотим проверить/изменить?

#### 1. Команды

```bash
# пример
<команда 1>
<команда 2>
2. Наблюдения (сырые факты)
Вывод/ошибки (кратко, без воды):

...

...

3. Вывод (что поняли)
Причина проблемы / результат проверки:

...

Статус:

✅ Успешно / ⚠️ Частично / ❌ Ошибка

4. Фикс / дальнейшие действия
Что сделали, чтобы исправить / улучшить:

...

Что надо сделать потом (TODO):

...

yaml
Копировать код

---

## 1. ЛОГ ЗАПИСЕЙ

### [001] Первичная проверка контейнера (sanity check)

- Дата/время:
- Контекст:
  - Ветка Git:
  - Коммит:
  - Каталог:
- Цель:
  - Проверить, что контейнер готов к работе по CHECKLIST-PLATFORM-L4-L5 (Node, pnpm, git, ресурсы).

#### 1. Команды

```bash
# здесь позже вставим:
# ./scripts/container-sanity-check.sh
2. Наблюдения
TBD

3. Вывод
TBD

4. Фикс / TODO
TBD


---

## 2025-11-24 — Dev Container Toolchain Snapshot

**Context**

- Branch: `dev`
- Container: `mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye`
- Node: установлено в контейнере базовым образом

**Commands used**

```bash
pnpm -v
chromium --version || chromium-browser --version
osv-scanner --version
node -v
pnpm biome --version
pnpm vitest --version
pnpm exec playwright --version
pnpm tsc --version
git --version
Resolved versions

Tool / Binary	Version / Output	Notes
node	v22.16.0	Runtime для всего проекта
pnpm	10.20.0	Пакетный менеджер
biome	2.3.7	Lint + форматтер
vitest	4.0.4	Unit / интеграционные тесты
playwright	1.56.1	E2E + a11y + визуальные тесты
tsc	5.9.3	TypeScript компилятор
git	2.49.0	VCS
chromium	120.0.6099.224 (Debian 11.8/11.11)	Браузер для Playwright
osv-scanner	2.3.0 (osv-scalibr 0.4.0)	SCA / security scan

Devcontainer config (reference)

Источник: .devcontainer/devcontainer.json:

Image: mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye

Post-create steps:

npm install -g pnpm

apt-get install -y chromium

установка osv-scanner

pnpm exec playwright install chromium

Guarantee

Этот снапшот фиксирует фактическое состояние инструментов, на котором успешно прошёл pnpm validate:all (lint, typecheck, test:ci, e2e, a11y, size).

