
## Typecheck в CI (ERL-47 MUST)
- Шаг `pnpm typecheck` = `tsc --noEmit` (strict mode)
- Красный typecheck = блокировка merge в main/dev
- Required check в branch protection

## Lint (ERL-48 MUST)
- Команда: `pnpm lint` = `eslint . --ext .ts,.tsx`
- Запускается в CI (L0-контур)
- Красный lint = блокировка merge
