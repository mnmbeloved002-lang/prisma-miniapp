module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Циклы запрещены',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-ui-in-domain',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/ui' }
    }
  ],
  options: { doNotFollow: { path: 'node_modules' } }
};
