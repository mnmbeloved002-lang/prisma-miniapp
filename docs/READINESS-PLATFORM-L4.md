# READINESS — PLATFORM L4 (Prisma Ritual AI)

## I.A. Core Platform

- [x] I.A.0 Safety-Net & Backups:
  - `archive/dev-before-l4.bundle` создан и задокументирован в `docs/BACKUP-POLICY.md`.
- [x] I.A.1 Devcontainer & Toolchain:
  - Devcontainer на `typescript-node:1-22-bullseye`.
  - Node / pnpm / Chromium / osv-scanner / Biome / Vitest / Playwright / tsc зафиксированы.
- [x] I.A.2 NPM scripts & Gate:
  - `lint`, `typecheck`, `test:ci`, `e2e:smoke`, `e2e:a11y`, `e2e:visual`, `size` работают.
  - `pnpm validate:all` проходит локально.
- [x] I.A.3 Lints, Format, Hooks:
  - Biome как единый линтер/форматтер.
  - Husky + lint-staged интегрированы, pre-commit зелёный.
- [x] I.A.4 Tests:
  - Vitest: все тесты зелёные, coverage ≥ целевых порогов.
  - Playwright: smoke / a11y / visual проходят.
- [ ] I.A.5 CI / GitHub Actions:
  - TODO: ревизия workflow’ов, verify-main, визуальные регрессии.
- [ ] I.A.6 Security:
  - TODO: `pnpm sec:osv`, `pnpm sec:gitleaks`, `pnpm sec:semgrep` — настройка и целевые пороги.
- [ ] I.A.7 Performance:
  - TODO: регламент по `pnpm size`, Lighthouse и целевым метрикам.
- [x] I.A.8 Docs & Runbooks:
  - `docs/BACKUP-POLICY.md`, `docs/ENGINEERING.md` созданы (минимальный набор).
  - Дальнейшее развитие: `docs/INCIDENTS.md`, `docs/ops/SLOs.md`.
- [ ] I.A.9 Observability & SLO:
  - TODO: `/api/healthz`, synthetics, SLO/SLI в `docs/ops/SLOs.md`.
- [ ] I.A.X ADR:
  - TODO: ADR-000…ADR-004 (архитектурные решения).

