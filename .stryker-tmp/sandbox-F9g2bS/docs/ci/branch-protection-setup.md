# Branch Protection Setup Guide

## Ручная настройка в GitHub
1. Settings → Branches → Add branch protection rule
2. Branch name pattern: main
3. Настройки:
   - Require pull request before merging
   - Require approvals (1 minimum)  
   - Require status checks: Content Compliance, CI, verify
   - Include administrators

## Проверка
- Пуш в main должен блокироваться
- PR требуют прохождения всех чеков
