# PR Bot Policy — Phase 2 / Step 1.3

## назначение
Единые правила контент-PR, создаваемых ботом.

## имя ветки
- `bot/autofetch-YYYYMMDD-HHMM` (UTC), напр.: `bot/autofetch-20251107-0630`.

## заголовок PR
- `autofetch: update news.json (YYYY-MM-DD HH:MM UTC)`

## метки PR
- `content`, `autofetch`

## allow-list файлов
- `public/news.json` — обязателен
- (опц.) `docs/fetch/REPORT.md` — краткая сводка
Любые другие файлы — ❌ FAIL (Content Compliance).

## ограничение по диффу
- суммарный diff ≤ 500 KiB → иначе ❌ FAIL.

## конкурентность
- допускается только один открытый контент-PR.
- при наличии открытого PR новый прогон делает NO-OP.

## коммит в PR
- один коммит:
  - `chore(content): autofetch news (YYYY-MM-DD HH:MM UTC) [phase-2/autofetch]`

## тело PR — сводка
- Added/Updated/Deduped, размер `public/news.json` (KiB)
- Checks: schema / UTC(Z) / https / DESC / allow-list / diff≤500KiB
- Sources: по каждому — новые/фильтр/ошибки
- TTFPR (fetch → PR)
- Итог: ✅ PASS / ⚠️ WARN / ❌ FAIL + причины при FAIL.

## merge-политика
- auto-merge при зелёных чеках (squash/rebase — по политике репо).
- при WARN — вручную.

## безопасность
- токен бота с минимальными правами (create/update PR).
- секреты не выводим в отчёты/логи.

## аудит
- ссылки на CI-джобы и источники данных; сводки доступны ретроспективе.
