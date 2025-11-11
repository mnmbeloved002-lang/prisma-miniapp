// Не собирать, если ветка не в allow
const ref =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_REF_NAME ||
  process.env.GIT_BRANCH ||
  '';

const allow = (process.env.ALLOW_BRANCH || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

if (!allow.length) {
  console.log(`[guard] ALLOW_BRANCH empty -> allow all (ref=${ref})`);
  process.exit(0);
}

const ok = allow.some(rule => {
  if (rule.startsWith('/') && rule.endsWith('/')) {
    return new RegExp(rule.slice(1, -1)).test(ref);
  }
  return rule === ref;
});

if (!ok) {
  console.log(`[guard] Skip build for branch "${ref}" (allowed: ${allow.join(' | ')})`);
  process.exit(0); // Vercel интерпретирует как "Ignored build"
}

console.log(`[guard] Branch "${ref}" allowed -> continue build`);
