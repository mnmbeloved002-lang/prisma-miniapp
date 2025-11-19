
## Typecheck в CI (ERL-47 MUST)
- Шаг `pnpm typecheck` = `tsc --noEmit` (strict mode)
- Красный typecheck = блокировка merge в main/dev
- Required check в branch protection
