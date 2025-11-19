# Архитектура Prisma Ritual AI Ecosystem (C4 Level 1 + слои)

```mermaid
graph TD
    subgraph UI
        A[React Miniapp] --> B[Zustand + CloudStorage]
    end
    subgraph Application
        B --> C[UseCases / Store]
    end
    subgraph Domain
        C --> D[Types + Zod Schemas]
    end
    subgraph Infrastructure
        D --> E[API Client, Telegram CloudStorage, Grok API]
        E --> F[Git-as-DB + GHA Ingestion]
    end

    UI --> Application --> Domain
    Application --> Infrastructure
    Domain --> Infrastructure
Направление зависимостей (ERL-35/36):

ui → application → domain
infrastructure → application → domain
Запрещено: domain → ui/infrastructure

Модульность экосистемы

config/activeModule.json = "ritual" или "news"
Новый модуль = src/modules/<name> + ingestion + DQM

Обновлено: 2025-11-20
