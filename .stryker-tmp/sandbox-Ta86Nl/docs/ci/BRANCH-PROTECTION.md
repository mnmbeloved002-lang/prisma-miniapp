# Branch Protection Policy (Phase 2 / Step 0.6)

## Текущее рабочее правило
- Работаем **только в `dev`**, прямые коммиты разрешены до завершения Фазы 2.
- `main` остаётся защищённой (текущие required checks — без изменений).

## План включения защиты на финише Фазы 2
### main (перманентно)
- ✅ Require pull request reviews (минимум 1; для bot-PR — auto-merge по зелёным чекам).
- ✅ Require status checks to pass:
  - Verify (lint+type+build)
  - Secret Scan / Security
  - **Content Compliance (новый)**
- ✅ Require branches to be up to date before merging
- ✅ Restrict force pushes / deletions
- ✅ Require linear history (optional)

### dev (временно после приёмки)
- Цель: перевести поток на PR-модель (в том числе от ботa).
- Такой же список required checks, как на `main`.
- Прямые пуши в `dev` будут запрещены после финала Фазы 2.

## Искомая модель после Фазы 2
- Любые изменения контента -> **только PR** (в `dev`), автор — бот.
- Чеки: Verify + Security + **Content Compliance**.
- После merge в `dev` — nightly-архив и контроль целостности; далее промоут в `main`.
