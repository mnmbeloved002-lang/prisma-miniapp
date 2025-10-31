// eslint.config.js (ESLint v9 flat config)
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // если у тебя уже есть project в tsconfig
  {
    ignores: ['dist', 'build', '.lighthouseci'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'].filter(Boolean),
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // твои боевые правила тут…
    },
  },
  // ⬇️ Оверрайд ТОЛЬКО для тестов
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
