// eslint.config.js (flat config)
import js from '@eslint/js';
import ts from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    name: 'env',
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },
  {
    name: 'react-hooks',
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    name: 'project-rules',
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
    },
  },
  {
    name: 'ignores',
    ignores: ['dist', 'coverage', '.lighthouseci', 'test-results', 'node_modules'],
  }
);
