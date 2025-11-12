/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','unicorn','sonarjs','security','import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
  env: { node: true, browser: true, es2023: true },
  settings: { 'import/resolver': { typescript: true } },
  rules: {
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    'import/order': ['error',{ 'newlines-between':'always', alphabetize:{order:'asc'} }],
    '@typescript-eslint/no-explicit-any': 'off'
  },
  ignorePatterns: ['dist','coverage','.lighthouseci','playwright-report','node_modules']
};
