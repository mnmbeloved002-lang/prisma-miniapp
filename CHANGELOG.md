# 1.0.0 (2025-10-30)


## v0.0.2...v1.8.2

[compare changes](https://github.com/mnmbeloved002-lang/prisma-miniapp/compare/v0.0.2...v1.8.2)

### 📖 Documentation

- **changelog:** Update for v1.8.2 ([77b20aa](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/77b20aa))

### ❤️ Contributors

- ShumikDV <dimitr227@gmail.com>

## 65ad9dd81483c4896c094371fafeeec71cb046fa...v1.8.2

[compare changes](https://github.com/mnmbeloved002-lang/prisma-miniapp/compare/65ad9dd81483c4896c094371fafeeec71cb046fa...v1.8.2)

### 🚀 Enhancements

- **ci:** Implement final L1.7 quality gate (CLEAN) ([705aae1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/705aae1))
- **api:** Add telegram webhook handler (L1.7) ([e143723](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e143723))
- **security:** Add baseline security headers (HSTS, CSP) ([af90171](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/af90171))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([a2fdaf3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2fdaf3))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([05cf61e](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/05cf61e))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([2b0b63d](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/2b0b63d))
- **l2:** Implement final L2-Free contour (reporting, release, lighthouse) ([5ae5406](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5ae5406))
- **l2:** Add final lhci and semantic-release dependencies ([c784988](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/c784988))
- **release:** Activate final L2 semantic release automation ([5a600c5](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5a600c5))
- **errors:** Tweak serverless reporter ([0d34649](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/0d34649))

### 🩹 Fixes

- **ci:** Add missing typecheck script ([613579c](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/613579c))
- **build:** Add missing @vercel/node types ([1b70a3a](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/1b70a3a))
- **deploy:** Add @vercel/node types and correct vercel.json (L1.7) ([fab2bd6](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/fab2bd6))
- **lhci:** Final local fix for universal image chrome flags ([e0c5df3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e0c5df3))
- **lhci:** Remove lhci integration due to devcontainer platform instability ([a2a3ee2](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2a3ee2))
- **ci:** Implement final L2 ci configuration (syntactically correct) ([050cfcd](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/050cfcd))
- **ci:** Restore pnpm/action-setup to CI pipeline (L2.1) ([83549e1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/83549e1))
- **ci:** Provide GITHUB_TOKEN to gitleaks-action (L2.2) ([23c20b0](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/23c20b0))
- **ci:** Add pull_requests:read permissions for gitleaks (L2.3) ([3f759e3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/3f759e3))
- **vercel:** Explicitly configure API routes in package.json (Final L2 Fix) ([6eac076](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/6eac076))

### 🏡 Chore

- Sync package.json with L1.8.2 standard ([a9e7f0d](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a9e7f0d))
- Trigger vercel deploy [skip ci] ([2074bfc](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/2074bfc))
- **sentry:** Rollback Sentry integration (subscription required) ([793b4d1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/793b4d1))
- **ci:** Make LHCI deterministic (CHROME_PATH + no-sandbox flags) ([02e8eb3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/02e8eb3))
- **ci:** Add LHCI job + store reports under .lighthouseci ([e4f3ba3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e4f3ba3))
- **lockfile:** Sync pnpm-lock with deps ([0b94290](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/0b94290))
- **git:** Update .gitignore (build/coverage/LHCI caches) ([dc97228](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/dc97228))
- **release:** 1.0.0 [skip ci] ([9c57c41](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/9c57c41))
- **ci:** Add retry & concurrency to release job ([a114021](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a114021))
- **ci:** Add retry & concurrency to release job ([40785b4](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/40785b4))
- **lhci:** Enable prod sourcemaps and set realistic unused-js threshold ([95a8c2e](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/95a8c2e))
- **eslint:** Type-aware only for src; soften tests/api; fix no-misused-promises ([7fbd561](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7fbd561))
- **security:** Add CSP + HSTS + hide sourcemaps via rewrite ([4783487](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/4783487))
- Ignore Playwright artifacts ([72c4882](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/72c4882))
- **ci:** Update lockfile after adding Playwright ([8186033](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/8186033))

### ✅ Tests

- **security:** Direct push to main ([cf7a016](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/cf7a016))
- **security:** Direct push to main (L2.3 ENFORCED) ([7b59d6a](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7b59d6a))
- **security:** Direct push to main (L2.3 ENFORCED) ([ed5f1b6](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ed5f1b6))
- **security:** Direct push to main (L2.3 FINAL) ([39504f9](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/39504f9))
- Add vitest config (jsdom + setup + coverage) ([ chore(git): ignore LHCI manifest](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ chore(git): ignore LHCI manifest))
- Cover reportError branches (non-Error, invalid meta, fetch catch, UA/url) ([5be9289](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5be9289))
- Cover env-absent branches in reportError (100% branches) ([a0cef44](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a0cef44))
- **ci:** Relax lint rules for tests + drop unused ts-expect-error ([1a878c0](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/1a878c0))
- Add HelloButton & cover reportError edge cases; chore: ESLint config polishing ([33a96ae](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/33a96ae))
- **e2e:** Add Playwright smoke + prod security headers + sourcemap 404 ([7547179](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7547179))
- Exclude Playwright e2e from Vitest discovery ([4dd4933](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/4dd4933))
- **vitest:** Drop vite plugins from config + exclude e2e ([83025bf](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/83025bf))

### 🤖 CI

- Add Lint + Typecheck + Build workflow ([929b1fe](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/929b1fe))
- Fix pnpm enable corepack ([ff1ee63](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ff1ee63))
- Fix pnpm path via pnpm/action-setup ([354da27](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/354da27))
- Reorder pnpm setup before node setup ([205a914](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/205a914))
- Retrigger checks for PR #3 ([#3](https://github.com/mnmbeloved002-lang/prisma-miniapp/issues/3))
- Retrigger checks ([bf20c1c](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/bf20c1c))

### ❤️ Contributors

- ShumikDV <dimitr227@gmail.com>
- Ccb96ef <ShumikDV>
- Semantic-release-bot <semantic-release-bot@martynus.net>
- Mnmbeloved002-lang <mnmbeloved002@gmail.com>

## 65ad9dd81483c4896c094371fafeeec71cb046fa...v1.8.2

[compare changes](https://github.com/mnmbeloved002-lang/prisma-miniapp/compare/65ad9dd81483c4896c094371fafeeec71cb046fa...v1.8.2)

### 🚀 Enhancements

- **ci:** Implement final L1.7 quality gate (CLEAN) ([705aae1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/705aae1))
- **api:** Add telegram webhook handler (L1.7) ([e143723](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e143723))
- **security:** Add baseline security headers (HSTS, CSP) ([af90171](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/af90171))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([a2fdaf3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2fdaf3))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([05cf61e](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/05cf61e))
- **l2:** Implement final security, error reporting and release automation (L2-Free) ([2b0b63d](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/2b0b63d))
- **l2:** Implement final L2-Free contour (reporting, release, lighthouse) ([5ae5406](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5ae5406))
- **l2:** Add final lhci and semantic-release dependencies ([c784988](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/c784988))
- **release:** Activate final L2 semantic release automation ([5a600c5](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5a600c5))
- **errors:** Tweak serverless reporter ([0d34649](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/0d34649))

### 🩹 Fixes

- **ci:** Add missing typecheck script ([613579c](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/613579c))
- **build:** Add missing @vercel/node types ([1b70a3a](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/1b70a3a))
- **deploy:** Add @vercel/node types and correct vercel.json (L1.7) ([fab2bd6](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/fab2bd6))
- **lhci:** Final local fix for universal image chrome flags ([e0c5df3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e0c5df3))
- **lhci:** Remove lhci integration due to devcontainer platform instability ([a2a3ee2](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2a3ee2))
- **ci:** Implement final L2 ci configuration (syntactically correct) ([050cfcd](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/050cfcd))
- **ci:** Restore pnpm/action-setup to CI pipeline (L2.1) ([83549e1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/83549e1))
- **ci:** Provide GITHUB_TOKEN to gitleaks-action (L2.2) ([23c20b0](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/23c20b0))
- **ci:** Add pull_requests:read permissions for gitleaks (L2.3) ([3f759e3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/3f759e3))
- **vercel:** Explicitly configure API routes in package.json (Final L2 Fix) ([6eac076](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/6eac076))

### 🏡 Chore

- Sync package.json with L1.8.2 standard ([a9e7f0d](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a9e7f0d))
- Trigger vercel deploy [skip ci] ([2074bfc](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/2074bfc))
- **sentry:** Rollback Sentry integration (subscription required) ([793b4d1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/793b4d1))
- **ci:** Make LHCI deterministic (CHROME_PATH + no-sandbox flags) ([02e8eb3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/02e8eb3))
- **ci:** Add LHCI job + store reports under .lighthouseci ([e4f3ba3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e4f3ba3))
- **lockfile:** Sync pnpm-lock with deps ([0b94290](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/0b94290))
- **git:** Update .gitignore (build/coverage/LHCI caches) ([dc97228](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/dc97228))
- **release:** 1.0.0 [skip ci] ([9c57c41](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/9c57c41))
- **ci:** Add retry & concurrency to release job ([a114021](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a114021))
- **ci:** Add retry & concurrency to release job ([40785b4](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/40785b4))
- **lhci:** Enable prod sourcemaps and set realistic unused-js threshold ([95a8c2e](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/95a8c2e))
- **eslint:** Type-aware only for src; soften tests/api; fix no-misused-promises ([7fbd561](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7fbd561))
- **security:** Add CSP + HSTS + hide sourcemaps via rewrite ([4783487](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/4783487))
- Ignore Playwright artifacts ([72c4882](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/72c4882))
- **ci:** Update lockfile after adding Playwright ([8186033](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/8186033))

### ✅ Tests

- **security:** Direct push to main ([cf7a016](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/cf7a016))
- **security:** Direct push to main (L2.3 ENFORCED) ([7b59d6a](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7b59d6a))
- **security:** Direct push to main (L2.3 ENFORCED) ([ed5f1b6](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ed5f1b6))
- **security:** Direct push to main (L2.3 FINAL) ([39504f9](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/39504f9))
- Add vitest config (jsdom + setup + coverage) ([ chore(git): ignore LHCI manifest](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ chore(git): ignore LHCI manifest))
- Cover reportError branches (non-Error, invalid meta, fetch catch, UA/url) ([5be9289](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5be9289))
- Cover env-absent branches in reportError (100% branches) ([a0cef44](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a0cef44))
- **ci:** Relax lint rules for tests + drop unused ts-expect-error ([1a878c0](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/1a878c0))
- Add HelloButton & cover reportError edge cases; chore: ESLint config polishing ([33a96ae](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/33a96ae))
- **e2e:** Add Playwright smoke + prod security headers + sourcemap 404 ([7547179](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/7547179))
- Exclude Playwright e2e from Vitest discovery ([4dd4933](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/4dd4933))
- **vitest:** Drop vite plugins from config + exclude e2e ([83025bf](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/83025bf))

### 🤖 CI

- Add Lint + Typecheck + Build workflow ([929b1fe](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/929b1fe))
- Fix pnpm enable corepack ([ff1ee63](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/ff1ee63))
- Fix pnpm path via pnpm/action-setup ([354da27](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/354da27))
- Reorder pnpm setup before node setup ([205a914](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/205a914))
- Retrigger checks for PR #3 ([#3](https://github.com/mnmbeloved002-lang/prisma-miniapp/issues/3))
- Retrigger checks ([bf20c1c](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/bf20c1c))

### ❤️ Contributors

- ShumikDV <dimitr227@gmail.com>
- Ccb96ef <ShumikDV>
- Semantic-release-bot <semantic-release-bot@martynus.net>
- Mnmbeloved002-lang <mnmbeloved002@gmail.com>

### Bug Fixes

* **build:** add missing @vercel/node types ([1b70a3a](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/1b70a3ac3d0a646a92cd4bf27d96022ca9e57f6f))
* **ci:** add missing typecheck script ([613579c](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/613579c84d57a640afb4791c2faaed8d86e3f63f))
* **ci:** add pull_requests:read permissions for gitleaks (L2.3) ([3f759e3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/3f759e34d553cf7a9ed6631f2a23cf397c906626))
* **ci:** implement final L2 ci configuration (syntactically correct) ([050cfcd](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/050cfcd03a648c8e33ed900e518b1675bd9479b6))
* **ci:** provide GITHUB_TOKEN to gitleaks-action (L2.2) ([23c20b0](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/23c20b0bf6a1eb27d83fca5680d8b252aa499d4c))
* **ci:** restore pnpm/action-setup to CI pipeline (L2.1) ([83549e1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/83549e1b503e0753d04d652c475c491e807b8708))
* **deploy:** add @vercel/node types and correct vercel.json (L1.7) ([fab2bd6](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/fab2bd6f79016d6b0a1ffcb2e0986b730b2c9ebe))
* **lhci:** final local fix for universal image chrome flags ([e0c5df3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e0c5df367069cc708935175328a90f144f8fd69d))
* **lhci:** remove lhci integration due to devcontainer platform instability ([a2a3ee2](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2a3ee24395733ee17059a7609688c3c48e27910))
* **vercel:** explicitly configure API routes in package.json (Final L2 Fix) ([6eac076](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/6eac076fb9db7448a5b4a929461136efc9ad2c86))


### Features

* **api:** add telegram webhook handler (L1.7) ([e143723](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/e143723e8f98fdcced594ce6baaaf347fbdf87ae))
* **ci:** implement final L1.7 quality gate (CLEAN) ([705aae1](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/705aae1dcd69769cd38487cf1f2fbbee4c806ab5))
* **l2:** add final lhci and semantic-release dependencies ([c784988](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/c784988e38a1966f7b2932388bcc691edfff8ac3))
* **l2:** implement final L2-Free contour (reporting, release, lighthouse) ([5ae5406](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5ae5406729706402f743d27c2b5f278448a17970))
* **l2:** implement final security, error reporting and release automation (L2-Free) ([2b0b63d](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/2b0b63dcffac521fad9cc87b113980b4ebc1df66))
* **l2:** implement final security, error reporting and release automation (L2-Free) ([05cf61e](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/05cf61ed3178fa78808cf65898bd7b5d89eb46a4))
* **l2:** implement final security, error reporting and release automation (L2-Free) ([a2fdaf3](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/a2fdaf3621392802038a0a4e779a0ea7d658eea4))
* **release:** activate final L2 semantic release automation ([5a600c5](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/5a600c515d2568df15722728f72dfbb2105ea49e))
* **security:** add baseline security headers (HSTS, CSP) ([af90171](https://github.com/mnmbeloved002-lang/prisma-miniapp/commit/af9017129d948b2eeb5af4a1373de939b0b76523))

# Changelog\n\nAll notable changes to this project will be documented in this file.
