# Rollback / Restore — news.json (≤ 5 минут)

## A) Из nightly-архива (archive/)
1) Выбери дату: `archive/YYYY/MM/DD/news.json`
2) Проверь SHA256 (если есть `*.sha256`)
3) Подмени `public/news.json` выбранной версией
4) Локальная проверка (см. docs/qa/LOCAL-VALIDATION.md)
5) Коммит в dev: `revert(content): restore public/news.json from archive YYYY-MM-DD [Phase-2/rollback]`
6) Пуш → CI

## B) Из CI-артефакта мерджа
1) Открой последний успешный merge-джоб → скачай `news.json`
2) Далее шаги 3–6 как выше

## Чек-лист восстановления
- [ ] Валидация прошла, DESC, https, UTC(...Z)
- [ ] Мини-апп показывает карточки
- [ ] Запись в RESTORE-LOG.md (дата/время, источник, ссылка)
