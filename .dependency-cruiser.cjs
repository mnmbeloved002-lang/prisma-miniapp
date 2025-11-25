/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    includeOnly: '^src',
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: './tsconfig.json' },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/[^/]+' },
    },
  },

  forbidden: [
    // 1. Стандарт: никаких циклов
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },

    // 2. Изоляция Ядра (Application/Domain)
    // Бизнес-логика — это "Священный Грааль". Она НЕ должна знать ни про UI, ни про React, ни про Axios/Fetch.
    {
      name: 'domain-is-king',
      comment: 'Application слой не должен зависеть от UI или Infrastructure',
      severity: 'error',
      from: {
        path: '^src/application',
        // ДОБАВИЛИ ВОТ ЭТУ СТРОКУ НИЖЕ:
        // Исключаем файлы тестов (они заканчиваются на .test.ts или .spec.ts)
        pathNot: '\\.(test|spec)\\.(ts|tsx)$',
      },
      to: {
        path: '^(src/ui|src/components|src/infrastructure)',
      },
    },

    // 3. UI — это просто "глупое" отображение
    // UI может дергать Application, но не должен лезть напрямую в базу/сеть (Infra)
    {
      name: 'ui-is-dumb',
      comment: 'UI не должен напрямую работать с инфраструктурой, только через Application',
      severity: 'error',
      from: { path: '^(src/ui|src/components)' },
      to: { path: '^src/infrastructure' },
    },

    // 4. (MODERN UPDATE) Правило Инверсии Зависимостей
    // Infrastructure МОЖЕТ зависеть от Application, но ТОЛЬКО через типы (реализация интерфейсов).
    // Нельзя импортировать классы или значения (runtime code), чтобы не нарушить чистоту.
    {
      name: 'infra-implements-domain',
      comment: 'Infra может импортировать из App только ТИПЫ (implements Interface), но не код',
      severity: 'error',
      from: { path: '^src/infrastructure' },
      to: {
        path: '^src/application',
        // ВАЖНО: Разрешаем, если это "import type"
        dependencyTypesNot: ['type-only'],
      },
    },

    // Доп. защита: Infra не должна лезть в UI
    {
      name: 'no-infra-to-ui',
      severity: 'error',
      from: { path: '^src/infrastructure' },
      to: { path: '^(src/ui|src/components)' },
    },

    // 5. Чистка мертвых зон
    {
      name: 'no-orphans',
      severity: 'warn',
      from: {
        path: '^src',
        orphan: true,
        pathNot:
          '(\\.(test|spec)\\.(ts|tsx|js|jsx)$|main\\.(ts|tsx)$|index\\.(ts|tsx)$|vite-env\\.d\\.ts|setupTests\\.ts)',
      },
      to: {},
    },
  ],
};
