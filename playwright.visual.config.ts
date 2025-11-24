import base from './playwright.config';

const baseUse = (base as { use?: { baseURL?: string; [key: string]: unknown } }).use ?? {};
const baseURL = baseUse.baseURL ?? 'http://127.0.0.1:4173';

export default {
  ...base,
  testDir: 'tests/e2e',
  testMatch: ['**/visual.spec.ts'],
  projects: [{ name: 'chromium', use: { ...baseUse, browserName: 'chromium', baseURL } }],
};
