// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import storybook from 'eslint-plugin-storybook';
import unicorn from 'eslint-plugin-unicorn';

export default [
  // глобальные игноры (вместо .eslintignore)
  // biome-ignore lint/style/noDefaultExport: ESLint requires default export
  {
    ignores: [
      'dist',
      'build',
      'coverage',
      'node_modules',
      'playwright-report',
      '.lighthouseci',
      '.next',
      'out',
    ],
  }, // базовые правила
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      unicorn,
      sonarjs,
      security,
      import: importPlugin,
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'import/no-unresolved': 'off',
      'security/detect-object-injection': 'off',
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/order': ['warn', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
    },
  }, // тише в тестах
  {
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
];
