import { it, expect, vi } from 'vitest'

it('bookmarks: null cache -> returns empty safely', async () => {
  vi.resetModules()
  ;(globalThis as any).localStorage = {
    getItem: () => null,  // путь, когда записи ещё не было
    setItem: () => {},
    removeItem: () => {},
  }
  const mod = await import('./bookmarks')
  const list = Object.values(mod).find(v => typeof v === 'function' && /list|all|get|select/i.test((v as any).name || 'list')) as any
  expect(Array.isArray(list?.())).toBe(true)
})
