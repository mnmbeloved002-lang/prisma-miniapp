# ADR-003 — zero-touch content pipeline (no editor, pr-only bot)

**status:** accepted  
**date:** 2025-11-07

## context
Контент формируется автоматически: сбор → нормализация → валидация → PR → merge → бэкап → integrity.

## decision
- Контент-PR создаёт только бот (cron + fetch + normalize).
- Все изменения проходят compliance-гейт и merge-политику.
- На merge: бэкап + запись в content integrity chain.
- Мини-апп читает единый `public/news.json` по контракту.

## scope / non-goals
В scope: авто-парсинг, валидация, PR-бот, бэкапы, integrity, телеметрия.  
Не в scope: админка/ручные правки.

## references
- `docs/schema/news.schema.json`
- `docs/qa/LOCAL-VALIDATION.md`
- `docs/runbooks/*`
- `docs/ci/*`
