module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}

module.exports = {
  ...module.exports,
  rules: {
    ...module.exports.rules,
    // Все warnings → errors
    'no-warning-comments': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'import/order': 'error',
  },
}

// Все warnings → errors (ломаем сборку)
module.exports.rules = {
  ...module.exports.rules,
  'no-warning-comments': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  'import/order': 'error',
}
