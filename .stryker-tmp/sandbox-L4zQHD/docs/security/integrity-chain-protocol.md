# Content Integrity Chain Protocol

## Цель
Криптографическая запись целостности news.json

## Формат записи:
SHA256-hash timestamp commit-hash

## Процесс:
- При каждом мерже вычисляем SHA-256 news.json
- Записываем в docs/checksums/chain.log
- Периодически сверяем хеши

## Проверка:
```bash
# Вычислить текущий хеш
CURRENT_HASH=$(sha256sum public/news.json)

# Сравнить с chain.log
if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
    echo "✅ Целостность подтверждена"
fi
