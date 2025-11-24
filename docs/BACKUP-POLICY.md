# BACKUP POLICY (UEC)

Status: L4 Core Requirement  
Scope: Все изменения, затрагивающие архитектуру, домен или инфраструктуру.

---

## 1. Golden Rule

Перед любыми L4-изменениями (архитектура, домен, инфраструктура) на ветке `dev` **обязательно** создавать `git bundle`:

```bash
git bundle create archive/<name>.bundle dev
archive/ включён в репозиторий, но .bundle файлы не пушатся в origin.

2. Backup History Log
2.1. L4 Initialization Backup
Bundle Name	Branch	Date (YYYY-MM-DD)	Path	Status
dev-baseline-l4-20251124-0351.bundle	dev	2025-11-24	archive/	[x] DONE

Notes:

Создано в devcontainer (/workspaces/prisma-miniapp).

Используется как точка отката для всей L4-платформенной работы (Hard Mode).

3. Процедура восстановления
bash
Копировать код
git clone prisma-miniapp prisma-miniapp-restore
cd prisma-miniapp-restore
git bundle verify ../archive/dev-baseline-l4-20251124-0351.bundle
git pull ../archive/dev-baseline-l4-20251124-0351.bundle dev
После этого можно создавать отдельную ветку для расследования/фикса.
