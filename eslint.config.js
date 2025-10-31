// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // базовый JS
  js.configs.recommended,

  // базовый TS (без type-aware) — работает везде
  ...tseslint.configs.recommended,

  // общие игноры
  { ignores: ['dist', 'build', '.lighthouseci'] },

  // ⬇️ ТОЛЬКО для src включаем type-aware правила (нужен project)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // свои правила для src можно добавить тут
    rules: {},
  },

  // ⬇️ Тесты: снимаем «unsafe» и бан ts-комментариев
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  // ⬇️ API-файлы: без type-aware (нет отдельного tsconfig — и не нужен)
  {
    files: ['api/**/*.ts'],
    // без project -> снимаем причину parser error
    languageOptions: {
      parserOptions: { project: null },
    },
    rules: {
      // можно ослабить что-то точечно, если захочешь
    },
  },
);
