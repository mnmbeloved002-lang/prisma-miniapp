# ADR-003 — zero-touch content pipeline (no editor, pr-only bot)

**status:** accepted  
**date:** 2025-11-07

## context
После Фазы 0/1 контент мини-аппа формируется автоматически с сайта: никакой админки/ручных POST. Нужен надёжный и наблюдаемый конвейер: сбор → нормализация → валидация → PR → merge → бэкап → integrity.

## decision
- PR с контентом создаёт **только бот** (cron + fetch + normalize).
- Любые изменения контента проходят через **compliance-чек** и merge-политику.
- На merge выполняются **бэкап** и запись в **content integrity chain**.
- Мини-апп читает **единый** `public/news.json`, соответствующий контракту.

## scope / non-goals
- В scope: авто-парсинг, валидация, PR-бот, бэкапы, integrity, телеметрия.
- Вне scope: любая админ-панель/ручные редактирования.

## data contract (reference)
См. `docs/schema/news.schema.json` и `docs/schema/NEWS-DATA-CONTRACT.md`:
`id(uuid), title(10–180, no HTML), preview(≤240, no HTML), tags(1–5), date(ISO8601 UTC …Z), url(https://); уникальность id/url/title+date; сортировка DESC.`

## security & process
- Защищённые ветки; прямой push в `main` запрещён.
- PR-policy: ветка `bot/autofetch-YYYYMMDD-HHMM`, allow-list файлов.

## reliability
- Бэкап при каждом merge + nightly архив, **RTO ≤ 5 мин**, **RPO ≤ 24 ч**.
- Integrity chain — SHA-256 `public/news.json` на каждый merge.

## kpis
only-bot PR = 100% • validations = 100% • стабильный TTFPR • 0 обходов процесса.

## consequences
(+) Автоматизация, воспроизводимость, быстрый откат.  
(–) Требуется поддержка парсеров и CI-инфраструктуры.
