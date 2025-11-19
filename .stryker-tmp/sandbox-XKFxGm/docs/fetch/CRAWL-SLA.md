# Crawl / SLA — Phase 2 / Step 1.1

## Гарантии процесса
- Запуск по расписанию (см. AUTOFETCH-SCHEDULE)
- «Один контент-PR за раз» (никакой гонки)
- При пустом результате — WARN-отчёт в PR (не FAIL)

## Политики сетевого доступа
- User-Agent: MiniAppBot/1.0
- robots.txt: соблюдать
- TLS: https только

## Ограничения и таймауты
- Concurrency: 1 на домен
- RPS: ≤ 0.2
- Timeouts: connect 5s, response 10s, total 20s
- Retries: 3 (2s, 5s, 13s)

## Политики данных
- Дедупликация по url/id/title+date
- Отсеивание контента без обязательных полей
- Приведение дат к UTC (…Z)
- Запрет HTML в title/preview
- Сортировка DESC по date

## Поведение при сбоях
- Частичный провал источника: продолжаем со здоровыми
- Полный провал всех → PR не создаём, пишем WARN-сводку
- Fallback: переключение на aggregator по cron пока primary/secondary красные

## Телеметрия (минимум)
- Счётчик новых/отфильтрованных
- Ошибки по источникам (4xx/5xx/timeout)
- TTFPR (fetch → PR)
