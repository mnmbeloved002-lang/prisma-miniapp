# Content Compliance Gate - Specification

## Назначение
Обязательная проверка качества контента для всех PR с изменениями в news.json.

## Требования к статус-чеку
- JSON валидность
- Структура данных  
- Обязательные поля
- Формат даты UTC
- Безопасность URL
- Уникальность записей
- Сортировка по дате

## Интеграция с GitHub
Добавить в branch protection rules:
- Require status checks: Content Compliance
- Block direct pushes to main
