# Mapping Rules — Phase 2 / Step 1.2

Цель: привести сырой контент (RSS/API/HTML) к контракту:
`id(uuid) · title(10–180, no HTML) · preview(≤240, no HTML) · tags(1–5) · date(ISO8601 UTC …Z) · url(https://)` + сортировка DESC.

## Поля и преобразования
- **title → title**: trim, collapse whitespace, decode entities; удалить `<` и `>`; длина 10..180 (длинные — обрезать по слову + `…`).
- **description/summary/og:description → preview**: текст без HTML; ≤ 240 (обрезать по слову + `…`); если нечего — поле опустить.
- **categories/section → tags**: маппинг в наш словарь (см. TAG-MAPPING.md), 1..5 тегов, 2..24 символа, дедуп и нормализация регистра.
- **pubDate/published_at/created → date**: распарсить с TZ источника → UTC ISO8601 c суффиксом `Z`; не парсится — запись отбросить.
- **link/url/guid.url → url**: только `https://`; убрать `#fragment`, нормализовать `www`; вычистить `utm_*`, `fbclid`, `gclid`, `yclid`, `utm_id`, `mc_*`, `ref`, `ref_`; унифицировать завершающий `/`.
- **id (UUID)**: если есть GUID источника → `uuid5(namespace, canonicalUrl|UTC-date|source-guid)`, иначе → `uuid5(namespace, canonicalUrl|UTC-date)`.

## Дедуп и порядок
- Дубликаты: по `url` ИЛИ `id` ИЛИ паре `title+date` — выбрасываем младшую/хуже заполненную.
- После объединения — сортировка по `date` **DESC**.

## Вне контракта
Поля вроде `image`, `source` оставлять только во временных артефактах (`data/news_raw.json`, `data/news_auto.json`), **не** в `public/news.json`.

## Пороговые правила для Compliance
- запрет HTML в `title/preview`; `date` обязательно UTC с `Z`; `url` только `https://`;
- лимит diff `public/news.json` по умолчанию 500 KiB;
- «0 записей» — WARN (если SLA допускает тишину).
