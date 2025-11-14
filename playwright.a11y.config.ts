import base from './playwright.config';

export default {
  ...base,
  testDir: 'tests/a11y',
  // Явно один проект, чтобы не было "Project(s) 'chromium' not found"
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
};
