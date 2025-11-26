# Development Setup

## Windows 11 Development (Devcontainer) — Recommended

### Prerequisites

1. **Docker Desktop for Windows**
   - Download: https://www.docker.com/products/docker-desktop
   - Enable WSL2 backend in Settings → General
   - Restart after installation

2. **VS Code + Extensions**
   - Download VS Code: https://code.visualstudio.com/
   - Install extension: `ms-vscode-remote.remote-containers`

3. **WSL2** (usually auto-installed with Docker Desktop)
   - Verify: `wsl --list --verbose`
   - If needed: `wsl --install`

---

### Setup Steps

1. **Clone Repository**
```bash
   git clone <repository-url>
   cd prisma-miniapp
```

2. **Open in VS Code**
```bash
   code .
```

3. **Reopen in Container**
   - VS Code will detect `.devcontainer/devcontainer.json`
   - Click notification: **"Reopen in Container"**
   - Or: `F1` → `Dev Containers: Reopen in Container`

4. **Wait for Setup** (first time ~5-10 min)
   - Container builds from `typescript-node:1-22-bullseye`
   - `postCreateCommand` installs:
     - pnpm, localtunnel
     - chromium, osv-scanner, gitleaks
     - Node dependencies
     - Playwright browsers

5. **Verify Environment**
```bash
   pnpm -v              # Should show 10.x
   node --version       # Should show v22.x
   chromium --version   # Should show Chromium 120.x
   osv-scanner --version # Should show 2.x
```

6. **Run Development Server**
```bash
   pnpm dev
```

---

### Troubleshooting

**Problem:** postCreateCommand fails  
**Solution:** Run manually inside container:
```bash
pnpm install
pnpm exec playwright install chromium
```

**Problem:** Docker Desktop won't start  
**Solution:**
- Check Windows Features: Hyper-V, WSL2 enabled
- Restart Windows
- Check Docker Desktop logs

**Problem:** VS Code can't connect to container  
**Solution:**
- Restart Docker Desktop
- `F1` → `Dev Containers: Rebuild Container`

---

## Alternative: Local Setup (without devcontainer)

### Prerequisites

- Node.js (use version from `.nvmrc`: Node 22 LTS "Jod")
- pnpm: `npm install -g pnpm`

### Installation

1. **Use correct Node version**
```bash
   nvm use
   # or manually install Node 22.x
```

2. **Install dependencies**
```bash
   pnpm install
```

3. **Build project**
```bash
   pnpm run build
```

4. **Start development server**
```bash
   pnpm run dev
```

---

## Verification

Run full quality gate before commits:
```bash
pnpm run validate:all
```

This runs:
- `lint` — Biome linting
- `typecheck` — TypeScript validation
- `test:ci` — Vitest unit tests
- `e2e:smoke` — Playwright smoke tests
- `a11y` — Accessibility checks
- `size` — Bundle size limits

---

## Additional Commands
```bash
pnpm test:all      # Complete test suite
pnpm e2e:visual    # Visual regression tests
pnpm mutation      # Stryker mutation testing
pnpm sec:osv       # Security scan
pnpm sec:semgrep   # Static analysis
```

---

## Notes

- **Devcontainer is L4-ready**: All security tools pre-installed
- **Biome replaces ESLint+Prettier**: Single formatter/linter
- **Tailwind 4**: CSS-first config via Vite plugin
- **Playwright**: Chromium-only for zero-cost CI

For more details, see:
- `docs/ENGINEERING.md` — Architecture decisions
- `docs/READINESS-PLATFORM-L4.md` — Platform maturity checklist
