module.exports = {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    { name: 'no-ui-in-domain', severity: 'error', from: { path: '^src/domain' }, to: { path: '^src/ui' } },
    { name: 'no-infra-in-domain', severity: 'error', from: { path: '^src/domain' }, to: { path: '^src/infrastructure' } }
  ],
  options: { doNotFollow: { path: 'node_modules' } }
};
