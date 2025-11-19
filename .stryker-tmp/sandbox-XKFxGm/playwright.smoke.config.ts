// @ts-nocheck
import base from './playwright.config';

const baseUse = (base as any).use ?? {};
const baseURL = baseUse.baseURL ?? 'http://127.0.0.1:4173';

export default {
  ...base,
  testDir: 'tests/e2e',
  testMatch: ['**/smoke.spec.ts'], // запускать только smoke
  projects: [
    {
      name: 'chromium',
      use: { ...baseUse, browserName: 'chromium', baseURL },
    },
  ],
};
